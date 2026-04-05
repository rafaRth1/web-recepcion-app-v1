"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { OrderItem } from "@/modules/orders/interfaces";
import { useRecepcionContext } from "@/modules/orders/context/recepcion-context";

const CREMAS_DISPONIBLES = [
	{ key: "mayonesa", name: "Mayonesa" },
	{ key: "ketchup", name: "Ketchup" },
	{ key: "mostaza", name: "Mostaza" },
	{ key: "golf", name: "Golf" },
	{ key: "aceituna", name: "Aceituna" },
	{ key: "tartara", name: "Tártara" },
	{ key: "aji", name: "Ají" },
	{ key: "rocoto", name: "Rocoto" },
];

interface Props {
	isOpen: boolean;
	onClose: () => void;
	itemIndex: number | null;
}

export const ModalItemExtras = ({ isOpen, onClose, itemIndex }: Props) => {
	const { order, setOrder } = useRecepcionContext();

	const item: OrderItem | null = itemIndex !== null ? (order.items[itemIndex] ?? null) : null;

	const [localExtras, setLocalExtras] = useState<string[]>(() => item?.extras ?? []);
	const [localCreams, setLocalCreams] = useState<string[]>(() => item?.creams ?? []);

	const toggleExtra = (key: string) => {
		setLocalExtras((prev) => (prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]));
	};

	const toggleCream = (key: string) => {
		setLocalCreams((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
	};

	const handleSave = () => {
		if (itemIndex === null) return;

		const updatedItems = order.items.map((i, idx) =>
			idx === itemIndex ? { ...i, extras: localExtras, creams: localCreams } : i
		);

		setOrder({ ...order, items: updatedItems });
		onClose();
	};

	const handleCancel = () => {
		if (item) {
			setLocalExtras(item.extras);
			setLocalCreams(item.creams);
		}
		onClose();
	};

	if (!item) return null;

	return (
		<Modal>
			<Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleCancel()}>
				<Modal.Container size="md" scroll="inside">
					<Modal.Dialog className="bg-neutral-900">
						<Modal.Header className="border-b border-neutral-800">
							<div>
								<p className="text-lg font-semibold">Editar Extras</p>
								<p className="text-sm font-normal text-neutral-400 capitalize">{item.name}</p>
							</div>
						</Modal.Header>

						<Modal.Body className="py-6">
							{/* Acompañamientos — solo DISH */}
							{item.type === "DISH" && (
								<div className="mb-6">
									<p className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Acompañamientos</p>
									<div className="space-y-3">
										{/* Arroz */}
										<button
											onClick={() => toggleExtra("rice")}
											className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all duration-200 ${
												localExtras.includes("rice")
													? "border-indigo-600 bg-indigo-600/20 text-indigo-400"
													: "border-neutral-700 bg-neutral-800 text-neutral-400"
											} `}
										>
											<span className="text-sm font-medium">🍚 Arroz</span>
											<div
												className={`relative h-6 w-12 rounded-full transition-all duration-200 ${localExtras.includes("rice") ? "bg-indigo-600" : "bg-neutral-600"}`}
											>
												<div
													className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 ${localExtras.includes("rice") ? "right-1" : "left-1"}`}
												/>
											</div>
										</button>

										{/* Ensalada */}
										<button
											onClick={() => toggleExtra("salad")}
											className={`flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all duration-200 ${
												localExtras.includes("salad")
													? "border-green-600 bg-green-600/20 text-green-400"
													: "border-neutral-700 bg-neutral-800 text-neutral-400"
											} `}
										>
											<span className="text-sm font-medium">🥗 Ensalada</span>
											<div
												className={`relative h-6 w-12 rounded-full transition-all duration-200 ${localExtras.includes("salad") ? "bg-green-600" : "bg-neutral-600"}`}
											>
												<div
													className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-200 ${localExtras.includes("salad") ? "right-1" : "left-1"}`}
												/>
											</div>
										</button>
									</div>
								</div>
							)}

							{/* Cremas — solo DISH */}
							{item.type === "DISH" && (
								<div>
									<p className="mb-3 text-xs font-semibold tracking-wide text-neutral-400 uppercase">Cremas y Salsas</p>
									<div className="grid grid-cols-2 gap-2">
										{CREMAS_DISPONIBLES.map((crema) => (
											<button
												key={crema.key}
												onClick={() => toggleCream(crema.key)}
												className={`rounded-lg border-2 p-3 text-xs font-medium transition-all duration-200 ${
													localCreams.includes(crema.key)
														? "border-indigo-600 bg-indigo-600 text-white"
														: "border-neutral-700 bg-neutral-800 text-neutral-400"
												} `}
											>
												{crema.name}
											</button>
										))}
									</div>
									<div className="mt-3 grid grid-cols-2 gap-2">
										<Button variant="secondary" onPress={() => setLocalCreams(CREMAS_DISPONIBLES.map((c) => c.key))}>
											Todas
										</Button>
										<Button variant="secondary" onPress={() => setLocalCreams([])}>
											Ninguna
										</Button>
									</div>
								</div>
							)}
						</Modal.Body>

						<Modal.Footer className="gap-2 border-t border-neutral-800">
							<Button className="flex-1" variant="tertiary" onPress={handleCancel}>
								Cancelar
							</Button>
							<Button className="flex-1" variant="primary" onPress={handleSave}>
								Guardar
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};
