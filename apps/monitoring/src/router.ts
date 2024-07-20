import cors from "cors";
import { sql } from "drizzle-orm/sql";
import express from "express";
import serverless from "serverless-http";
import { db } from "./drizzle";
import { type Monitoring, monitoring } from "./schema";

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

		const pageResult: Page<Monitoring> = {
			data: results as Monitoring[],
			info: {
				currentPage: page,
				itemsPerPage: limit,
				totalItems: totalCount,
				totalPages: Math.ceil(totalCount / limit),
			},
		};
		console.log("pageResult :>> ", JSON.stringify(pageResult, null, 2));
		return res.status(200).json(pageResult);
	} catch (e) {
		console.error(`Err ${e.stack}`);
	}
});

apiRouter.post("/monitoring", async (req, res, next) => {
	const { name, eventAbi, contractAddress } = await req.body;

	const newMonitoring = await db.insert(monitoring).values({
		name,
		eventAbi,
		contractAddress,
	});

	return res.status(200).json(newMonitoring);
});

export const handler = serverless(app);
