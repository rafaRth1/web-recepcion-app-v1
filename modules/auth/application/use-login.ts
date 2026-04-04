import { useMutation } from "@tanstack/react-query";
import { LoginCredentials } from "../domain/auth";
import { loginAction } from "../infrastructure/auth-service";

export const useLogin = () => {
	const login = useMutation({
		mutationKey: ["login"],
		mutationFn: (credentials: LoginCredentials) => loginAction(credentials),
	});

	return { login };
};
