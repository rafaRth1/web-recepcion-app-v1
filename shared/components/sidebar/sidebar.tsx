"use client";

import { useEffect, useRef } from "react";
import { ScrollShadow } from "@heroui/react";
import { useSidebar } from "./sidebar-context";

interface SidebarProps {
	children: React.ReactNode;
	header?: React.ReactNode;
	footer?: React.ReactNode;
}

export const Sidebar = ({ children, header, footer }: SidebarProps) => {
	const { isOpen, isCollapsed, close } = useSidebar();
	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (window.innerWidth < 1024 && isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
				close();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen, close]);

	return (
		<>
			{/* Overlay mobile */}
			{isOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={close} />}

			<aside
				ref={sidebarRef}
				className={`bg-surface border-divider fixed inset-y-0 left-0 z-30 flex flex-col border-r transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "lg:w-16" : "lg:w-60"} w-60`}
			>
				{/* Header */}
				{header && <div className="border-divider shrink-0 border-b">{header}</div>}

				{/* Content */}
				<ScrollShadow className="flex-1 py-2">{children}</ScrollShadow>

				{/* Footer */}
				{footer && <div className="border-divider shrink-0 border-t">{footer}</div>}
			</aside>
		</>
	);
};
