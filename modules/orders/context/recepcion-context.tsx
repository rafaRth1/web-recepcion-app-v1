"use client";

import { createContext, useContext, useState } from "react";
import { v4 } from "uuid";
import { toast } from "@heroui/react";
import { initialLocalOrder, LocalOrder, OrderItem } from "../interfaces";
import { useLocalStorage } from "@/shared/hooks/use-local-storage";

interface RecepcionContextProps {
	order: LocalOrder;
	setOrder: React.Dispatch<React.SetStateAction<LocalOrder>>;
	pendingOrders: LocalOrder[];
	setPendingOrders: React.Dispatch<React.SetStateAction<LocalOrder[]>>;
	addItem: (item: OrderItem) => void;
	removeItem: (index: number) => void;
	handleSaveOrder: () => void;
	handleEditOrder: (order: LocalOrder) => void;
	handleDeletePendingOrder: (id: string) => void;
}

const RecepcionContext = createContext<RecepcionContextProps>({} as RecepcionContextProps);

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
		setOrder((prev) => ({
			...prev,
			items: [...prev.items, item],
			totalPrice: prev.totalPrice + item.price,
		}));
	};

	const removeItem = (index: number) => {
		setOrder((prev) => {
			const removed = prev.items[index];
			return {
				...prev,
				items: prev.items.filter((_, i) => i !== index),
				totalPrice: prev.totalPrice - removed.price,
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
				handleSaveOrder,
				handleEditOrder,
				handleDeletePendingOrder,
			}}
		>
			{children}
		</RecepcionContext.Provider>
	);
};
