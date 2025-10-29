"use client";

import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignIn({ variant = "signin" }: { variant?: "signin" | "getstarted" }) {
	const { isConnected, loading: isLoading, connect } = useWeb3AuthConnect();

	if (isConnected) {
		return null;
	}

	const handleSignIn = async () => {
		try {
			await connect();
		} catch (_error) {
			// Sign in failed silently
		}
	};

	return (
		<Button
			onClick={handleSignIn}
			disabled={isLoading}
			className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-3 md:px-6 md:py-6 text-base font-medium"
		>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Connecting...
				</>
			) : variant === "getstarted" ? (
				"Get Started"
			) : (
				"Sign in"
			)}
		</Button>
	);
}
