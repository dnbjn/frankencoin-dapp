import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { CONFIG } from "../app.config";
import { useConnection } from "wagmi";
import DarkModeToggle from "./DarkModeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCoins,
	faSeedling,
	faChartLine,
	faWallet,
	faRightLeft,
	faEye,
	faLandmark,
	faFileLines,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useSidebar } from "../contexts/SidebarContext";

const MAIN_ITEMS = [
	{ to: "/mint", name: "Borrow", icon: faCoins },
	{ to: "/savings", name: "Earn", icon: faSeedling },
	{ to: "/equity", name: "Invest", icon: faChartLine },
	{ to: "/mypositions", name: "My Positions", icon: faWallet },
];

const MORE_ITEMS = [
	{ to: "/transfer", name: "Transfer", icon: faRightLeft },
	{ to: "/monitoring", name: "Monitoring", icon: faEye },
	{ to: "/governance", name: "Governance", icon: faLandmark },
	{ to: "/report", name: "Accounting Report", icon: faFileLines },
];

function DrawerItem({
	to,
	name,
	icon,
	onClose,
}: {
	to: string;
	name: string;
	icon: IconDefinition;
	onClose: () => void;
}) {
	const router = useRouter();
	const active = router.pathname.startsWith(to);

	return (
		<Link
			href={to}
			onClick={onClose}
			className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
				active
					? "bg-menu-active text-menu-textactive font-semibold"
					: "text-menu-text hover:bg-menu-hover hover:text-menu-textactive"
			}`}
		>
			<FontAwesomeIcon icon={icon} className="w-4 h-4 flex-shrink-0" />
			{name}
		</Link>
	);
}

export default function MobileDrawer() {
	const { mobileOpen, setMobileOpen } = useSidebar();
	const { address } = useConnection();
	const close = () => setMobileOpen(false);

	const mainItems = address ? MAIN_ITEMS : MAIN_ITEMS.filter((i) => i.to !== "/mypositions");

	return (
		<>
			{/* Backdrop */}
			<div
				className={`md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
					mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
				onClick={close}
			/>

			{/* Drawer */}
			<aside
				className={`md:hidden fixed left-0 top-0 bottom-0 w-72 flex flex-col bg-menu-back border-r border-menu-separator z-40 transition-transform duration-200 ${
					mobileOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-menu-separator">
					<Link href={CONFIG.landing} className="flex items-center gap-2.5" onClick={close} target="_blank" rel="noopener noreferrer">
						<Image src="/coin/zchf.png" alt="Frankencoin" width={32} height={32} className="object-contain" />
						<span className="font-bold text-menu-textactive text-base tracking-tight">Frankencoin</span>
					</Link>
					<button
						onClick={close}
						className="p-2 rounded-lg text-menu-text hover:bg-menu-hover transition-colors"
						aria-label="Close menu"
					>
						<FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
					</button>
				</div>

				{/* Nav */}
				<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
					{mainItems.map((item) => (
						<DrawerItem key={item.to} {...item} onClose={close} />
					))}
					<div className="my-3 border-t border-menu-separator mx-1" />
					{MORE_ITEMS.map((item) => (
						<DrawerItem key={item.to} {...item} onClose={close} />
					))}
				</nav>

				{/* Footer */}
				<div className="px-5 py-4 border-t border-menu-separator">
					<div className="flex items-center gap-2">
						<DarkModeToggle />
						<span className="text-sm text-menu-text">Toggle theme</span>
					</div>
				</div>
			</aside>
		</>
	);
}
