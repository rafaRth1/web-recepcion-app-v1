import { useMutation } from "@tanstack/react-query";
import { updateProductAction } from "../infrastructure/product.service";

export const useUpdateProduct = () => {
	const updateProduct = useMutation({
		mutationKey: ["update-product"],
		mutationFn: updateProductAction,
	});
	return { updateProduct };
};
