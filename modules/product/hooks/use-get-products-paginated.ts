import { useQuery } from "@tanstack/react-query";
import { GetProductsPaginatedParams } from "../interfaces";
import { getProductsPaginatedAction } from "../services";

interface GetProductsPaginatedQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetProductsPaginated = ({
	params,
	queryOptions,
}: {
	params: GetProductsPaginatedParams;
	queryOptions?: GetProductsPaginatedQueryOptions;
}) => {
	return useQuery({
		queryKey: ["products-paginated", params],
		queryFn: () => getProductsPaginatedAction(params),
		...queryOptions,
	});
};
