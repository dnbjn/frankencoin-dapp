"use client";

import React, { ReactNode } from "react";
import { WAGMI_CONFIG, CONFIG, WAGMI_ADAPTER, WAGMI_METADATA, WAGMI_CHAINS, WAGMI_CHAIN } from "../app.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, State, WagmiProvider } from "wagmi";
import { createAppKit } from "@reown/appkit/react";

const queryClient = new QueryClient();
if (!CONFIG.wagmiId) throw new Error("Project ID is not defined");

const modal = createAppKit({
	adapters: [WAGMI_ADAPTER],
	projectId: CONFIG.wagmiId,
	networks: WAGMI_CHAINS as any,
	defaultNetwork: WAGMI_CHAIN,
	metadata: WAGMI_METADATA,
	features: {
		analytics: true,
	},
	themeMode: "light",
	themeVariables: {
		"--w3m-color-mix": "#ffffff",
		"--w3m-color-mix-strength": 40,
		// Setting a custom font-family makes AppKit skip its preload of
		// KHTeka woff2 files from fonts.reown.com (see node_modules/
		// @reown/appkit-ui/.../ThemeUtil.js: `if (!hasCustomFont) { ... }`),
		// which otherwise triggers the "preloaded but not used" warning.
		"--w3m-font-family": "Inter, system-ui, sans-serif",
	},
});

export default function Web3ModalProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
	return (
		<WagmiProvider config={WAGMI_CONFIG as Config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}
