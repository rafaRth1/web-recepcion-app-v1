import { useMutation } from "@tanstack/react-query";
import { printReceiptAction } from "../../services/printer";

export const usePrintReceipt = () => {
	const printReceipt = useMutation({
		mutationKey: ["print-receipt"],
		mutationFn: (orderId: string) => printReceiptAction(orderId),
	});

	return { printReceipt };
};
