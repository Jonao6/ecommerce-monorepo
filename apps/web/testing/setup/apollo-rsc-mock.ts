import { vi } from 'vitest';
vi.mock('@apollo/client-integration-nextjs', async (importOriginal) => {
	const actual = await importOriginal<any>();

	const { ApolloClient, InMemoryCache, HttpLink } = await import(
		'@apollo/client'
	);

	return {
		...actual,
		registerApolloClient: () => {
			const getClient = () =>
				new ApolloClient({
					cache: new InMemoryCache({}),
					link: new HttpLink({
						uri: 'https://api.mock/graphql',
						fetch: globalThis.fetch,
					}),
					defaultOptions: {
						query: {
							fetchPolicy: 'no-cache',
							errorPolicy: 'all',
						},
					},
				});

			return {
				getClient,
				query: (opts: any) => getClient().query(opts),
				PreloadQuery: vi.fn(),
			};
		},
	};
});
