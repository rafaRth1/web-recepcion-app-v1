import { apiClient } from "@/lib/http-client";
import { ApiResponse } from "@/shared/types/api-response";

/**
 * @description Imprime el ticket de cocina de una orden
 **/
export const printTicketAction = async (orderId: string) => {
	try {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>, { orderId: string }>("/api/v1/printer/print", {
			orderId,
		});
		return data;
	} catch (error) {
		throw error;
	}
};
