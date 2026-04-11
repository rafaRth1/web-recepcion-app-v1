"use client";

import { Order } from "../../../interfaces";
import { Button, Chip, Table } from "@heroui/react";
import { Eye } from "lucide-react";
import { DELIVERY_STATUS_LABEL, ORDER_STATUS_LABEL, ORDER_TYPE_LABEL } from "../../../constants";

interface OrdersTableProps {
	orders: Order[];
	isLoading: boolean;
	onView: (order: Order) => void;
}

export const OrdersTable = ({ orders, isLoading, onView }: OrdersTableProps) => {
	const getStatusColor = (status: Order["status"]) => {
		switch (status) {
			case "COMPLETED":
				return "success";
			case "PROCESS":
				return "warning";
			case "CANCELLED":
				return "danger";
			default:
				return "default";
		}
	};

	const getDeliveryStatusColor = (status: Order["deliveryStatus"]) => {
		switch (status) {
			case "COMPLETED":
				return "success";
			case "PROCESS":
				return "warning";
			case "CANCELLED":
				return "danger";
			default:
				return "default";
		}
	};

	return (
		<Table>
			<Table.ScrollContainer>
				<Table.Content aria-label="Tabla de órdenes">
					<Table.Header>
						<Table.Column id="id" isRowHeader>
							ID
						</Table.Column>
						<Table.Column id="nameOrder">Nombre</Table.Column>
						<Table.Column id="type">Tipo</Table.Column>
						<Table.Column id="status">Estado</Table.Column>
						<Table.Column id="deliveryStatus">Entrega</Table.Column>
						<Table.Column id="totalPrice">Total</Table.Column>
						<Table.Column id="createdAt">Fecha</Table.Column>
						<Table.Column id="actions">Acciones</Table.Column>
					</Table.Header>
					<Table.Body
						renderEmptyState={() => (
							<p className="text-muted-fg py-6 text-center">{isLoading ? "Cargando..." : "No hay órdenes"}</p>
						)}
					>
						{orders.map((order) => (
							<Table.Row key={order._id} id={order._id}>
								<Table.Cell className="text-muted-fg font-mono text-xs">{order._id.slice(-6)}</Table.Cell>
								<Table.Cell className="font-medium">{order.nameOrder}</Table.Cell>
								<Table.Cell>
									<Chip size="sm" variant="soft">
										{ORDER_TYPE_LABEL[order.type] ?? order.type}
									</Chip>
								</Table.Cell>
								<Table.Cell>
									<Chip size="sm" variant="soft" color={getStatusColor(order.status)}>
										{ORDER_STATUS_LABEL[order.status] ?? order.status}
									</Chip>
								</Table.Cell>
								<Table.Cell>
									<Chip size="sm" variant="soft" color={getDeliveryStatusColor(order.deliveryStatus)}>
										{DELIVERY_STATUS_LABEL[order.deliveryStatus] ?? order.deliveryStatus}
									</Chip>
								</Table.Cell>
								<Table.Cell>S/ {order.totalPrice.toFixed(2)}</Table.Cell>
								<Table.Cell className="text-muted-fg text-sm">
									{new Date(order.createdAt).toLocaleDateString("es-PE", {
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Table.Cell>
								<Table.Cell>
									<Button size="sm" variant="secondary" onPress={() => onView(order)}>
										<Eye size={14} />
									</Button>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
};
