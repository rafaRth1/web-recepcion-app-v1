import { useMutation } from "@tanstack/react-query";
import { updateCategoryAction } from "../infrastructure/category-service";

export const useUpdateCategory = () => {
	const updateCategory = useMutation({
		mutationKey: ["update-category"],
		mutationFn: updateCategoryAction,
	});
	return { updateCategory };
};
