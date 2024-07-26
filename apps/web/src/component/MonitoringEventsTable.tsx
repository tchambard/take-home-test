"use client";

import type { MonitoringEvent } from "@/services/monitoring.api";

export default function MonitoringEventsTable({
	events,
}: { events: MonitoringEvent[] }) {
	return (
		<div className="overflow-x-auto shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					<tr>
						<th scope="col" className="px-6 py-3">
							Event name
						</th>
						<th scope="col" className="px-6 py-3">
							Transaction hash
						</th>
						<th scope="col" className="px-6 py-3">
							Log index
						</th>
						<th scope="col" className="px-6 py-3">
							Block number
						</th>
						<th scope="col" className="px-6 py-3">
							Block hash
						</th>
					</tr>
				</thead>
				<tbody>
					{events?.map((event, index) => (
						<tr
							key={`event-${index.toString()}`}
							className="bg-white border-b hover:bg-gray-50"
						>
							<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								{event.eventName}
							</td>
							<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								{event.transactionHash}
							</td>
							<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								{event.logIndex}
							</td>
							<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								{event.blockNumber}
							</td>
							<td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
								{event.blockHash}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
