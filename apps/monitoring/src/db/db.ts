import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { event, monitoring } from "./schema";

const connectionString = process.env.DATABASE_URL as string;
if (!connectionString) {
	throw new Error("Missing DATABASE_URL env variable");
}
const client = postgres(connectionString);
export const db = drizzle(client, { schema: { monitoring, event } });
