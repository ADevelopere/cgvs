import { gql } from '@apollo/client';

export const IS_AUTHENTICATED = gql`
query isAuthenticated{
    isAuthenticated
}
`;
