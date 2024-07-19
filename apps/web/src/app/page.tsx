import { Card } from "../component/card";

async function Home() {
	try {
		const allMonitoring = await fetch(
			`http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/monitoring`,
		).then((res) => res.json());

		return (
    		<div className="flex flex-wrap gap-4 justify-start p-20">
				{allMonitoring.map(({ id, name, eventAbi, contractAddress }) => (
					<Card
						key={id}
						id={id}
						name={name}
						eventAbi={eventAbi}
						contractAddress={contractAddress}
					/>
				))}
			</div>
		);
	} catch (error) {
		console.log(error);
	}
}

export default Home;
