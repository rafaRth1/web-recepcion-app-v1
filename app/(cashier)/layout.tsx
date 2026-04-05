"use client";
import { ArrowLeft, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@heroui/react";
import { SidebarProvider, useSidebar } from "@/shared/components/sidebar/sidebar-context";

const AppSidebar = dynamic(() => import("@/shared/components/sidebar/app-sidebar").then((m) => m.AppSidebar), {
	ssr: false,
	loading: () => (
		<div className="border-divider bg-surface hidden w-64 shrink-0 flex-col border-r md:flex">
			<div className="flex items-center justify-center p-4">
				<div className="bg-default-200 h-10 w-32 animate-pulse rounded-md" />
			</div>
			<div className="flex flex-1 flex-col gap-1 px-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="bg-default-200 h-10 animate-pulse rounded-md" />
				))}
			</div>
			<div className="p-2">
				<div className="bg-default-200 h-12 animate-pulse rounded-md" />
			</div>
		</div>
	),
});

const HIDDEN_BACK_ROUTES = ["/dashboard/recepcion"];

function CashierContent({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { toggle } = useSidebar();
	const shouldShowBack = !HIDDEN_BACK_ROUTES.includes(pathname);

	return (
		<div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
			<div className="mb-3 flex w-full items-center justify-between px-5 pt-2">
				<Button variant="tertiary" size="sm" isIconOnly onPress={toggle}>
					<PanelLeft size={18} />
				</Button>
				{shouldShowBack && (
					<Button variant="tertiary" size="sm" onPress={() => window.history.back()}>
						<ArrowLeft size={16} />
						Atrás
					</Button>
				)}
			</div>
			{children}
		</div>
	);
}

export default function CashierLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<div className="flex h-screen w-full overflow-hidden">
				<AppSidebar />
				<CashierContent>{children}</CashierContent>
			</div>
		</SidebarProvider>
	);
}
