"use client";

import { useRecepcionContext } from "@/modules/orders/context/recepcion-context";
import { initialLocalOrder, OrderItem } from "@/modules/orders/interfaces";
import { Button, Modal, toast } from "@heroui/react";
import { Trash, Settings, AlertCircle, CheckCircle } from "lucide-react";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onOpenExtras: (index: number) => void;
}

const PAYMENT_OPTIONS = [
	{ key: "YAPE", label: "Yape", emoji: "💜", activeClass: "bg-purple-600/20 border-purple-500" },
	{ key: "PLIN", label: "Plin", emoji: "💙", activeClass: "bg-cyan-600/20 border-cyan-500" },
	{ key: "EFECTIVO", label: "Efectivo", emoji: "💵", activeClass: "bg-green-600/20 border-green-500" },
] as const;

export const ModalOrderDetail = ({ isOpen, onClose, onOpenExtras }: Props) => {
	const { order, setOrder, handleSaveOrder } = useRecepcionContext();

	const hasItems = order.items.length > 0;
	const showPayment = order.type === "DELIVERY" || order.type === "PICKUP";

	const handleRemoveItem = (index: number) => {
		const removed = order.items[index];
		const updatedItems = order.items.filter((_, i) => i !== index);
		setOrder({
			...order,
			items: updatedItems,
			totalPrice: order.totalPrice - removed.price,
		});
	};

	const handleGenerate = () => {
		if (showPayment && !order.paymentType) {
			toast.danger("Selecciona un tipo de pago");
			return;
		}

		toast.success("Pedido generado revisar en pendientes");
		handleSaveOrder();
		onClose();
	};

	const handleStopEditing = () => {
		setOrder(initialLocalOrder);
		onClose();
	};

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
				<Modal.Container size="lg" scroll="inside">
					<Modal.Dialog className="bg-neutral-900">
						<Modal.Header className="border-b border-neutral-800">
							<div className="flex items-center gap-2">
								<span className="text-xl">📋</span>
								<span>Detalle del Pedido</span>
							</div>
						</Modal.Header>

						<Modal.Body className="py-4">
							{!hasItems ? (
								<div className="py-8 text-center">
									<div className="mb-3 text-6xl">🛒</div>
									<p className="font-medium text-neutral-400">Pedido vacío</p>
									<p className="mt-1 text-sm text-neutral-500">Agrega productos para comenzar</p>
								</div>
							) : (
								<div className="space-y-3">
									{/* Items */}
									{order.items.map((item: OrderItem, index: number) => (
										<div key={index} className="rounded-lg bg-neutral-800 p-3">
											<div className="mb-2 flex items-start justify-between">
												<p className="flex-1 font-medium capitalize">{item.name}</p>
												<p className="ml-2 font-semibold text-indigo-400">S/ {item.price.toFixed(2)}</p>
											</div>

											{/* Extras — solo DISH */}
											{item.type === "DISH" && (
												<div className="mb-3 flex gap-3 text-xs text-neutral-400">
													<span>🍚 Arroz: {item.extras.includes("rice") ? "Sí" : "No"}</span>
													<span>🥗 Ensalada: {item.extras.includes("salad") ? "Sí" : "No"}</span>
													{item.creams.length > 0 && <span>🧴 {item.creams.join(", ")}</span>}
												</div>
											)}

											<div className="flex gap-2">
												{item.type === "DISH" && (
													<Button
														size="sm"
														className="flex-1 bg-indigo-600 text-white"
														onPress={() => onOpenExtras(index)}
													>
														<Settings size={14} />
														Extras
													</Button>
												)}
												<Button
													isIconOnly
													size="sm"
													className="bg-red-900/50 hover:bg-red-900"
													onPress={() => handleRemoveItem(index)}
												>
													<Trash size={16} className="text-red-400" />
												</Button>
											</div>
										</div>
									))}

									{/* Observación */}
									<div>
										<p className="mb-2 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Observación</p>
										<textarea
											placeholder="Ej: Sin cebolla, extra picante..."
											value={order.exception}
											onChange={(e) => setOrder({ ...order, exception: e.target.value })}
											className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm text-white placeholder-neutral-400 focus:border-indigo-500 focus:outline-none"
											rows={3}
										/>
									</div>
								</div>
							)}
						</Modal.Body>

						<Modal.Footer className="flex-col gap-3 border-t border-neutral-800">
							{/* Tipo de pago */}
							{showPayment && hasItems && (
								<div className="w-full">
									<p className="mb-2 text-sm font-semibold text-neutral-400 uppercase">💳 Tipo de Pago</p>
									<div className="grid grid-cols-3 gap-2">
										{PAYMENT_OPTIONS.map((option) => (
											<button
												key={option.key}
												onClick={() => setOrder({ ...order, paymentType: option.key })}
												className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all duration-200 ${
													order.paymentType === option.key ? option.activeClass : "border-neutral-700 bg-neutral-800"
												} `}
											>
												<span className="text-2xl">{option.emoji}</span>
												<span className="text-xs font-semibold">{option.label}</span>
											</button>
										))}
									</div>
								</div>
							)}

							{/* Advertencia pago */}
							{showPayment && hasItems && !order.paymentType && (
								<div className="flex w-full items-center gap-2 rounded-lg border border-yellow-700/50 bg-yellow-900/20 p-2">
									<AlertCircle className="text-yellow-400" size={16} />
									<p className="text-xs text-yellow-400">Selecciona un tipo de pago para continuar</p>
								</div>
							)}

							{/* Botón generar */}
							<Button className="w-full" variant="primary" isDisabled={!hasItems} onPress={handleGenerate}>
								<CheckCircle size={20} />
								{order.id ? "Actualizar Pedido" : "Generar Pedido"}
							</Button>

							{/* Dejar de editar */}
							{order.id && (
								<Button className="w-full bg-orange-600 hover:bg-orange-500" onPress={handleStopEditing}>
									Dejar de editar
								</Button>
							)}
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};
