import { useMutation } from "@tanstack/react-query";
import { createCategoryAction } from "../services";

export const useCreateCategory = () => {
	const createCategory = useMutation({
		mutationKey: ["create-category"],
		mutationFn: createCategoryAction,
	});
	return { createCategory };
};
