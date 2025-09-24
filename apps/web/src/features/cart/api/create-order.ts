import { gql } from '@apollo/client';

export const CREATE_ORDER_MUTATION = gql`
	mutation CreateOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			id
			status
			createdAt
		}
	}
`;
