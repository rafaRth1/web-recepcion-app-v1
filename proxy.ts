import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "6xtWyYQAkkW0ZasluP5ZUscFJWHOmbUa";
const NESTJS_URL = "http://localhost:8081";

const PUBLIC_ROUTES = ["/login"];
const DASHBOARD_ROUTES = ["/home", "/categories", "/products", "/orders", "/users"];

export function proxy(req: NextRequest): NextResponse {
	const { pathname } = req.nextUrl;
	const token = req.cookies.get(TOKEN_KEY)?.value;

	// Proxy hacia NestJS — inyecta token y reescribe URL
	if (pathname.startsWith("/api/v1")) {
		const url = req.nextUrl.clone();
		url.href = `${NESTJS_URL}${pathname}${url.search}`;

		const requestHeaders = new Headers(req.headers);
		if (token) {
			requestHeaders.set("Authorization", `Bearer ${token}`);
		}

		return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
	}

	const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
	const isDashboard = DASHBOARD_ROUTES.some((route) => pathname.startsWith(route));

	// Sin token intentando entrar al dashboard → login
	if (!token && isDashboard) {
		const url = req.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	// Con token intentando entrar a login → dashboard
	if (token && isPublic) {
		const url = req.nextUrl.clone();
		url.pathname = "/home";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
