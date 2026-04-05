import { UserRole } from "@/shared/types/user-role";

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: AuthUser;
}

export interface RegisterRequest {
	email: string;
	nickName: string;
	password: string;
}
