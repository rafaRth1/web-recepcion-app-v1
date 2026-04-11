"use client";

import { Input, Label, ListBox, Select, TextField } from "@heroui/react";
import { OrderStatus, DeliveryStatus, OrderType, PaymentType } from "../../../interfaces";
import { DELIVERY_STATUS_LABEL, ORDER_STATUS_LABEL, ORDER_TYPE_LABEL, PAYMENT_TYPE_LABEL } from "../../../constants";

interface OrdersFiltersBarProps {
	search: string;
	onSearchChange: (value: string) => void;
	selectedPaymentType: PaymentType | "all";
	onPaymentTypeChange: (value: PaymentType | "all") => void;
	selectedStatus: OrderStatus | "all";
	onStatusChange: (value: OrderStatus | "all") => void;
	selectedDeliveryStatus: DeliveryStatus | "all";
	onDeliveryStatusChange: (value: DeliveryStatus | "all") => void;
	selectedType: OrderType | "all";
	onTypeChange: (value: OrderType | "all") => void;
	startDate: string;
	onStartDateChange: (value: string) => void;
	endDate: string;
	onEndDateChange: (value: string) => void;
}

export const OrdersFiltersBar = ({
	search,
	onSearchChange,
	selectedPaymentType,
	onPaymentTypeChange,
	selectedStatus,
	onStatusChange,
	selectedDeliveryStatus,
	onDeliveryStatusChange,
	selectedType,
	onTypeChange,
	startDate,
	onStartDateChange,
	endDate,
	onEndDateChange,
}: OrdersFiltersBarProps) => {
	return (
		<div className="flex flex-wrap items-end gap-4">
			<TextField value={search} onChange={onSearchChange} className="w-64">
				<Label>Buscar</Label>
				<Input placeholder="Buscar orden..." />
			</TextField>

			<Select
				value={selectedType}
				onChange={(val) => onTypeChange(val as OrderType | "all")}
				placeholder="Todos"
				className="w-40"
			>
				<Label>Tipo</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						<ListBox.Item id="all" textValue="Todos">
							Todos
							<ListBox.ItemIndicator />
						</ListBox.Item>
						{Object.entries(ORDER_TYPE_LABEL).map(([value, label]) => (
							<ListBox.Item key={value} id={value} textValue={label}>
								{label}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			<Select
				value={selectedStatus}
				onChange={(val) => onStatusChange(val as OrderStatus | "all")}
				placeholder="Todos"
				className="w-44"
			>
				<Label>Estado</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						<ListBox.Item id="all" textValue="Todos">
							Todos
							<ListBox.ItemIndicator />
						</ListBox.Item>
						{Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
							<ListBox.Item key={value} id={value} textValue={label}>
								{label}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			<Select
				value={selectedDeliveryStatus}
				onChange={(val) => onDeliveryStatusChange(val as DeliveryStatus | "all")}
				placeholder="Todos"
				className="w-44"
			>
				<Label>Entrega</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						<ListBox.Item id="all" textValue="Todos">
							Todos
							<ListBox.ItemIndicator />
						</ListBox.Item>
						{Object.entries(DELIVERY_STATUS_LABEL).map(([value, label]) => (
							<ListBox.Item key={value} id={value} textValue={label}>
								{label}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			<Select
				value={selectedPaymentType}
				onChange={(val) => onPaymentTypeChange(val as PaymentType | "all")}
				placeholder="Todos"
				className="w-44"
			>
				<Label>Pago</Label>
				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>
				<Select.Popover>
					<ListBox>
						<ListBox.Item id="all" textValue="Todos">
							Todos
							<ListBox.ItemIndicator />
						</ListBox.Item>
						{Object.entries(PAYMENT_TYPE_LABEL).map(([value, label]) => (
							<ListBox.Item key={value} id={value} textValue={label}>
								{label}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>
			</Select>

			<TextField value={startDate} onChange={onStartDateChange} className="w-44" type="date">
				<Label>Fecha inicio</Label>
				<Input />
			</TextField>

			<TextField value={endDate} onChange={onEndDateChange} className="w-44" type="date">
				<Label>Fecha fin</Label>
				<Input />
			</TextField>
		</div>
	);
};
