"use client";

import { useState } from "react";
import { Button, Input, TextField, Select, ListBox, Pagination } from "@heroui/react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryTable } from "./category-table";
import { CategoryFormModal } from "./category-form-modal";
import { useGetCategoriesPaginated } from "@/modules/categories/hooks/use-get-categories-paginated";
import { useCreateCategory } from "@/modules/categories/hooks/use-create-category";
import { useUpdateCategory } from "@/modules/categories/hooks/use-update-category";
import { useDeleteCategory } from "@/modules/categories/hooks/use-delete-category";
import { Status } from "@/shared/types/status";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Category, GetCategoriesPaginatedParams } from "../../interfaces";
import { CreateCategoryFormValues } from "../../validations";

const generateSlug = (name: string) =>
	name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");

export const CategoryListContainer = () => {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	const debouncedSearch = useDebounce(searchValue, 400);

	const params: GetCategoriesPaginatedParams = {
		page,
		limit: 10,
		search: debouncedSearch,
		status: statusFilter === "all" ? undefined : statusFilter,
	};

	const { data, isLoading } = useGetCategoriesPaginated({ params });
	const { createCategory } = useCreateCategory();
	const { updateCategory } = useUpdateCategory();
	const { deleteCategory } = useDeleteCategory();

	const categories = data?.data.data ?? [];
	const totalPages = data?.data.totalPages ?? 1;
	const total = data?.data.total ?? 0;

	const handleOpenCreate = () => {
		setEditingCategory(null);
		setIsModalOpen(true);
	};

	const handleOpenEdit = (category: Category) => {
		setEditingCategory(category);
		setIsModalOpen(true);
	};

	const handleDelete = (category: Category) => {
		deleteCategory.mutate(
			{ id: category._id },
			{
				onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories-paginated"] }),
			}
		);
	};

	const handleSubmit = (values: CreateCategoryFormValues) => {
		if (editingCategory) {
			updateCategory.mutate(
				{
					id: editingCategory._id,
					...values,
					slug: generateSlug(values.name),
				},
				{
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ["categories-paginated"] });
						setIsModalOpen(false);
					},
				}
			);
		} else {
			createCategory.mutate(values, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["categories-paginated"] });
					setIsModalOpen(false);
				},
			});
		}
	};

	const isPending = createCategory.isPending || updateCategory.isPending;

	return (
		<div className="flex flex-col gap-4 px-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-foreground text-xl font-bold">Categorías</h1>
					<p className="text-default-400 text-sm">
						{total} categoría{total !== 1 ? "s" : ""} registrada{total !== 1 ? "s" : ""}
					</p>
				</div>
				<Button variant="primary" onPress={handleOpenCreate}>
					<Plus size={16} />
					Nueva categoría
				</Button>
			</div>

			{/* Filtros */}
			<div className="flex items-center gap-3">
				<TextField
					aria-label="Filtro de busqueda"
					className="max-w-sm flex-1"
					value={searchValue}
					onChange={(val) => setSearchValue(val)}
				>
					<Input placeholder="Buscar por nombre..." />
				</TextField>

				<Select
					placeholder="Todos los estados"
					value={statusFilter ?? null}
					onChange={(val) => {
						setStatusFilter(val === null || val === "all" ? "all" : (val as Status | "all"));
						setPage(1);
					}}
				>
					<Select.Trigger>
						<Select.Value />
						<Select.Indicator />
					</Select.Trigger>
					<Select.Popover>
						<ListBox>
							<ListBox.Item id="all" textValue="Todos">
								Todos
								<ListBox.ItemIndicator />
							</ListBox.Item>
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
			</div>

			{/* Tabla */}
			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="bg-default-200 h-12 animate-pulse rounded-md" />
					))}
				</div>
			) : (
				<CategoryTable
					categories={categories}
					onEdit={handleOpenEdit}
					onDelete={handleDelete}
					isDeleting={deleteCategory.isPending}
				/>
			)}

			{/* Paginación */}
			{totalPages > 1 && (
				<Pagination className="w-full" size="sm">
					<Pagination.Summary>
						Página {page} de {totalPages} — {total} resultado{total !== 1 ? "s" : ""}
					</Pagination.Summary>
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
								<Pagination.PreviousIcon />
								<span>Anterior</span>
							</Pagination.Previous>
						</Pagination.Item>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
							<Pagination.Item key={p}>
								<Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
									{p}
								</Pagination.Link>
							</Pagination.Item>
						))}
						<Pagination.Item>
							<Pagination.Next isDisabled={page === totalPages} onPress={() => setPage((p) => p + 1)}>
								<span>Siguiente</span>
								<Pagination.NextIcon />
							</Pagination.Next>
						</Pagination.Item>
					</Pagination.Content>
				</Pagination>
			)}

			{/* Modal */}
			<CategoryFormModal
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
				onSubmit={handleSubmit}
				isPending={isPending}
				editingCategory={editingCategory}
			/>
		</div>
	);
};
