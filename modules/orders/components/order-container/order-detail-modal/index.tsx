"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { Printer, Receipt, X, AlertCircle, UtensilsCrossed, Car, ShoppingBag, Pencil, CheckCircle } from "lucide-react";
import { usePrintTicket } from "@/modules/shared/hooks/printer/use-print-ticket";
import { usePrintReceipt } from "@/modules/shared/hooks/printer/use-print-receipt";
import { useUpdateOrder } from "../../../hooks/use-update-order";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@heroui/react";
import { Order, OrderType } from "../../../interfaces";
import { useRouter } from "next/navigation";
import { useCompleteOrder } from "@/modules/orders/hooks/use-complete-order";

const TYPE_LABEL: Record<OrderType, string> = {
	TABLE: "Mesa",
	DELIVERY: "Delivery",
	PICKUP: "Recojo",
};

const TYPE_ICON: Record<OrderType, React.ReactNode> = {
	TABLE: <UtensilsCrossed size={14} />,
	DELIVERY: <Car size={14} />,
	PICKUP: <ShoppingBag size={14} />,
};

interface Props {
	order: Order | null;
	onClose: () => void;
}

export const OrderDetailModal = ({ order, onClose }: Props) => {
	const [showConfirmCancel, setShowConfirmCancel] = useState(false);
	const { printTicket } = usePrintTicket();
	const { printReceipt } = usePrintReceipt();
	const { updateOrder } = useUpdateOrder();
	const { completeOrder } = useCompleteOrder();
	const queryClient = useQueryClient();
	const router = useRouter();

	const handlePrintTicket = () => {
		if (!order) return;
		printTicket.mutate(order._id, {
			onSuccess: () => toast.success("Ticket enviado a cocina"),
			onError: (error) => toast.danger(error.message || "Error al imprimir"),
		});
	};

	const handlePrintReceipt = () => {
		if (!order) return;
		printReceipt.mutate(order._id, {
			onSuccess: () => toast.success("Boleta enviada a la impresora"),
			onError: (error) => toast.danger(error.message || "Error al imprimir"),
		});
	};

	const handleComplete = () => {
		if (!order) return;
		completeOrder.mutate(order._id, {
			onSuccess: () => {
				toast.success("Orden completada");
				queryClient.invalidateQueries({ queryKey: ["orders"] });
				onClose();
			},
			onError: (error) => toast.danger(error.message || "Error al completar"),
		});
	};

	const handleCancel = () => {
		if (!order) return;
		updateOrder.mutate(
			{ id: order._id, body: { status: "CANCELLED" } },
			{
				onSuccess: () => {
					toast.success("Orden cancelada");
					queryClient.invalidateQueries({ queryKey: ["orders"] });
					setShowConfirmCancel(false);
					onClose();
				},
				onError: (error) => toast.danger(error.message || "Error al cancelar"),
			}
		);
	};

	const isPending = printTicket.isPending || printReceipt.isPending || updateOrder.isPending || completeOrder.isPending;

	return (
		<Modal
			isOpen={!!order}
			onOpenChange={(open) => {
				if (!open) {
					onClose();
					setShowConfirmCancel(false);
				}
			}}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="border border-neutral-800 bg-neutral-900">
						<Modal.Header className="border-b border-neutral-800">
							<span className="font-semibold text-neutral-100">Detalle de orden</span>
						</Modal.Header>

						<Modal.Body className="space-y-4 py-4">
							{order && (
								<>
									<div className="flex items-start justify-between">
										<div>
											<h3 className="text-lg font-bold text-neutral-100 capitalize">{order.nameOrder}</h3>
											<span className="mt-1 flex items-center gap-1 text-sm text-neutral-400">
												{TYPE_ICON[order.type]}
												{TYPE_LABEL[order.type]}
											</span>
										</div>
										<p className="text-2xl font-bold text-indigo-400">S/ {order.totalPrice.toFixed(2)}</p>
									</div>

									<div className="space-y-2">
										{order.items.map((item, index) => (
											<div key={index} className="rounded-lg bg-neutral-800 p-3">
												<div className="mb-1 flex justify-between">
													<p className="font-medium text-neutral-100 capitalize">{item.name}</p>
													<p className="font-semibold text-indigo-400">S/ {item.price.toFixed(2)}</p>
												</div>
												{item.type === "DISH" && (
													<div className="flex gap-3 text-xs text-neutral-400">
														<span>🍚 Arroz: {item.extras.includes("rice") ? "Sí" : "No"}</span>
														<span>🥗 Ensalada: {item.extras.includes("salad") ? "Sí" : "No"}</span>
														{item.creams.length > 0 && <span>🧴 {item.creams.join(", ")}</span>}
													</div>
												)}
											</div>
										))}
									</div>

									{order.exception && (
										<div className="flex items-start gap-2 rounded-lg border border-yellow-700/30 bg-yellow-900/20 p-3">
											<AlertCircle size={16} className="mt-0.5 shrink-0 text-yellow-400" />
											<p className="text-sm text-yellow-400">{order.exception}</p>
										</div>
									)}

									{order.paymentType && (
										<p className="text-sm text-neutral-400">
											Pago: <span className="font-medium text-neutral-100">{order.paymentType}</span>
										</p>
									)}
								</>
							)}
						</Modal.Body>

						<Modal.Footer className="flex-col gap-2 border-t border-neutral-800 py-3">
							<div className="grid w-full grid-cols-2 gap-2">
								<Button
									className="w-full"
									isDisabled={isPending}
									isPending={printTicket.isPending}
									onPress={handlePrintTicket}
								>
									<Printer size={16} />
									Cocina
								</Button>
								<Button
									className="w-full"
									isDisabled={isPending}
									isPending={printReceipt.isPending}
									onPress={handlePrintReceipt}
								>
									<Receipt size={16} />
									Boleta
								</Button>
							</div>

							<Button
								className="w-full"
								isDisabled={isPending}
								onPress={() => router.push(`/dashboard/recepcion/${order?._id}`)}
							>
								<Pencil size={16} />
								Editar
							</Button>

							<Button
								className="w-full bg-green-800 text-white"
								isDisabled={isPending}
								isPending={updateOrder.isPending}
								onPress={handleComplete}
							>
								<CheckCircle size={16} />
								Completar orden
							</Button>

							{!showConfirmCancel ? (
								<Button
									className="w-full border border-red-800 bg-red-900/40 text-red-400"
									isDisabled={isPending}
									onPress={() => setShowConfirmCancel(true)}
								>
									<X size={16} />
									Cancelar orden
								</Button>
							) : (
								<div className="w-full space-y-2">
									<p className="text-center text-sm text-neutral-400">¿Confirmar cancelación?</p>
									<div className="grid grid-cols-2 gap-2">
										<Button className="w-full" isDisabled={isPending} onPress={() => setShowConfirmCancel(false)}>
											Volver
										</Button>
										<Button
											className="w-full bg-red-800 text-white"
											isPending={updateOrder.isPending}
											onPress={handleCancel}
										>
											Sí, cancelar
										</Button>
									</div>
								</div>
							)}
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};
