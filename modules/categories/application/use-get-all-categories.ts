import { useQuery } from "@tanstack/react-query";
import { getAllCategoriesAction } from "../infrastructure/category-service";

export interface GetAllCategoriesQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetAllCategories = ({
	queryOptions,
}: {
	queryOptions?: GetAllCategoriesQueryOptions;
} = {}) => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: getAllCategoriesAction,
		...queryOptions,
	});
};
