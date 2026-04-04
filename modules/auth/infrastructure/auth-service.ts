import axios from "axios";
import { apiClient } from "@/lib/http-client";
import type { LoginCredentials, AuthResponse, RegisterRequest } from "../domain/auth";

/**
 * @description
 * Iniciar sesión con email y contraseña
 */
export const loginAction = async (credentials: LoginCredentials): Promise<AuthResponse> => {
	try {
		const { data } = await axios.post<AuthResponse, LoginCredentials>("/api/auth/login", credentials);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Registrar un nuevo usuario
 */
export const registerAction = async (values: RegisterRequest) => {
	try {
		const { data } = await axios.post("/api/auth/register", values);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Cerrar sesión
 */
export const logoutAction = async (): Promise<void> => {
	try {
		await apiClient.post("/api/auth/logout");
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Obtener sesión activa
 */
export const getSessionAction = async (): Promise<AuthResponse> => {
	try {
		const { data } = await axios.get<AuthResponse>("/api/auth/session");
		return data;
	} catch (error) {
		throw error;
	}
};
