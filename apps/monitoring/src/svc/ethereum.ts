import { http, type BlockTag, createPublicClient, fallback } from "viem";

import { mainnet } from "viem/chains";

const infura = http(
	`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
);

export const ethereum = createPublicClient({
	chain: mainnet,
	transport: fallback([infura, http()]),
});

export async function getLatestBlockHash(): Promise<string> {
	try {
		const latestBlockNumber: BlockTag = await ethereum.request({
			method: "eth_blockNumber",
		});

		const block = await ethereum.request({
			method: "eth_getBlockByNumber",
			params: [latestBlockNumber, false],
		});

		const blockNumber = block?.number;
		if (!blockNumber) {
			throw new Error("Failed to fetch latest block hash");
		}
		return blockNumber.toString();
	} catch (error) {
		console.error("Error fetching current block hash:", error);
		throw error;
	}
}
