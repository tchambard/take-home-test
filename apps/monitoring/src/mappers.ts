import { EventDb, MonitoringDb } from "./db/schema";

export type Monitoring = {
    id: number;
    name: string;
    eventAbi: string;
    contractAddress: string;
};

export type Event = {
    monitoringId: number;
    transactionHash: string;
};

export function mapMonitoring(monitoring: MonitoringDb): Monitoring {
    return {
        id: monitoring.id,
        name: monitoring.name || '',
        contractAddress: monitoring.contractAddress || '',
        eventAbi: monitoring.eventAbi || '',
    }
}

export function mapEvent(evt: EventDb): Event {
    return {
        monitoringId: evt.monitoringId,
        transactionHash: evt.transactionHash || '',
    }
}