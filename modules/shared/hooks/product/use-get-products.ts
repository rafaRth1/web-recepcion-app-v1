import { useQuery } from "@tanstack/react-query";
import { GetProductsParams } from "../../interfaces/product";
import { getProductsAction } from "../../services/product";

export interface GetProductsQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetProducts = ({
	params,
	queryOptions,
}: {
	params?: GetProductsParams;
	queryOptions?: GetProductsQueryOptions;
} = {}) => {
	return useQuery({
		queryKey: ["products", params],
		queryFn: () => getProductsAction(params),
		...queryOptions,
	});
};
