import { useMutation } from "@tanstack/react-query";
import { deleteCategoryAction } from "../services";

export const useDeleteCategory = () => {
	const deleteCategory = useMutation({
		mutationKey: ["delete-category"],
		mutationFn: deleteCategoryAction,
	});
	return { deleteCategory };
};
