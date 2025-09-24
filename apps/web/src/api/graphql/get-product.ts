import { DocumentNode, gql } from '@apollo/client';

export const GET_PRODUCT_BY_ID: DocumentNode = gql`
	query GetProducts($id: ID!) {
		product(id: $id) {
			id
			name
			image
			price
			colors
			sizes
			description
			category {
				id
				name
			}
			createdAt
		}
	}
`;
