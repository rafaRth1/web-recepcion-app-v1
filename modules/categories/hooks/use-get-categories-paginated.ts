import { useQuery } from "@tanstack/react-query";
import { GetCategoriesPaginatedParams } from "../interfaces";
import { getCategoriesPaginatedAction } from "../services";

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
