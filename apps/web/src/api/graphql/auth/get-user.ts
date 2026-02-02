import { gql } from '@apollo/client';

export const GET_USER = gql`
	mutation GetUser($input: LoginInput!) {
		getUser(input: $input) {
			message
			user {
				name
				email
			}
		}
	}
`;
