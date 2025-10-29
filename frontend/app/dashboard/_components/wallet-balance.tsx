"use client";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useEffect, useState } from "react";

export function WalletBalance() {
	const { accounts, connection } = useSolanaWallet();
	const [balance, setBalance] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchBalance = async () => {
		if (connection && accounts && accounts.length > 0) {
			try {
				setIsLoading(true);
				setError(null);
				const publicKey = new PublicKey(accounts[0]);
				const balance = await connection.getBalance(publicKey);
				setBalance(balance);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		fetchBalance();
	}, [connection, accounts]);

	return (
		<div className="mb-6 flex w-full flex-col items-start md:mb-0 md:w-auto">
			<span className="mb-1 text-base text-muted-foreground">Your balance</span>
			<span className="text-4xl font-semibold">
				{balance !== null ? `${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL` : "0.0000 SOL"}
			</span>
			{isLoading && <div className="mt-1 text-xs text-muted-foreground">Loading...</div>}
			{error && <div className="mt-1 text-xs text-red-500">Error: {error}</div>}
		</div>
	);
}
