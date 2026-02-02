import { gql } from '@apollo/client';
export const GET_PRODUCT_BY_CATEGORY = gql`
	query Category($name: String!) {
		category(name: $name) {
			products {
				id
				name
				price
				description
				image
				category {
					name
				}
			}
		}
	}
`;
