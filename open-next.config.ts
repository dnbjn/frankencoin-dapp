// default open-next.config.ts file created by @opennextjs/cloudflare

export default {
	default: {
		override: {
			wrapper: "cloudflare-node",
			converter: "edge",
			proxyExternalRequest: "fetch",
			incrementalCache: "dummy",
			tagCache: "dummy",
			queue: "direct",
		},
	},
	override: {
		wrapper: "cloudflare-edge",
		converter: "edge",
		proxyExternalRequest: "fetch",
		incrementalCache: "dummy",
		tagCache: "dummy",
		queue: "direct",
	},
	edgeExternals: [
		"pino-pretty",
		"lokijs",
		"encoding",
		"@metamask/connect-evm",
		"porto",
		"@base-org/account",
		"accounts"
	]
};