import { Category } from "@/modules/shared/interfaces/category";
import type { ApiResponse } from "@/shared/types/api-response";
import { PaginatedResult } from "@/shared/types/paginated-result";
import { Status } from "@/shared/types/status";

export interface CreateCategoryRequest {
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	status?: Status;
}

export interface UpdateCategoryRequest {
	name?: string;
	slug?: string;
	description?: string;
	icon?: string;
	status?: Status;
}

export interface GetCategoriesPaginatedParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: Status;
}

export interface GetCategoryByIdParams {
	id: string;
}

export interface DeleteCategoryParams {
	id: string;
}

export type GetCategoryByIdResponse = ApiResponse<Category>;
export type GetCategoriesPaginatedResponse = ApiResponse<PaginatedResult<Category[]>>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type UpdateCategoryResponse = ApiResponse<Category>;
export type DeleteCategoryResponse = ApiResponse<void>;
