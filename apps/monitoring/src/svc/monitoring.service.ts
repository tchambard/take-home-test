import { eq, sql } from "drizzle-orm/sql";

import type { BlockTag } from "viem";
import { db } from "../db/db";
import { monitoring } from "../db/schema";
import { ethereum, getLatestBlockHash } from "./ethereum";
import {
	type Monitoring,
	type MonitoringCreate,
	type Page,
	mapMonitoring,
} from "./mappers";

export async function getMonitoringsPage(
	page: number,
	limit: number,
): Promise<Page<Monitoring>> {
	const offset = (page - 1) * limit;

	const [results, totalCount] = await Promise.all([
		db.select().from(monitoring).limit(limit).offset(offset),
		db
			.select({ count: sql<number>`count(*)` })
			.from(monitoring)
			.then((result) => Number(result[0].count)),
	]);

	return {
		data: results.map(mapMonitoring),
		info: {
			currentPage: page,
			itemsPerPage: limit,
			totalItems: totalCount,
			totalPages: Math.ceil(totalCount / limit),
		},
	};
}

export async function getAllMonitoringIds(): Promise<number[]> {
	return (await db.select({ id: monitoring.id }).from(monitoring)).map(
		(row) => row.id,
	);
}

export async function createMonitoring(data: MonitoringCreate): Promise<void> {
	const latestBlockHash = await getLatestBlockHash();
	await db
		.insert(monitoring)
		.values({ ...data, blockNumberAtCreation: latestBlockHash });
}

export async function getMonitoringDetail(
	monitoringId: number,
): Promise<Monitoring | undefined> {
	const monitoringDetail = await db.query.monitoring.findFirst({
		where: () => eq(monitoring.id, monitoringId),
	});
	if (monitoringDetail) {
		return mapMonitoring(monitoringDetail);
	}
	return;
}
