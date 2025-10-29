"use client";

import { useSignMessage } from "@web3auth/modal/react/solana";
import { Button } from "@/components/ui/button";

export function SignMessage() {
	const { data: hash, error, loading: isPending, signMessage } = useSignMessage();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const message = formData.get("message");
		if (message) {
			signMessage(message.toString());
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Sign Message</h3>
			<form onSubmit={handleSubmit} className="space-y-3">
				<input
					name="message"
					placeholder="Enter message to sign"
					required
					className="w-full px-3 py-2 border rounded-md"
				/>
				<Button disabled={isPending} type="submit" className="w-full">
					{isPending ? "Signing..." : "Sign Message"}
				</Button>
			</form>
			{hash && (
				<div className="p-3 bg-green-50 border border-green-200 rounded-md">
					<p className="text-sm font-medium text-green-800">Message Signed!</p>
					<p className="text-xs text-green-600 break-all">Hash: {hash}</p>
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
