import * as Yup from "yup";

export const createProductValidation = Yup.object({
	name: Yup.string().required("El nombre es obligatorio"),
	price: Yup.number().min(0, "El precio no puede ser negativo").required("El precio es obligatorio"),
	discount: Yup.number()
		.min(0, "El descuento no puede ser negativo")
		.max(100, "El descuento no puede ser mayor a 100")
		.optional(),
	image: Yup.string().optional(),
	description: Yup.string().optional(),
	ingredients: Yup.array().of(Yup.string().required()).optional(),
	tags: Yup.array().of(Yup.string().required()).optional(),
	categoryIds: Yup.array()
		.of(Yup.string().required())
		.min(1, "Debe tener al menos una categoría")
		.required("Debe tener al menos una categoría"),
});

export const updateProductValidation = Yup.object({
	name: Yup.string().optional(),
	price: Yup.number().min(0, "El precio no puede ser negativo").optional(),
	discount: Yup.number()
		.min(0, "El descuento no puede ser negativo")
		.max(100, "El descuento no puede ser mayor a 100")
		.optional(),
	image: Yup.string().optional(),
	description: Yup.string().optional(),
	ingredients: Yup.array().of(Yup.string().required()).optional(),
	tags: Yup.array().of(Yup.string().required()).optional(),
	categoryIds: Yup.array().of(Yup.string().required()).min(1, "Debe tener al menos una categoría").optional(),
	status: Yup.string().oneOf(["ACTIVE", "INACTIVE"]).optional(),
});
