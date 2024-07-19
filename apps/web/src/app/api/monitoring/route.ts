import { sql } from "drizzle-orm/sql";
import type { NextRequest } from "next/server";
import { db } from "../../../database/drizzle";
import { type Monitoring, monitoring } from "../../../database/schema";

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

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const page = +(searchParams.get("page") || "1");
	const limit = +(searchParams.get("limit") || "10");
	const offset = (page - 1) * limit;

	const [results, totalCount] = await Promise.all([
		db.select().from(monitoring).limit(limit).offset(offset),
		db
			.select({ count: sql<number>`count(*)` })
			.from(monitoring)
			.then((result) => Number(result[0].count)),
	]);

	return Response.json({
		data: results,
		info: {
			currentPage: page,
			itemsPerPage: limit,
			totalItems: totalCount,
			totalPages: Math.ceil(totalCount / limit),
		},
	} as Page<Monitoring>);
}

export async function POST(req: Request) {
	const { name, eventAbi, contractAddress } = await req.json();

	const newMonitoring = await db.insert(monitoring).values({
		name,
		eventAbi,
		contractAddress,
	});

	return Response.json(newMonitoring);
}
