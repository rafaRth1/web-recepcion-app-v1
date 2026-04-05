import { Status } from "@/shared/types/status";

export interface Product {
	_id: string;
	name: string;
	price: number;
	discount: number;
	image: string;
	description: string;
	ingredients: string[];
	tags: string[];
	categoryIds: string[];
	categoryNames: string[];
	status: Status;
	createdAt: string;
	updatedAt: string;
}

export interface GetProductsPaginatedParams {
	page: number;
	limit: number;
	search?: string;
	categoryId?: string;
	minPrice?: number;
	maxPrice?: number;
	status?: Status;
}

export interface CreateProductRequest {
	name: string;
	price: number;
	discount?: number;
	image?: string;
	description?: string;
	ingredients?: string[];
	tags?: string[];
	categoryIds: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
	status?: Status;
}

export interface CategoryOption {
	_id: string;
	name: string;
}
