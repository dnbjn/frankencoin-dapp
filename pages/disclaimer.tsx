import Head from "next/head";
import AppCard from "@components/AppCard";
import AppTitle from "@components/AppTitle";

export default function DisclaimerPage() {
	return (
		<div className="grid gap-8">
			<Head>
				<title>Frankencoin - Disclaimer</title>
			</Head>

			<AppTitle title="Disclaimer">
				<div className="text-text-secondary">
					Please read this disclaimer carefully before accessing or interacting with this website. By using this site you confirm
					that you have read, understood, and agree to the terms below. If you do not agree, do not use this site.
				</div>
			</AppTitle>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">Unofficial frontend</h2>
				<div className="text-text-secondary">
					This website is an independent, community-operated frontend for the Frankencoin protocol. It is not operated by,
					affiliated with, or endorsed by the Frankencoin Association or any other entity associated with the protocol. The
					operator of this site is an individual and is not the issuer of ZCHF, FPS, or any other token accessible through this
					interface.
				</div>
			</AppCard>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">No control over the protocol</h2>
				<div className="text-text-secondary">
					Frankencoin is a fully decentralized protocol that runs on the Ethereum network through smart contracts. The operator of
					this frontend does not control these smart contracts, does not custody user funds, cannot reverse, modify, or refund
					transactions, and cannot recover lost keys or assets. All interactions are executed directly between the user&apos;s
					wallet and the protocol&apos;s smart contracts.
				</div>
			</AppCard>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">Provided &quot;as is&quot;</h2>
				<div className="text-text-secondary">
					This frontend and any information made available through it are provided <strong>&quot;as is&quot;</strong> and{" "}
					<strong>&quot;as available&quot;</strong>, without warranty of any kind, express or implied, including warranties of
					merchantability, fitness for a particular purpose, accuracy, or non-infringement. To the maximum extent permitted by
					law, the operator shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary
					damages, including loss of funds, profits, data, or goodwill, arising from or in connection with the use of this site
					or the underlying protocol.
				</div>
			</AppCard>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">Risks</h2>
				<div className="text-text-secondary">
					Interacting with the Frankencoin protocol involves significant risk. These risks include, but are not limited to:
				</div>
				<ul className="list-disc pl-6 text-text-secondary flex flex-col gap-y-1">
					<li>
						<strong>Smart contract risk</strong> — bugs, vulnerabilities, or unintended behavior in the protocol&apos;s code,
						even after audits.
					</li>
					<li>
						<strong>Collateral risk</strong> — sudden or sharp drops in the value of the assets backing the system.
					</li>
					<li>
						<strong>Depeg risk</strong> — ZCHF may trade above or below its target value of one Swiss franc.
					</li>
					<li>
						<strong>Liquidity risk</strong> — there may not be a buyer or seller for tokens at a given moment or price.
					</li>
					<li>
						<strong>Oracle and infrastructure risk</strong> — failures or manipulation of price feeds, RPC providers, or other
						third-party services this frontend depends on.
					</li>
					<li>
						<strong>Frontend risk</strong> — bugs, downtime, stale data, or compromise of this site or its hosting
						infrastructure.
					</li>
				</ul>
				<div className="text-text-secondary">Funds used with the protocol may be lost permanently and cannot be recovered.</div>
			</AppCard>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">No financial advice</h2>
				<div className="text-text-secondary">
					Nothing on this site constitutes financial, investment, legal, tax, or any other form of professional advice, nor a
					recommendation, solicitation, or offer to buy, sell, or hold any token or security. ZCHF is not redeemable for fiat
					currency by the operator of this frontend; redemption is only possible through the protocol&apos;s on-chain mechanisms.
					You should consult qualified professionals before making any financial decision.
				</div>
			</AppCard>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">User responsibility and compliance</h2>
				<div className="text-text-secondary">
					You are solely responsible for complying with all laws and regulations applicable to you, including tax, securities,
					anti-money-laundering, and sanctions laws in your jurisdiction. You are responsible for determining whether your use of
					the Frankencoin protocol is lawful in your jurisdiction, for safeguarding your wallet and private keys, and for
					verifying every transaction before signing it. Do not use this site if doing so would violate any applicable law.
				</div>
			</AppCard>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">No accounts, no custody, limited data</h2>
				<div className="text-text-secondary">
					This frontend does not create user accounts and does not custody funds or private keys. It connects to publicly
					available data sources and to the user&apos;s self-custodied wallet. The operator may have no visibility into individual
					user activity beyond what is publicly recorded on the Ethereum blockchain.
				</div>
			</AppCard>

			<AppCard>
				<h2 className="font-bold text-xl text-text-primary">Changes</h2>
				<div className="text-text-secondary">
					This disclaimer may be updated from time to time without prior notice. Continued use of the site after changes are
					published constitutes acceptance of the updated terms.
				</div>
			</AppCard>
		</div>
	);
}
