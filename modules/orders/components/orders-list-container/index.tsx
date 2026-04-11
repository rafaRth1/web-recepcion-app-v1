"use client";

import { useState } from "react";
import { Button, Modal, Pagination } from "@heroui/react";
import { useGetOrdersPaginated } from "../../hooks/use-get-orders-paginated";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { OrdersTable } from "./orders-table";
import { OrdersFiltersBar } from "./orders-filters-bar";
import { Order, OrderStatus, DeliveryStatus, OrderType, PaymentType } from "../../interfaces";
import { DELIVERY_STATUS_LABEL, ORDER_STATUS_LABEL, ORDER_TYPE_LABEL, PAYMENT_TYPE_LABEL } from "../../constants";

export const OrdersListContainer = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | "all">("all");
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
	const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState<DeliveryStatus | "all">("all");
	const [selectedType, setSelectedType] = useState<OrderType | "all">("all");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const debouncedSearch = useDebounce(search, 400);

	const { data, isLoading } = useGetOrdersPaginated({
		params: {
			page,
			limit: 10,
			search: debouncedSearch || undefined,
			paymentType: selectedPaymentType === "all" ? undefined : selectedPaymentType,
			status: selectedStatus === "all" ? undefined : selectedStatus,
			deliveryStatus: selectedDeliveryStatus === "all" ? undefined : selectedDeliveryStatus,
			type: selectedType === "all" ? undefined : selectedType,
			startDate: startDate || undefined,
			endDate: endDate || undefined,
		},
	});

	const orders = data?.data ?? [];
	const totalPages = data?.totalPages ?? 0;
	const total = data?.total ?? 0;

	const handleView = (order: Order) => {
		setSelectedOrder(order);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedOrder(null);
	};

	return (
		<div className="flex flex-col gap-4 px-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Órdenes</h1>
			</div>

			<OrdersFiltersBar
				search={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				selectedPaymentType={selectedPaymentType}
				onPaymentTypeChange={(val) => {
					setSelectedPaymentType(val);
					setPage(1);
				}}
				selectedStatus={selectedStatus}
				onStatusChange={(val) => {
					setSelectedStatus(val);
					setPage(1);
				}}
				selectedDeliveryStatus={selectedDeliveryStatus}
				onDeliveryStatusChange={(val) => {
					setSelectedDeliveryStatus(val);
					setPage(1);
				}}
				selectedType={selectedType}
				onTypeChange={(val) => {
					setSelectedType(val);
					setPage(1);
				}}
				startDate={startDate}
				onStartDateChange={setStartDate}
				endDate={endDate}
				onEndDateChange={setEndDate}
			/>

			<OrdersTable orders={orders} isLoading={isLoading} onView={handleView} />

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

			{/* Modal — view order details */}
			<Modal>
				<Modal.Backdrop isOpen={isModalOpen} onOpenChange={handleCloseModal}>
					<Modal.Container>
						<Modal.Dialog>
							{({ close }) => (
								<>
									<Modal.CloseTrigger />
									<Modal.Header>
										<Modal.Heading>Detalle de la orden</Modal.Heading>
									</Modal.Header>
									<Modal.Body className="flex flex-col gap-3 text-sm">
										{selectedOrder && (
											<>
												<p>
													<span className="font-medium">Nombre:</span> {selectedOrder.nameOrder}
												</p>
												<p>
													<span className="font-medium">Tipo:</span>{" "}
													{ORDER_TYPE_LABEL[selectedOrder.type] ?? selectedOrder.type}
												</p>
												<p>
													<span className="font-medium">Estado:</span>{" "}
													{ORDER_STATUS_LABEL[selectedOrder.status] ?? selectedOrder.status}
												</p>
												<p>
													<span className="font-medium">Entrega:</span>{" "}
													{DELIVERY_STATUS_LABEL[selectedOrder.deliveryStatus] ?? selectedOrder.deliveryStatus}
												</p>
												<p>
													<span className="font-medium">Pago:</span>{" "}
													{PAYMENT_TYPE_LABEL[selectedOrder.paymentType] ?? selectedOrder.paymentType}
												</p>
												<p>
													<span className="font-medium">Total:</span> S/ {selectedOrder.totalPrice.toFixed(2)}
												</p>
												<p>
													<span className="font-medium">Fecha:</span>{" "}
													{new Date(selectedOrder.createdAt).toLocaleDateString("es-PE", {
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
												{selectedOrder.exception && (
													<p>
														<span className="font-medium">Excepción:</span> {selectedOrder.exception}
													</p>
												)}
												{selectedOrder.momentaryTime && (
													<p>
														<span className="font-medium">Horario:</span> {selectedOrder.momentaryTime}
													</p>
												)}
												<div>
													<p className="font-medium">Items:</p>
													<ul className="ml-4 mt-1 list-disc">
														{selectedOrder.items.map((item, index) => (
															<li key={index}>
																{item.name} - S/ {item.price.toFixed(2)}
																{item.extras.length > 0 && (
																	<span className="text-muted-fg"> (Extras: {item.extras.join(", ")})</span>
																)}
																{item.creams.length > 0 && (
																	<span className="text-muted-fg"> (Cremas: {item.creams.join(", ")})</span>
																)}
															</li>
														))}
													</ul>
												</div>
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
		</div>
	);
};
