import { TypedDocumentNode, gql } from "@apollo/client";

import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const templateQueryDocument: TypedDocumentNode<
    Graphql.TemplateQuery,
    Graphql.TemplateQueryVariables
> = gql`
    query template($id: Int!) {
        template(id: $id) {
            id
            name
            description
            order
            createdAt
            updatedAt

            category {
                id
                name
            }

            preSuspensionCategory {
                id
                name
            }
        }
    }
`;

export const paginatedTemplatesQueryDocument: TypedDocumentNode<
    Graphql.TemplatesQuery,
    Graphql.TemplatesQueryVariables
> = gql`
    query templates($pagination: PaginationArgs) {
        templates(pagination: $pagination) {
            data {
                id
                name
                description
                # imageUrl
                category {
                    id
                    name
                }
                order
                preSuspensionCategory {
                    id
                    name
                }
                createdAt
                updatedAt
            }
            pageInfo {
                count
                currentPage
                firstItem
                hasMorePages
                lastItem
                lastPage
                perPage
                total
            }
        }
    }
`;

export const templatesConfigsQueryDocument: TypedDocumentNode<Graphql.TemplatesConfigsQuery> = gql`
    query TemplatesConfigs {
        templatesConfigs {
            configs {
                key
                value
            }
        }
    }
`;

export const createTemplateQueryDocument: TypedDocumentNode<
    Graphql.CreateTemplateMutation,
    Graphql.CreateTemplateMutationVariables
> = gql`
    mutation createTemplate($input: TemplateCreateInput!) {
        createTemplate(input: $input) {
            id
            name
            description
            # imageUrl
            category {
                id
                name
            }
            order
            preSuspensionCategory {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const updateTemplateMutationDocument: TypedDocumentNode<
    Graphql.UpdateTemplateMutation,
    Graphql.UpdateTemplateMutationVariables
> = gql`
    mutation updateTemplate($input: UpdateTemplateInput!) {
        updateTemplate(input: $input) {
            id
            name
            description
            # imageUrl
            category {
                id
                name
            }
            order
            preSuspensionCategory {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const deleteTemplateMutationDocument: TypedDocumentNode<
    Graphql.DeleteTemplateMutation,
    Graphql.DeleteTemplateMutationVariables
> = gql`
    mutation deleteTemplate($id: Int!) {
        deleteTemplate(id: $id) {
            id
            name
            category {
                id
                name
            }
        }
    }
`;

export const suspendTemplateMutationDocument: TypedDocumentNode<
    Graphql.SuspendTemplateMutation,
    Graphql.SuspendTemplateMutationVariables
> = gql`
    mutation suspendTemplate($id: Int!) {
        suspendTemplate(id: $id) {
            id
            name
            description
            # imageUrl
            category {
                id
                name
            }
            order
            preSuspensionCategory {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const unsuspendTemplateMutationDocument: TypedDocumentNode<
    Graphql.UnsuspendTemplateMutation,
    Graphql.UnsuspendTemplateMutationVariables
> = gql`
    mutation unsuspendTemplate($id: Int!) {
        unsuspendTemplate(id: $id) {
            id
            name
            description
            # imageUrl
            category {
                id
                name
            }
            order
            preSuspensionCategory {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;
