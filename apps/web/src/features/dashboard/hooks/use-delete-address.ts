import { DELETE_ADDRESS } from '@/api/graphql/dashboard/delete-address';
import { useMutation } from '@apollo/client/react';

type DeleteResult = { success: true } | { success: false; error: string };

export const useDeleteAddress = () => {
	const [mutate, { loading }] = useMutation(DELETE_ADDRESS);

	const deleteAddress = async (id: string): Promise<DeleteResult> => {
		return mutate({
			variables: { deleteAddressId: id },
			update(cache) {
				const normalizedId = cache.identify({ id, __typename: 'Address' });
				if (normalizedId) {
					cache.evict({ id: normalizedId });
					cache.gc();
				}
			},
		})
			.then(() => ({ success: true }) as const)
			.catch((err) => {
				return {
					success: false,
					error: err instanceof Error ? err.message : 'Erro desconhecido',
				} as const;
			});
	};

	return { deleteAddress, isDeleting: loading };
};
