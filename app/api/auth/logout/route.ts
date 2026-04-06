import { NextResponse } from "next/server";

const TOKEN_KEY = "6xtWyYQAkkW0ZasluP5ZUscFJWHOmbUa";

export async function POST(): Promise<NextResponse> {
	const res = NextResponse.json({ ok: true });

	res.cookies.set(TOKEN_KEY, "", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});

	res.cookies.set("user_role", "", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});

	return res;
}
