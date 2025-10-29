"use client";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function GetBalance() {
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
		<div className="flex items-center gap-2">
			<div className="text-sm">
				<div className="font-medium">
					{balance !== null ? `${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL` : "0.0000 SOL"}
				</div>
				{isLoading && <div className="text-xs text-muted-foreground">Loading...</div>}
				{error && <div className="text-xs text-red-500">Error: {error}</div>}
			</div>
			<Button
				variant="ghost"
				size="sm"
				onClick={fetchBalance}
				disabled={isLoading}
				className="h-6 w-6 p-0"
			>
				<RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
			</Button>
		</div>
	);
}
