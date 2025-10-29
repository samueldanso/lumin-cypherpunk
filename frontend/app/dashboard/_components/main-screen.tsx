import { useState } from 'react'
import { ActivityFeed } from './activity-feed'
import { DashboardHeader } from './dashboard-header'
import { DashboardSummary } from './dashboard-summary'
import { DepositModal } from './deposit-modal'
import { NewProducts } from './new-products'
import { WithdrawModal } from './withdraw-modal'
import { YieldTable } from '@/components/yield-table'

interface MainScreenProps {
	walletAddress?: string
}

export function MainScreen({ walletAddress }: MainScreenProps) {
	const [showDepositModal, setShowDepositModal] = useState(false)
	const [showWithdrawModal, setShowWithdrawModal] = useState(false)

	// Mock yield data for demonstration
	const mockYieldData = [
		{
			protocol: 'Orca',
			token_pair: 'SOL-USDC',
			apy: 8.5,
			tvl: 15000000,
			risk_level: 'low' as const,
			source: 'orca',
			last_updated: new Date().toISOString(),
		},
		{
			protocol: 'Raydium',
			token_pair: 'SOL-USDC',
			apy: 7.2,
			tvl: 12000000,
			risk_level: 'low' as const,
			source: 'raydium',
			last_updated: new Date().toISOString(),
		},
		{
			protocol: 'Kamino',
			token: 'USDC',
			apy: 12.3,
			tvl: 5000000,
			risk_level: 'medium' as const,
			source: 'kamino',
			last_updated: new Date().toISOString(),
		},
		{
			protocol: 'Marginfi',
			token: 'SOL',
			apy: 9.8,
			tvl: 8000000,
			risk_level: 'medium' as const,
			source: 'marginfi',
			last_updated: new Date().toISOString(),
		},
		{
			protocol: 'Solend',
			token: 'USDT',
			apy: 6.7,
			tvl: 3000000,
			risk_level: 'low' as const,
			source: 'solend',
			last_updated: new Date().toISOString(),
		},
	]

	return (
		<div className="flex h-full w-full items-center justify-center gap-2 px-3 py-8">
			<div className="h-full w-full max-w-5xl space-y-6">
				<DashboardHeader />
				<DashboardSummary
					onDepositClick={() => setShowDepositModal(true)}
					onWithdrawClick={() => setShowWithdrawModal(true)}
				/>

				{/* Yield Opportunities Table */}
				<YieldTable
					opportunities={mockYieldData}
					title="Current Yield Opportunities"
					className="w-full"
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
				<WithdrawModal
					open={showWithdrawModal}
					onClose={() => setShowWithdrawModal(false)}
				/>
			</div>
		</div>
	)
}
