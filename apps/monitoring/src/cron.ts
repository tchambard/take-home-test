import type { Handler } from "aws-lambda";
import AWS from "aws-sdk";

import { getAllMonitoringIds } from "./svc/monitoring.service";

interface IDiagnose {
	message: string;
	severity: "error" | "info" | "warning";
}

const lambda = new AWS.Lambda();

export const handler: Handler = async (event, context) => {
	try {
		const monitorings = await getAllMonitoringIds();

		const diagnoses: IDiagnose[] = [];

		await Promise.all(
			monitorings.map(async (monitoringId) => {
				try {
					await lambda
						.invoke({
							FunctionName: process.env.UPDATE_FUNCTION_NAME as string,
							InvocationType: "Event",
							Payload: JSON.stringify({ monitoringId }),
						})
						.promise();

					console.log(
						"Lambda update invoked successfully for monitoring:",
						monitoringId,
					);
				} catch (error) {
					console.error("Error invoking update:", error);
					throw error;
				}
			}),
		);

		return {
			statusCode: 200,
			body: JSON.stringify({ diagnoses }),
		};
	} catch (e) {
		console.error("Error submitting children lambdas:", e);
		return {
			statusCode: 500,
			body: JSON.stringify({ success: false, error: "Internal Server Error" }),
		};
	}
};
