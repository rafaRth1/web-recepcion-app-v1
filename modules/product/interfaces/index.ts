import { ProductType } from "@/modules/shared/interfaces/product";
import { Status } from "@/shared/types/status";

export interface GetProductsPaginatedParams {
	page: number;
	limit: number;
	search?: string;
	categoryId?: string;
	minPrice?: number;
	maxPrice?: number;
	status?: Status;
}

export interface CategoryOption {
	_id: string;
	name: string;
}

export interface CreateProductRequest {
	name: string;
	price: number;
	discount?: number;
	image?: string;
	description?: string;
	ingredients?: string[];
	type: ProductType;
	tags?: string[];
	categoryIds: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
	status?: Status;
}
