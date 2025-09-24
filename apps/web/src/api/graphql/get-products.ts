import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
	query GetProducts($limit: Int, $offset: Int) {
		products(limit: $limit, offset: $offset) {
			id
			name
			price
			description
			category {
				name
			}
			image
		}
	}
`;
