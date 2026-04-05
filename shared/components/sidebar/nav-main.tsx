"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, Chip, Tooltip } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
	title: string;
	url: string;
	icon: LucideIcon;
	badge?: number;
	badgeColor?: "accent" | "success" | "warning" | "danger" | "default";
	subItems?: { title: string; url: string }[];
}

interface NavMainProps {
	items: NavItem[];
	label?: string;
}

export const NavMain = ({ items, label }: NavMainProps) => {
	const pathname = usePathname();
	const { isCollapsed, close } = useSidebar();
	const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

	const toggleMenu = (title: string) => {
		setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	const handleLinkClick = () => {
		if (window.innerWidth < 1024) close();
	};

	const isActive = (url: string) => pathname === url;

	const isParentActive = (item: NavItem) => item.subItems?.some((s) => pathname === s.url) || pathname === item.url;

	return (
		<nav className="flex flex-col gap-1 px-2">
			{label && !isCollapsed && (
				<p className="text-default-400 mb-1 px-2 text-xs font-medium tracking-wider uppercase">{label}</p>
			)}

			{items.map((item) => {
				const Icon = item.icon;
				const hasSubItems = !!item.subItems?.length;
				const isMenuOpen = openMenus[item.title];
				const parentActive = isParentActive(item);

				const buttonContent = (
					<Button
						variant={parentActive ? "secondary" : "ghost"}
						className={`h-10 w-full px-5 ${isCollapsed ? "mx-auto w-10 min-w-0 justify-center" : "justify-start"}`}
						onPress={() => {
							if (hasSubItems) toggleMenu(item.title);
							else handleLinkClick();
						}}
					>
						{isCollapsed ? (
							<Icon size={18} />
						) : (
							<>
								<Icon size={18} className="shrink-0" />
								<span className="flex-1 truncate text-left">{item.title}</span>
								{item.badge ? (
									<Chip size="sm" variant="secondary" className="ml-auto">
										{item.badge}
									</Chip>
								) : null}
								{hasSubItems && (
									<ChevronDown
										size={16}
										className={`ml-auto transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
									/>
								)}
							</>
						)}
					</Button>
				);

				return (
					<div key={item.title}>
						{isCollapsed ? (
							<Tooltip>
								<Tooltip.Trigger>
									{hasSubItems ? (
										buttonContent
									) : (
										<Link href={item.url} className="block" onClick={handleLinkClick}>
											{buttonContent}
										</Link>
									)}
								</Tooltip.Trigger>
								<Tooltip.Content>{item.title}</Tooltip.Content>
							</Tooltip>
						) : hasSubItems ? (
							buttonContent
						) : (
							<Link href={item.url} onClick={handleLinkClick}>
								{buttonContent}
							</Link>
						)}

						{/* Subitems */}
						{hasSubItems && !isCollapsed && isMenuOpen && (
							<div className="border-divider mt-1 ml-4 flex flex-col gap-1 border-l pl-2">
								{item.subItems!.map((sub) => (
									<Link key={sub.url} href={sub.url} onClick={handleLinkClick}>
										<Button
											variant={isActive(sub.url) ? "secondary" : "ghost"}
											className="h-9 w-full justify-start px-2 text-sm"
										>
											{sub.title}
										</Button>
									</Link>
								))}
							</div>
						)}
					</div>
				);
			})}
		</nav>
	);
};
