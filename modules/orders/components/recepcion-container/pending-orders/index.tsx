"use client";

import { Button } from "@heroui/react";
import { Pencil, CheckCircle, Trash, AlertCircle, UtensilsCrossed, Car, ShoppingBag } from "lucide-react";
import { useCreateOrder } from "../../../hooks/use-create-order";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { CreateOrderRequest, LocalOrder } from "@/modules/orders/interfaces";
import { useRecepcionContext } from "@/modules/orders/context/recepcion-context";

const ORDER_TYPE_ICON: Record<string, React.ReactNode> = {
	TABLE: <UtensilsCrossed size={14} />,
	DELIVERY: <Car size={14} />,
	PICKUP: <ShoppingBag size={14} />,
};

const ORDER_TYPE_LABEL: Record<string, string> = {
	TABLE: "Mesa",
	DELIVERY: "Delivery",
	PICKUP: "Llevar",
};

const PAYMENT_STYLE: Record<string, string> = {
	YAPE: "bg-purple-600",
	PLIN: "bg-cyan-600",
	EFECTIVO: "bg-green-600",
};

interface Props {
	onSwitchToNew: () => void;
}

export const PendingOrders = ({ onSwitchToNew }: Props) => {
	const { pendingOrders, handleDeletePendingOrder, handleEditOrder } = useRecepcionContext();
	const { createOrder } = useCreateOrder();
	const queryClient = useQueryClient();

	const handleFinish = (localOrder: LocalOrder) => {
		const request: CreateOrderRequest = {
			nameOrder: localOrder.nameOrder,
			items: localOrder.items,
			exception: localOrder.exception || undefined,
			paymentType: localOrder.paymentType || undefined,
			type: localOrder.type,
		};

		createOrder.mutate(request, {
			onSuccess: (response) => {
				toast.success(response.message);
				handleDeletePendingOrder(localOrder.id);
				queryClient.invalidateQueries({ queryKey: ["orders"] });
			},
			onError: (error) => {
				toast.danger(error.message || "Error al crear la orden");
			},
		});
	};

	const handleEdit = (localOrder: LocalOrder) => {
		handleEditOrder(localOrder);
		onSwitchToNew();
	};

	const handleDelete = (id: string) => {
		const confirm = window.confirm("¿Eliminar este pedido?");
		if (!confirm) return;
		handleDeletePendingOrder(id);
	};

	if (pendingOrders.length === 0) return null;

	return (
		<div className="mt-6">
			<h2 className="mb-4 text-xl font-semibold text-neutral-100">Pedidos Pendientes ({pendingOrders.length})</h2>

			<div className="space-y-4">
				{pendingOrders.map((localOrder) => (
					<div key={localOrder.id} className="rounded-xl bg-neutral-900 p-4">
						{/* Header */}
						<div className="mb-4 flex items-start justify-between">
							<div>
								<h3 className="mb-1 text-lg font-semibold capitalize">{localOrder.nameOrder}</h3>
								<div className="flex items-center gap-2 text-sm text-neutral-400">
									<span className="flex items-center gap-1">
										{ORDER_TYPE_ICON[localOrder.type]}
										{ORDER_TYPE_LABEL[localOrder.type]}
									</span>
									{localOrder.paymentType && (
										<span className={`${PAYMENT_STYLE[localOrder.paymentType]} rounded px-2 py-0.5 text-xs text-white`}>
											{localOrder.paymentType}
										</span>
									)}
								</div>
							</div>
							<div className="text-right">
								<p className="mb-1 text-xs text-neutral-400">Total</p>
								<p className="text-2xl font-bold text-indigo-400">S/ {localOrder.totalPrice.toFixed(2)}</p>
							</div>
						</div>

						{/* Items */}
						<div className="mb-4 space-y-2">
							{localOrder.items.map((item, index) => (
								<div key={index} className="rounded-lg bg-neutral-800 p-3">
									<div className="mb-1 flex items-start justify-between">
										<p className="flex-1 font-medium capitalize">{item.name}</p>
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

						{/* Observación */}
						{localOrder.exception && (
							<div className="mb-4 rounded-lg border border-yellow-700/50 bg-yellow-900/20 p-3">
								<p className="flex items-center gap-2 text-sm text-yellow-400">
									<AlertCircle size={16} />
									<span className="font-medium">Observación:</span>
									{localOrder.exception}
								</p>
							</div>
						)}

						{/* Acciones */}
						<div className="grid grid-cols-2 gap-2">
							<Button className="w-full" isDisabled={createOrder.isPending} onPress={() => handleEdit(localOrder)}>
								<Pencil size={18} />
								Editar
							</Button>

							<Button className="w-full" isDisabled={createOrder.isPending} onPress={() => handleFinish(localOrder)}>
								<CheckCircle size={18} />
								Terminar
							</Button>

							<Button
								className="w-full bg-red-800"
								isDisabled={createOrder.isPending}
								onPress={() => handleDelete(localOrder.id)}
							>
								<Trash size={18} />
								Eliminar
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
