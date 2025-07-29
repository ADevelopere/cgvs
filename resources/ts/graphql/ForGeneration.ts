import { gql } from '@apollo/client';

export const PlaceholderQuery = gql`
  query Placeholder {
    me {
      id
      name
      email
    }
  }
`;
