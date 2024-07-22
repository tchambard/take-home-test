import cors from "cors";
import { eq, sql } from "drizzle-orm/sql";
import express from "express";
import serverless from "serverless-http";
import { db } from "./db/db";
import { type MonitoringDb, monitoring, type EventDb, event } from "./db/schema";
import { mapEvent, mapMonitoring } from "./mappers";
import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

export type PageInfo = {
	currentPage: number;
	itemsPerPage: number;
	totalItems: number;
	totalPages: number;
};
export type Page<T = object> = {
	info: PageInfo;
	data: T[];
};

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
		const offset = (page - 1) * limit;

		const [results, totalCount] = await Promise.all([
			db.select().from(monitoring).limit(limit).offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(monitoring)
				.then((result) => Number(result[0].count)),
		]);

		const pageResult: Page<MonitoringDb> = {
			data: results.map(mapMonitoring),
			info: {
				currentPage: page,
				itemsPerPage: limit,
				totalItems: totalCount,
				totalPages: Math.ceil(totalCount / limit),
			},
		};
		return res.status(200).json(pageResult);
	} catch (e) {
		console.error(`Error: ${e.stack}`);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

apiRouter.post("/monitoring", async (req, res, next) => {
	try {
		const { name, eventAbi, contractAddress } = await req.body;
		const newMonitoring = await db.insert(monitoring).values({
			name,
			eventAbi,
			contractAddress,
		});

		return res.status(200).json(newMonitoring);
	} catch (e) {
		console.error(`Error: ${e.stack}`);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

apiRouter.post("/monitoring/:id", async (req, res, next) => {
	try {
		const monitoringId = +req.params.id;
		const monitoringDetail = await db.query.monitoring.findFirst({ with: { id: monitoringId } });
		if (monitoringDetail) {
			return res.status(200).json(mapMonitoring(monitoringDetail));
		}
		return res.status(404).send();
	} catch (e) {
		console.error(`Error: ${e.stack}`);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

apiRouter.get("/monitoring/:id/events", async (req, res) => {
	try {
		const monitoringId = +(req.params.id);
		const page = +(req.query.page || "1");
		const limit = +(req.query.limit || "10");
		const offset = (page - 1) * limit;

		const [results, totalCount] = await Promise.all([
			db.select().from(event)
				.where(eq(event.monitoringId, monitoringId))
				.limit(limit)
				.offset(offset),
			db.select({ count: sql`count(*)` })
				.from(event)
				.where(eq(event.monitoringId, monitoringId))
				.then((result) => Number(result[0].count)),
		]);

		const pageResult: Page<EventDb> = {
			data: results.map(mapEvent),
			info: {
				currentPage: page,
				itemsPerPage: limit,
				totalItems: totalCount,
				totalPages: Math.ceil(totalCount / limit),
			},
		};

		return res.status(200).json(pageResult);
	} catch (e) {
		console.error(`Error: ${e.stack}`);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});
export const handler = serverless(app);
