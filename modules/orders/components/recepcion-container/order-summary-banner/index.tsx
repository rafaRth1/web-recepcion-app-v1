"use client";

import { useRecepcionContext } from "@/modules/orders/context/recepcion-context";

interface Props {
	onOpenDetail: () => void;
}

export const OrderSummaryBanner = ({ onOpenDetail }: Props) => {
	const { order } = useRecepcionContext();

	const totalItems = order.items.length;
	const previewItems = order.items.slice(0, 3).map((item) => item.name);

	return (
		<div
			onClick={onOpenDetail}
			className="sticky top-0 z-40 mx-4 mb-4 cursor-pointer rounded-xl bg-linear-to-r from-green-700 to-green-600 p-3 shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-xl">🛒</span>
					<span className="text-sm font-semibold text-white">Pedido</span>
					<span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
						{totalItems} {totalItems === 1 ? "item" : "items"}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xl font-bold text-white">S/ {order.totalPrice.toFixed(2)}</span>
					<span className="text-sm text-white/70">▼</span>
				</div>
			</div>

			{/* Preview */}
			<div className="mt-2 flex flex-wrap gap-2">
				{totalItems === 0 ? (
					<span className="text-xs text-white/60">Toca para ver detalles</span>
				) : (
					<>
						{previewItems.map((name, idx) => (
							<span
								key={idx}
								className="max-w-30 truncate rounded-lg bg-white/15 px-2 py-0.5 text-xs text-white capitalize"
							>
								{name}
							</span>
						))}
						{totalItems > 3 && (
							<span className="rounded-lg bg-white/15 px-2 py-0.5 text-xs text-white">+{totalItems - 3} más</span>
						)}
					</>
				)}
			</div>
		</div>
	);
};
