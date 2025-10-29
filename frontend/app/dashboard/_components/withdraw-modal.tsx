import React, { useState } from "react";
import { AmountInput } from "@/components/ui/amount-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface WithdrawModalProps {
	open: boolean;
	onClose: () => void;
}

export function WithdrawModal({ open, onClose }: WithdrawModalProps) {
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [showPreview, setShowPreview] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Mock balance for now - will be replaced with real balance
	const displayableBalance = "5.0000";

	const isRecipientValid = recipient.length > 0;
	const isAmountValid =
		!!amount &&
		!Number.isNaN(Number(amount)) &&
		Number(amount) > 0 &&
		Number(amount) <= Number(displayableBalance);
	const canContinue = isRecipientValid && isAmountValid;

	async function handleContinue() {
		setError(null);
		if (!recipient) {
			setError("Please enter a recipient");
			return;
		}
		try {
			setIsLoading(true);
			setShowPreview(true);
		} catch (e: unknown) {
			setError((e as Error).message || String(e));
		} finally {
			setIsLoading(false);
		}
	}

	async function handleWithdraw() {
		setError(null);
		setIsLoading(true);
		try {
			if (!isRecipientValid || !amount || !isAmountValid) {
				setError("Invalid recipient or amount");
				setIsLoading(false);
				return;
			}

			// Mock withdrawal - will be replaced with real functionality
			await new Promise((resolve) => setTimeout(resolve, 2000));

			handleDone();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}

	const resetFlow = () => {
		setShowPreview(false);
		setAmount("");
		setRecipient("");
		setError(null);
	};

	const handleDone = () => {
		resetFlow();
		onClose();
	};

	const handleBack = () => {
		if (!showPreview) {
			handleDone();
		} else {
			resetFlow();
		}
	};

	const displayableAmount = Number(amount).toFixed(2);

	return (
		<Modal
			open={open}
			onClose={onClose}
			showBackButton={!isLoading}
			onBack={handleBack}
			title={showPreview ? "Order Confirmation" : "Withdraw"}
		>
			{!showPreview ? (
				<>
					<div className="mb-6 flex w-full flex-col items-center justify-between">
						<AmountInput amount={amount} onChange={setAmount} />
						<div
							className={
								Number(amount) > Number(displayableBalance) ? "text-red-600" : "text-gray-400"
							}
						>
							$ {displayableBalance} balance
						</div>
					</div>
					<div className="mb-6">
						<Input
							placeholder="Recipient address or email"
							value={recipient}
							onChange={(e) => setRecipient(e.target.value)}
							className="w-full"
						/>
						{error && <div className="mt-1 text-xs text-red-500">{error}</div>}
					</div>
					<Button disabled={!canContinue} onClick={handleContinue} className="w-full">
						Continue
					</Button>
				</>
			) : (
				<div className="text-center">
					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Confirm Withdrawal</h3>
						<div className="space-y-2 text-sm text-muted-foreground">
							<div>Amount: ${displayableAmount}</div>
							<div>Recipient: {recipient}</div>
						</div>
					</div>
					{error && <div className="mb-4 text-sm text-red-500">{error}</div>}
					<Button onClick={handleWithdraw} disabled={isLoading} className="w-full">
						{isLoading ? "Processing..." : "Confirm Withdrawal"}
					</Button>
				</div>
			)}
		</Modal>
	);
}
