"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";

export function QueryProvider({ children, state }: { children: React.ReactNode; state?: DehydratedState }) {
	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						refetchOnWindowFocus: false,
						retry: 2,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={state}>{children}</HydrationBoundary>
		</QueryClientProvider>
	);
}
