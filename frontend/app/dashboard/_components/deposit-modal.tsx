import React, { useCallback, useState } from "react";
import { AmountInput } from "@/components/ui/amount-input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface DepositModalProps {
	open: boolean;
	onClose: () => void;
	walletAddress?: string;
}

const MAX_AMOUNT = 50; // Max amount in USD allowed in staging

export function DepositModal({ open, onClose, walletAddress }: DepositModalProps) {
	const [step, setStep] = useState<"options" | "processing" | "completed">("options");
	const [amount, setAmount] = useState("");

	const restartFlow = () => {
		setStep("options");
		setAmount("");
	};

	const handleDone = () => {
		restartFlow();
		onClose();
	};

	const handlePaymentCompleted = useCallback(() => {
		handleDone();
	}, []);

	const handleProcessingPayment = useCallback(() => {
		setStep("processing");
	}, []);

	return (
		<>
			<Modal
				open={open}
				onClose={onClose}
				showBackButton={step !== "processing"}
				onBack={step === "options" ? handleDone : restartFlow}
				className="top-[70px] h-[calc(100dvh-174px)] md:max-h-[calc(100dvh-174px)] lg:top-0 lg:max-h-[calc(100dvh-32px)] lg:min-h-[718px]"
				title="Deposit"
			>
				{step === "options" && (
					<div className="mb-6 flex w-full flex-col items-center">
						<AmountInput amount={amount} onChange={setAmount} />
						{Number(amount) > MAX_AMOUNT && (
							<div className="mt-1 text-center text-red-600">
								Transaction amount exceeds the maximum allowed deposit limit of ${MAX_AMOUNT}
							</div>
						)}
					</div>
				)}
				<div className="flex w-full flex-grow flex-col">
					{step === "options" && (
						<div className="text-center">
							<p className="text-muted-foreground mb-4 text-base">
								Deposit functionality coming soon...
							</p>
							<Button
								onClick={handleProcessingPayment}
								disabled={!(Number(amount) <= MAX_AMOUNT && Number(amount) > 0)}
								className="w-full"
							>
								Continue
							</Button>
						</div>
					)}
					{step === "processing" && (
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-muted-foreground text-base">Processing deposit...</p>
						</div>
					)}
					{step === "completed" && (
						<div className="text-center">
							<div className="text-green-500 text-6xl mb-4">✓</div>
							<p className="text-lg font-semibold mb-2 text-foreground">Deposit Successful!</p>
							<p className="text-muted-foreground mb-4 text-base">
								Your deposit of ${amount} has been processed.
							</p>
							<Button onClick={handleDone} className="w-full">
								Done
							</Button>
						</div>
					)}
				</div>
			</Modal>
		</>
	);
}
