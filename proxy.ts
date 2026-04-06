import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "6xtWyYQAkkW0ZasluP5ZUscFJWHOmbUa";
const NESTJS_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

const PUBLIC_ROUTES = ["/login", "/register"];
const INTERNAL_API_ROUTES = ["/api/auth"];

const ROLE_ROUTES: Record<string, string[]> = {
	ADMIN: ["/dashboard/category", "/dashboard/product"],
	CASHIER: ["/dashboard/order", "/dashboard/recepcion"],
};

const ROLE_HOME: Record<string, string> = {
	ADMIN: "/dashboard/category",
	CASHIER: "/dashboard/recepcion",
};

function getRole(req: NextRequest): string | null {
	// El rol viene en el payload del token — lo lees de una cookie separada
	return req.cookies.get("user_role")?.value ?? null;
}

export function proxy(req: NextRequest): NextResponse {
	const { pathname } = req.nextUrl;
	const token = req.cookies.get(TOKEN_KEY)?.value;

	// Proxy hacia NestJS
	if (pathname.startsWith("/api/v1")) {
		const url = req.nextUrl.clone();
		url.href = `${NESTJS_URL}${pathname}${url.search}`;
		const requestHeaders = new Headers(req.headers);
		if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
		return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
	}

	// Raíz → redirige según token
	if (pathname === "/") {
		const url = req.nextUrl.clone();
		const role = getRole(req);
		url.pathname = token && role ? (ROLE_HOME[role] ?? "/login") : "/login";
		return NextResponse.redirect(url);
	}

	const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
	const isInternalApi = INTERNAL_API_ROUTES.some((route) => pathname.startsWith(route));

	// Sin token en ruta no pública → login
	if (!token && !isPublic && !isInternalApi) {
		const url = req.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	// Con token en ruta pública
	if (token && isPublic) {
		const url = req.nextUrl.clone();
		const role = getRole(req);
		url.pathname = role ? (ROLE_HOME[role] ?? "/login") : "/login";
		return NextResponse.redirect(url);
	}

	// Verificar acceso por rol
	if (token && !isInternalApi) {
		const role = getRole(req);
		const allowedRoutes = role ? (ROLE_ROUTES[role] ?? []) : [];
		const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));
		if (!hasAccess) {
			const url = req.nextUrl.clone();
			url.pathname = role ? (ROLE_HOME[role] ?? "/login") : "/login";
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
