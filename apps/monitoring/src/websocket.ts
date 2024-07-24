import { type RealtimeChannel, createClient } from "@supabase/supabase-js";
import AWS from "aws-sdk";

import type { EventDb } from "./db/schema";
import { mapEvent } from "./mappers";

if (
	!process.env.SUPABASE_URL ||
	!process.env.SUPABASE_ANON_KEY ||
	!process.env.APIG_ENDPOINT
) {
	throw new Error("Missing environment variable");
}

const supabase = createClient(
	process.env.SUPABASE_URL as string,
	process.env.SUPABASE_ANON_KEY as string,
);

const apig = new AWS.ApiGatewayManagementApi({
	endpoint: process.env.APIG_ENDPOINT,
});

const sendMessage = async <T>(
	connectionId: string,
	type: string,
	payload?: T,
) => {
	await apig
		.postToConnection({
			ConnectionId: connectionId,
			Data: JSON.stringify({
				type,
				data: payload,
			}),
		})
		.promise();
};

const keepAliveInterval = 30000; // 3 seconds
const connectionTimeout = 900000; // 15 minutes

let channel: RealtimeChannel;

// TODO: add missing types
exports.handler = async (_event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	const {
		requestContext: { connectionId, routeKey },
	} = _event;

	try {
		switch (routeKey) {
			case "$connect": {
				console.log("> connected...");
				break;
			}
			case "$disconnect": {
				console.log("> disconnected...");
				break;
			}
			case "$default": {
				const { body } = _event;
				console.log(`Message received: ${body}`);
				let parsedBody: { type: "listen"; monitoringId: string };
				try {
					parsedBody = JSON.parse(body);
				} catch (e) {
					throw new Error("Invalid message");
				}

				if (parsedBody.type === "listen") {
					const monitoringId = parsedBody.monitoringId;
					if (Number.isNaN(monitoringId)) {
						throw new Error("Invalid monitoringId");
					}

					console.log(`> Listening monitoring events: ID=${monitoringId}...`);

					// I tried to use `client.listen` after creating pg trigger + function to notify event but without success, so I probably missed something
					// supabase client works successfully !!!
					channel = supabase
						.channel("db-changes")
						.on(
							"postgres_changes",
							{
								event: "INSERT",
								schema: "public",
								table: "event",
								filter: `monitoringId=eq.${monitoringId}`,
							},
							async (payload) => {
								console.log("Change received!", payload);

								await sendMessage(
									connectionId,
									"new_event",
									mapEvent(payload.new as EventDb),
								);
							},
						)
						.subscribe((status) => {
							console.log("Subscription status:", status);
						});

					// Prevent infinite listening
					setTimeout(async () => {
						try {
							console.log("Session timeout...");
							await channel.unsubscribe();
							await sendMessage(connectionId, "session_timeout", {
								message: "Subscription ended",
							});
						} catch (error) {
							console.error(
								"Error during unsubsribe or sending timeout message:",
								error,
							);
						}
					}, connectionTimeout);

					// Send a PING message to keep wss alive
					const keepAliveTimer = setInterval(async () => {
						try {
							await sendMessage(connectionId, "ping");
						} catch (error) {
							await channel.unsubscribe();
							clearInterval(keepAliveTimer);
						}
					}, keepAliveInterval);
				}
				break;
			}
			default:
				throw new Error("Invalid routeKey");
		}
	} catch (error) {
		console.error("Error:", error);
		await sendMessage(connectionId, "Internal server error", {
			message: error.message,
		});
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Internal server error",
			}),
		};
	}

	return {
		statusCode: 200,
	};
};
