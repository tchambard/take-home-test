import { Card } from "@/component/card";
import Pagination from "@/component/pagination";
import { getMonitoringPage } from "@/services/monitoring.svc";
import Link from "next/link";

interface HomeProps {
	searchParams: { page?: string };
}

async function Home({ searchParams }: HomeProps) {
	const currentPage = Number(searchParams.page) || 1;
	const itemsPerPage = 10;

	try {
		const { data: monitorings, info } = await getMonitoringPage(
			currentPage,
			itemsPerPage,
		);
		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold text-center my-4">Monitorings</h1>
				<Link
					href="/create-monitoring"
					className={
						"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					}
				>
					Create New Monitoring
				</Link>
				<div className="flex flex-wrap gap-4 justify-start p-20">
					{monitorings.map(({ id, name, eventAbi, contractAddress }) => (
						<Card
							key={id}
							id={id.toString()}
							name={name}
							eventAbi={eventAbi}
							contractAddress={contractAddress}
						/>
					))}
				</div>
				<Pagination currentPage={currentPage} totalPages={info.totalPages} />
			</div>
		);
	} catch (error) {
		console.log(error);
	}
}

export default Home;
