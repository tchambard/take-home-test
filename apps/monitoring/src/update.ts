import type { Handler } from "aws-lambda";
import { createMonitoringEventsFromHistory } from "./svc/event.service";

export const handler: Handler = async (event: { monitoringId: number }) => {
	try {
		if (!event.monitoringId) {
			throw new Error("Invalid event data");
		}
		await createMonitoringEventsFromHistory(event.monitoringId);
		return {
			statusCode: 200,
			body: JSON.stringify({ success: true }),
		};
	} catch (e) {
		console.error("Error updating monitoring events history:", e.stack);
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, error: "Internal Server Error" }),
		};
	}
};
