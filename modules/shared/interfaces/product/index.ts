import { Status } from "@/shared/types/status";

export type ProductType = "DISH" | "DRINK";

export interface CategoryEmbed {
	_id: string;
	name: string;
	slug: string;
}

export interface Product {
	_id: string;
	name: string;
	price: number;
	discount: number;
	image: string;
	description: string;
	ingredients: string[];
	type: ProductType;
	tags: string[];
	categories: CategoryEmbed[];
	status: Status;
	createdAt: string;
	updatedAt: string;
}

export interface GetProductsParams {
	categorySlug?: string;
	status?: string;
	search?: string;
}
