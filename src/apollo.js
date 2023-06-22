import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

const client = createApolloClient();

function createApolloClient() {
	const link = new HttpLink({
		uri: 'https://nottommy11.hasura.app/v1/graphql',
		headers: {
			'x-hasura-admin-secret': 'OzKHw0o3Ce690tn1Wlq43sR6s2fleKPeBlv6oG7BMjmtgS2EBfXUzeH0AE7M4PhC'
		}
	});

	const cache = new InMemoryCache();

	const client = new ApolloClient({
		link,
		cache
	});

	return client;
}

export default client;
