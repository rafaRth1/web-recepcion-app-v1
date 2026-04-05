"use client";

import { Button, Table } from "@heroui/react";
import { Eye, Pencil } from "lucide-react";
import { Product } from "../../../domain/product";

interface ProductTableProps {
	products: Product[];
	isLoading: boolean;
	onView: (product: Product) => void;
	onEdit: (product: Product) => void;
}

export const ProductTable = ({ products, isLoading, onView, onEdit }: ProductTableProps) => {
	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Tabla de productos">
					<Table.Header>
						<Table.Column id="id" isRowHeader>
							ID
						</Table.Column>
						<Table.Column id="name">Nombre</Table.Column>
						<Table.Column id="price">Precio</Table.Column>
						<Table.Column id="discount">Descuento</Table.Column>
						<Table.Column id="categories">Categorías</Table.Column>
						<Table.Column id="status">Estado</Table.Column>
						<Table.Column id="actions">Acciones</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<p className="text-muted-fg py-6 text-center">{isLoading ? "Cargando..." : "No hay productos"}</p>
						)}
					>
						{products.map((product) => (
							<Table.Row key={product._id} id={product._id}>
								<Table.Cell className="text-muted-fg font-mono text-xs">{product._id.slice(-6)}</Table.Cell>
								<Table.Cell className="font-medium">{product.name}</Table.Cell>
								<Table.Cell>S/ {product.price.toFixed(2)}</Table.Cell>
								<Table.Cell>{product.discount}%</Table.Cell>
								<Table.Cell>
									<div className="flex flex-wrap gap-1">
										{product.categoryNames.map((name) => (
											<span key={name} className="bg-surface-secondary rounded-full px-2 py-0.5 text-xs">
												{name}
											</span>
										))}
									</div>
								</Table.Cell>
								<Table.Cell>
									<span
										className={`rounded-full px-2 py-0.5 text-xs font-medium ${
											product.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
										}`}
									>
										{product.status === "ACTIVE" ? "Activo" : "Inactivo"}
									</span>
								</Table.Cell>
								<Table.Cell>
									<div className="flex gap-2">
										<Button size="sm" variant="secondary" onPress={() => onView(product)}>
											<Eye size={14} />
										</Button>
										<Button size="sm" variant="secondary" onPress={() => onEdit(product)}>
											<Pencil size={14} />
										</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
};
