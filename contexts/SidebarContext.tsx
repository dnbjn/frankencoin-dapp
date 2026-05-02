import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
	collapsed: boolean;
	toggleCollapsed: () => void;
	mobileOpen: boolean;
	setMobileOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
	collapsed: false,
	toggleCollapsed: () => {},
	mobileOpen: false,
	setMobileOpen: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("sidebar-collapsed");
		if (stored === "true") setCollapsed(true);
	}, []);

	const toggleCollapsed = () => {
		setCollapsed((prev) => {
			const next = !prev;
			localStorage.setItem("sidebar-collapsed", String(next));
			return next;
		});
	};

	return (
		<SidebarContext.Provider value={{ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }}>
			{children}
		</SidebarContext.Provider>
	);
}

export const useSidebar = () => useContext(SidebarContext);
