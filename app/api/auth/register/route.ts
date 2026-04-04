import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8081";

interface RegisterBody {
	email: string;
	nickName: string;
	password: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = (await req.json()) as RegisterBody;

		const response = await fetch(`${BACKEND_URL}/api/v1/users/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json({ message: data?.message ?? "Error al crear la cuenta" }, { status: response.status });
		}

		return NextResponse.json({ message: "Cuenta creada exitosamente" });
	} catch {
		return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
	}
}
