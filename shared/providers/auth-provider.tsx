"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface LoginCredentials {
	email: string;
	password: string;
}

interface AuthContextValue {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ROLE_HOME: Record<string, string> = {
	ADMIN: "/dashboard/category",
	CASHIER: "/dashboard/recepcion",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		console.log("AuthProvider mounted — calling fetchSession");
		fetchSession();
	}, [pathname]);

	async function fetchSession(): Promise<AuthUser | null> {
		try {
			const res = await fetch("/api/auth/session");
			const data = (await res.json()) as { user: AuthUser | null };
			setUser(data.user);
			return data.user;
		} catch {
			setUser(null);
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function login(credentials: LoginCredentials): Promise<void> {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credentials),
		});

		if (!res.ok) {
			const data = (await res.json()) as { message: string };
			throw new Error(data.message ?? "Error al iniciar sesión");
		}

		const data = (await res.json()) as { user: AuthUser };
		window.location.href = ROLE_HOME[data.user.role] ?? "/login";
	}

	async function logout(): Promise<void> {
		await fetch("/api/auth/logout", { method: "POST" });
		setUser(null);
		router.push("/login");
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: !!user,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth debe usarse dentro de AuthProvider");
	}
	return context;
}
