"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/shared/providers/auth-provider";
import { logoutAction } from "@/modules/auth/infrastructure/auth-service";
import { useSidebar } from "./sidebar-context";

export const NavUser = () => {
	const { user } = useAuth();
	const { isCollapsed } = useSidebar();
	const router = useRouter();

	const handleLogout = async () => {
		await logoutAction();
		router.push("/login");
	};

	return (
		<div className="flex items-center gap-3 px-3 py-3">
			{!isCollapsed && (
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium">{user?.name}</p>
					<p className="text-default-400 truncate text-xs">{user?.email}</p>
				</div>
			)}

			<Button variant="tertiary" size="sm" isIconOnly onPress={handleLogout} className="text-danger shrink-0">
				<LogOut size={16} />
			</Button>
		</div>
	);
};
