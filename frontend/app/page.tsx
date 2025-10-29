"use client";

import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SignIn } from "@/components/web3auth/sign-in";

const NAVIGATION_LINKS = [
	{
		title: "Home",
		href: "#home",
	},
	{
		title: "Features",
		href: "#features",
	},
	{
		title: "How it works",
		href: "#how-it-works",
	},
	{
		title: "FAQ",
		href: "#faq",
	},
	{
		title: "AI Chat",
		href: "/chat",
	},
];

export default function Home() {
	const { isConnected, loading: isLoading } = useWeb3AuthConnect();
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	// Redirect authenticated users to dashboard
	useEffect(() => {
		if (isConnected) {
			router.push("/dashboard");
		}
	}, [isConnected, router]);

	// Show loading state while checking auth
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	// Show landing page for non-authenticated users
	return (
		<div className="min-h-screen relative">
			{/* Marketing Header  */}
			<header className="absolute top-0 left-0 right-0 z-50 p-6">
				<div className="mx-auto max-w-6xl flex h-20 items-center px-4">
					{/* Logo - Left */}
					<div className="flex-shrink-0">
						<Logo />
					</div>

					{/* Navigation - Center */}
					<div className="flex-1 flex justify-center">
						<nav className="hidden md:flex bg-muted/80 rounded-full px-4 py-2">
							{NAVIGATION_LINKS.map((item, index) => (
								<Link
									key={item.title}
									href={item.href}
									className="text-base font-medium text-muted-foreground transition-colors duration-200 hover:text-primary px-4 py-2.5 rounded-full mx-1"
								>
									{item.title}
								</Link>
							))}
						</nav>
					</div>

					{/* Actions - Right */}
					<div className="hidden md:flex items-center space-x-4 flex-shrink-0">
						<SignIn />
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center space-x-4 flex-shrink-0">
						<SignIn />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="bg-muted/80 hover:bg-muted/90 p-3 rounded-full text-muted-foreground hover:text-muted-foreground"
						>
							{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation Dropdown - Card style */}
				{isMobileMenuOpen && (
					<div className="md:hidden px-4">
						<div className="bg-muted/80 rounded-2xl px-6 py-3 mt-3 shadow-sm">
							<nav>
								{NAVIGATION_LINKS.map((item) => (
									<Link
										key={item.title}
										href={item.href}
										className="block px-2 py-4 text-2xl font-medium text-foreground rounded-xl hover:bg-muted/80"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.title}
									</Link>
								))}
							</nav>
						</div>
					</div>
				)}
			</header>

			{/* Hero Section */}
			<div className="min-h-screen flex items-center justify-center pt-16">
				<div className="text-center space-y-12 max-w-4xl mx-auto px-6">
					<div className="space-y-8">
						<h1 className="text-5xl md:text-7xl font-bold tracking-tight">
							Your stablecoins,{" "}
							<span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
								working smarter
							</span>
						</h1>
						<p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
							Earn 6-8% APY with AI-powered yield optimization across Solana DeFi protocols. Chat
							with our AI agents to find the best strategies.
						</p>
					</div>

					<div className="space-y-8">
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<SignIn variant="getstarted" />
							<Link href="/chat">
								<Button variant="outline" size="lg" className="px-8 py-4">
									Ask AI About Yields
								</Button>
							</Link>
						</div>
						<p className="text-sm text-muted-foreground">Free • No seed phrases • Instant setup</p>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<section id="features" className="py-24">
				<div className="mx-auto max-w-6xl px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">AI-powered stablecoin savings</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
							Automated yield optimization across Solana DeFi protocols
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						{/* Feature Card 1 - AI-Powered Yield Optimization */}
						<div className="bg-muted/80 rounded-2xl p-10 relative overflow-hidden min-h-[280px]">
							<h3 className="text-2xl font-bold mb-6">AI-Powered Yield Optimization</h3>
							<p className="text-muted-foreground font-medium mb-8 text-lg leading-relaxed">
								Our AI automatically finds the highest yielding protocols across Solana DeFi,
								ensuring you always get the best returns.
							</p>
							<div className="flex items-center space-x-4">
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Current APY</div>
									<div className="text-2xl font-bold text-primary">6-8%</div>
								</div>
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Risk Level</div>
									<div className="text-2xl font-bold">Low</div>
								</div>
							</div>
						</div>

						{/* Feature Card 2 - Self Custodial */}
						<div className="bg-muted/80 rounded-2xl p-10 relative overflow-hidden min-h-[280px]">
							<h3 className="text-2xl font-bold mb-6">Self Custodial</h3>
							<p className="text-muted-foreground mb-8 text-lg leading-relaxed">
								You always maintain full control of your funds. No third-party custody, no
								withdrawal limits, and complete ownership of your assets.
							</p>
							<div className="flex items-center space-x-4">
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Control</div>
									<div className="text-2xl font-bold text-primary">100%</div>
								</div>
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Security</div>
									<div className="text-2xl font-bold">Full</div>
								</div>
							</div>
						</div>

						{/* Feature Card 3 - Instant Withdrawals */}
						<div className="bg-muted/80 rounded-2xl p-10 relative overflow-hidden min-h-[280px]">
							<h3 className="text-2xl font-bold mb-6">Instant Withdrawals</h3>
							<p className="text-muted-foreground mb-8 text-lg leading-relaxed">
								Access your funds anytime with no lockups or delays. Withdraw to any wallet or use
								Solana Pay for instant payments.
							</p>
							<div className="flex items-center space-x-4">
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Withdrawal Time</div>
									<div className="text-2xl font-bold text-primary">Instant</div>
								</div>
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Min Withdrawal</div>
									<div className="text-2xl font-bold">$1</div>
								</div>
							</div>
						</div>

						{/* Feature Card 4 - Automated Rebalancing */}
						<div className="bg-muted/80 rounded-2xl p-10 relative overflow-hidden min-h-[280px]">
							<h3 className="text-2xl font-bold mb-6">Automated Rebalancing</h3>
							<p className="text-muted-foreground mb-8 text-lg leading-relaxed">
								Our AI continuously monitors the market and automatically moves your funds to the
								highest-yielding protocols available.
							</p>
							<div className="flex items-center space-x-4">
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Rebalancing</div>
									<div className="text-2xl font-bold text-primary">Auto</div>
								</div>
								<div className="bg-muted/80 rounded-lg p-4 flex-1">
									<div className="text-sm text-muted-foreground mb-2">Monitoring</div>
									<div className="text-2xl font-bold">24/7</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How it Works Section */}
			<section id="how-it-works" className="py-24 bg-primary relative overflow-hidden">
				{/* Logo Icon Overlays */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-10 w-32 h-32">
						<Logo />
					</div>
					<div className="absolute top-20 right-20 w-24 h-24">
						<Logo />
					</div>
					<div className="absolute bottom-20 left-1/4 w-28 h-28">
						<Logo />
					</div>
					<div className="absolute bottom-10 right-10 w-20 h-20">
						<Logo />
					</div>
				</div>

				<div className="mx-auto max-w-6xl px-4 relative z-10">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-background">
							Start earning in 5 minutes
						</h2>
						<p className="text-xl font-medium text-background/80 max-w-3xl mx-auto">
							Three simple steps to start earning more on your stablecoins
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* Step 01 */}
						<div className="bg-background/95 backdrop-blur-sm rounded-2xl p-10 min-h-[350px] flex flex-col justify-between shadow-xl">
							<div className="text-left">
								<div className="text-2xl font-bold text-muted-foreground mb-4">01</div>
								<h3 className="text-2xl font-bold text-primary mb-6">Create your Account</h3>
								<p className="text-muted-foreground text-lg leading-relaxed">
									Sign up instantly with your email or Google account - seamless, no seed phrases,
									powered by Web3Auth.
								</p>
							</div>
							<div className="mt-auto pt-8">
								<Link href="/dashboard">
									<Button
										variant="outline"
										className="border-lime-500 text-foreground hover:bg-lime-500 hover:text-background rounded-full w-full px-12 py-6 text-lg font-semibold"
									>
										Start earning
									</Button>
								</Link>
							</div>
						</div>

						{/* Step 02 */}
						<div className="bg-background/95 backdrop-blur-sm rounded-2xl p-10 min-h-[350px] flex flex-col justify-between shadow-xl">
							<div className="text-left">
								<div className="text-2xl font-bold text-muted-foreground mb-4">02</div>
								<h3 className="text-2xl font-bold text-primary mb-6">Deposit your Funds</h3>
								<p className="text-muted-foreground text-lg leading-relaxed">
									Fund your account by usung Solana Pay QR code or transfering crypto from an
									existing wallet.
								</p>
							</div>
							<div className="mt-auto pt-8">
								<Link href="/dashboard">
									<Button
										variant="outline"
										className="border-lime-500 text-foreground hover:bg-lime-500 hover:text-background rounded-full w-full px-12 py-6 text-lg font-semibold"
									>
										Start earning
									</Button>
								</Link>
							</div>
						</div>

						{/* Step 03 */}
						<div className="bg-background/95 backdrop-blur-sm rounded-2xl p-10 min-h-[350px] flex flex-col justify-between shadow-xl">
							<div className="text-left">
								<div className="text-2xl font-bold text-muted-foreground mb-4">03</div>
								<h3 className="text-2xl font-bold text-primary mb-6">Earn & Withdraw</h3>
								<p className="text-muted-foreground text-lg leading-relaxed">
									AI Agents automatically move your funds to the protocol with highest rates
									available. Withdraw your earnings anytime.
								</p>
							</div>
							<div className="mt-auto pt-8">
								<Link href="/dashboard">
									<Button
										variant="outline"
										className="border-lime-500 text-foreground hover:bg-lime-500 hover:text-background rounded-full w-full px-12 py-6 text-lg font-semibold"
									>
										Start earning
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section id="faq" className="py-24">
				<div className="mx-auto max-w-6xl px-4">
					<div className="bg-muted/80 rounded-2xl p-12">
						<div className="grid md:grid-cols-2 gap-12">
							{/* Left Column - Title */}
							<div>
								<h2 className="text-4xl md:text-5xl font-bold leading-tight">
									Frequently
									<br />
									asked
									<br />
									questions
								</h2>
							</div>

							{/* Right Column - FAQ Items */}
							<div className="space-y-6">
								{/* FAQ Item 1 */}
								<div className="border-b border-muted/30 pb-6">
									<button
										onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
										className="flex items-center space-x-4 w-full text-left hover:text-primary transition-colors"
									>
										<div className="text-2xl font-bold text-primary">
											{openFaq === 1 ? "−" : "+"}
										</div>
										<h3 className="text-xl font-semibold">What is LuminYield?</h3>
									</button>
									{openFaq === 1 && (
										<div className="mt-4 pl-10 text-muted-foreground">
											LuminYield is an AI-powered stablecoin plafform that lets users{" "}
											<strong>save and earn</strong> on their stablecoin deposits effortlesly
											accross Solana DeFi procotols and self-custodial.
										</div>
									)}
								</div>

								{/* FAQ Item 2 */}
								<div className="border-b border-muted/30 pb-6">
									<button
										onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
										className="flex items-center space-x-4 w-full text-left hover:text-primary transition-colors"
									>
										<div className="text-2xl font-bold text-primary">
											{openFaq === 2 ? "−" : "+"}
										</div>
										<h3 className="text-xl font-semibold">How does LuminYield work?</h3>
									</button>
									{openFaq === 2 && (
										<div className="mt-4 pl-10 text-muted-foreground">
											LuminYield automatically finds the highest yielding protocols across Solana
											DeFi. Our AI continuously monitors rates and rebalances your funds to maximize
											returns, ensuring you always earn the best available APY.
										</div>
									)}
								</div>

								{/* FAQ Item 3 */}
								<div className="border-b border-muted/30 pb-6">
									<button
										onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
										className="flex items-center space-x-4 w-full text-left hover:text-primary transition-colors"
									>
										<div className="text-2xl font-bold text-primary">
											{openFaq === 3 ? "−" : "+"}
										</div>
										<h3 className="text-xl font-semibold">What makes LuminYield different?</h3>
									</button>
									{openFaq === 3 && (
										<div className="mt-4 pl-10 text-muted-foreground">
											Unlike traditional DeFi platforms, LuminYield uses AI to automatically
											optimize your yields across multiple protocols. No manual management needed –
											just deposit and watch your money grow with the best available rates.
										</div>
									)}
								</div>

								{/* FAQ Item 4 */}
								<div className="border-b border-muted/30 pb-6">
									<button
										onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
										className="flex items-center space-x-4 w-full text-left hover:text-primary transition-colors"
									>
										<div className="text-2xl font-bold text-primary">
											{openFaq === 4 ? "−" : "+"}
										</div>
										<h3 className="text-xl font-semibold">What stablecoins do you support?</h3>
									</button>
									{openFaq === 4 && (
										<div className="mt-4 pl-10 text-muted-foreground">
											We currently support USDC sstablecoin on Solana.
										</div>
									)}
								</div>

								{/* FAQ Item 5 */}
								<div className="border-b border-muted/30 pb-6">
									<button
										onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
										className="flex items-center space-x-4 w-full text-left hover:text-primary transition-colors"
									>
										<div className="text-2xl font-bold text-primary">
											{openFaq === 5 ? "−" : "+"}
										</div>
										<h3 className="text-xl font-semibold">Where does the yield come from?</h3>
									</button>
									{openFaq === 5 && (
										<div className="mt-4 pl-10 text-muted-foreground">
											Yields come from lending protocols like Kamino, Marginfi, and on Solana. These
											protocols pay interest to users who provide liquidity, and our AI ensures
											you're always earning from the highest-paying options.
										</div>
									)}
								</div>

								{/* FAQ Item 6 */}
								<div className="pb-6">
									<button
										onClick={() => setOpenFaq(openFaq === 6 ? null : 6)}
										className="flex items-center space-x-4 w-full text-left hover:text-primary transition-colors"
									>
										<div className="text-2xl font-bold text-primary">
											{openFaq === 6 ? "−" : "+"}
										</div>
										<h3 className="text-xl font-semibold">Is my money safe?</h3>
									</button>
									{openFaq === 6 && (
										<div className="mt-4 pl-10 text-muted-foreground">
											Yes! LuminYield uses non-custodial wallets, meaning you always maintain
											control of your funds. We only integrate with audited, established protocols,
											and you can withdraw your money anytime.
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24">
				<div className="mx-auto max-w-6xl px-4">
					<div className="bg-primary rounded-3xl p-20 relative overflow-hidden">
						{/* Subtle background elements */}
						<div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-xl"></div>
						<div className="absolute bottom-10 right-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-xl"></div>

						<div className="text-center max-w-3xl mx-auto relative z-10">
							<h2 className="text-4xl md:text-5xl font-bold mb-6 text-background">
								Your automated stablecoin high-yield savings app
							</h2>
							<p className="text-xl font-medium text-background/90 mb-8">
								Save automatically, earn more with AI, and move money instantly using your .sol name
							</p>
							<div className="flex justify-center">
								<Link href="/dashboard">
									<Button className="bg-background hover:bg-background/90 text-primary px-12 py-6 text-lg font-semibold rounded-full">
										Start earning now
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12">
				{/* Divider */}
				<div className="mx-auto max-w-6xl px-4 mb-8">
					<div className="h-px bg-muted/80"></div>
				</div>

				<div className="mx-auto max-w-6xl px-4">
					<div className="flex flex-col md:flex-row items-center justify-between">
						{/* Logo - Left */}
						<div className="flex-shrink-0 mb-6 md:mb-0">
							<Logo />
						</div>

						{/* Navigation */}
						<nav className="flex flex-col items-start space-y-4">
							{NAVIGATION_LINKS.map((item) => (
								<Link
									key={item.title}
									href={item.href}
									className="text-base font-medium text-foreground transition-colors duration-200 hover:text-primary"
								>
									{item.title}
								</Link>
							))}
						</nav>
					</div>
				</div>
			</footer>
		</div>
	);
}
