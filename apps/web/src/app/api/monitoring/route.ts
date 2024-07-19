import { db } from "../../../database/drizzle";
import { monitoring } from "../../../database/schema";

export async function GET() {
	const allMonitoring = await db.select().from(monitoring);
	return Response.json(allMonitoring);
}

export async function POST(req: Request) {
	const { name, eventAbi, contractAddress } = await req.json();

	const newMonitoring = await db.insert(monitoring).values({
		name,
		eventAbi,
		contractAddress,
	});

	return Response.json(newMonitoring);
}
