"use client";

import { Beef, LayoutDashboard, Tag } from "lucide-react";
import { Sidebar } from "./sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useSidebar } from "./sidebar-context";
import type { NavItem } from "./nav-main";

const items: NavItem[] = [
	{
		title: "Inicio",
		url: "/dashboard/home",
		icon: LayoutDashboard,
	},
	{
		title: "Categorías",
		url: "/dashboard/category",
		icon: Tag,
	},
	{
		title: "Productos",
		url: "/dashboard/product",
		icon: Beef,
	},
];

const SidebarHeader = () => {
	const { isCollapsed } = useSidebar();

	return (
		<div className={`flex items-center py-4 ${isCollapsed ? "justify-center px-0" : "gap-2 px-4"}`}>
			<div className="bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
				<span className="text-accent-foreground text-xs font-bold">EB</span>
			</div>
			{!isCollapsed && <span className="text-foreground truncate text-sm font-semibold">Ezechis Burger</span>}
		</div>
	);
};

export const AppSidebar = () => {
	return (
		<Sidebar header={<SidebarHeader />} footer={<NavUser />}>
			<NavMain items={items} label="Menú" />
		</Sidebar>
	);
};
