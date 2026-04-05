"use client";

import { Table, Button, Chip, EmptyState } from "@heroui/react";
import { Icon, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/modules/categories/domain/category";

interface CategoryTableProps {
	categories: Category[];
	onEdit: (category: Category) => void;
	onDelete: (category: Category) => void;
	isDeleting: boolean;
}

export const CategoryTable = ({ categories, onEdit, onDelete, isDeleting }: CategoryTableProps) => {
	return (
		<Table className="min-h-50">
			<Table.ScrollContainer>
				<Table.Content aria-label="Listado de categorías">
					<Table.Header>
						<Table.Column isRowHeader>Nombre</Table.Column>
						<Table.Column>Slug</Table.Column>
						<Table.Column>Descripción</Table.Column>
						<Table.Column>Estado</Table.Column>
						<Table.Column className="text-end">Acciones</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
								<p className="text-default-400 py-10 text-center text-sm">No hay categorías registradas.</p>
							</EmptyState>
						)}
					>
						{categories.map((category) => (
							<Table.Row key={category._id} id={category._id}>
								<Table.Cell>
									<div className="flex items-center gap-2">
										{category.icon && <span>{category.icon}</span>}
										<span className="text-foreground font-medium">{category.name}</span>
									</div>
								</Table.Cell>
								<Table.Cell>
									<span className="text-default-400 font-mono text-xs">{category.slug}</span>
								</Table.Cell>
								<Table.Cell>
									<span className="text-default-500 max-w-xs truncate">{category.description || "—"}</span>
								</Table.Cell>
								<Table.Cell>
									<Chip size="sm" variant="soft" color={category.status === "ACTIVE" ? "success" : "default"}>
										{category.status === "ACTIVE" ? "Activo" : "Inactivo"}
									</Chip>
								</Table.Cell>
								<Table.Cell>
									<div className="flex justify-end gap-1">
										<Button isIconOnly variant="ghost" size="sm" onPress={() => onEdit(category)}>
											<Pencil size={15} />
										</Button>
										<Button
											isIconOnly
											variant="danger-soft"
											size="sm"
											isDisabled={isDeleting}
											onPress={() => onDelete(category)}
										>
											<Trash2 size={15} />
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
