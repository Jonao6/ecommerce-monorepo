import { gql } from '@apollo/client';

export const GET_PRODUCTS_PAGINATION = gql`
	query Products($limit: Int, $offset: Int) {
		products(limit: $limit, offset: $offset) {
			currentPage
			hasNextPage
			hasPreviousPage
			totalCount
			totalPages
			products {
				category {
					name
				}
				colors
				createdAt
				description
				id
				image
				name
				price
				sizes
				url
			}
		}
	}
`;
