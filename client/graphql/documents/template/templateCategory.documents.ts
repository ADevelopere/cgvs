import { TypedDocumentNode, gql } from "@apollo/client";
import {
    MutationCreateTemplateCategoryArgs,
    MutationDeleteTemplateCategoryArgs,
    MutationUpdateTemplateCategoryArgs,
    QueryTemplateCategoryArgs,
    TemplateCategory,
} from "../../generated/gql/graphql";

export const mainTemplateCategoryQueryDocument: TypedDocumentNode<TemplateCategory> = gql`
    query mainTemplateCategory {
        mainTemplateCategory {
            id
            name
            description
            specialType
            parentCategory {
                id
                name
            }
            order
            subCategories {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const suspenionTemplateCategoryQueryDocument: TypedDocumentNode<TemplateCategory> = gql`
    query suspensionTemplateCategory {
        suspensionTemplateCategory {
            id
            name
            description
            specialType
            parentCategory {
                id
                name
            }
            order
            subCategories {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const templateCategoriesQueryDocument: TypedDocumentNode<TemplateCategory[]> =
    gql`
        query templateCategories {
            templateCategories {
                id
                name
                description
                specialType
                parentCategory {
                    id
                }
                order
                templates {
                    id
                    name
                    description
                    # imageUrl
                    order
                    createdAt
                    updatedAt
                }
                createdAt
                updatedAt
            }
        }
    `;

export const templateCategoryQueryDocument: TypedDocumentNode<
    TemplateCategory,
    QueryTemplateCategoryArgs
> = gql`
    query templateCategory($id: Int!) {
        templateCategory(id: $id) {
            id
            name
            description
            specialType
            parentCategory {
                id
                name
            }
            order
            subCategories {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const createTemplateCategoryMutationDocument: TypedDocumentNode<
    TemplateCategory,
    MutationCreateTemplateCategoryArgs
> = gql`
    mutation createTemplateCategory($input: TemplateCategoryCreateInput!) {
        createTemplateCategory(input: $input) {
            id
            name
            description
            specialType
            parentCategory {
                id
            }
            order
            createdAt
            updatedAt
        }
    }
`;

export const deleteTemplateCategoryMutationDocument: TypedDocumentNode<
    TemplateCategory,
    MutationDeleteTemplateCategoryArgs
> = gql`
    mutation deleteTemplateCategory($id: Int!) {
        deleteTemplateCategory(id: $id) {
            id
            name
            parentCategory {
                id
            }
        }
    }
`;

export const updateTemplateCategoryMutationDocument: TypedDocumentNode<
    TemplateCategory,
    MutationUpdateTemplateCategoryArgs
> = gql`
    mutation updateTemplateCategory($input: TemplateCategoryUpdateInput!) {
        updateTemplateCategory(input: $input) {
            id
            name
            description
            specialType
            parentCategory {
                id
            }
            order
            createdAt
            updatedAt
        }
    }
`;
