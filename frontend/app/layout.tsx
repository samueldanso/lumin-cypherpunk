import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
// IMP START - SSR
import { cookieToWeb3AuthState } from "@web3auth/modal";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "../components/providers";

// IMP END - SSR

const monaSans = Mona_Sans({
	variable: "--font-mona-sans",
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "Lumin Yield",
	description:
		"Earn more on your stablecoins with LuminYield, a fully automated stablecoin savings & yield platform on Solana.",
	icons: {
		icon: "/favicon.svg",
		shortcut: "/favicon.svg",
		apple: "/favicon.svg",
	},
};

// IMP START - SSR
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// IMP START - SSR
	const headersList = await headers();
	const web3authInitialState = cookieToWeb3AuthState(headersList.get("cookie"));
	// IMP END - SSR

	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<body className={`${monaSans.variable} antialiased`}>
				{/* IMP START - SSR */}
				<Providers web3authInitialState={web3authInitialState}>{children}</Providers>
				{/* IMP END - SSR */}
				<Toaster />
			</body>
		</html>
	);
}
// IMP END - SSR
