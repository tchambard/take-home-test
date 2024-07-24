import { getMonitoringEventsPage } from "@/services/monitoring.api";
import type React from "react";
import MonitoringEventsTable from "./MonitoringEventsTable";
import Pagination from "./pagination";

interface MonitoringEventsHistoryProps {
	monitoringId: string;
	page?: number;
	limit: number;
}

const MonitoringEventsHistory = async ({
	monitoringId,
	page,
	limit,
}: MonitoringEventsHistoryProps) => {
	const currentPage = page ?? 1;
	const itemsPerPage = limit ?? 10;
	const { data: events, info } = await getMonitoringEventsPage(
		monitoringId,
		currentPage,
		itemsPerPage,
	);

	return (
		<div className="bg-white shadow-md rounded-lg p-6">
			<h2 className="text-xl font-semibold mb-4 text-gray-800">
				History Events
			</h2>
			<MonitoringEventsTable events={events} />
			<Pagination
				currentPage={currentPage ?? 0}
				totalPages={info?.totalPages ?? 0}
				basePath={`/${monitoringId}`}
				// className="mt-4"
			/>
		</div>
	);
};
export default MonitoringEventsHistory;
