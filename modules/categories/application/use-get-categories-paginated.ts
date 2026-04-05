import { useQuery } from "@tanstack/react-query";
import type { GetCategoriesPaginatedParams } from "../domain/category";
import { getCategoriesPaginatedAction } from "../infrastructure/category-service";

export interface GetCategoriesPaginatedQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetCategoriesPaginated = ({
	params,
	queryOptions,
}: {
	params: GetCategoriesPaginatedParams;
	queryOptions?: GetCategoriesPaginatedQueryOptions;
}) => {
	return useQuery({
		queryKey: ["categories-paginated", params],
		queryFn: () => getCategoriesPaginatedAction(params),
		...queryOptions,
	});
};
