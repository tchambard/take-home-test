import type { Monitoring, MonitoringEvent } from "@/services/monitoring.svc";
import { useRouter } from "next/navigation";
import React from "react";

const mockMonitoring: Monitoring = {
	id: 1,
	name: "Monitoring Test",
	eventAbi:
		"event Transfer(address indexed from, address indexed to, uint256 value)",
	contractAddress: "0x123456789abcdef...",
};

const mockEvents: MonitoringEvent[] = [
	{ monitoringId: "1", transactionHash: "0xabcdef1234567890..." },
	{ monitoringId: "1", transactionHash: "0x0987654321fedcba..." },
];

export default function MonitoringDetailPage({
	params,
}: { params: { id: string } }) {
	const { id } = params;

	// TODO: fetch data in parallel (Promise.all)
	const monitoring = mockMonitoring;
	const events = mockEvents;

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Monitoring details</h1>

			<div className="bg-white shadow-md rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">{monitoring.name}</h2>
				<p className="mb-2">
					<span className="font-medium">ID:</span> {monitoring.id}
				</p>
				<p className="mb-2">
					<span className="font-medium">Event ABI:</span> {monitoring.eventAbi}
				</p>
				<p className="mb-2">
					<span className="font-medium">Contract address:</span>{" "}
					{monitoring.contractAddress}
				</p>
			</div>

			<h2 className="text-xl font-semibold mb-2">Events</h2>
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Monitoring ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Transaction hash
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{events.map((event, index) => (
							<tr key={`event-${index.toString()}`}>
								<td className="px-6 py-4 whitespace-nowrap">
									{event.monitoringId}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{event.transactionHash}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
