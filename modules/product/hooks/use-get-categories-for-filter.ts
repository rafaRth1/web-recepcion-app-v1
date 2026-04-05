import { useQuery } from "@tanstack/react-query";
import { getCategoriesForFilterAction } from "../services";

interface GetCategoriesForFilterQueryOptions {
	enabled?: boolean;
	staleTime?: number;
}

export const useGetCategoriesForFilter = ({
	queryOptions,
}: {
	queryOptions?: GetCategoriesForFilterQueryOptions;
} = {}) => {
	return useQuery({
		queryKey: ["categories-for-filter"],
		queryFn: getCategoriesForFilterAction,
		staleTime: 1000 * 60 * 5,
		...queryOptions,
	});
};
