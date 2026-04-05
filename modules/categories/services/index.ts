import { apiClient } from "@/lib/http-client";
import type {
	CreateCategoryRequest,
	UpdateCategoryRequest,
	GetCategoryByIdParams,
	DeleteCategoryParams,
	GetCategoryByIdResponse,
	CreateCategoryResponse,
	UpdateCategoryResponse,
	DeleteCategoryResponse,
	GetCategoriesPaginatedParams,
	GetCategoriesPaginatedResponse,
} from "../interfaces";

/**
 * @description
 * Obtener una categoría por ID
 */
export const getCategoryByIdAction = async ({ id }: GetCategoryByIdParams): Promise<GetCategoryByIdResponse> => {
	try {
		const { data } = await apiClient.get<GetCategoryByIdResponse>(`/api/v1/categories/${id}`);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Obtener categorías paginadas con búsqueda y filtros
 */
export const getCategoriesPaginatedAction = async (
	params: GetCategoriesPaginatedParams
): Promise<GetCategoriesPaginatedResponse> => {
	try {
		const filteredParams = Object.fromEntries(
			Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
		);
		const { data } = await apiClient.get<GetCategoriesPaginatedResponse>("/api/v1/categories/paginated", {
			params: filteredParams,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Crear una nueva categoría
 */
export const createCategoryAction = async (values: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
	try {
		const { data } = await apiClient.post<CreateCategoryResponse, CreateCategoryRequest>("/api/v1/categories", values);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Actualizar una categoría por ID
 */
export const updateCategoryAction = async ({
	id,
	...values
}: UpdateCategoryRequest & GetCategoryByIdParams): Promise<UpdateCategoryResponse> => {
	try {
		const { data } = await apiClient.put<UpdateCategoryResponse, Omit<UpdateCategoryRequest, "id">>(
			`/api/v1/categories/${id}`,
			values
		);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description
 * Eliminar una categoría por ID
 */
export const deleteCategoryAction = async ({ id }: DeleteCategoryParams): Promise<DeleteCategoryResponse> => {
	try {
		const { data } = await apiClient.delete<DeleteCategoryResponse>(`/api/v1/categories/${id}`);
		return data;
	} catch (error) {
		throw error;
	}
};
