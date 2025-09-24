'use client';

import { HttpLink } from '@apollo/client';
import {
	ApolloNextAppProvider,
	ApolloClient,
	InMemoryCache,
} from '@apollo/client-integration-nextjs';

function makeClient() {
	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || 'http://localhost:4000/graphql',
	});

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: httpLink,
	});
}

export function ApolloContext({ children }: { children: React.ReactNode }) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}
