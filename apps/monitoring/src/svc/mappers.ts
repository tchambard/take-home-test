import type { EventDb, MonitoringDb } from "../db/schema";

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

export type Event = {
	monitoringId: number;
	transactionHash: string;
	logIndex: number;
	eventName: string;
	blockNumber: string;
	blockHash: string;
};

export function mapMonitoring(monitoring: MonitoringDb): Monitoring {
	return {
		id: monitoring.id,
		name: monitoring.name,
		contractAddress: monitoring.contractAddress,
		eventAbi: monitoring.eventAbi,
		blockNumberAtCreation: monitoring.blockNumberAtCreation,
	};
}

export function mapEvent(evt: EventDb): Event {
	return {
		monitoringId: evt.monitoringId,
		transactionHash: evt.transactionHash,
		logIndex: evt.logIndex,
		eventName: evt.eventName,
		blockNumber: evt.blockNumber,
		blockHash: evt.blockHash,
	};
}
