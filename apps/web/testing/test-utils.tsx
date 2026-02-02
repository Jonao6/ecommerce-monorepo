import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { Toaster } from 'sonner';

const createTestClient = () => {
	return new ApolloClient({
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
			fetch: fetch,
		}),
		cache: new InMemoryCache(),
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'no-cache',
			},
			query: {
				fetchPolicy: 'no-cache',
			},
		},
	});
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	const client = createTestClient();
	return (
		<ApolloProvider client={client}>
			{children}
			<Toaster />
		</ApolloProvider>
	);
};

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
