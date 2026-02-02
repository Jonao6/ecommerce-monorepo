'use client';

import {
	HttpLink,
	ApolloLink,
	CombinedGraphQLErrors,
	Observable,
} from '@apollo/client';
import {
	ApolloNextAppProvider,
	ApolloClient,
	InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { ErrorLink } from '@apollo/client/link/error';

function makeClient() {
	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:4000/graphql',
		credentials: 'include',
	});

	const errorLink = new ErrorLink(({ error, operation, forward }) => {
		if (CombinedGraphQLErrors.is(error)) {
			for (const err of error.errors) {
				switch (err?.extensions?.code) {
					case 'UNAUTHORIZED': {
						return new Observable((observer) => {
							fetch('http://localhost:4000/me', {
								method: 'POST',
								credentials: 'include',
							})
								.then(() => {
									forward(operation).subscribe({
										next: observer.next.bind(observer),
										error: observer.error.bind(observer),
										complete: observer.complete.bind(observer),
									});
								})
								.catch(observer.error.bind(observer));
						});
					}
				}
			}
		}

		console.log('[GraphQL Error]:', error?.message);

		return forward(operation);
	});

	return new ApolloClient({
		link: ApolloLink.from([errorLink, httpLink]),
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						products: {
							merge: false,
							keyArgs: ['limit', 'offset'],
						},
						categories: {
							merge: false,
						},
					},
				},
			},
		}),
	});
}

export function ApolloContext({ children }: { children: React.ReactNode }) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}
