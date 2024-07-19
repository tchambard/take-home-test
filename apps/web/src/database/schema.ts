import { pgTable, serial, text } from "drizzle-orm/pg-core";

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

export const monitoring = pgTable("monitoring", {
	id: serial("id").primaryKey(),
	name: text("name"),
	eventAbi: text("eventAbi"),
	contractAddress: text("contractAddress"),
});

export const event = pgTable("event", {
	monitoringId: serial("monitoringId"),
	transactionHash: text("transactionHash"),
});
