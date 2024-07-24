"use client";

import type { MonitoringEvent } from "@/services/monitoring.api";
import { useEffect, useState } from "react";
import MonitoringEventsTable from "./MonitoringEventsTable";

export default function LiveMonitoringEvents({
	monitoringId,
}: { monitoringId: string }) {
	const [events, setEvents] = useState<MonitoringEvent[]>([]);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const ws = new WebSocket(
			process.env.NEXT_PUBLIC_AWS_LAMBDA_MONITORING_WSS_URL as string,
		);

		ws.onopen = () => {
			console.log("Connection succeeded");
			ws?.send(`{"type":"listen", "monitoringId": "${+monitoringId}"}`);
			setIsConnected(true);
		};

		ws.onmessage = (event) => {
			console.log("Received message:", event.data);
			const message = JSON.parse(event.data);
			try {
				if (message.type === "new_event") {
					setEvents([message.data, ...events]);
				}
			} catch (e) {
				console.log("Message data parsing error");
			}
		};

		ws.onclose = () => {
			console.log("Connection closed");
			setIsConnected(false);
		};

		ws.onerror = (error) => {
			console.error("wss error:", error);
			ws?.close();
		};

		return () => {
			ws?.close();
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
