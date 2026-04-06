"use client";

import { useState } from "react";
import { EditOrderProvider, useRecepcionContext } from "../../context/edit-order-context";
import { OrderTypeHeader } from "../recepcion-container/order-type-header";
import { ProductGrid } from "../recepcion-container/product-grid";
import { OrderSummaryBanner } from "../recepcion-container/order-summary-banner";
import { ModalOrderDetail } from "../recepcion-container/modal-order-detail";
import { ModalItemExtras } from "../recepcion-container/modal-item-extras";
import { useGetOrderById } from "../../hooks/use-get-order-by-id";

interface Props {
	orderId: string;
}

const EditOrderContent = () => {
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
					<div className="p-4 pb-0">
						<OrderTypeHeader />
					</div>
					<OrderSummaryBanner onOpenDetail={() => setIsDetailOpen(true)} />
					<div className="space-y-6 px-4">
						<div>
							<p className="mb-2 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
								Nombre del cliente o mesa
							</p>
							<NameInput />
						</div>
						<div>
							<p className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Agregar Productos</p>
							<ProductGrid />
						</div>
					</div>
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

const NameInput = () => {
	const { order, setOrder } = useRecepcionContext();
	return (
		<input
			type="text"
			placeholder="Ej: Mesa 5 o Juan Pérez"
			value={order.nameOrder}
			onChange={(e) => setOrder({ ...order, nameOrder: e.target.value })}
			className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-white placeholder-neutral-400 focus:border-indigo-500 focus:outline-none"
		/>
	);
};

export const EditOrderContainer = ({ orderId }: Props) => {
	const { isLoading, data: response } = useGetOrderById({
		id: orderId,
		queryOptions: { enabled: !!orderId, staleTime: 0, gcTime: 0 },
	});

	if (isLoading || !response?.data) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-neutral-400">Cargando orden...</p>
			</div>
		);
	}

	return (
		<EditOrderProvider key={orderId} initialOrder={response?.data} orderId={orderId}>
			<EditOrderContent />
		</EditOrderProvider>
	);
};
