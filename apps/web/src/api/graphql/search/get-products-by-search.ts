import { gql } from '@apollo/client';
export const PRODUCT_BY_SEARCH = gql`
	query ProductsBySearch($term: String!) {
		productsBySearch(term: $term) {
			price
			name
			image
			id
			category {
				name
			}
		}
	}
`;
