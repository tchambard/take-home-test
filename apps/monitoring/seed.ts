import { db } from "./src/drizzle";
import { monitoring } from "./src/schema";
import { monitoringSeeds } from "./src/seeds/monitoring";

const run = async () => {
	for (const seed of monitoringSeeds) {
		await db.insert(monitoring).values(seed);
	}
};

run()
	.then(() => {
		process.exit(0);
	})
	.catch((e) => {
		console.error("An error occurred while inserting data seeds", e.stack);
		process.exit(1);
	});
