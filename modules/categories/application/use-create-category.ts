import { useMutation } from "@tanstack/react-query";
import { createCategoryAction } from "../infrastructure/category-service";

export const useCreateCategory = () => {
	const createCategory = useMutation({
		mutationKey: ["create-category"],
		mutationFn: createCategoryAction,
	});
	return { createCategory };
};
