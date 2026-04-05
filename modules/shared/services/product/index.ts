import { apiClient } from "@/lib/http-client";
import { ApiResponse } from "@/shared/types/api-response";
import { GetProductsParams, Product } from "../../interfaces/product";

/**
 * @description Obtener todos los productos con filtros opcionales
 **/
export const getProductsAction = async (params?: GetProductsParams) => {
	try {
		const filteredParams = params
			? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
			: {};

		const { data } = await apiClient.get<ApiResponse<Product[]>>("/api/v1/products", { params: filteredParams });
		return data;
	} catch (error) {
		throw error;
	}
};
