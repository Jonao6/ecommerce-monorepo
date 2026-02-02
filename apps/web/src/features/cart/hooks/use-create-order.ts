import { useMutation } from '@apollo/client/react';
import { CartItem } from '@/store/cart-store';
import {
	CreateOrderDocument,
	CreateOrderInput,
	CreateOrderMutation,
	CreateOrderMutationVariables,
} from '@/gql/graphql';

interface CreateOrderParams {
	userId: string;
	items: CartItem[];
	total: number;
}

type OrderResult =
	| { success: true; orderId: string }
	| { success: false; error: Error };

export const useCreateOrder = () => {
	const [mutate, { loading }] = useMutation<
		CreateOrderMutation,
		CreateOrderMutationVariables
	>(CreateOrderDocument);

	const createOrder = async ({
		items,
		total,
	}: CreateOrderParams): Promise<OrderResult> => {
		const orderInput: CreateOrderInput = {
			totalAmount: total,
			items: items.map((item) => ({
				productId: item.id,
				quantity: item.quantity,
				color: item.color,
				size: item.size,
			})),
		};

		return mutate({
			variables: { input: orderInput },
		})
			.then(({ data }) => {
				const orderId = data?.createOrder?.id;

				if (!orderId) {
					return {
						success: false,
						error: Error('Pedido criado sem ID.'),
					} as const;
				}
				return {
					success: true,
					orderId: orderId,
				} as const;
			})
			.catch((err) => {
				return {
					success: false,
					error: err instanceof Error ? err : Error('Erro ao processar pedido'),
				} as const;
			});
	};

	return { createOrder, loading };
};
