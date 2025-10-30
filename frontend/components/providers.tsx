'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { IWeb3AuthState } from '@web3auth/modal'
import { Web3AuthProvider } from '@web3auth/modal/react'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { web3AuthContextConfig } from '@/lib/web3auth-config'

// IMP START - SSR
export function Providers({
	children,
	web3authInitialState,
}: {
	children: ReactNode
	web3authInitialState: IWeb3AuthState | undefined
}) {
	// IMP END - SSR
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						refetchOnWindowFocus: false,
					},
				},
			})
	)

	return (
		<QueryClientProvider client={queryClient}>
			{/* IMP START - SSR */}
			<Web3AuthProvider config={web3AuthContextConfig} initialState={web3authInitialState}>
				{/* IMP END - SSR */}
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					forcedTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</Web3AuthProvider>
		</QueryClientProvider>
	)
}
