import {
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export type MonitoringDb = {
	id: number;
	name: string;
	eventAbi: string;
	contractAddress: string;
	blockNumberAtCreation: string;
};

export type EventDb = {
	monitoringId: number;
	transactionHash: string;
	logIndex: number;
	eventName: string;
	blockNumber: string;
	blockHash: string;
};

export const monitoring = pgTable(
	"monitoring",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		eventAbi: text("eventAbi").notNull(),
		contractAddress: text("contractAddress").notNull(),
		blockNumberAtCreation: text("blockNumberAtCreation").notNull(),
	},
	(table) => {
		return {
			uniqueContractAddress: unique().on(table.contractAddress),
			onDelete: "cascade",
		};
	},
);

export const event = pgTable(
	"event",
	{
		monitoringId: serial("monitoringId")
			.notNull()
			.references(() => monitoring.id),
		transactionHash: text("transactionHash").notNull(),
		logIndex: integer("logIndex").notNull(),
		eventName: text("eventName").notNull(),
		blockNumber: text("blockNumber").notNull(),
		blockHash: text("blockHash").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.transactionHash, table.logIndex, table.eventName],
			}),
		};
	},
);

export const monitoringRelations = relations(monitoring, ({ many }) => ({
	events: many(event),
}));

export const eventRelations = relations(event, ({ one }) => ({
	monitoring: one(monitoring, {
		fields: [event.monitoringId],
		references: [monitoring.id],
	}),
}));
