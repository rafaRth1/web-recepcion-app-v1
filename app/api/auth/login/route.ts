import { ApiResponse } from "@/shared/types/api-response";
import { UserRole } from "@/shared/types/user-role";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";
const TOKEN_KEY = "6xtWyYQAkkW0ZasluP5ZUscFJWHOmbUa";

interface LoginBody {
	email: string;
	password: string;
}

interface NestLoginResponse {
	_id: string;
	nickName: string;
	email: string;
	role: UserRole;
	token: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = (await req.json()) as LoginBody;

		const response = await fetch(`${BACKEND_URL}/api/v1/users/authenticate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const data = (await response.json()) as ApiResponse<NestLoginResponse>;

		if (!response.ok) {
			return NextResponse.json({ message: data?.message ?? "Credenciales inválidas" }, { status: response.status });
		}

		const res = NextResponse.json({
			user: data.data,
		});

		res.cookies.set(TOKEN_KEY, data.data.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 8, // 8 horas
		});

		return res;
	} catch {
		return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
	}
}
