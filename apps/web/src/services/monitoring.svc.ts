export type PageInfo = {
	currentPage: number;
	itemsPerPage: number;
	totalItems: number;
	totalPages: number;
};
export type Page<T = object> = {
	info: PageInfo;
	data: T[];
};

export type Monitoring = {
	id: number;
	name: string;
	eventAbi: string;
	contractAddress: string;
};

export type Event = {
	monitoringId: string;
	transactionHash: string;
};

export async function getMonitoringPage(
	page = 1,
	limit = 10,
): Promise<Page<Monitoring>> {
	const res = await fetch(
		`${process.env.AWS_LAMBDA_MONITORING_URL}/api/monitoring?page=${page}&limit=${limit}`,
		{ cache: "no-store" },
	);
	return res.json();
}

export async function addMonitoring(
	name: string,
	eventAbi: string,
	contractAddress: string,
): Promise<void> {
	await fetch(`${process.env.AWS_LAMBDA_MONITORING_URL}/api/monitoring`, {
		method: "POST",
		body: JSON.stringify({ name, eventAbi, contractAddress }),
	});
}
