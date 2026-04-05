import { useMutation } from "@tanstack/react-query";
import { UpdateOrderRequest } from "../interfaces";
import { updateOrderAction } from "../services";

export const useUpdateOrder = () => {
	const updateOrder = useMutation({
		mutationKey: ["update-order"],
		mutationFn: ({ id, body }: { id: string; body: UpdateOrderRequest }) => updateOrderAction(id, body),
	});

	return { updateOrder };
};
