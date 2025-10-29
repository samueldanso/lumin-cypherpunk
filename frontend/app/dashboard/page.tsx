"use client";

import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { MainScreen } from "@/app/dashboard/_components/main-screen";

export default function Dashboard() {
	const { accounts } = useSolanaWallet();
	const walletAddress = accounts?.[0];

	return <MainScreen walletAddress={walletAddress} />;
}
