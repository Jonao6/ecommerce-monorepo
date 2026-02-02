import {
	CreateAddressDocument,
	CreateAddressMutationVariables,
	CreateAddressMutation,
} from '@/gql/graphql';
import { useMutation } from '@apollo/client/react';
import { AddressState } from '../components/form/checkout-form';

type AddressResult =
	| { success: true; data: NonNullable<CreateAddressMutation['createAddress']> }
	| { success: false; error: Error };

export const useCreateUserAddress = () => {
	const [createAddressMutation, { loading, error: apolloError }] = useMutation<
		CreateAddressMutation,
		CreateAddressMutationVariables
	>(CreateAddressDocument);

	const createUserAddress = async ({
		address,
	}: {
		address: AddressState;
	}): Promise<AddressResult> => {
		return createAddressMutation({
			variables: {
				input: {
					street: address.street,
					city: address.city,
					postalCode: address.zap_code,
					streetNumber: address.street_number,
					complements: address.complements,
					neighbor: address.neighbor,
					state: address.state,
					country: 'Brasil',
				},
			},
		})
			.then(({ data }) => {
				if (!data?.createAddress?.id) {
					return {
						success: false,
						error: new Error('Retorno inválido ao criar endereço.'),
					} as const;
				}

				return { success: true, data: data.createAddress } as const;
			})
			.catch((err) => {
				return {
					success: false,
					error:
						err instanceof Error
							? err
							: new Error('Falha ao salvar o endereço de entrega.'),
				} as const;
			});
	};

	return { createUserAddress, loading, error: apolloError };
};
