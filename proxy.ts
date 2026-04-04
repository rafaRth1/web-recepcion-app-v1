import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = "6xtWyYQAkkW0ZasluP5ZUscFJWHOmbUa";

const PUBLIC_ROUTES = ["/login"];

const DASHBOARD_ROUTES = [
  "/home",
  "/categories",
  "/products",
  "/orders",
  "/users",
];

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_KEY)?.value;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isDashboard = DASHBOARD_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

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

  // Inyectar token como Authorization header hacia NestJS
  const requestHeaders = new Headers(req.headers);
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
