"use client";

import {
	type Monitoring,
	type MonitoringEvent,
	createMonitoringEvent,
} from "@/services/monitoring.api";
import { useEffect, useState } from "react";
import {
	http,
	type Abi,
	type Address,
	type WatchEventReturnType,
	createPublicClient,
	fallback,
} from "viem";
import { mainnet } from "viem/chains";
import MonitoringEventsTable from "./MonitoringEventsTable";

const infura = http(
	`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
);
const client = createPublicClient({
	chain: mainnet,
	transport: fallback([infura, http()]),
});

export default function LiveMonitoringEvents({
	monitoring,
}: { monitoring: Monitoring }) {
	const [events, setEvents] = useState<MonitoringEvent[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const watchers: WatchEventReturnType[] = [];

		const parsedAbi = JSON.parse(monitoring.eventAbi) as Abi;
		const abiEvents = parsedAbi.filter((item) => item.type === "event");

		for (const event of abiEvents) {
			watchers.push(
				client.watchEvent({
					address: monitoring.contractAddress as Address,
					event,
					onLogs: async (logs) => {
						for (const log of logs) {
							const event: MonitoringEvent = {
								monitoringId: monitoring.id,
								transactionHash: log.transactionHash,
								logIndex: log.logIndex,
								blockNumber: log.blockNumber.toString(),
								blockHash: log.blockHash,
								eventName: log.eventName,
							};
							setEvents((previousEvents) => [event, ...previousEvents]);
							await createMonitoringEvent(event);
						}
					},
				}),
			);
		}

		return () => {
			for (const unwatch of watchers) {
				unwatch();
			}
		};
	}, []);

	return (
		<div className="bg-white shadow-md rounded-lg p-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-gray-800">Live Events</h2>
			</div>
			<MonitoringEventsTable events={events} />
		</div>
	);
}
