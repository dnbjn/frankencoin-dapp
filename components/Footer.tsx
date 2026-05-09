import Link from "next/link";
import { SOCIAL, shortenAddress } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faBookmark, faComments, faHeart, faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faTelegram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { SubmitIssue } from "./LoadingScreen";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SAVINGS_DEFAULT_REFERRER } from "../app.config";

const DynamicDocs = (): string => {
	const p = usePathname();
	let link: string = SOCIAL.Docs;

	if (p === null) return link;

	if (p !== "/mint/create" && p.includes("/mint")) link += "/positions/clone";
	else if (p === "/mint/create") link += "/positions/open";
	else if (p.includes("/mypositions")) link += "/positions/adjust";
	else if (p.includes("/monitoring")) link += "/positions/auctions";
	else if (p.includes("/challenges")) link += "/positions/auctions";
	else if (p.includes("/equity")) link += "/pool-shares";
	else if (p.includes("/savings")) link += "/savings-todo";
	else if (p.includes("/governance")) link += "/governance";
	else if (p.includes("/swap")) link += "/swap";
	else if (p.includes("/transfer")) link += "/transfer";

	return link;
};

export default function Footer() {
	const docsLink = DynamicDocs();
	const [copied, setCopied] = useState(false);

	const onCopyDonationAddress = async () => {
		try {
			await navigator.clipboard.writeText(SAVINGS_DEFAULT_REFERRER);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// no-op
		}
	};

	const communityLinks = [
		{ link: SOCIAL.Twitter, name: "Twitter", icon: faXTwitter },
		{ link: SOCIAL.Telegram, name: "Telegram", icon: faTelegram },
		{ link: SOCIAL.Forum, name: "Forum", icon: faComments },
		{ link: SOCIAL.SubStack, name: "Substack", icon: faBookmark },
		{ link: SOCIAL.Github_contract, name: "GitHub", icon: faGithub },
		{ link: docsLink, name: "Documentation", icon: faBook },
	];

	return (
		<footer className="w-full px-3 md:px-6 pb-4 pt-2">
			<div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
				<div className="bg-menu-back/85 backdrop-blur-xl border border-menu-separator rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] px-3 py-3 md:px-6 md:py-5">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
						{/* Community links */}
						<div className="flex flex-wrap items-center justify-center sm:justify-start gap-1">
							{communityLinks.map(({ link, name, icon }) => (
								<Link
									key={name}
									href={link}
									target="_blank"
									rel="noreferrer"
									aria-label={name}
									title={name}
									className="group inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl text-menu-text hover:text-menu-textactive hover:bg-menu-hover transition-all duration-150"
								>
									<FontAwesomeIcon icon={icon} className="w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-110" />
								</Link>
							))}
						</div>

						{/* Donate + Submit issue / version */}
						<div className="border-t border-menu-separator pt-3 sm:border-0 sm:pt-0 sm:pl-4 sm:border-l sm:border-menu-separator flex-shrink-0 flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-1">
							<button
								type="button"
								onClick={onCopyDonationAddress}
								title={copied ? "Address copied" : `Copy donation address ${SAVINGS_DEFAULT_REFERRER}`}
								className="group flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm text-menu-text hover:text-menu-textactive hover:bg-menu-hover transition-all duration-150"
							>
								<FontAwesomeIcon
									icon={copied ? faCheck : faHeart}
									className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-150 group-hover:scale-110 ${
										copied ? "text-status-success" : "text-status-danger"
									}`}
								/>
								<span>{copied ? "Copied" : "Donate"}</span>
								<span className="hidden md:inline text-xs text-text-secondary font-mono">
									{shortenAddress(SAVINGS_DEFAULT_REFERRER)}
								</span>
								<FontAwesomeIcon icon={faCopy} className="hidden md:inline w-3 h-3 text-text-secondary" />
							</button>
							<Link
								href="/disclaimer"
								title="Disclaimer"
								className="px-2.5 py-2 rounded-xl text-sm text-menu-text hover:text-menu-textactive hover:bg-menu-hover transition-all duration-150 sm:border-l sm:border-menu-separator sm:pl-3 sm:rounded-l-none"
							>
								Disclaimer
							</Link>
							<div className="sm:border-l sm:border-menu-separator sm:pl-2">
								<SubmitIssue />
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
