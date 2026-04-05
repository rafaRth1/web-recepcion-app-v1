"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextType {
	isOpen: boolean;
	isCollapsed: boolean;
	toggle: () => void;
	close: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggle = () => {
		if (window.innerWidth >= 1024) {
			setIsCollapsed((prev) => !prev);
		} else {
			setIsOpen((prev) => !prev);
		}
	};

	const close = () => setIsOpen(false);

	return <SidebarContext.Provider value={{ isOpen, isCollapsed, toggle, close }}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
	const ctx = useContext(SidebarContext);
	if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
	return ctx;
};
