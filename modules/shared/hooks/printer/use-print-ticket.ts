import { useMutation } from "@tanstack/react-query";
import { printTicketAction } from "../../services/printer";

export const usePrintTicket = () => {
	const printTicket = useMutation({
		mutationKey: ["print-ticket"],
		mutationFn: printTicketAction,
	});

	return { printTicket };
};
