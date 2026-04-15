import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import {
	CreateOrderDocument,
	CreateOrderInput,
	CreateOrderMutation,
	CreateOrderMutationVariables,
} from '@/gql/graphql';
import type { CartItem } from '@/interfaces/store.interface';

export const useOrderMutation = () => {
	const [mutate, { loading }] = useMutation<
		CreateOrderMutation,
		CreateOrderMutationVariables
	>(CreateOrderDocument);

	const createOrderMutation = useCallback(
		(input: CreateOrderInput) => {
			return mutate({
				variables: { input },
			});
		},
		[mutate],
	);

	return {
		createOrderMutation,
		loading,
	};
};

export const mapCartItemsToOrderInput = (
	items: CartItem[],
): CreateOrderInput['items'] => {
	return items.map((item) => ({
		productId: item.id,
		quantity: item.quantity,
		color: item.color,
		size: item.size,
	}));
};

export type OrderResult =
	| { success: true; orderId: string }
	| { success: false; error: Error };

export const useCreateOrder = () => {
	const { createOrderMutation, loading } = useOrderMutation();

	const createOrder = async ({
		items,
		total,
	}: {
		items: CartItem[];
		total: number;
	}): Promise<OrderResult> => {
		const orderInput: CreateOrderInput = {
			totalAmount: total,
			items: mapCartItemsToOrderInput(items),
		};

		try {
			const { data } = await createOrderMutation(orderInput);
			const orderId = data?.createOrder?.id;

			if (!orderId) {
				return {
					success: false,
					error: Error('Pedido criado sem ID.'),
				};
			}
			return {
				success: true,
				orderId,
			};
		} catch (err) {
			return {
				success: false,
				error: err instanceof Error ? err : Error('Erro ao processar pedido'),
			};
		}
	};

	return { createOrder, loading };
};
