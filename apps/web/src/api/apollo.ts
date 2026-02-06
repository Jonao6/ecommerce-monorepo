import { HttpLink } from '@apollo/client';
import {
	registerApolloClient,
	ApolloClient,
	InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { cookies } from 'next/headers';

export const { getClient, query, PreloadQuery } = registerApolloClient(
	async () => {
		const cookieStore = await cookies();
		return new ApolloClient({
			cache: new InMemoryCache({
				typePolicies: {
					Query: {
						fields: {
							products: {
								merge: false,
								keyArgs: ['limit', 'offset'],
							},
							categories: {
								merge: true,
							},
						},
					},
				},
			}),
			link: new HttpLink({
				uri: process.env.GRAPHQL_URI || 'http://localhost:4000/graphql',
				headers: {
					Cookie: cookieStore.toString(),
				},
				credentials: 'include',
			}),
		});
	},
);
