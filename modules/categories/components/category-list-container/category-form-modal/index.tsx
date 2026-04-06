"use client";

import { useEffect } from "react";
import { Modal, Button, TextField, Label, Input, FieldError, TextArea, Select, ListBox } from "@heroui/react";
import { useFormik } from "formik";
import { CreateCategoryFormValues, createCategorySchema } from "@/modules/categories/validations";
import { Category } from "@/modules/shared/interfaces/category";

interface CategoryFormModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: CreateCategoryFormValues) => void;
	isPending: boolean;
	editingCategory?: Category | null;
}

const generateSlug = (name: string) =>
	name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");

const initialValues: CreateCategoryFormValues = {
	name: "",
	slug: "",
	description: "",
	icon: "",
	status: "ACTIVE",
};

export const CategoryFormModal = ({ isOpen, onOpenChange, onSubmit, isPending, editingCategory }: CategoryFormModalProps) => {
	const isEditing = !!editingCategory;

	const formik = useFormik<CreateCategoryFormValues>({
		initialValues,
		validationSchema: createCategorySchema,
		onSubmit: (values) => onSubmit(values),
	});

	// Poblar form al editar, resetear al crear
	useEffect(() => {
		if (editingCategory) {
			formik.setValues({
				name: editingCategory.name,
				slug: editingCategory.slug,
				description: editingCategory.description ?? "",
				icon: editingCategory.icon ?? "",
				status: editingCategory.status,
			});
		} else {
			formik.resetForm();
		}
	}, [editingCategory, isOpen]);

	// Auto-generar slug desde nombre solo al crear
	useEffect(() => {
		if (!isEditing) {
			formik.setFieldValue("slug", generateSlug(formik.values.name));
		}
	}, [formik.values.name]);

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
				<Modal.Container>
					<Modal.Dialog>
						{({ close }) => (
							<>
								<Modal.CloseTrigger />

								<Modal.Header>
									<Modal.Heading>{isEditing ? "Editar categoría" : "Nueva categoría"}</Modal.Heading>
								</Modal.Header>

								<Modal.Body className="flex flex-col gap-4 px-1">
									{/* Nombre */}
									<TextField
										aria-label="Nombre"
										fullWidth
										name="name"
										value={formik.values.name}
										variant="secondary"
										onChange={(val) => formik.setFieldValue("name", val)}
										onBlur={() => formik.setFieldTouched("name")}
										isInvalid={!!formik.touched.name && !!formik.errors.name}
									>
										<Label>Nombre</Label>
										<Input placeholder="Ej: Hamburguesas" />
										<FieldError>{formik.errors.name}</FieldError>
									</TextField>

									{/* Slug */}
									<TextField
										aria-label="slug"
										fullWidth
										name="slug"
										variant="secondary"
										isDisabled
										value={formik.values.slug}
										onChange={(val) => formik.setFieldValue("slug", val)}
										onBlur={() => formik.setFieldTouched("slug")}
										isInvalid={!!formik.touched.slug && !!formik.errors.slug}
									>
										<Label>Slug</Label>
										<Input placeholder="ej: hamburguesas" />
										<FieldError>{formik.errors.slug}</FieldError>
									</TextField>

									{/* Descripción */}
									<TextField
										aria-label="Descripción"
										fullWidth
										name="description"
										variant="secondary"
										value={formik.values.description ?? ""}
										onChange={(val) => formik.setFieldValue("description", val)}
										onBlur={() => formik.setFieldTouched("description")}
										isInvalid={!!formik.touched.description && !!formik.errors.description}
									>
										<Label>Descripción</Label>
										<TextArea placeholder="Descripción opcional..." rows={3} />
										<FieldError>{formik.errors.description}</FieldError>
									</TextField>

									{/* Ícono */}
									{/*<TextField
										aria-label="Ícono"
										fullWidth
										name="icon"
										variant="secondary"
										value={formik.values.icon ?? ""}
										onChange={(val) => formik.setFieldValue("icon", val)}
									>
										<Label>Ícono</Label>
										<Input placeholder="Ej: 🍔" />
									</TextField>*/}

									{/* Estado */}
									<Select
										aria-label="Estado"
										fullWidth
										name="status"
										variant="secondary"
										value={formik.values.status}
										onChange={(val) => formik.setFieldValue("status", val)}
									>
										<Label>Estado</Label>
										<Select.Trigger>
											<Select.Value />
											<Select.Indicator />
										</Select.Trigger>
										<Select.Popover>
											<ListBox>
												<ListBox.Item id={"ACTIVE"} textValue="Activo">
													Activo
													<ListBox.ItemIndicator />
												</ListBox.Item>
												<ListBox.Item id={"INACTIVE"} textValue="Inactivo">
													Inactivo
													<ListBox.ItemIndicator />
												</ListBox.Item>
											</ListBox>
										</Select.Popover>
									</Select>
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
