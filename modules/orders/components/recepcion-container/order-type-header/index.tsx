"use client";

import { useRecepcionContext } from "@/modules/orders/context/recepcion-context";
import { OrderType } from "@/modules/orders/interfaces";
import { UtensilsCrossed, Car, ShoppingBag } from "lucide-react";

const ORDER_TYPES: { type: OrderType; label: string; icon: React.ReactNode }[] = [
	{ type: "TABLE", label: "Mesa", icon: <UtensilsCrossed size={24} /> },
	{ type: "DELIVERY", label: "Delivery", icon: <Car size={24} /> },
	{ type: "PICKUP", label: "Llevar", icon: <ShoppingBag size={24} /> },
];

export const OrderTypeHeader = () => {
	const { order, setOrder } = useRecepcionContext();

	const handleTypeChange = (newType: OrderType) => {
		const isDeliveryOrPickup = newType === "DELIVERY" || newType === "PICKUP";
		// When switching to TABLE, reset disposable charges; when switching to DELIVERY/PICKUP, keep them
		const updatedItems = isDeliveryOrPickup
			? order.items
			: order.items.map((item) => ({ ...item, chargeDisposable: false }));
		const itemsTotal = updatedItems.reduce((acc, i) => acc + i.price, 0);
		const disposableCount = isDeliveryOrPickup ? updatedItems.filter((i) => i.chargeDisposable).length : 0;
		const disposableCharge = disposableCount * 1.0;

		setOrder({
			...order,
			type: newType,
			items: updatedItems,
			totalPrice: itemsTotal + disposableCharge,
			disposableCharge,
		});
	};

	return (
		<div className="mb-6">
			<p className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Tipo de pedido</p>
			<div className="grid grid-cols-3 gap-2 rounded-xl bg-neutral-900 p-1">
				{ORDER_TYPES.map(({ type, label, icon }) => (
					<button
						key={type}
						onClick={() => handleTypeChange(type)}
						className={`flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
							order.type === type ? "bg-indigo-700 text-white" : "text-neutral-400 hover:text-neutral-200"
						} `}
					>
						{icon}
						<span>{label}</span>
					</button>
				))}
			</div>
		</div>
	);
};
