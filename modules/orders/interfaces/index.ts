export type OrderItemType = "DISH" | "DRINK";
export type OrderType = "TABLE" | "DELIVERY" | "PICKUP";
export type OrderStatus = "COMPLETED" | "PROCESS" | "CANCELLED";
export type DeliveryStatus = "COMPLETED" | "PROCESS" | "CANCELLED";
export type PaymentType = "YAPE" | "PLIN" | "EFECTIVO";

export interface OrderItem {
	type: OrderItemType;
	name: string;
	price: number;
	extras: string[];
	creams: string[];
}

export interface Order {
	_id: string;
	nameOrder: string;
	items: OrderItem[];
	totalPrice: number;
	exception: string;
	momentaryTime: string;
	paymentType: PaymentType;
	status: OrderStatus;
	deliveryStatus: DeliveryStatus;
	type: OrderType;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateOrderRequest {
	nameOrder: string;
	items: OrderItem[];
	exception?: string;
	momentaryTime?: string;
	paymentType?: PaymentType;
	type: OrderType;
}

export interface UpdateOrderRequest {
	nameOrder?: string;
	items?: OrderItem[];
	totalPrice?: number;
	exception?: string;
	momentaryTime?: string;
	paymentType?: PaymentType;
	status?: OrderStatus;
	deliveryStatus?: DeliveryStatus;
	type?: OrderType;
}

// Estado local del pedido en construcción (no viene del backend)
export interface LocalOrder {
	id: string; // uuid local, nunca va al backend
	nameOrder: string;
	items: OrderItem[];
	totalPrice: number;
	exception: string;
	paymentType: PaymentType | "";
	type: OrderType;
}

export const initialLocalOrder: LocalOrder = {
	id: "",
	nameOrder: "",
	items: [],
	totalPrice: 0,
	exception: "",
	paymentType: "",
	type: "TABLE",
};

export interface GetOrdersPaginatedParams {
	page: number;
	limit: number;
	search?: string;
	paymentType?: PaymentType;
	status?: OrderStatus;
	deliveryStatus?: DeliveryStatus;
	type?: OrderType;
	startDate?: string;
	endDate?: string;
}
