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

export type MonitoringCreate = {
	name: string;
	eventAbi: string;
	contractAddress: string;
};

export type Monitoring = {
	id: number;
	name: string;
	eventAbi: string;
	contractAddress: string;
	blockNumberAtCreation: string;
};

export type MonitoringEvent = {
	monitoringId: number;
	transactionHash: string;
	logIndex: number;
	eventName: string;
	blockNumber: string;
	blockHash: string;
};

export async function getMonitoringsPage(
	page = 1,
	limit = 10,
): Promise<Page<Monitoring>> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_AWS_LAMBDA_MONITORING_API_URL}/api/monitoring?page=${page}&limit=${limit}`,
		{ cache: "no-store" },
	);
	return res.json();
}

export async function createMonitoring(
	monitoring: MonitoringCreate,
): Promise<void> {
	await fetch(
		`${process.env.NEXT_PUBLIC_AWS_LAMBDA_MONITORING_API_URL}/api/monitoring`,
		{
			method: "POST",
			body: JSON.stringify(monitoring),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
	);
}

export async function getMonitoringDetail(
	monitoringId: string,
): Promise<Monitoring> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_AWS_LAMBDA_MONITORING_API_URL}/api/monitoring/${monitoringId}`,
		{ cache: "no-store" },
	);
	return res.json();
}

export async function getMonitoringEventsPage(
	monitoringId: number,
	page = 1,
	limit = 10,
): Promise<Page<MonitoringEvent>> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_AWS_LAMBDA_MONITORING_API_URL}/api/monitoring/${monitoringId}/events?page=${page}&limit=${limit}`,
		{ cache: "no-store" },
	);
	return res.json();
}

export async function createMonitoringEvent(
	event: MonitoringEvent,
): Promise<void> {
	await fetch(
		`${process.env.NEXT_PUBLIC_AWS_LAMBDA_MONITORING_API_URL}/api/monitoring/${event.monitoringId}/events`,
		{
			method: "POST",
			body: JSON.stringify(event),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
	);
}
