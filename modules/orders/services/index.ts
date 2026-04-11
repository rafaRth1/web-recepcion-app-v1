import { ApiResponse } from "@/shared/types/api-response";
import { PaginatedResult } from "@/shared/types/paginated-result";
import { apiClient } from "@/lib/http-client";
import { CreateOrderRequest, GetOrdersPaginatedParams, Order, UpdateOrderRequest } from "../interfaces";

/**
 * @description Crea una nueva orden
 **/
export const createOrderAction = async (body: CreateOrderRequest): Promise<ApiResponse<Order>> => {
	try {
		const { data } = await apiClient.post<ApiResponse<Order>, CreateOrderRequest>("/api/v1/orders", body);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description Obtiene todas las órdenes
 **/
export const getOrdersAction = async (): Promise<ApiResponse<Order[]>> => {
	try {
		const { data } = await apiClient.get<ApiResponse<Order[]>>("/api/v1/orders");
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description Obtiene una orden por su id
 **/
export const getOrderByIdAction = async (id: string): Promise<ApiResponse<Order>> => {
	try {
		const { data } = await apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${id}`);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description Actualiza una orden por su id
 **/
export const updateOrderAction = async (id: string, body: UpdateOrderRequest): Promise<ApiResponse<Order>> => {
	try {
		const { data } = await apiClient.put<ApiResponse<Order>, UpdateOrderRequest>(`/api/v1/orders/${id}`, body);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description Completa una orden por su ID
 **/
export const completeOrderAction = async (id: string): Promise<ApiResponse<Order>> => {
	try {
		const { data } = await apiClient.patch<ApiResponse<Order>>(`/api/v1/orders/${id}/complete`);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description Obtiene todas las órdenes con paginación y filtros (Admin)
 **/
export const getOrdersPaginatedAction = async (params: GetOrdersPaginatedParams) => {
	try {
		const filteredParams = Object.fromEntries(
			Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
		);
		const { data } = await apiClient.get<ApiResponse<PaginatedResult<Order[]>>>(
			"/api/v1/orders/paginated",
			{ params: filteredParams }
		);
		return data.data;
	} catch (error) {
		throw error;
	}
};
