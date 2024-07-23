import { pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

// Maybe all fields should be mandatory ?
export type MonitoringDb = {
	id: number;
	name: string | null;
	eventAbi: string | null;
	contractAddress: string | null;
};

// Maybe all fields should be mandatory ?
export type EventDb = {
	id: number;
	monitoringId: number;
	transactionHash: string | null;
};

export const monitoring = pgTable(
	"monitoring",
	{
		id: serial("id").primaryKey(),
		name: text("name"),
		eventAbi: text("eventAbi"),
		contractAddress: text("contractAddress"),
	},
	(table) => {
		return {
			uniqueContractAddress: unique().on(table.contractAddress),
		};
	},
);

export const event = pgTable("event", {
	id: serial("id").primaryKey(),
	monitoringId: serial("monitoringId")
		.notNull()
		.references(() => monitoring.id),
	transactionHash: text("transactionHash"),
});

export const monitoringRelations = relations(monitoring, ({ many }) => ({
	events: many(event),
}));

export const eventRelations = relations(event, ({ one }) => ({
	monitoring: one(monitoring, {
		fields: [event.monitoringId],
		references: [monitoring.id],
	}),
}));
