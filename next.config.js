/** @type {import('next').NextConfig} */
const fs = require("fs");
const path = require("path");

// Scan `public/` asset folders so `<TokenLogo>` / `<ChainLogo>` know each
// asset's actual extension (svg/png/jpg) without runtime fallback 404s.
const scanAssets = (dir) => {
	const out = {};
	for (const f of fs.readdirSync(path.join(__dirname, dir))) {
		const ext = path.extname(f).slice(1).toLowerCase();
		if (!["svg", "png", "jpg", "jpeg"].includes(ext)) continue;
		const name = path.basename(f, path.extname(f)).toLowerCase();
		if (!out[name] || ext === "svg") out[name] = ext;
	}
	return out;
};

const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["@frankencoin/zchf", "@frankencoin/api"],

	env: {
		ASSET_COIN_EXT: JSON.stringify(scanAssets("public/coin")),
		ASSET_CHAIN_EXT: JSON.stringify(scanAssets("public/chain")),
	},

	// Ensure the `workerd` export targets of these packages are traced into the
	// standalone output so OpenNext copies them. Without this, esbuild fails
	// resolving `isows` / `uncrypto` during the worker bundle step.
	outputFileTracingIncludes: {
		"*": [
			"./node_modules/isows/_esm/native.js",
			"./node_modules/uncrypto/dist/crypto.web.mjs",
		],
	},

	webpack: (config) => {
		// Stub out optional peer deps not used in this app
		config.resolve.alias = {
			...config.resolve.alias,
			"pino-pretty": false,
			lokijs: false,
			encoding: false,
			"@metamask/connect-evm": false,
			porto: false,
			"@base-org/account": false,
			accounts: false,
		};
		return config;
	},

	// @dev: if you want to set the iFrame SAMEORIGIN headers,
	// to prevent injecting in cross domains.
	// headers: [
	// 	{
	// 		key: "X-Frame-Options",
	// 		value: "SAMEORIGIN",
	// 	},
	// ],

	// @dev: Needed for SAFE testing locally
	headers: async () => [
		{
			source: "/(.*)",
			headers: [
				{
					key: "Content-Security-Policy",
					value: "frame-ancestors 'self' https://app.safe.global https://*.safe.global",
				},
			],
		},
		{
			source: "/manifest.json",
			headers: [
				{
					key: "Access-Control-Allow-Origin",
					value: "*",
				},
				{
					key: "Access-Control-Allow-Methods",
					value: "GET",
				},
				{
					key: "Access-Control-Allow-Headers",
					value: "X-Requested-With, content-type, Authorization",
				},
			],
		},
	],
};

module.exports = nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
