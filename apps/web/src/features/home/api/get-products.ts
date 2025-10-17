import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query Products($limit: Int, $offset: Int) {
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
