import { useMutation } from "@tanstack/react-query";
import { registerAction } from "../services";

export const useRegister = () => {
	const register = useMutation({
		mutationKey: ["register"],
		mutationFn: registerAction,
	});

	return { register };
};
