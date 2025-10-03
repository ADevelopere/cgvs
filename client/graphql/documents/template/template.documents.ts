import { TypedDocumentNode, gql } from "@apollo/client";
import {
    PaginatedTemplatesResponse,
    QueryTemplateArgs,
    QueryTemplatesArgs,
    Template,
    TemplatesConfigs,
    MutationCreateTemplateArgs,
    MutationUpdateTemplateArgs,
    MutationDeleteTemplateArgs,
    MutationSuspendTemplateArgs,
    MutationUnsuspendTemplateArgs,
} from "../../generated/gql/graphql";

export const templateQueryDocument: TypedDocumentNode<Template, QueryTemplateArgs> = gql`
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
    PaginatedTemplatesResponse,
    QueryTemplatesArgs
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

export const templatesConfigsQueryDocument: TypedDocumentNode<TemplatesConfigs> = gql`
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
    Template,
    MutationCreateTemplateArgs
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
    Template,
    MutationUpdateTemplateArgs
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
    Template,
    MutationDeleteTemplateArgs
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
    Template,
    MutationSuspendTemplateArgs
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
    Template,
    MutationUnsuspendTemplateArgs
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
