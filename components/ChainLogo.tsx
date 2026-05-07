import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
const CHAIN_EXT: Record<string, string> = JSON.parse(process.env.ASSET_CHAIN_EXT || "{}");

interface Props {
	chain: string;
	size?: number;
}

export default function ChainLogo({ chain, size = 8 }: Props) {
	const [failed, setFailed] = useState(false);
	const key = chain?.toLowerCase();
	const ext = CHAIN_EXT[key];

	if (!ext || failed) {
		return <FontAwesomeIcon icon={faCircleQuestion} className={`w-${size} h-${size} mr-2`} />;
	}

	return (
		<picture className=" relative">
			<img
				src={`/chain/${key}.${ext}`}
				className={`w-${size} h-${size} rounded-full`}
				alt="chain-logo"
				onError={() => setFailed(true)}
			/>
		</picture>
	);
}
