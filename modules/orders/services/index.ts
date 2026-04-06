import { ApiResponse } from "@/shared/types/api-response";
import { apiClient } from "@/lib/http-client";
import { CreateOrderRequest, Order, UpdateOrderRequest } from "../interfaces";

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
