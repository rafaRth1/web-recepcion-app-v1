import { useMutation } from "@tanstack/react-query";
import { createProductAction } from "../services";

export const useCreateProduct = () => {
	const createProduct = useMutation({
		mutationKey: ["create-product"],
		mutationFn: createProductAction,
	});
	return { createProduct };
};
