import * as Yup from "yup";
import type { Status } from "@/shared/types/status";

export const createCategorySchema = Yup.object({
	name: Yup.string().required("El nombre es obligatorio"),
	slug: Yup.string().required("El slug es obligatorio"),
	description: Yup.string().max(500, "Máximo 500 caracteres").optional(),
	icon: Yup.string().optional(),
	status: Yup.mixed<Status>()
		.oneOf(Object.values(["ACTIVE", "INACTIVE"]))
		.optional(),
});

export const updateCategorySchema = createCategorySchema;

export type CreateCategoryFormValues = Yup.InferType<typeof createCategorySchema>;
