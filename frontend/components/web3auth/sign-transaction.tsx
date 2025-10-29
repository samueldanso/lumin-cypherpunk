"use client";

import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useSignTransaction, useSolanaWallet } from "@web3auth/modal/react/solana";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function SignTransaction() {
	const {
		data: signedTransaction,
		error,
		loading: isPending,
		signTransaction,
	} = useSignTransaction();
	const { accounts, connection } = useSolanaWallet();

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const to = formData.get("address") as string;
		const value = formData.get("value") as string;

		if (!connection || !accounts?.[0]) return;

		const block = await connection.getLatestBlockhash();
		const TransactionInstruction = SystemProgram.transfer({
			fromPubkey: new PublicKey(accounts[0]),
			toPubkey: new PublicKey(to),
			lamports: Number(value) * LAMPORTS_PER_SOL,
		});

		const transaction = new Transaction({
			blockhash: block.blockhash,
			lastValidBlockHeight: block.lastValidBlockHeight,
			feePayer: new PublicKey(accounts[0]),
		}).add(TransactionInstruction);

		signTransaction(transaction);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Sign Transaction</h3>
			<form onSubmit={submit} className="space-y-3">
				<input
					name="address"
					placeholder="Recipient address"
					required
					className="w-full px-3 py-2 border rounded-md"
				/>
				<input
					name="value"
					placeholder="Amount (SOL)"
					type="number"
					step="0.01"
					required
					className="w-full px-3 py-2 border rounded-md"
				/>
				<Button disabled={isPending} type="submit" className="w-full">
					{isPending ? "Signing..." : "Sign Transaction"}
				</Button>
			</form>
			{signedTransaction && (
				<div className="p-3 bg-green-50 border border-green-200 rounded-md">
					<p className="text-sm font-medium text-green-800">Transaction Signed!</p>
					<p className="text-xs text-green-600 break-all">
						Signed Transaction: {signedTransaction}
					</p>
				</div>
			)}
			{error && (
				<div className="p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-800">Error: {error.message}</p>
				</div>
			)}
		</div>
	);
}
