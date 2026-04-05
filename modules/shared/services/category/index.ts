import { apiClient } from "@/lib/http-client";
import { ApiResponse } from "@/shared/types/api-response";
import { Category } from "../../interfaces/category";

/**
 * @description
 * Obtener todas las categorías
 */
export const getAllCategoriesAction = async () => {
	try {
		const { data } = await apiClient.get<ApiResponse<Category[]>>("/api/v1/categories");
		return data;
	} catch (error) {
		throw error;
	}
};
