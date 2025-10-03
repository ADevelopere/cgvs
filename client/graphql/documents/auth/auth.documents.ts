import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const meQueryDocumetn: TypedDocumentNode<Graphql.MeQuery> = gql`
    query me {
        me {
            createdAt
            email
            emailVerifiedAt
            id
            name
            updatedAt
        }
    }
`;

export const userQueryDocument: TypedDocumentNode<
    Graphql.UserQuery,
    Graphql.QueryUserArgs
> = gql`
    query user($id: Int!) {
        user(id: $id) {
            createdAt
            email
            emailVerifiedAt
            id
            name
            updatedAt
        }
    }
`;

export const usersQueryDocument: TypedDocumentNode<Graphql.UsersQuery> = gql`
    query users {
        users {
            createdAt
            email
            emailVerifiedAt
            id
            name
            updatedAt
        }
    }
`;

export const loginMutationDocument: TypedDocumentNode<
    Graphql.LoginMutation,
    Graphql.MutationLoginArgs
> = gql`
    mutation login($input: LoginInput!) {
        login(input: $input) {
            token
            user {
                createdAt
                email
                emailVerifiedAt
                id
                name
                updatedAt
            }
        }
    }
`;

export const logoutMutationDocument: TypedDocumentNode<Graphql.LogoutMutation> = gql`
    mutation logout {
        logout
    }
`;

export const refreshTokenMutationDocument: TypedDocumentNode<Graphql.RefreshTokenMutation> = gql`
    mutation refreshToken {
        refreshToken {
            token
            user {
                createdAt
                email
                emailVerifiedAt
                id
                name
                updatedAt
            }
        }
    }
`;
