import {
	CreatePaymentIntentDocument,
	CreatePaymentIntentMutation,
	CreatePaymentIntentMutationVariables,
} from '@/gql/graphql';
import { useMutation } from '@apollo/client/react';

type PaymentIntentResult =
	| { success: true; secret: string }
	| { success: false; error: Error };

export const useCreatePaymentIntent = () => {
	const [mutate, { loading, error: apolloError }] = useMutation<
		CreatePaymentIntentMutation,
		CreatePaymentIntentMutationVariables
	>(CreatePaymentIntentDocument);

	const createUserPaymentIntent = async ({
		orderId,
		amount,
	}: {
		orderId: string;
		amount: number;
	}): Promise<PaymentIntentResult> => {
		return mutate({
			variables: {
				input: { orderId, amount },
			},
		})
			.then(({ data }) => {
				const secret = data?.createPaymentIntent?.clientSecret;

				if (!secret) {
					return {
						success: false,
						error: new Error(
							'O gateway de pagamento não retornou uma chave válida.',
						),
					} as const;
				}

				return { success: true, secret } as const;
			})
			.catch((err) => {
				return {
					success: false,
					error:
						err instanceof Error
							? err
							: new Error('Erro desconhecido ao criar pagamento'),
				} as const;
			});
	};

	return {
		createUserPaymentIntent,
		loading,
		error: apolloError,
	};
};
