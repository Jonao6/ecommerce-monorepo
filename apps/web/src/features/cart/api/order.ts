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

export const GET_ORDER_BY_ID = gql`
	query Order($orderId: ID!) {
		order(id: $orderId) {
			payment {
				paymentStatus
			}
		}
	}
`;
