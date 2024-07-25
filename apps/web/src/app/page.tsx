import { Card } from "@/component/card";
import Pagination from "@/component/pagination";
import { getMonitoringsPage } from "@/services/monitoring.api";
import { truncateString } from "@/services/strings.utils";
import Link from "next/link";

interface HomeProps {
	searchParams: { page?: string };
}

async function Home({ searchParams }: HomeProps) {
	const currentPage = Number(searchParams.page) || 1;
	const itemsPerPage = 10;

	try {
		const { data: monitorings, info } = await getMonitoringsPage(
			currentPage,
			itemsPerPage,
		);

		if (!monitorings || !info) {
			return <></>;
		}
		return (
			<div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
				<div className="mb-8 flex flex-col sm:flex-row items-center justify-between">
					<h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
						Monitorings
					</h1>
					<Link
						href="/create-monitoring"
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition ease-in-out duration-150"
					>
						Create New Monitoring
					</Link>
				</div>

				{monitorings?.length === 0 ? (
					<div className="text-center py-10">
						<p className="text-xl text-gray-600">
							No monitorings found. Create your first one!
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{monitorings?.map(({ id, name, eventAbi, contractAddress }) => (
							<div key={id} className="w-full">
								<Card
									id={id.toString()}
									name={name}
									contractAddress={truncateString(contractAddress, 12, 12)}
								/>
							</div>
						))}
					</div>
				)}

				<div className="mt-8">
					<Pagination currentPage={currentPage} totalPages={info.totalPages} />
				</div>
			</div>
		);
	} catch (error) {
		console.log(error);
	}
}

export default Home;
