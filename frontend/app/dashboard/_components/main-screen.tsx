import { useState } from "react";
import { ActivityFeed } from "./activity-feed";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSummary } from "./dashboard-summary";
import { DepositModal } from "./deposit-modal";
import { NewProducts } from "./new-products";
import { WithdrawModal } from "./withdraw-modal";

interface MainScreenProps {
	walletAddress?: string;
}

export function MainScreen({ walletAddress }: MainScreenProps) {
	const [showDepositModal, setShowDepositModal] = useState(false);
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);

	return (
		<div className="flex h-full w-full items-center justify-center gap-2 px-3 py-8">
			<div className="h-full w-full max-w-5xl">
				<DashboardHeader />
				<DashboardSummary
					onDepositClick={() => setShowDepositModal(true)}
					onWithdrawClick={() => setShowWithdrawModal(true)}
				/>
				<NewProducts />
				<ActivityFeed onDepositClick={() => setShowDepositModal(true)} />

				{/* Deposit Modal */}
				<DepositModal
					open={showDepositModal}
					onClose={() => setShowDepositModal(false)}
					walletAddress={walletAddress}
				/>

				{/* Withdraw Modal */}
				<WithdrawModal open={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
			</div>
		</div>
	);
}
