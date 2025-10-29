"use client";

import { DepositButton } from "@/components/deposit-button";
import { Card, CardContent } from "@/components/ui/card";
import { WithdrawButton } from "@/components/withdraw-button";
import { CurrentAPY } from "./current-apy";
import { WalletBalance } from "./wallet-balance";

interface DashboardSummaryProps {
	onDepositClick: () => void;
	onWithdrawClick: () => void;
}

export function DashboardSummary({ onDepositClick, onWithdrawClick }: DashboardSummaryProps) {
	return (
		<Card className="flex w-full max-w-5xl rounded-3xl">
			<CardContent className="flex w-full flex-col items-center justify-between md:flex-row md:items-stretch">
				{/* Left Side */}
				<div className="flex w-full flex-row items-center gap-8 md:w-auto">
					<WalletBalance />
					<CurrentAPY />
				</div>

				{/* Right Side - Actions */}
				<div className="flex w-full items-center gap-2 md:w-auto md:justify-end">
					<DepositButton onClick={onDepositClick} />
					<WithdrawButton onClick={onWithdrawClick} />
				</div>
			</CardContent>
		</Card>
	);
}
