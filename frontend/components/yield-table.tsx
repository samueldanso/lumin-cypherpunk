'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { TrendingUp, Shield, DollarSign, Activity } from 'lucide-react'

interface YieldOpportunity {
	protocol: string
	token_pair?: string
	token?: string
	apy: number | null
	tvl: number | null
	risk_level: 'low' | 'medium' | 'high'
	source: string
	last_updated: string
}

interface YieldTableProps {
	opportunities: YieldOpportunity[]
	title?: string
	className?: string
}

export function YieldTable({
	opportunities,
	title = 'Yield Opportunities',
	className,
}: YieldTableProps) {
	const getRiskColor = (risk: string) => {
		switch (risk) {
			case 'low':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
			case 'high':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
		}
	}

	const getRiskIcon = (risk: string) => {
		switch (risk) {
			case 'low':
				return <Shield className="h-3 w-3" />
			case 'medium':
				return <Activity className="h-3 w-3" />
			case 'high':
				return <TrendingUp className="h-3 w-3" />
			default:
				return <Shield className="h-3 w-3" />
		}
	}

	const formatAPY = (apy: number | null) => {
		if (apy === null) return 'N/A'
		return `${apy.toFixed(2)}%`
	}

	const formatTVL = (tvl: number | null) => {
		if (tvl === null) return 'N/A'
		if (tvl >= 1000000) {
			return `$${(tvl / 1000000).toFixed(1)}M`
		} else if (tvl >= 1000) {
			return `$${(tvl / 1000).toFixed(1)}K`
		}
		return `$${tvl.toFixed(0)}`
	}

	const formatTokenPair = (opportunity: YieldOpportunity) => {
		if (opportunity.token_pair) {
			return opportunity.token_pair
		}
		if (opportunity.token) {
			return opportunity.token
		}
		return 'Unknown'
	}

	// Sort opportunities by APY (highest first), then by TVL
	const sortedOpportunities = [...opportunities].sort((a, b) => {
		const aApy = a.apy || 0
		const bApy = b.apy || 0
		if (aApy !== bApy) {
			return bApy - aApy
		}
		const aTvl = a.tvl || 0
		const bTvl = b.tvl || 0
		return bTvl - aTvl
	})

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{sortedOpportunities.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>No yield opportunities found</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Protocol</TableHead>
									<TableHead>Asset</TableHead>
									<TableHead className="text-right">APY</TableHead>
									<TableHead className="text-right">TVL</TableHead>
									<TableHead className="text-center">Risk</TableHead>
									<TableHead className="text-center">Source</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedOpportunities.map((opportunity, index) => (
									<TableRow key={index}>
										<TableCell className="font-medium">
											{opportunity.protocol}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<DollarSign className="h-4 w-4 text-muted-foreground" />
												{formatTokenPair(opportunity)}
											</div>
										</TableCell>
										<TableCell className="text-right">
											<span
												className={`font-mono ${
													opportunity.apy && opportunity.apy > 10
														? 'text-green-600 dark:text-green-400'
														: opportunity.apy && opportunity.apy > 5
														? 'text-yellow-600 dark:text-yellow-400'
														: 'text-muted-foreground'
												}`}
											>
												{formatAPY(opportunity.apy)}
											</span>
										</TableCell>
										<TableCell className="text-right font-mono text-sm">
											{formatTVL(opportunity.tvl)}
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="secondary"
												className={`${getRiskColor(
													opportunity.risk_level
												)} flex items-center gap-1 w-fit mx-auto`}
											>
												{getRiskIcon(opportunity.risk_level)}
												{opportunity.risk_level}
											</Badge>
										</TableCell>
										<TableCell className="text-center">
											<Badge variant="outline" className="text-xs">
												{opportunity.source}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
