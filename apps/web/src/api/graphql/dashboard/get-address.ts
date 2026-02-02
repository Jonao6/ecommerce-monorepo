import { gql } from '@apollo/client';

export const USER_ADDRESSES = gql`
	query UserAddresses {
		userAddresses{
			city
			complements
			country
			createdAt
			id
			neighbor
			postalCode
			state
			street
			streetNumber
		}
	}
`;
