import "source-map-support/register";

import cors from "cors";
import express from "express";
import serverless from "serverless-http";

import {
	createMonitoringEvent,
	createMonitoringEventsFromHistory,
	getMonitoringEventsPage,
} from "./svc/event.service";
import type { Event, MonitoringCreate } from "./svc/mappers";
import {
	createMonitoring,
	getMonitoringDetail,
	getMonitoringsPage,
} from "./svc/monitoring.service";

const app = express();

const apiRouter = express.Router();

apiRouter.use(cors());
apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

apiRouter.get("/monitoring", async (req, res, next) => {
	try {
		const searchParams = req.query;
		const page = +(searchParams.page || "1");
		const limit = +(searchParams.limit || "10");
		const pageResult = await getMonitoringsPage(page, limit);
		return res.status(200).send(pageResult);
	} catch (e) {
		console.error(`Error: ${e}`);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

apiRouter.post("/monitoring", async (req, res, next) => {
	try {
		const { name, eventAbi, contractAddress } =
			(await req.body) as MonitoringCreate;

		await createMonitoring({ name, eventAbi, contractAddress });
		return res.status(201).send();
	} catch (e) {
		console.error(`Error: ${e}`);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

apiRouter.get("/monitoring/:id", async (req, res, next) => {
	try {
		const monitoringId = +req.params.id;
		const monitoringDetail = await getMonitoringDetail(monitoringId);
		if (monitoringDetail) {
			return res.status(200).json(monitoringDetail);
		}
		return res.status(404).send();
	} catch (e) {
		console.error(`Error: ${e}`);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

apiRouter.get("/monitoring/:id/events", async (req, res) => {
	try {
		const monitoringId = +req.params.id;
		const page = +(req.query.page || "1");
		const limit = +(req.query.limit || "10");

		const pageResult = await getMonitoringEventsPage(monitoringId, page, limit);

		return res.status(200).json(pageResult);
	} catch (e) {
		console.error(`Error: ${e}`);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

apiRouter.post("/monitoring/:id/events", async (req, res, next) => {
	try {
		const { transactionHash, logIndex, eventName, blockNumber, blockHash } =
			(await req.body) as Event;

		await await createMonitoringEvent({
			monitoringId: +req.params.id,
			transactionHash,
			logIndex,
			eventName,
			blockNumber,
			blockHash,
		});

		return res.status(201).send();
	} catch (e) {
		console.error(`Error: ${e}`);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

// useful to trigger update manually but should be authenticated
apiRouter.post(
	"/monitoring/:id/fetch-events-history",
	async (req, res, next) => {
		try {
			const monitoringId = +req.params.id;
			await createMonitoringEventsFromHistory(monitoringId);
			return res.status(200).send();
		} catch (e) {
			console.error(`Error: ${e}`);
			return res.status(500).json({ error: "Internal Server Error" });
		}
	},
);

export const handler = serverless(app);
