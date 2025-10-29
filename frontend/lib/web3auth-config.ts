// Web3Auth Configuration for LuminYield
import { WEB3AUTH_NETWORK } from "@web3auth/modal";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";
import { env } from "@/env";

export const web3AuthContextConfig: Web3AuthContextConfig = {
	web3AuthOptions: {
		clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
		web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
		// IMP START - SSR
		ssr: true,
		// IMP END - SSR
		uiConfig: {
			appName: "LuminYield",
			appUrl: env.NEXT_PUBLIC_APP_URL,
			theme: {
				primary: "hsl(210 40% 98%)",
			},
			mode: "dark",
			logoLight: "https://web3auth.io/images/web3authlog.png",
			logoDark: "https://web3auth.io/images/web3authlogodark.png",
			defaultLanguage: "en",
			loginGridCol: 3,
			primaryButton: "socialLogin",
		},
		// Add configuration to help with modal behavior
		sessionTime: 86400, // 24 hours
	},
};

export const solanaConfig = {
	network: "devnet" as const,
	rpcEndpoint: "https://api.devnet.solana.com",
} as const;

export default web3AuthContextConfig;
