"use client";

import { useState } from "react";
import { Button, Modal, Pagination } from "@heroui/react";
import { Plus } from "lucide-react";
import { useGetProductsPaginated } from "../../application/use-get-products-paginated";
import { useGetCategoriesForFilter } from "../../application/use-get-categories-for-filter";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { CreateProductRequest, Product, UpdateProductRequest } from "../../domain/product";
import { ProductTable } from "./product-table";
import { ProductFiltersBar } from "./product-filters-bar";
import { Status } from "@/shared/types/status";
import { ProductFormModal } from "./shared/product-form-modal";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateProduct } from "../../application/use-create-product";
import { useUpdateProduct } from "../../application/use-update-product";

type ModalMode = "create" | "edit" | "view" | null;

export const ProductListContainer = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState("");
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
	const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all");
	const [modalMode, setModalMode] = useState<ModalMode>(null);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const debouncedSearch = useDebounce(search, 400);

	const queryClient = useQueryClient();

	const { createProduct } = useCreateProduct();
	const { updateProduct } = useUpdateProduct();

	const { data, isLoading } = useGetProductsPaginated({
		params: {
			page,
			limit: 10,
			search: debouncedSearch || undefined,
			categoryId: selectedCategoryId || undefined,
			minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
			maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
			status: selectedStatus === "all" ? undefined : selectedStatus,
		},
	});

	const { data: categories = [] } = useGetCategoriesForFilter();

	const products = data?.data ?? [];
	const totalPages = data?.totalPages ?? 0;
	const total = data?.total ?? 0;
	const isPending = createProduct.isPending || updateProduct.isPending;

	const handleView = (product: Product) => {
		setSelectedProduct(product);
		setModalMode("view");
	};

	const handleEdit = (product: Product) => {
		setSelectedProduct(product);
		setModalMode("edit");
	};

	const handleCloseModal = () => {
		setModalMode(null);
		setSelectedProduct(null);
	};

	const handleSubmit = (values: CreateProductRequest | UpdateProductRequest) => {
		if (modalMode === "create") {
			createProduct.mutate(values as CreateProductRequest, {
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["products-paginated"] });
					handleCloseModal();
				},
			});
		} else if (modalMode === "edit" && selectedProduct) {
			console.log("values", { id: selectedProduct._id, body: values as UpdateProductRequest });

			updateProduct.mutate(
				{ id: selectedProduct._id, body: values as UpdateProductRequest },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ["products-paginated"] });
						handleCloseModal();
					},
				}
			);
		}
	};

	return (
		<div className="flex flex-col gap-4 px-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Productos</h1>
				<Button variant="primary" onPress={() => setModalMode("create")}>
					<Plus size={16} />
					Nuevo producto
				</Button>
			</div>

			<ProductFiltersBar
				search={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				selectedCategoryId={selectedCategoryId}
				onCategoryChange={(val) => {
					setSelectedCategoryId(val as string);
					setPage(1);
				}}
				priceRange={priceRange}
				onPriceRangeChange={(val) => {
					setPriceRange(val);
					setPage(1);
				}}
				selectedStatus={selectedStatus}
				onStatusChange={(val) => {
					setSelectedStatus(val);
					setPage(1);
				}}
				categories={categories}
			/>

			<ProductTable products={products} isLoading={isLoading} onView={handleView} onEdit={handleEdit} />

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

			{/* Modal — view */}
			<Modal>
				<Modal.Backdrop isOpen={modalMode === "view"} onOpenChange={handleCloseModal}>
					<Modal.Container>
						<Modal.Dialog>
							{({ close }) => (
								<>
									<Modal.CloseTrigger />
									<Modal.Header>
										<Modal.Heading>Detalle del producto</Modal.Heading>
									</Modal.Header>
									<Modal.Body className="flex flex-col gap-3 text-sm">
										{selectedProduct && (
											<>
												<p>
													<span className="font-medium">Nombre:</span> {selectedProduct.name}
												</p>
												<p>
													<span className="font-medium">Precio:</span> S/ {selectedProduct.price.toFixed(2)}
												</p>
												<p>
													<span className="font-medium">Descuento:</span> {selectedProduct.discount}%
												</p>
												<p>
													<span className="font-medium">Estado:</span> {selectedProduct.status}
												</p>
												<p>
													<span className="font-medium">Descripción:</span> {selectedProduct.description || "—"}
												</p>
												<p>
													<span className="font-medium">Ingredientes:</span>{" "}
													{selectedProduct.ingredients?.join(", ") || "—"}
												</p>
												<p>
													<span className="font-medium">Tags:</span> {selectedProduct.tags?.join(", ") || "—"}
												</p>
												<p>
													<span className="font-medium">Categorías:</span>{" "}
													{selectedProduct.categoryNames?.join(", ") || "—"}
												</p>
											</>
										)}
									</Modal.Body>
									<Modal.Footer>
										<Button variant="ghost" onPress={close}>
											Cerrar
										</Button>
									</Modal.Footer>
								</>
							)}
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>

			{/* Modal — create / edit */}
			<ProductFormModal
				isOpen={modalMode === "create" || modalMode === "edit"}
				onOpenChange={handleCloseModal}
				onSubmit={handleSubmit}
				isPending={isPending}
				editingProduct={modalMode === "edit" ? selectedProduct : null}
				categories={categories}
			/>
		</div>
	);
};
