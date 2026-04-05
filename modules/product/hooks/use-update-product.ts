import { useMutation } from "@tanstack/react-query";
import { updateProductAction } from "../services";

export const useUpdateProduct = () => {
	const updateProduct = useMutation({
		mutationKey: ["update-product"],
		mutationFn: updateProductAction,
	});
	return { updateProduct };
};
