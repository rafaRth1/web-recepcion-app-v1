import { useQuery } from "@tanstack/react-query";
import { getOrdersAction } from "../services";

export interface GetOrdersQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetOrders = ({
	queryOptions,
}: {
	queryOptions?: GetOrdersQueryOptions;
} = {}) => {
	return useQuery({
		queryKey: ["orders"],
		queryFn: getOrdersAction,
		...queryOptions,
	});
};
