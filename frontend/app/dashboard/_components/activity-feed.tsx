import { DepositButton } from '@/components/deposit-button'
import { Card, CardContent } from '@/components/ui/card'

interface ActivityFeedProps {
	onDepositClick: () => void
}

export function ActivityFeed({ onDepositClick }: ActivityFeedProps) {
	return (
		<Card className="flex min-h-[350px] w-full max-w-5xl flex-grow flex-col rounded-3xl">
			<CardContent className="flex w-full flex-1 flex-col">
				<div className="mb-2 text-base text-muted-foreground">Last activity</div>
				<div className="flex w-full flex-1 flex-col items-center justify-center">
					<div className="mb-2 text-center text-base font-semibold text-foreground">
						Your activity feed
					</div>
					<div className="mb-7 max-w-xl text-center text-muted-foreground">
						When you deposit, withdraw and earn yield it shows up here.
						<br />
						Get started with making a deposit to your account
					</div>
					<div>
						<DepositButton onClick={onDepositClick} />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
