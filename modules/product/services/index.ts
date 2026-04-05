import { apiClient } from "@/lib/http-client";
import { ApiResponse } from "@/shared/types/api-response";
import { PaginatedResult } from "@/shared/types/paginated-result";
import { CategoryOption, CreateProductRequest, GetProductsPaginatedParams, UpdateProductRequest } from "../interfaces";
import { Product } from "@/modules/shared/interfaces/product";

/**
 * @description
 * Obtener productos paginados con filtros
 */
export const getProductsPaginatedAction = async (params: GetProductsPaginatedParams) => {
	try {
		const filteredParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
		const { data } = await apiClient.get<ApiResponse<PaginatedResult<Product[]>>>("/api/v1/products/paginated", {
			params: filteredParams,
		});
		return data.data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Obtener un producto por ID
 */
export const getProductByIdAction = async ({ id }: { id: string }) => {
	try {
		const { data } = await apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`);
		return data.data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Crear un nuevo producto
 */
export const createProductAction = async (body: CreateProductRequest) => {
	try {
		const { data } = await apiClient.post<ApiResponse<Product>, CreateProductRequest>("/api/v1/products", body);
		return data.data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Actualizar un producto por ID
 */
export const updateProductAction = async ({ id, body }: { id: string; body: UpdateProductRequest }) => {
	try {
		const { data } = await apiClient.put<ApiResponse<Product>, UpdateProductRequest>(`/api/v1/products/${id}`, body);
		return data.data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Obtener categorías para el filtro de productos
 */
export const getCategoriesForFilterAction = async (): Promise<CategoryOption[]> => {
	try {
		const { data } = await apiClient.get<ApiResponse<CategoryOption[]>>("/api/v1/categories");
		return data.data;
	} catch (error) {
		throw error;
	}
};
