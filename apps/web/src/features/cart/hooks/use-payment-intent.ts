import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import {
	CreatePaymentIntentDocument,
	CreatePaymentIntentMutation,
	CreatePaymentIntentMutationVariables,
} from '@/gql/graphql';

export const usePaymentIntentMutation = () => {
	const [mutate, { loading, error }] = useMutation<
		CreatePaymentIntentMutation,
		CreatePaymentIntentMutationVariables
	>(CreatePaymentIntentDocument);

	const createPaymentIntentMutation = useCallback(
		(input: { orderId: string; amount: number }) => {
			return mutate({
				variables: { input },
			});
		},
		[mutate],
	);

	return {
		createPaymentIntentMutation,
		loading,
		error,
	};
};

export type PaymentIntentResult =
	| { success: true; secret: string }
	| { success: false; error: Error };

export const useCreatePaymentIntent = () => {
	const { createPaymentIntentMutation, loading, error } =
		usePaymentIntentMutation();

	const createPaymentIntent = async ({
		orderId,
		amount,
	}: {
		orderId: string;
		amount: number;
	}): Promise<PaymentIntentResult> => {
		try {
			const { data } = await createPaymentIntentMutation({ orderId, amount });
			const secret = data?.createPaymentIntent?.clientSecret;

			if (!secret) {
				return {
					success: false,
					error: new Error(
						'O gateway de pagamento não retornou uma chave válida.',
					),
				};
			}

			return { success: true, secret };
		} catch (err) {
			return {
				success: false,
				error:
					err instanceof Error
						? err
						: new Error('Erro desconhecido ao criar pagamento'),
			};
		}
	};

	return {
		createPaymentIntent,
		loading,
		error,
	};
};
