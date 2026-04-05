import { useMutation } from "@tanstack/react-query";
import { LoginCredentials } from "../interfaces";
import { loginAction } from "../services";

export const useLogin = () => {
	const login = useMutation({
		mutationKey: ["login"],
		mutationFn: (credentials: LoginCredentials) => loginAction(credentials),
	});

	return { login };
};
