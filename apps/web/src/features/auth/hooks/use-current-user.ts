import { useQuery } from '@apollo/client/react';
import { MeDocument, MeQuery } from '@/gql/graphql';

export const useCurrentUser = () => {
	const { data, loading, error, refetch } = useQuery<MeQuery>(MeDocument, {
		fetchPolicy: 'network-only',
	});

	const user = data?.me;
	const isAuthenticated = !!user;

	return {
		user,
		isAuthenticated,
		loading,
		error,
		refetch,
	};
};
