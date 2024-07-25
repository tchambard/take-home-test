import { eq, max, sql } from "drizzle-orm/sql";

import type { Abi, AbiEvent, Address } from "viem";
import { db } from "../db/db";
import { type EventDb, event } from "../db/schema";
import { ethereum } from "./ethereum";
import { type Event, type Page, mapEvent } from "./mappers";
import { getMonitoringDetail } from "./monitoring.service";

export async function getMonitoringEventsPage(
	monitoringId: number,
	page: number,
	limit: number,
): Promise<Page<Event>> {
	const offset = (page - 1) * limit;

	const [results, totalCount] = await Promise.all([
		db
			.select()
			.from(event)
			.where(eq(event.monitoringId, monitoringId))
			.limit(limit)
			.offset(offset),
		db
			.select({ count: sql`count(*)` })
			.from(event)
			.where(eq(event.monitoringId, monitoringId))
			.then((result) => Number(result[0].count)),
	]);

	return {
		data: results.map(mapEvent),
		info: {
			currentPage: page,
			itemsPerPage: limit,
			totalItems: totalCount,
			totalPages: Math.ceil(totalCount / limit),
		},
	};
}

export async function createMonitoringEvent(data: Event): Promise<void> {
	await db.insert(event).values(data);
}

export async function createMonitoringEventsFromHistory(
	monitoringId: number,
): Promise<void> {
	console.log("createMonitoringEventsFromHistory :>> ", monitoringId);
	const _monitoring = await getMonitoringDetail(monitoringId);
	if (!_monitoring) {
		throw new Error("Monitoring not found");
	}

	const [lastEvent] = await db
		.select({ maxBlock: max(event.blockNumber) })
		.from(event)
		.where(eq(event.monitoringId, monitoringId));

	const fromBlock = lastEvent?.maxBlock
		? BigInt(lastEvent.maxBlock) + 1n
		: BigInt(_monitoring.blockNumberAtCreation);

	console.log("fromBlock", fromBlock?.toString());

	const parsedAbi = JSON.parse(_monitoring.eventAbi) as Abi;

	for (const item of parsedAbi) {
		if (item.type === "event") {
			console.log(">>>> getLogs :>> ", item.name);
			const logs = await ethereum.getLogs({
				address: _monitoring.contractAddress as Address,
				event: item as AbiEvent,
				fromBlock,
				toBlock: "latest",
			});
			console.log("Nb new events: ", logs.length);
			const chunkSize = 100;
			for (let i = 0; i < logs.length; i += chunkSize) {
				const chunk = logs.slice(i, i + chunkSize);

				const events: EventDb[] = chunk.map((log) => ({
					monitoringId,
					address: log.address.toString(),
					eventName: log.eventName,
					blockNumber: log.blockNumber.toString(),
					transactionHash: log.transactionHash.toString(),
					blockHash: log.blockHash.toString(),
					logIndex: log.logIndex,
				}));
				await db.insert(event).values(events);
			}
		}
	}
}
