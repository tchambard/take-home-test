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
							Transaction hash
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
								{event.transactionHash}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
