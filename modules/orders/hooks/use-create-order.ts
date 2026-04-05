import { useMutation } from "@tanstack/react-query";
import { createOrderAction } from "../services";

export const useCreateOrder = () => {
	const createOrder = useMutation({
		mutationKey: ["create-order"],
		mutationFn: createOrderAction,
	});

	return { createOrder };
};
