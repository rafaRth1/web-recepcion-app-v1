import { Button } from "@heroui/react";
import { UtensilsCrossed, Car, ShoppingBag, AlertCircle } from "lucide-react";
import { Order, OrderType } from "../../../interfaces";

const TYPE_ICON: Record<OrderType, React.ReactNode> = {
	TABLE: <UtensilsCrossed size={14} />,
	DELIVERY: <Car size={14} />,
	PICKUP: <ShoppingBag size={14} />,
};

const TYPE_LABEL: Record<OrderType, string> = {
	TABLE: "Mesa",
	DELIVERY: "Delivery",
	PICKUP: "Recojo",
};

const PAYMENT_STYLE: Record<string, string> = {
	YAPE: "bg-purple-500/20 text-purple-400",
	PLIN: "bg-cyan-500/20 text-cyan-400",
	EFECTIVO: "bg-green-500/20 text-green-400",
};

interface Props {
	order: Order;
	onPress: () => void;
}

export const OrderCard = ({ order, onPress }: Props) => {
	return (
		<div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
			{/* Header */}
			<div className="mb-3 flex items-start justify-between">
				<div>
					<h3 className="font-semibold text-neutral-100 capitalize">{order.nameOrder}</h3>
					<div className="mt-1 flex items-center gap-2">
						<span className="flex items-center gap-1 text-xs text-neutral-400">
							{TYPE_ICON[order.type]}
							{TYPE_LABEL[order.type]}
						</span>
						{order.paymentType && (
							<span className={`rounded px-2 py-0.5 text-xs ${PAYMENT_STYLE[order.paymentType]}`}>
								{order.paymentType}
							</span>
						)}
					</div>
				</div>
				<div className="text-right">
					<p className="text-xl font-bold text-indigo-400">S/ {order.totalPrice.toFixed(2)}</p>
					<p className="mt-1 text-xs text-neutral-500">{order.momentaryTime}</p>
				</div>
			</div>

			{/* Items */}
			<p className="mb-3 text-sm text-neutral-400">
				{order.items.length} item{order.items.length !== 1 ? "s" : ""}
			</p>

			{/* Excepción */}
			{order.exception && (
				<div className="mb-3 flex items-center gap-2 rounded-lg border border-yellow-700/30 bg-yellow-900/20 p-2">
					<AlertCircle size={14} className="shrink-0 text-yellow-400" />
					<p className="text-xs text-yellow-400">{order.exception}</p>
				</div>
			)}

			{/* Botón */}
			<Button className="w-full" onPress={onPress}>
				Ver detalle
			</Button>
		</div>
	);
};
