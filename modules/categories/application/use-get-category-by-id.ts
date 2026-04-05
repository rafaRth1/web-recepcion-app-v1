import { useQuery } from "@tanstack/react-query";
import type { GetCategoryByIdParams } from "../domain/category";
import { getCategoryByIdAction } from "../infrastructure/category-service";

export interface GetCategoryByIdQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetCategoryById = ({
	params,
	queryOptions,
}: {
	params: GetCategoryByIdParams;
	queryOptions?: GetCategoryByIdQueryOptions;
}) => {
	return useQuery({
		queryKey: ["categories", params.id],
		queryFn: () => getCategoryByIdAction({ id: params.id }),
		enabled: !!params.id,
		...queryOptions,
	});
};
