"use client";

import { useContext, useState } from "react";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LocalOrder, OrderItem, initialLocalOrder, Order, OrderType } from "../interfaces";
import { useUpdateOrder } from "../hooks/use-update-order";
import { RecepcionContext } from "./recepcion-context";

const DISPOSABLE_PRICE = 1.0;

const calculateDisposableCharge = (items: OrderItem[], orderType: OrderType): number => {
	const isDeliveryOrPickup = orderType === "DELIVERY" || orderType === "PICKUP";
	if (!isDeliveryOrPickup) return 0;
	const disposableCount = items.filter((item) => item.chargeDisposable).length;
	return disposableCount * DISPOSABLE_PRICE;
};

export const useRecepcionContext = () => {
	const context = useContext(RecepcionContext);
	if (!context) throw new Error("useRecepcionContext must be used within EditOrderProvider");
	return context;
};

interface Props {
	orderId: string;
	initialOrder?: Order;
	children: React.ReactNode;
}

export const EditOrderProvider = ({ orderId, initialOrder, children }: Props) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { updateOrder } = useUpdateOrder();

	const [order, setOrder] = useState<LocalOrder>(() => {
		if (!initialOrder) return initialLocalOrder;
		const disposableCharge = initialOrder.disposableCharge ?? 0;
		return {
			id: initialOrder._id,
			nameOrder: initialOrder.nameOrder,
			items: initialOrder.items,
			totalPrice: initialOrder.totalPrice,
			disposableCharge,
			exception: initialOrder.exception ?? "",
			paymentType: initialOrder.paymentType ?? "",
			type: initialOrder.type,
		};
	});

	const addItem = (item: OrderItem) => {
		setOrder((prev) => {
			const newItems = [...prev.items, item];
			const itemsTotal = newItems.reduce((acc, i) => acc + i.price, 0);
			const disposableCharge = calculateDisposableCharge(newItems, prev.type);
			return {
				...prev,
				items: newItems,
				totalPrice: itemsTotal + disposableCharge,
				disposableCharge,
			};
		});
	};

	const removeItem = (index: number) => {
		setOrder((prev) => {
			const newItems = prev.items.filter((_, i) => i !== index);
			const itemsTotal = newItems.reduce((acc, i) => acc + i.price, 0);
			const disposableCharge = calculateDisposableCharge(newItems, prev.type);
			return {
				...prev,
				items: newItems,
				totalPrice: itemsTotal + disposableCharge,
				disposableCharge,
			};
		});
	};

	const toggleItemDisposable = (index: number) => {
		setOrder((prev) => {
			const newItems = prev.items.map((item, i) =>
				i === index ? { ...item, chargeDisposable: !item.chargeDisposable } : item
			);
			const itemsTotal = newItems.reduce((acc, i) => acc + i.price, 0);
			const disposableCharge = calculateDisposableCharge(newItems, prev.type);
			return {
				...prev,
				items: newItems,
				totalPrice: itemsTotal + disposableCharge,
				disposableCharge,
			};
		});
	};

	const handleSaveOrder = () => {
		if (order.nameOrder.trim().length === 0) {
			toast.danger("El pedido debe tener un nombre");
			return;
		}
		updateOrder.mutate(
			{
				id: orderId,
				body: {
					nameOrder: order.nameOrder,
					items: order.items,
					totalPrice: order.totalPrice,
					exception: order.exception,
					paymentType: order.paymentType || undefined,
					type: order.type,
					status: initialOrder?.status ?? "PROCESS",
					deliveryStatus: initialOrder?.deliveryStatus ?? "PROCESS",
					momentaryTime: initialOrder?.momentaryTime ?? "",
				},
			},
			{
				onSuccess: () => {
					toast.success("Orden actualizada correctamente");
					queryClient.invalidateQueries({ queryKey: ["orders"] });
					router.push("/dashboard/order");
				},
				onError: (error) => {
					toast.danger(error.message || "Error al actualizar la orden");
				},
			}
		);
	};

	const handleEditOrder = (_order: LocalOrder) => {};
	const handleDeletePendingOrder = (_id: string) => {};

	return (
		<RecepcionContext.Provider
			value={{
				order,
				setOrder,
				pendingOrders: [],
				setPendingOrders: () => {},
				addItem,
				removeItem,
				toggleItemDisposable,
				handleSaveOrder,
				handleEditOrder,
				handleDeletePendingOrder,
			}}
		>
			{children}
		</RecepcionContext.Provider>
	);
};
