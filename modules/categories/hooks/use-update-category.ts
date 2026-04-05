import { useMutation } from "@tanstack/react-query";
import { updateCategoryAction } from "../services";

export const useUpdateCategory = () => {
	const updateCategory = useMutation({
		mutationKey: ["update-category"],
		mutationFn: updateCategoryAction,
	});
	return { updateCategory };
};
