import { db } from "./drizzle";
import { Monitoring, monitoring } from "./schema";

const monitoringSeeds: Partial<Monitoring>[] = [
	{
		name: "Test Monitoring 1",
		eventAbi: "{}",
		contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
	},
	{
		name: "Test Monitoring 2",
		eventAbi: "{}",
		contractAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
	},
	{
		name: "Test Monitoring 3",
		eventAbi: "{}",
		contractAddress: "0x0987654321abcdef0987654321abcdef09876543",
	},
];

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
