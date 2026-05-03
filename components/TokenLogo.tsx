import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
const COIN_EXT: Record<string, string> = JSON.parse(process.env.ASSET_COIN_EXT || "{}");
const CHAIN_EXT: Record<string, string> = JSON.parse(process.env.ASSET_CHAIN_EXT || "{}");

interface Props {
	currency: string;
	size?: number;
	chain?: string;
}

export default function TokenLogo({ currency, size = 8, chain }: Props) {
	const [coinFailed, setCoinFailed] = useState(false);
	const [chainFailed, setChainFailed] = useState(false);

	const coinKey = currency?.toLowerCase();
	const coinExt = COIN_EXT[coinKey];
	const chainKey = chain?.toLowerCase();
	const chainExt = chainKey ? CHAIN_EXT[chainKey] : undefined;

	if (!coinExt || coinFailed) {
		return <FontAwesomeIcon icon={faCircleQuestion} className={`w-${size} h-${size} mr-2`} />;
	}

	return (
		<picture className=" relative">
			<img
				src={`/coin/${coinKey}.${coinExt}`}
				className={`w-${size} h-${size} rounded-full`}
				alt="token-logo"
				onError={() => setCoinFailed(true)}
			/>
			{chainKey && chainExt && !chainFailed && (
				<picture className="absolute -bottom-1 -right-1 p-[1px] rounded-full bg-card-input-border">
					<img
						src={`/chain/${chainKey}.${chainExt}`}
						className={`w-3 h-3 rounded-full`}
						alt="chain-logo"
						onError={() => setChainFailed(true)}
					/>
				</picture>
			)}
		</picture>
	);
}
