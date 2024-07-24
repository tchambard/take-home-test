import MonitoringEventsHistory from "@/component/MonitoringEventsHistory";
import LiveMonitoringEvents from "@/component/MonitoringEventsLive";
import { getMonitoringDetail } from "@/services/monitoring.api";
import Link from "next/link";
import type React from "react";

interface MonitoringDetailPageProps {
	searchParams: { page?: string };
	params: { id: string };
}

const MonitoringDetailPage: React.FC<MonitoringDetailPageProps> = async ({
	params,
	searchParams,
}) => {
	const { id } = params;
	const currentPage = Number(searchParams.page) || 1;
	const itemsPerPage = 10;
	const monitoring = await getMonitoringDetail(id);

	return (
		<div className="container mx-auto p-6 bg-gray-100 min-h-screen">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-800">Monitoring Details</h1>
				<Link
					href="/"
					className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition ease-in-out duration-150"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
							clipRule="evenodd"
						/>
					</svg>
					Back to Monitoring List
				</Link>
			</div>

			<div className="bg-white shadow-md rounded-lg p-6 mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-gray-800">
					{monitoring.name}
				</h2>
				<div className="grid grid-cols-2 gap-4 text-gray-600">
					<div>
						<span className="font-medium text-gray-800">ID:</span>{" "}
						{monitoring.id}
					</div>
					<div>
						<span className="font-medium text-gray-800">Event ABI:</span>{" "}
						{monitoring.eventAbi}
					</div>
					<div className="col-span-2">
						<span className="font-medium text-gray-800">Contract address:</span>{" "}
						{monitoring.contractAddress}
					</div>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				<MonitoringEventsHistory
					monitoringId={id}
					page={currentPage}
					limit={itemsPerPage}
				/>
				<LiveMonitoringEvents monitoringId={id} />
			</div>
		</div>
	);
};
export default MonitoringDetailPage;
