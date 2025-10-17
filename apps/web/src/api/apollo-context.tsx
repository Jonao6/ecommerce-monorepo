"use client" 

import { HttpLink, ApolloLink, CombinedGraphQLErrors, Observable } from "@apollo/client";
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { ErrorLink } from "@apollo/client/link/error"


function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:4000/graphql",
    credentials: "include",
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (let err of error.errors) {
      switch (err?.extensions?.code) {
        case "TOKEN_NOT_FOUND": {
          return new Observable(observer => {
            fetch("http://localhost:4000/refresh", {
              method: "POST",
              credentials: "include",
            })
              .then(() => {
                const subscriber = forward(operation).subscribe({
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

  console.log("[GraphQL Error]:", error?.message);

  return forward(operation);
});

return new ApolloClient({
  link: ApolloLink.from([httpLink, errorLink]),
  cache: new InMemoryCache(),
});
}

export function ApolloContext({ children }: { children: React.ReactNode }) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}