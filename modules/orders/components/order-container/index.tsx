"use client";

import { useState } from "react";
import { useGetOrders } from "../../hooks/use-get-orders";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Order, OrderType } from "../../interfaces";
import { OrderCard } from "./order-card";
import { OrderDetailModal } from "./order-detail-modal";

const TABS: { key: "all" | OrderType; label: string }[] = [
	{ key: "all", label: "Todas" },
	{ key: "TABLE", label: "Mesa" },
	{ key: "DELIVERY", label: "Delivery" },
	{ key: "PICKUP", label: "Recojo" },
];

export const OrderContainer = () => {
	const [selectedTab, setSelectedTab] = useState<"all" | OrderType>("all");
	const [search, setSearch] = useState("");
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const debouncedSearch = useDebounce(search, 400);

	const { data: response, isLoading } = useGetOrders({
		queryOptions: {},
	});

	const orders = response?.data ?? [];

	const processOrders = orders.filter((o) => o.status === "PROCESS");

	const stats = {
		total: processOrders.length,
		table: processOrders.filter((o) => o.type === "TABLE").length,
		delivery: processOrders.filter((o) => o.type === "DELIVERY").length,
		pickup: processOrders.filter((o) => o.type === "PICKUP").length,
	};

	const filtered = processOrders.filter((o) => {
		const matchesTab = selectedTab === "all" || o.type === selectedTab;
		const matchesSearch = o.nameOrder.toLowerCase().includes(debouncedSearch.toLowerCase());
		return matchesTab && matchesSearch;
	});

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Stats */}
			<div className="grid grid-cols-4 gap-3 p-4">
				{[
					{ label: "Total", value: stats.total, color: "text-neutral-100" },
					{ label: "Mesa", value: stats.table, color: "text-indigo-400" },
					{ label: "Delivery", value: stats.delivery, color: "text-orange-400" },
					{ label: "Recojo", value: stats.pickup, color: "text-green-400" },
				].map((stat) => (
					<div key={stat.label} className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-center">
						<p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
						<p className="mt-1 text-xs text-neutral-400">{stat.label}</p>
					</div>
				))}
			</div>

			{/* Tabs */}
			<div className="flex gap-1 border-b border-neutral-800 px-4">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setSelectedTab(tab.key)}
						className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
							selectedTab === tab.key
								? "border-indigo-500 text-indigo-400"
								: "border-transparent text-neutral-400 hover:text-neutral-200"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Search */}
			<div className="px-4 py-3">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar por nombre..."
					className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-indigo-500"
				/>
			</div>

			{/* Lista */}
			<div className="flex-1 overflow-y-auto px-4 pb-6">
				{isLoading ? (
					<p className="py-12 text-center text-neutral-400">Cargando órdenes...</p>
				) : filtered.length === 0 ? (
					<p className="py-12 text-center text-neutral-500">No hay órdenes</p>
				) : (
					<div className="space-y-3">
						{filtered.map((order) => (
							<OrderCard key={order._id} order={order} onPress={() => setSelectedOrder(order)} />
						))}
					</div>
				)}
			</div>

			{/* Modal */}
			<OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
		</div>
	);
};
