import { useMutation } from "@tanstack/react-query";
import { deleteCategoryAction } from "../infrastructure/category-service";

export const useDeleteCategory = () => {
	const deleteCategory = useMutation({
		mutationKey: ["delete-category"],
		mutationFn: deleteCategoryAction,
	});
	return { deleteCategory };
};
