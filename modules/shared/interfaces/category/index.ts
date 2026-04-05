import { Status } from "@/shared/types/status";

export interface Category {
	_id: string;
	name: string;
	slug: string;
	description: string;
	icon: string;
	status: Status;
	createdAt: string;
	updatedAt: string;
}
