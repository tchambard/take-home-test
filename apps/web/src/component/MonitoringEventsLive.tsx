"use client";

import type { MonitoringEvent } from "@/services/monitoring.api";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import MonitoringEventsTable from "./MonitoringEventsTable";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL as string,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

export default function LiveMonitoringEvents({
	monitoringId,
}: { monitoringId: string }) {
	const [events, setEvents] = useState<MonitoringEvent[]>([]);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		console.log(`> Listening monitoring events: ID=${monitoringId}...`);

		const channel = supabase
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
					setEvents([payload.new as MonitoringEvent, ...events]);
				},
			)
			.subscribe((status) => {
				console.log("Subscription status:", status);
				if (status === "SUBSCRIBED") {
					setIsConnected(true);
				}
			});

		return () => {
			channel.unsubscribe();
		};
	}, []);

	const ConnectionBadge = ({ isConnected }: { isConnected: boolean }) => (
		<span
			className={`px-2 py-1 text-xs font-semibold rounded-full ${
				isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
			}`}
		>
			{isConnected ? "Connected" : "Disconnected"}
		</span>
	);
	return (
		<div className="bg-white shadow-md rounded-lg p-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-gray-800">Live Events</h2>
				<ConnectionBadge isConnected={isConnected} />
			</div>
			<MonitoringEventsTable events={events} />
		</div>
	);
}
