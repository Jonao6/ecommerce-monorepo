import { gql } from '@apollo/client';

export const HOME_PRODUCTS = gql`
	query HomeProducts($limit: Int, $offset: Int) {
		products(limit: $limit, offset: $offset) {
			products {
				category {
					name
				}
				createdAt
				description
				id
				image
				name
				price
				url
			}
		}
	}
`;
