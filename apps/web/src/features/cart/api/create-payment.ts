import { gql } from '@apollo/client';

export const CREATE_PAYMENT_INTENT_MUTATION = gql`
	mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
		createPaymentIntent(input: $input) {
			clientSecret
		}
	}
`;
