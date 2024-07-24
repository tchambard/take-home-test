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

export type MonitoringEvent = {
	id: number;
	monitoringId: string;
	transactionHash: string;
};

export async function getMonitoringsPage(
	page = 1,
	limit = 10,
): Promise<Page<Monitoring>> {
	const res = await fetch(
		`${process.env.AWS_LAMBDA_MONITORING_API_URL}/api/monitoring?page=${page}&limit=${limit}`,
		{ cache: "no-store" },
	);
	return res.json();
}

export async function addMonitoring(
	name: string,
	eventAbi: string,
	contractAddress: string,
): Promise<void> {
	await fetch(`${process.env.AWS_LAMBDA_MONITORING_API_URL}/api/monitoring`, {
		method: "POST",
		body: JSON.stringify({ name, eventAbi, contractAddress }),
	});
}

export async function getMonitoringDetail(
	monitoringId: string,
): Promise<Monitoring> {
	const res = await fetch(
		`${process.env.AWS_LAMBDA_MONITORING_API_URL}/api/monitoring/${monitoringId}`,
		{ cache: "no-store" },
	);
	return res.json();
}

export async function getMonitoringEventsPage(
	monitoringId: string,
	page = 1,
	limit = 10,
): Promise<Page<MonitoringEvent>> {
	const res = await fetch(
		`${process.env.AWS_LAMBDA_MONITORING_API_URL}/api/monitoring/${monitoringId}/events?page=${page}&limit=${limit}`,
		{ cache: "no-store" },
	);
	return res.json();
}
