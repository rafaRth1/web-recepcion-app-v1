"use client";

import { useAuth } from "@/shared/providers/auth-provider";

export default function Home() {
	const { user } = useAuth();

	return (
		<div className="flex flex-col gap-2 px-6">
			<h1 className="text-foreground text-2xl font-bold">Bienvenido, {user?.name} 👋</h1>
			<p className="text-default-400 text-sm">Este es el panel de administración de Ezechis Burger.</p>
		</div>
	);
}
