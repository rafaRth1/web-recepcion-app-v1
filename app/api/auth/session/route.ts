import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";
const TOKEN_KEY = "6xtWyYQAkkW0ZasluP5ZUscFJWHOmbUa";

interface NestUserResponse {
	data: {
		id: string;
		name: string;
		email: string;
		role: string;
	};
}

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const token = req.cookies.get(TOKEN_KEY)?.value;

		if (!token) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		const response = await fetch(`${BACKEND_URL}/api/v1/auth/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			return NextResponse.json({ user: null }, { status: 401 });
		}

		const data = (await response.json()) as NestUserResponse;

		return NextResponse.json({ user: data.data });
	} catch {
		return NextResponse.json({ user: null }, { status: 500 });
	}
}
