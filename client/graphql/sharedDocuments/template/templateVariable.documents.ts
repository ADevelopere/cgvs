import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createTemplateTextVariableMutationDocument: TypedDocumentNode<
    Graphql.CreateTemplateTextVariableMutation,
    Graphql.CreateTemplateTextVariableMutationVariables
> = gql`
    mutation createTemplateTextVariable(
        $input: TemplateTextVariableCreateInput!
    ) {
        createTemplateTextVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            minLength
            maxLength
            pattern
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const createTemplateNumberVariableMutationDocument: TypedDocumentNode<
    Graphql.CreateTemplateNumberVariableMutation,
    Graphql.CreateTemplateNumberVariableMutationVariables
> = gql`
    mutation createTemplateNumberVariable(
        $input: TemplateNumberVariableCreateInput!
    ) {
        createTemplateNumberVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            minValue
            maxValue
            decimalPlaces
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const createTemplateDateVariableMutationDocument: TypedDocumentNode<
    Graphql.CreateTemplateDateVariableMutation,
    Graphql.CreateTemplateDateVariableMutationVariables
> = gql`
    mutation createTemplateDateVariable(
        $input: TemplateDateVariableCreateInput!
    ) {
        createTemplateDateVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            minDate
            maxDate
            format
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const createTemplateSelectVariableMutationDocument: TypedDocumentNode<
    Graphql.CreateTemplateSelectVariableMutation,
    Graphql.CreateTemplateSelectVariableMutationVariables
> = gql`
    mutation createTemplateSelectVariable(
        $input: TemplateSelectVariableCreateInput!
    ) {
        createTemplateSelectVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            options
            multiple
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const updateTemplateTextVariableMutationDocument: TypedDocumentNode<
    Graphql.UpdateTemplateTextVariableMutation,
    Graphql.UpdateTemplateTextVariableMutationVariables
> = gql`
    mutation updateTemplateTextVariable(
        $input: TemplateTextVariableUpdateInput!
    ) {
        updateTemplateTextVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            minLength
            maxLength
            pattern
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const updateTemplateNumberVariableMutationDocument: TypedDocumentNode<
    Graphql.UpdateTemplateNumberVariableMutation,
    Graphql.UpdateTemplateNumberVariableMutationVariables
> = gql`
    mutation updateTemplateNumberVariable(
        $input: TemplateNumberVariableUpdateInput!
    ) {
        updateTemplateNumberVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            minValue
            maxValue
            decimalPlaces
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const updateTemplateDateVariableMutationDocument: TypedDocumentNode<
    Graphql.UpdateTemplateDateVariableMutation,
    Graphql.UpdateTemplateDateVariableMutationVariables
> = gql`
    mutation updateTemplateDateVariable(
        $input: TemplateDateVariableUpdateInput!
    ) {
        updateTemplateDateVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            minDate
            maxDate
            format
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const updateTemplateSelectVariableMutationDocument: TypedDocumentNode<
    Graphql.UpdateTemplateSelectVariableMutation,
    Graphql.UpdateTemplateSelectVariableMutationVariables
> = gql`
    mutation updateTemplateSelectVariable(
        $input: TemplateSelectVariableUpdateInput!
    ) {
        updateTemplateSelectVariable(input: $input) {
            id
            name
            description
            type
            required
            order
            options
            multiple
            previewValue
            template {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const deleteTemplateVariableMutationDocument: TypedDocumentNode<
    Graphql.DeleteTemplateVariableMutation,
    Graphql.DeleteTemplateVariableMutationVariables
> = gql`
    mutation deleteTemplateVariable($id: Int!) {
        deleteTemplateVariable(id: $id) {
            id
            name
            template {
                id
                name
            }
        }
    }
`;
