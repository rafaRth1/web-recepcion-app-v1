import { useQuery } from "@tanstack/react-query";
import { GetOrdersPaginatedParams } from "../interfaces";
import { getOrdersPaginatedAction } from "../services";

interface GetOrdersPaginatedQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetOrdersPaginated = ({
	params,
	queryOptions,
}: {
	params: GetOrdersPaginatedParams;
	queryOptions?: GetOrdersPaginatedQueryOptions;
}) => {
	return useQuery({
		queryKey: ["orders-paginated", params],
		queryFn: () => getOrdersPaginatedAction(params),
		...queryOptions,
	});
};
