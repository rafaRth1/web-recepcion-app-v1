"use client";

import { Input, Label, ListBox, Select, Slider, TextField } from "@heroui/react";
import { CategoryOption } from "../../../domain/product";
import { Status } from "@/shared/types/status";
import { Key } from "react";

interface ProductFiltersBarProps {
	search: string;
	onSearchChange: (value: string) => void;
	selectedCategoryId: string;
	onCategoryChange: (value: Key | null) => void;
	priceRange: [number, number];
	onPriceRangeChange: (value: [number, number]) => void;
	selectedStatus: Status | "all";
	onStatusChange: (value: Status | "all") => void;
	categories: CategoryOption[];
}

export const ProductFiltersBar = ({
	search,
	onSearchChange,
	selectedCategoryId,
	onCategoryChange,
	priceRange,
	onPriceRangeChange,
	selectedStatus,
	onStatusChange,
	categories,
}: ProductFiltersBarProps) => {
	return (
		<div className="flex flex-wrap items-end gap-4">
			<TextField value={search} onChange={onSearchChange} className="w-64">
				<Label>Buscar</Label>
				<Input placeholder="Buscar producto..." />
			</TextField>

			<Select value={selectedCategoryId} onChange={onCategoryChange} placeholder="Todas" className="w-48">
				<Label>Categoría</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						<ListBox.Item id="" textValue="Todas">
							Todas
							<ListBox.ItemIndicator />
						</ListBox.Item>
						{categories.map((cat) => (
							<ListBox.Item key={cat._id} id={cat._id} textValue={cat.name}>
								{cat.name}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			<Select
				value={selectedStatus}
				onChange={(val) => onStatusChange(val as Status | "all")}
				placeholder="Todos"
				className="w-40"
			>
				<Label>Estado</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						<ListBox.Item id="all" textValue="Todos">
							Todos <ListBox.ItemIndicator />
						</ListBox.Item>
						<ListBox.Item id={"ACTIVE"} textValue="Activo">
							Activo <ListBox.ItemIndicator />
						</ListBox.Item>
						<ListBox.Item id={"INACTIVE"} textValue="Inactivo">
							Inactivo <ListBox.ItemIndicator />
						</ListBox.Item>
					</ListBox>
				</Select.Popover>
			</Select>

			<Slider
				value={priceRange}
				onChange={(val) => onPriceRangeChange(val as [number, number])}
				minValue={0}
				maxValue={500}
				step={10}
				formatOptions={{ style: "currency", currency: "PEN" }}
				className="w-64"
			>
				<Label>Rango de precio</Label>
				<Slider.Output />
				<Slider.Track>
					{({ state }) => (
						<>
							<Slider.Fill />
							{state.values.map((_, i) => (
								<Slider.Thumb key={i} index={i} />
							))}
						</>
					)}
				</Slider.Track>
			</Slider>
		</div>
	);
};
