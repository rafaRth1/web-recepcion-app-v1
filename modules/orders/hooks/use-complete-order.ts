import { useMutation } from "@tanstack/react-query";
import { completeOrderAction } from "../services";

export const useCompleteOrder = () => {
	const completeOrder = useMutation({
		mutationKey: ["complete-order"],
		mutationFn: (id: string) => completeOrderAction(id),
	});

	return { completeOrder };
};
