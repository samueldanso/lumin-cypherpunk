import { useWeb3AuthUser } from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { Copy, Wallet } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SignOut } from "@/components/web3auth/sign-out";

export function DashboardHeader() {
	const { userInfo } = useWeb3AuthUser();
	const { accounts } = useSolanaWallet();

	const copyAddress = async () => {
		if (accounts?.[0]) {
			try {
				await navigator.clipboard.writeText(accounts[0]);
				toast.success("Wallet address copied!");
			} catch (_error) {
				// Copy failed silently
			}
		}
	};

	return (
		<div className="mb-2 flex h-14 w-full max-w-5xl items-center justify-between px-2">
			{/* Left: Logo only */}
			<div className="flex items-center">
				<Logo />
			</div>

			{/* Center: Welcome Message */}
			<div className="hidden md:flex items-center">
				<p className="text-sm text-muted-foreground">
					Welcome back,{" "}
					<span className="font-medium text-foreground">
						{userInfo?.name || userInfo?.email || "User"}
					</span>
				</p>
			</div>

			{/* Right: Actions + Wallet Info */}
			<div className="flex items-center gap-3">
				{/* Wallet Info - Compact */}
				{accounts?.[0] && (
					<div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-full px-3 py-2">
						<Wallet className="w-5 h-5 text-muted-foreground" />
						<div className="text-sm">
							<div
								className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
								onClick={copyAddress}
							>
								{accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}
							</div>
						</div>
						<Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0">
							<Copy className="w-3 h-3" />
						</Button>
					</div>
				)}

				{/* Theme Toggle */}
				<ThemeToggle />

				{/* Sign Out - Now uses default icon + text */}
				<SignOut
					variant="ghost"
					className="text-muted-foreground font-medium hover:text-foreground"
				/>
			</div>
		</div>
	);
}
