import { apiClient } from "@/lib/http-client";
import { ApiResponse } from "@/shared/types/api-response";
import { PrintDirectTicketDto } from "@/modules/shared/interfaces/printer";

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

/**
 * @description Imprime la boleta del cliente de una orden
 **/
export const printReceiptAction = async (orderId: string) => {
	try {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>, { orderId: string }>(
			"/api/v1/printer/print-receipt",
			{ orderId }
		);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description Imprime ticket de cocina directamente sin crear orden en BD
 **/
export const printDirectTicketAction = async (dto: PrintDirectTicketDto) => {
	try {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>, PrintDirectTicketDto>(
			"/api/v1/printer/print-direct",
			dto
		);
		return data;
	} catch (error) {
		throw error;
	}
};
