import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { CONFIG } from "../app.config";
import { useConnection } from "wagmi";
import DarkModeToggle from "./DarkModeToggle";
import WalletConnect from "./WalletConnect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "../contexts/SidebarContext";

const MAIN_NAV = [
	{ to: "/mint", name: "Borrow" },
	{ to: "/savings", name: "Earn" },
	{ to: "/equity", name: "Invest" },
	{ to: "/mypositions", name: "Portfolio" },
];

const MORE_NAV = [
	{ to: "/transfer", name: "Transfer" },
	{ to: "/monitoring", name: "Monitoring" },
	{ to: "/governance", name: "Governance" },
	{ to: "/report", name: "Report" },
];

export default function TopBar() {
	const router = useRouter();
	const { address } = useConnection();
	const { setMobileOpen } = useSidebar();
	const [moreOpen, setMoreOpen] = useState(false);
	const moreRef = useRef<HTMLDivElement>(null);

	const mainItems = address ? MAIN_NAV : MAIN_NAV.filter((i) => i.to !== "/mypositions");
	const moreActive = MORE_NAV.some((i) => router.pathname.startsWith(i.to));

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
				setMoreOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	return (
		<header className="sticky top-0 z-20 w-full px-4 md:px-6 pt-4 pb-2">
			<div className="flex items-center justify-between gap-3 bg-menu-back/85 backdrop-blur-xl border border-menu-separator rounded-2xl px-4 py-2 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
				{/* Logo */}
				<Link
					href={CONFIG.landing}
					className="flex items-center gap-2.5 flex-shrink-0 group"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image src="/coin/zchf.png" alt="ZCHF" width={32} height={32} className="object-contain transition-transform duration-200 group-hover:scale-105" />
					<span className="hidden lg:block font-bold text-menu-textactive text-sm tracking-tight whitespace-nowrap">
						Frankencoin
					</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
					{mainItems.map(({ to, name }) => {
						const active = router.pathname.startsWith(to);
						return (
							<Link
								key={to}
								href={to}
								className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
									active
										? "bg-menu-active text-menu-textactive"
										: "text-menu-text hover:bg-menu-hover hover:text-menu-textactive"
								}`}
							>
								{name}
								{active && (
									<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
								)}
							</Link>
						);
					})}

					{/* More dropdown */}
					<div ref={moreRef} className="relative">
						<button
							onClick={() => setMoreOpen((p) => !p)}
							className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
								moreActive
									? "bg-menu-active text-menu-textactive"
									: "text-menu-text hover:bg-menu-hover hover:text-menu-textactive"
							}`}
						>
							More
							<FontAwesomeIcon
								icon={faChevronDown}
								className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
							/>
						</button>
						{moreOpen && (
							<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-menu-back border border-menu-separator rounded-xl shadow-lg overflow-hidden py-1 z-50">
								{MORE_NAV.map(({ to, name }) => {
									const active = router.pathname.startsWith(to);
									return (
										<Link
											key={to}
											href={to}
											onClick={() => setMoreOpen(false)}
											className={`flex items-center px-4 py-2.5 text-sm transition-colors duration-150 ${
												active
													? "bg-menu-active text-menu-textactive font-medium"
													: "text-menu-text hover:bg-menu-hover hover:text-menu-textactive"
											}`}
										>
											{name}
										</Link>
									);
								})}
							</div>
						)}
					</div>
				</nav>

				{/* Actions */}
				<div className="flex items-center gap-1 flex-shrink-0">
					<DarkModeToggle />
					<WalletConnect />
					<button
						className="md:hidden p-2 rounded-lg text-menu-text hover:bg-menu-hover transition-colors"
						onClick={() => setMobileOpen(true)}
						aria-label="Open menu"
					>
						<FontAwesomeIcon icon={faBars} className="w-5 h-5" />
					</button>
				</div>
			</div>
		</header>
	);
}
