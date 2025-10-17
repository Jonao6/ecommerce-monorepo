import { gql } from '@apollo/client';

export const UPDATE_ORDER_ADDRESS = gql`
 mutation UpdateAddress($updateAddressId: ID!, $input: UpdateAddressInput!) {
  updateAddress(id: $updateAddressId, input: $input) {
    createdAt
    id
    user {
      name
    }
  }
}
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: CreateAddressInput!) {
  createAddress(input: $input) {
    createdAt
    id
  }
}
`;
