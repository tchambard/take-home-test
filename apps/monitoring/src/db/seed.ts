import { randomBytes } from 'crypto';

import { db } from "./db";
import { monitoring, event } from "./schema";

function generateRandomHash(): string {
	return `0x${randomBytes(32).toString('hex')}`;
}
const run = async () => {
	// insert monitoring
	for (let i = 0; i < 40; i++) {
		await db.insert(monitoring)
			.values({
				contractAddress: generateRandomHash(),
				eventAbi: '{}',
				name: `Monitoring ${i}`
			});
	}

	// insert monitoring
	for (let i = 0; i < 300; i++) {
		const monitoringId = Math.floor(Math.random() * 40) + 1;
		await db.insert(event)
			.values({
				monitoringId,
				transactionHash: generateRandomHash(),
			});
	}
};

run().then(() => {
	process.exit(0);
}).catch((e) => {
	console.error("An error occurred while inserting data seeds", e.stack);
	process.exit(1);
});
