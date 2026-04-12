"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Product } from "@/modules/shared/interfaces/product";
import { useGetAllCategories } from "@/modules/shared/hooks/category/use-get-all-categories";
import { useGetProducts } from "@/modules/shared/hooks/product/use-get-products";
import { OrderItem } from "@/modules/orders/interfaces";
import { useRecepcionContext } from "@/modules/orders/context/recepcion-context";

export const ProductGrid = () => {
	const { addItem } = useRecepcionContext();
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearch = useDebounce(searchTerm, 500);

	const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetAllCategories();
	const categories = categoriesResponse?.data ?? [];

	const { data: productsResponse, isLoading: isLoadingProducts } = useGetProducts({
		params: {
			categorySlug: selectedCategory === "all" ? undefined : selectedCategory,
			status: "ACTIVE",
			search: debouncedSearch || undefined,
		},
		queryOptions: {
			staleTime: 1000 * 60 * 5,
		},
	});
	const products = productsResponse?.data ?? [];

	const handleClickProduct = (product: Product) => {
		const item: OrderItem = {
			type: product.type,
			name: product.name,
			price: product.price,
			extras: [],
			creams: [],
			chargeDisposable: false,
		};
		addItem(item);
	};

	return (
		<div className="space-y-4">
			{/* Search */}
			<div className="relative">
				<Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400" />
				<input
					placeholder="Buscar productos..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-2 pr-4 pl-9 text-sm text-white placeholder-neutral-400 focus:border-indigo-500 focus:outline-none"
				/>
			</div>

			{/* Category tabs */}
			<div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
				<button
					onClick={() => setSelectedCategory("all")}
					className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
						selectedCategory === "all" ? "bg-indigo-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
					} `}
				>
					🍽️ Todos
				</button>

				{!isLoadingCategories &&
					categories.map((cat) => (
						<button
							key={cat._id}
							onClick={() => setSelectedCategory(cat.slug)}
							className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
								selectedCategory === cat.slug
									? "bg-indigo-600 text-white"
									: "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
							} `}
						>
							{cat.icon && <span className="mr-1">{cat.icon}</span>}
							{cat.name}
						</button>
					))}
			</div>

			{/* Grid */}
			{isLoadingProducts ? (
				<div className="grid grid-cols-3 gap-2">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} className="h-24 animate-pulse rounded-lg bg-neutral-800 p-3" />
					))}
				</div>
			) : products.length > 0 ? (
				<div className="grid grid-cols-3 gap-2">
					{products.map((product) => (
						<button
							key={product._id}
							onClick={() => handleClickProduct(product)}
							className="relative rounded-lg border-2 border-transparent bg-neutral-800 p-2 transition-all duration-200 hover:border-indigo-600 hover:bg-neutral-700 active:scale-95"
						>
							<div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
								+
							</div>
							<p className="mb-1 line-clamp-2 pr-6 text-left text-xs font-medium capitalize">{product.name}</p>
							<p className="text-left text-sm font-semibold text-green-400">S/ {product.price.toFixed(2)}</p>
						</button>
					))}
				</div>
			) : (
				<div className="rounded-lg bg-neutral-800 p-6 text-center">
					<p className="text-sm text-neutral-500">No hay productos</p>
				</div>
			)}
		</div>
	);
};
