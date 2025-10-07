import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createTemplateTextVariable: TypedDocumentNode<
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

export const createTemplateNumberVariable: TypedDocumentNode<
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

export const createTemplateDateVariable: TypedDocumentNode<
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

export const createTemplateSelectVariable: TypedDocumentNode<
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

export const updateTemplateTextVariable: TypedDocumentNode<
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

export const updateTemplateNumberVariable: TypedDocumentNode<
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

export const updateTemplateDateVariable: TypedDocumentNode<
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

export const updateTemplateSelectVariable: TypedDocumentNode<
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

export const deleteTemplateVariable: TypedDocumentNode<
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
