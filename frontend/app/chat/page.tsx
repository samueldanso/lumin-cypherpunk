'use client'

import { Bot, Loader2, Send, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { YieldTable } from '@/components/yield-table'

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

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
	yieldData?: YieldOpportunity[]
}

export default function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	// Parse yield data from agent response
	const parseYieldData = (content: string): YieldOpportunity[] => {
		const yieldData: YieldOpportunity[] = []

		// Look for yield data patterns in the response
		const lines = content.split('\n')
		let currentOpportunity: Partial<YieldOpportunity> = {}

		for (const line of lines) {
			// Match protocol names
			if (
				line.includes('**') &&
				(line.includes('Orca') ||
					line.includes('Raydium') ||
					line.includes('Kamino') ||
					line.includes('Marginfi') ||
					line.includes('Solend'))
			) {
				const protocolMatch = line.match(/\*\*(.*?)\*\*/)
				if (protocolMatch) {
					currentOpportunity.protocol = protocolMatch[1]
				}
			}

			// Match APY
			const apyMatch = line.match(/APY:\s*\*\*([0-9.]+)%/)
			if (apyMatch) {
				currentOpportunity.apy = parseFloat(apyMatch[1])
			}

			// Match TVL
			const tvlMatch = line.match(/TVL:\s*\$?([0-9,]+)/)
			if (tvlMatch) {
				currentOpportunity.tvl = parseFloat(tvlMatch[1].replace(/,/g, ''))
			}

			// Match risk level
			const riskMatch = line.match(/Risk:\s*([A-Za-z]+)/)
			if (riskMatch) {
				currentOpportunity.risk_level = riskMatch[1].toLowerCase() as
					| 'low'
					| 'medium'
					| 'high'
			}

			// Match source
			const sourceMatch = line.match(/Source:\s*([A-Za-z]+)/)
			if (sourceMatch) {
				currentOpportunity.source = sourceMatch[1].toLowerCase()
			}

			// If we have enough data, add to yieldData
			if (
				currentOpportunity.protocol &&
				(currentOpportunity.apy !== undefined || currentOpportunity.tvl !== undefined)
			) {
				yieldData.push({
					protocol: currentOpportunity.protocol,
					token_pair: currentOpportunity.token_pair || undefined,
					token: currentOpportunity.token || undefined,
					apy: currentOpportunity.apy || null,
					tvl: currentOpportunity.tvl || null,
					risk_level: currentOpportunity.risk_level || 'medium',
					source: currentOpportunity.source || 'unknown',
					last_updated: new Date().toISOString(),
				})
				currentOpportunity = {}
			}
		}

		return yieldData
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!input.trim() || isLoading) return

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input.trim(),
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setInput('')
		setIsLoading(true)

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: userMessage.content }),
			})

			const data = await response.json()
			const responseContent = data.response || 'Sorry, I encountered an error.'
			const yieldData = parseYieldData(responseContent)

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: responseContent,
				timestamp: new Date(),
				yieldData: yieldData.length > 0 ? yieldData : undefined,
			}

			setMessages((prev) => [...prev, assistantMessage])
		} catch (error) {
			console.error('Error:', error)
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: 'Sorry, I encountered an error while processing your request.',
				timestamp: new Date(),
			}
			setMessages((prev) => [...prev, errorMessage])
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex flex-col h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-card px-4 py-4 shadow-sm">
				<div className="max-w-4xl mx-auto flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-foreground">LuminYield Chat</h1>
						<p className="text-sm text-muted-foreground mt-1">
							Ask about Solana yield optimization strategies
						</p>
					</div>
					<Badge variant="secondary" className="flex items-center gap-2">
						<Bot className="h-4 w-4" />
						AI Powered
					</Badge>
				</div>
			</header>

			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto px-4 py-6">
				<div className="max-w-4xl mx-auto space-y-6">
					{messages.length === 0 ? (
						<div className="text-center py-12">
							<Card className="max-w-md mx-auto">
								<CardContent className="pt-6">
									<div className="inline-block p-6 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-4">
										<Bot className="w-12 h-12 text-primary-foreground" />
									</div>
									<h2 className="text-2xl font-semibold text-foreground mb-2">
										Start optimizing your yield
									</h2>
									<p className="text-muted-foreground mb-4">
										Ask me about the best yield strategies on Solana
									</p>
									<div className="space-y-2 text-sm text-muted-foreground">
										<p>💡 "What's the best yield for SOL?"</p>
										<p>💡 "Compare Orca vs Raydium APYs"</p>
										<p>💡 "Show me staking opportunities"</p>
									</div>
								</CardContent>
							</Card>
						</div>
					) : (
						messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.role === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								<Card
									className={`max-w-[80%] ${
										message.role === 'user'
											? 'bg-primary text-primary-foreground'
											: 'bg-card'
									}`}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											{message.role === 'assistant' && (
												<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
													<Bot className="w-5 h-5 text-primary-foreground" />
												</div>
											)}
											{message.role === 'user' && (
												<div className="flex-shrink-0 w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
													<User className="w-5 h-5 text-primary-foreground" />
												</div>
											)}
											<div className="flex-1">
												{message.role === 'assistant' ? (
													<div className="space-y-4">
														<div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-headings:my-3 prose-img:rounded-lg prose-img:shadow-md">
															<ReactMarkdown
																remarkPlugins={[remarkGfm]}
																components={{
																	img: ({ node, ...props }) => (
																		<img
																			{...props}
																			className="max-w-full h-auto rounded-lg shadow-md my-4"
																			loading="lazy"
																			alt={
																				props.alt || 'Image'
																			}
																		/>
																	),
																	a: ({ node, ...props }) => (
																		<a
																			{...props}
																			target="_blank"
																			rel="noopener noreferrer"
																			className="text-primary hover:text-primary/80 underline"
																		/>
																	),
																	code: ({
																		node,
																		className,
																		children,
																		...props
																	}) => {
																		const isInline =
																			!className?.includes(
																				'language-'
																			)
																		return isInline ? (
																			<code
																				className="bg-muted px-1.5 py-0.5 rounded text-sm"
																				{...props}
																			>
																				{children}
																			</code>
																		) : (
																			<code
																				className={`block bg-muted p-3 rounded-lg overflow-x-auto ${
																					className || ''
																				}`}
																				{...props}
																			>
																				{children}
																			</code>
																		)
																	},
																}}
															>
																{message.content}
															</ReactMarkdown>
														</div>

														{/* Yield Table if data is available */}
														{message.yieldData &&
															message.yieldData.length > 0 && (
																<YieldTable
																	opportunities={
																		message.yieldData
																	}
																	title="Yield Analysis Results"
																	className="w-full"
																/>
															)}
													</div>
												) : (
													<p className="whitespace-pre-wrap break-words">
														{message.content}
													</p>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						))
					)}

					{isLoading && (
						<div className="flex justify-start">
							<Card className="max-w-[80%]">
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
											<Bot className="w-5 h-5 text-primary-foreground" />
										</div>
										<div className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span className="text-muted-foreground">
												Analyzing yield opportunities...
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Form */}
			<div className="border-t bg-card px-4 py-4">
				<div className="max-w-4xl mx-auto">
					<form onSubmit={handleSubmit} className="flex gap-2">
						<Input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask about Solana yield strategies..."
							disabled={isLoading}
							className="flex-1"
						/>
						<Button type="submit" disabled={isLoading || !input.trim()} size="icon">
							<Send className="h-4 w-4" />
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
}
