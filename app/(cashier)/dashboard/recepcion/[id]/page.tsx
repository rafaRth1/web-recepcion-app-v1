import { EditOrderContainer } from "@/modules/orders/components/edit-order-container";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function EditOrderPage({ params }: Props) {
	const { id } = await params;
	return <EditOrderContainer orderId={id} />;
}
