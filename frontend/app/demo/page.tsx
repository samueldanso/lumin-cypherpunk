// Demo page showcasing Web3Auth Solana hooks following official patterns
// https://web3auth.io/docs/sdk/web/react/solana-hooks/

"use client";

import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { Button } from "@/components/ui/button";
import { GetBalance } from "@/components/web3auth/get-balance";
import { SignMessage } from "@/components/web3auth/sign-message";
import { SignTransaction } from "@/components/web3auth/sign-transaction";

export default function DemoPage() {
	const {
		connect,
		isConnected,
		connectorName,
		loading: connectLoading,
		error: connectError,
	} = useWeb3AuthConnect();
	const {
		disconnect,
		loading: disconnectLoading,
		error: disconnectError,
	} = useWeb3AuthDisconnect();
	const { userInfo } = useWeb3AuthUser();
	const { accounts } = useSolanaWallet();

	function uiConsole(...args: any[]): void {
		const el = document.querySelector("#console>p");
		if (el) {
			el.innerHTML = JSON.stringify(args || {}, null, 2);
		}
	}

	const loggedInView = (
		<div className="grid gap-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold">Connected to {connectorName}</h2>
				<p className="text-muted-foreground">{accounts?.[0]}</p>
			</div>

			<div className="flex gap-4 justify-center">
				<Button onClick={() => uiConsole(userInfo)} variant="outline">
					Get User Info
				</Button>
				<Button onClick={() => disconnect()} variant="destructive">
					{disconnectLoading ? "Disconnecting..." : "Log Out"}
				</Button>
			</div>
			{disconnectError && (
				<div className="text-red-500 text-center">Error: {disconnectError.message}</div>
			)}

			{/* Web3Auth Solana Components following official patterns */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="p-6 border rounded-lg">
					<GetBalance />
				</div>

				<div className="p-6 border rounded-lg">
					<SignMessage />
				</div>

				<div className="p-6 border rounded-lg">
					<SignTransaction />
				</div>
			</div>
		</div>
	);

	const unloggedInView = (
		<div className="text-center space-y-4">
			<h1 className="text-3xl font-bold">Web3Auth Solana Demo</h1>
			<p className="text-muted-foreground">Following official Web3Auth patterns</p>
			<Button onClick={() => connect()} size="lg">
				{connectLoading ? "Connecting..." : "Login"}
			</Button>
			{connectError && <div className="text-red-500">Error: {connectError.message}</div>}
		</div>
	);

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8 text-center">
				<h1 className="text-4xl font-bold mb-2">
					<a
						target="_blank"
						href="https://web3auth.io/docs/sdk/pnp/web/modal"
						rel="noreferrer"
						className="text-blue-600 hover:underline"
					>
						Web3Auth
					</a>{" "}
					& Next.js Solana Demo
				</h1>
				<p className="text-muted-foreground">
					Showcasing official Web3Auth Solana hooks implementation
				</p>
			</div>

			{isConnected ? loggedInView : unloggedInView}

			<div id="console" className="mt-8 p-4 bg-muted rounded-lg">
				<h3 className="font-semibold mb-2">Console Output:</h3>
				<p className="whitespace-pre-line text-sm font-mono"></p>
			</div>

			<footer className="mt-8 text-center">
				<a
					href="https://github.com/Web3Auth/web3auth-examples/tree/main/quick-starts/react-solana-quick-start"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline"
				>
					Official Source Code Reference
				</a>
			</footer>
		</div>
	);
}
