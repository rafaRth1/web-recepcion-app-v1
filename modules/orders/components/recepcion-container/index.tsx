"use client";

import { useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { RecepcionProvider, useRecepcionContext } from "../../context/recepcion-context";
import { OrderTypeHeader } from "./order-type-header";
import { ProductGrid } from "./product-grid";
import { OrderSummaryBanner } from "./order-summary-banner";
import { ModalOrderDetail } from "./modal-order-detail";
import { ModalItemExtras } from "./modal-item-extras";
import { PendingOrders } from "./pending-orders";

type ActiveTab = "nuevo" | "pendientes";

const RecepcionContent = () => {
	const { order, setOrder, pendingOrders } = useRecepcionContext();
	const [activeTab, setActiveTab] = useState<ActiveTab>("nuevo");
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isExtrasOpen, setIsExtrasOpen] = useState(false);
	const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

	const handleOpenExtras = (index: number) => {
		setSelectedItemIndex(index);
		setIsExtrasOpen(true);
	};

	return (
		<>
			<main className="pb-20">
				<div className="mx-auto max-w-205">
					{/* Tabs */}
					<div className="mb-4 px-4">
						<div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-900 p-1">
							<button
								onClick={() => setActiveTab("nuevo")}
								className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
									activeTab === "nuevo" ? "bg-indigo-700 text-white" : "text-neutral-400 hover:text-neutral-200"
								} `}
							>
								<Plus size={18} />
								Nuevo Pedido
							</button>
							<button
								onClick={() => setActiveTab("pendientes")}
								className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
									activeTab === "pendientes" ? "bg-indigo-700 text-white" : "text-neutral-400 hover:text-neutral-200"
								} `}
							>
								<Receipt size={18} />
								Pendientes
								{pendingOrders.length > 0 && (
									<span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
										{pendingOrders.length}
									</span>
								)}
							</button>
						</div>
					</div>

					{activeTab === "nuevo" ? (
						<>
							<div className="p-4 pb-0">
								<OrderTypeHeader />
							</div>

							{/* Banner sticky */}
							<OrderSummaryBanner onOpenDetail={() => setIsDetailOpen(true)} />

							<div className="space-y-6 px-4">
								{/* Nombre del cliente */}
								<div>
									<p className="mb-2 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
										Nombre del cliente o mesa
									</p>
									<input
										type="text"
										placeholder="Ej: Mesa 5 o Juan Pérez"
										value={order.nameOrder}
										onChange={(e) => setOrder({ ...order, nameOrder: e.target.value })}
										className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder-neutral-400 focus:border-indigo-500 focus:outline-none"
									/>
								</div>

								{/* Grid de productos */}
								<div>
									<p className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
										Agregar Productos
									</p>
									<ProductGrid />
								</div>
							</div>
						</>
					) : (
						<div className="px-4">
							<PendingOrders onSwitchToNew={() => setActiveTab("nuevo")} />
						</div>
					)}
				</div>
			</main>

			<ModalOrderDetail isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} onOpenExtras={handleOpenExtras} />

			<ModalItemExtras
				key={selectedItemIndex ?? "closed"}
				isOpen={isExtrasOpen}
				onClose={() => setIsExtrasOpen(false)}
				itemIndex={selectedItemIndex}
			/>
		</>
	);
};

export const RecepcionContainer = () => {
	return (
		<RecepcionProvider>
			<RecepcionContent />
		</RecepcionProvider>
	);
};
