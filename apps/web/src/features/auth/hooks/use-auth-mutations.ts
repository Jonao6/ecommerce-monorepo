import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import {
	GetUserDocument,
	GetUserMutation,
	GetUserMutationVariables,
} from '@/gql/graphql';

export const useLoginMutation = () => {
	const [mutate, { loading, error }] = useMutation<
		GetUserMutation,
		GetUserMutationVariables
	>(GetUserDocument, {
		fetchPolicy: 'network-only',
	});

	const loginMutation = useCallback(
		(input: { email: string; password: string }) => {
			return mutate({
				variables: { input },
			});
		},
		[mutate],
	);

	return {
		loginMutation,
		loading,
		error,
	};
};

export type LoginResult =
	| {
			success: true;
			user: { id: string; name: string; email: string; role: string };
	  }
	| { success: false; error: Error };
