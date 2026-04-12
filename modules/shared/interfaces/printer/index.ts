export interface PrintTicketRequest {
	orderId: string;
}

export interface PrintDirectTicketDto {
	nameOrder: string;
	items: {
		type: "DISH" | "DRINK";
		name: string;
		price: number;
		extras: string[];
		creams: string[];
		chargeDisposable: boolean;
	}[];
	totalPrice: number;
	disposableCharge?: number;
	exception?: string;
	momentaryTime?: string;
	paymentType?: "YAPE" | "PLIN" | "EFECTIVO";
	type: "TABLE" | "DELIVERY" | "PICKUP";
}
