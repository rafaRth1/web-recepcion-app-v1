"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Modal, Button, TextField, Label, Input, FieldError, Select, ListBox } from "@heroui/react";
import { useFormik } from "formik";
import { CategoryOption, CreateProductRequest, UpdateProductRequest } from "@/modules/product/interfaces";
import { createProductValidation, updateProductValidation } from "@/modules/product/validations";
import { Product, ProductType } from "@/modules/shared/interfaces/product";

interface ProductFormModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: CreateProductRequest | UpdateProductRequest) => void;
	isPending: boolean;
	editingProduct?: Product | null;
	categories: CategoryOption[];
}

const initialValues: CreateProductRequest | UpdateProductRequest = {
	name: "",
	price: 0,
	discount: 0,
	image: "",
	description: "",
	ingredients: [],
	type: "DISH",
	tags: [],
	categoryIds: [],
	status: undefined,
};

export const ProductFormModal = ({
	isOpen,
	onOpenChange,
	onSubmit,
	isPending,
	editingProduct,
	categories,
}: ProductFormModalProps) => {
	const isEditing = !!editingProduct;
	const [priceDisplay, setPriceDisplay] = useState("");

	const formik = useFormik({
		initialValues,
		validationSchema: isEditing ? updateProductValidation : createProductValidation,
		onSubmit: (values) => {
			onSubmit({
				...values,
				ingredients:
					typeof values.ingredients === "string"
						? (values.ingredients as string)
								.split(",")
								.map((s) => s.trim())
								.filter(Boolean)
						: values.ingredients,
				tags:
					typeof values.tags === "string"
						? (values.tags as string)
								.split(",")
								.map((s) => s.trim())
								.filter(Boolean)
						: values.tags,
			});
		},
	});

	useEffect(() => {
		if (editingProduct) {
			setPriceDisplay(String(editingProduct.price));
			formik.setValues({
				name: editingProduct.name,
				price: editingProduct.price,
				discount: editingProduct.discount,
				image: editingProduct.image ?? "",
				description: editingProduct.description ?? "",
				ingredients: editingProduct.ingredients ?? [],
				tags: editingProduct.tags ?? [],
				categoryIds: editingProduct.categories.map((c) => c._id),
				status: editingProduct.status,
			});
		} else {
			setPriceDisplay("");
			formik.resetForm();
		}
	}, [editingProduct, isOpen]);

	const handlePriceChange = (val: string) => {
		// Allow comma as decimal separator and limit to 2 decimals
		let normalized = val.replace(",", ".");
		// Remove any non-numeric characters except dot
		normalized = normalized.replace(/[^0-9.]/g, "");
		// Ensure only one dot
		const parts = normalized.split(".");
		if (parts.length > 2) {
			normalized = parts[0] + "." + parts.slice(1).join("");
		}
		// Limit to 2 decimal places
		if (parts[1] && parts[1].length > 2) {
			normalized = parts[0] + "." + parts[1].slice(0, 2);
		}
		setPriceDisplay(normalized);
		const numValue = normalized === "" || normalized === "." ? 0 : Number(normalized);
		formik.setFieldValue("price", isNaN(numValue) ? 0 : numValue);
	};

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container>
					<Modal.Dialog>
						{({ close }) => (
							<>
								<Modal.CloseTrigger />
								<Modal.Header>
									<Modal.Heading>{isEditing ? "Editar producto" : "Nuevo producto"}</Modal.Heading>
								</Modal.Header>

								<Modal.Body className="flex flex-col gap-4 px-1">
									{/* Nombre */}
									<TextField
										aria-label="Nombre"
										fullWidth
										variant="secondary"
										value={formik.values.name}
										onChange={(val) => formik.setFieldValue("name", val)}
										onBlur={() => formik.setFieldTouched("name")}
										isInvalid={!!formik.touched.name && !!formik.errors.name}
									>
										<Label>Nombre</Label>
										<Input placeholder="Ej: Hamburguesa clásica" />
										<FieldError>{formik.errors.name}</FieldError>
									</TextField>

									{/* Precio */}
									<TextField
										aria-label="Precio"
										fullWidth
										variant="secondary"
										value={priceDisplay}
										onChange={handlePriceChange}
										onBlur={() => {
											formik.setFieldTouched("price");
											// Normalize display on blur
											const num = Number(priceDisplay);
											if (!isNaN(num)) {
												setPriceDisplay(num.toFixed(2));
											}
										}}
										isInvalid={!!formik.touched.price && !!formik.errors.price}
									>
										<Label>Precio (S/)</Label>
										<Input placeholder="Ej: 18.50" />
										<FieldError>{formik.errors.price}</FieldError>
									</TextField>

									<div>
										<p className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
											Tipo de producto
										</p>
										<div className="grid grid-cols-2 gap-2">
											{(["DISH", "DRINK"] as ProductType[]).map((type) => (
												<button
													key={type}
													type="button"
													onClick={() => formik.setFieldValue("type", type)}
													className={`rounded-lg border-2 p-3 text-sm font-medium transition-all duration-200 ${
														formik.values.type === type
															? "border-indigo-500 bg-indigo-600/20 text-indigo-400"
															: "border-neutral-700 bg-neutral-800 text-neutral-400"
													} `}
												>
													{type === "DISH" ? "🍽️ Plato" : "🥤 Bebida"}
												</button>
											))}
										</div>
									</div>

									{/* Descuento */}
									{/*<TextField
										aria-label="Descuento"
										fullWidth
										variant="secondary"
										value={String(formik.values.discount ?? 0)}
										onChange={(val) => formik.setFieldValue("discount", Number(val))}
										onBlur={() => formik.setFieldTouched("discount")}
										isInvalid={!!formik.touched.discount && !!formik.errors.discount}
									>
										<Label>Descuento (%)</Label>
										<Input placeholder="Ej: 10" />
										<FieldError>{formik.errors.discount}</FieldError>
									</TextField>*/}

									{/* Imagen */}
									{/*<TextField
										aria-label="Imagen"
										fullWidth
										variant="secondary"
										value={formik.values.image ?? ""}
										onChange={(val) => formik.setFieldValue("image", val)}
									>
										<Label>URL de imagen</Label>
										<Input placeholder="Ej: https://imagen.com/burger.png" />
									</TextField>*/}

									{/* Descripción */}
									{/*<TextField
										aria-label="Descripción"
										fullWidth
										variant="secondary"
										value={formik.values.description ?? ""}
										onChange={(val) => formik.setFieldValue("description", val)}
									>
										<Label>Descripción</Label>
										<TextArea placeholder="Descripción opcional..." rows={3} />
									</TextField>*/}

									{/* Ingredientes */}
									{/*<TextField
										aria-label="Ingredientes"
										fullWidth
										variant="secondary"
										value={
											Array.isArray(formik.values.ingredients)
												? formik.values.ingredients.join(", ")
												: (formik.values.ingredients ?? "")
										}
										onChange={(val) => formik.setFieldValue("ingredients", val)}
									>
										<Label>Ingredientes</Label>
										<Input placeholder="Ej: lechuga, tomate, cebolla, queso" />
									</TextField>*/}

									{/* Tags */}
									{/*<TextField
										aria-label="Tags"
										fullWidth
										variant="secondary"
										value={
											Array.isArray(formik.values.tags) ? formik.values.tags.join(", ") : (formik.values.tags ?? "")
										}
										onChange={(val) => formik.setFieldValue("tags", val)}
									>
										<Label>Tags</Label>
										<Input placeholder="Ej: popular, oferta, nuevo" />
									</TextField>*/}

									{/* Categorías */}
									<Select
										aria-label="Categorías"
										fullWidth
										variant="secondary"
										selectionMode="multiple"
										placeholder="Seleccionar categorías"
										value={formik.values.categoryIds}
										onChange={(keys) => formik.setFieldValue("categoryIds", keys as string[])}
										isInvalid={!!formik.touched.categoryIds && !!formik.errors.categoryIds}
									>
										<Label>Categorías</Label>
										<Select.Trigger>
											<Select.Value />
											<Select.Indicator />
										</Select.Trigger>
										<Select.Popover>
											<ListBox selectionMode="multiple">
												{categories.map((cat) => (
													<ListBox.Item key={cat._id} id={cat._id} textValue={cat.name}>
														{cat.name}
														<ListBox.ItemIndicator />
													</ListBox.Item>
												))}
											</ListBox>
										</Select.Popover>
									</Select>
									<FieldError>{formik.errors.categoryIds as string}</FieldError>

									{/* Estado — solo al editar */}
									{isEditing && (
										<Select
											aria-label="Estado"
											fullWidth
											variant="secondary"
											value={(formik.values as UpdateProductRequest).status ?? "ACTIVE"}
											onChange={(val) => formik.setFieldValue("status", val)}
										>
											<Label>Estado</Label>
											<Select.Trigger>
												<Select.Value />
												<Select.Indicator />
											</Select.Trigger>
											<Select.Popover>
												<ListBox>
													<ListBox.Item id="ACTIVE" textValue="Activo">
														Activo <ListBox.ItemIndicator />
													</ListBox.Item>
													<ListBox.Item id="INACTIVE" textValue="Inactivo">
														Inactivo <ListBox.ItemIndicator />
													</ListBox.Item>
												</ListBox>
											</Select.Popover>
										</Select>
									)}
								</Modal.Body>

								<Modal.Footer>
									<Button variant="ghost" isDisabled={isPending} onPress={close}>
										Cancelar
									</Button>
									<Button variant="primary" isPending={isPending} onPress={() => formik.handleSubmit()}>
										{({ isPending: pending }) => <>{pending ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}</>}
									</Button>
								</Modal.Footer>
							</>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};
