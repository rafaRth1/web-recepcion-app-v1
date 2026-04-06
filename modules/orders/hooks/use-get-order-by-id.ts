import { useQuery } from "@tanstack/react-query";
import { getOrderByIdAction } from "../services";

export interface GetOrderByIdQueryOptions {
	enabled?: boolean;
	staleTime?: number;
	gcTime?: number;
}

export const useGetOrderById = ({ id, queryOptions }: { id: string; queryOptions?: GetOrderByIdQueryOptions }) => {
	return useQuery({
		queryKey: ["order", id],
		queryFn: () => getOrderByIdAction(id),
		...queryOptions,
	});
};
