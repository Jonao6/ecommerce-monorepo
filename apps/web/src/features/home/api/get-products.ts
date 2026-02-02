import { query } from '@/api/apollo';
import {
	HomeProductsDocument,
	HomeProductsQuery,
	HomeProductsQueryVariables,
} from '@/gql/graphql';

export const getProducts = async (variables: HomeProductsQueryVariables) => {
	return query<HomeProductsQuery>({
		query: HomeProductsDocument,
		variables: variables,
	})
		.then(({ data, error }) => {
			if (error) {
				return {
					success: false,
					error: new Error(error.message || 'Erro na query GraphQL'),
				} as const;
			}
			return {
				success: true,
				data,
			} as const;
		})
		.catch((err) => {
			return {
				success: false,
				error: err instanceof Error ? err : new Error('Erro inesperado'),
			} as const;
		});
};
