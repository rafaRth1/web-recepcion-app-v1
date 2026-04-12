import { useMutation } from "@tanstack/react-query";
import { printDirectTicketAction } from "../../services/printer";

export const usePrintDirectTicket = () => {
	const printDirectTicket = useMutation({
		mutationKey: ["print-direct-ticket"],
		mutationFn: printDirectTicketAction,
	});

	return { printDirectTicket };
};
