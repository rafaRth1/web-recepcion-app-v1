import { useQuery } from "@tanstack/react-query";
import { GetProductsPaginatedParams } from "../domain/product";
import { getProductsPaginatedAction } from "../infrastructure/product.service";

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
