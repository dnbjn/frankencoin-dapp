import Head from "next/head";
import { ReactNode } from "react";
import MobileDrawer from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";
import { SidebarProvider } from "../contexts/SidebarContext";

type LayoutProps = {
	children: NonNullable<ReactNode>;
};

function LayoutInner({ children }: LayoutProps) {
	return (
		<div className="flex flex-col min-h-screen bg-layout-primary">
			<TopBar />
			<main className="flex-1 w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-20 space-y-5">
				{children}
			</main>
			<Footer />
			<MobileDrawer />
		</div>
	);
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<Head>
				<title>Frankencoin - Home</title>
			</Head>
			<SidebarProvider>
				<LayoutInner>{children}</LayoutInner>
			</SidebarProvider>
		</>
	);
};

export default Layout;
