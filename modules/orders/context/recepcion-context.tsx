"use client";

import { createContext, useContext, useState } from "react";
import { v4 } from "uuid";
import { toast } from "@heroui/react";
import { initialLocalOrder, LocalOrder, OrderItem, OrderType } from "../interfaces";
import { useLocalStorage } from "@/shared/hooks/use-local-storage";

const DISPOSABLE_PRICE = 1.0;

const calculateDisposableCharge = (items: OrderItem[], orderType: OrderType): number => {
	const isDeliveryOrPickup = orderType === "DELIVERY" || orderType === "PICKUP";
	if (!isDeliveryOrPickup) return 0;
	const disposableCount = items.filter((item) => item.chargeDisposable).length;
	return disposableCount * DISPOSABLE_PRICE;
};

interface RecepcionContextProps {
	order: LocalOrder;
	setOrder: React.Dispatch<React.SetStateAction<LocalOrder>>;
	pendingOrders: LocalOrder[];
	setPendingOrders: React.Dispatch<React.SetStateAction<LocalOrder[]>>;
	addItem: (item: OrderItem) => void;
	removeItem: (index: number) => void;
	toggleItemDisposable: (index: number) => void;
	handleSaveOrder: () => void;
	handleEditOrder: (order: LocalOrder) => void;
	handleDeletePendingOrder: (id: string) => void;
}

export const RecepcionContext = createContext<RecepcionContextProps>({} as RecepcionContextProps);

export const useRecepcionContext = () => {
	const context = useContext(RecepcionContext);
	if (!context) {
		throw new Error("useRecepcionContext must be used within RecepcionProvider");
	}
	return context;
};

export const RecepcionProvider = ({ children }: { children: React.ReactNode }) => {
	const [order, setOrder] = useState<LocalOrder>(initialLocalOrder);
	const [pendingOrders, setPendingOrders] = useLocalStorage<LocalOrder[]>("pending-orders", []);

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

		if (order.id) {
			setPendingOrders(pendingOrders.map((o) => (o.id === order.id ? order : o)));
		} else {
			setPendingOrders([...pendingOrders, { ...order, id: v4() }]);
		}

		setOrder(initialLocalOrder);
	};

	const handleEditOrder = (selected: LocalOrder) => {
		setOrder(selected);
	};

	const handleDeletePendingOrder = (id: string) => {
		setPendingOrders(pendingOrders.filter((o) => o.id !== id));
	};

	return (
		<RecepcionContext.Provider
			value={{
				order,
				setOrder,
				pendingOrders,
				setPendingOrders,
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
