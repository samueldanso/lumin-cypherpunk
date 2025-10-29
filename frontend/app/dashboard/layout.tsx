"use client";

import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { isConnected, loading: isLoading } = useWeb3AuthConnect();
	const router = useRouter();

	// Redirect to landing if not authenticated
	useEffect(() => {
		if (!isLoading && !isConnected) {
			router.push("/");
		}
	}, [isConnected, isLoading, router]);

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p className="text-muted-foreground">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	// Don't render dashboard if not authenticated
	if (!isConnected) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Main Content - Clean centered layout with header in MainScreen */}
			{children}
		</div>
	);
}
