import { pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

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
	monitoringId: serial("monitoringId").notNull().references(() => monitoring.id),
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