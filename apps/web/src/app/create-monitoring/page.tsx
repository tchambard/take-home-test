import { createMonitoring } from "@/services/monitoring.api";
import Head from "next/head";
import { redirect } from "next/navigation";

const addMonitoringAction = async (formData: FormData): Promise<void> => {
	"use server";
	// TODO: validation
	const name = formData.get("name") as string;
	const eventAbi = formData.get("eventAbi") as string;
	const contractAddress = formData.get("contractAddress") as string;
	await createMonitoring({ name, eventAbi, contractAddress });
	// TODO: handle errors
	redirect("/");
};

const CreateMonitoringPage: React.FC = () => {
	return (
		<div>
			<Head>
				<title>Create New Monitoring</title>
			</Head>
			<main>
				<h1 className="text-2xl font-bold text-center my-4">
					Create New Monitoring
				</h1>

				<form
					action={addMonitoringAction}
					method="POST"
					className="max-w-md mx-auto p-4 bg-white shadow-md rounded"
				>
					<div className="mb-4">
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder="Monitoring's name"
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="eventAbi"
							className="block text-sm font-medium text-gray-700"
						>
							Event ABI
						</label>
						<textarea
							id="eventAbi"
							name="eventAbi"
							placeholder="Event ABI"
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="contractAddress"
							className="block text-sm font-medium text-gray-700"
						>
							Contract Address
						</label>
						<input
							type="text"
							id="contractAddress"
							name="contractAddress"
							placeholder="Enter the contract address"
							required
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
						/>
					</div>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Create Monitoring
					</button>
				</form>
			</main>
		</div>
	);
};

export default CreateMonitoringPage;
