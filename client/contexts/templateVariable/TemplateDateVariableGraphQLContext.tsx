"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloLink } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

type TemplateDateVariableGraphQLContextType = {
    /**
     * Mutation to create a new date template variable
     * @param variables - The creation date template variable variables
     */
    createTemplateDateVariableMutation: (
        variables: Graphql.CreateTemplateDateVariableMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.CreateTemplateDateVariableMutation>>;

    /**
     * Mutation to update an existing date template variable
     * @param variables - The update date template variable variables
     */
    updateTemplateDateVariableMutation: (
        variables: Graphql.UpdateTemplateDateVariableMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.UpdateTemplateDateVariableMutation>>;
};

const TemplateDateVariableGraphQLContext = createContext<
    TemplateDateVariableGraphQLContextType | undefined
>(undefined);

export const useTemplateDateVariableGraphQL = () => {
    const context = useContext(TemplateDateVariableGraphQLContext);
    if (!context) {
        throw new Error(
            "useTemplateDateVariableGraphQL must be used within a TemplateDateVariableGraphQLProvider",
        );
    }
    return context;
};

export const TemplateDateVariableGraphQLProvider: React.FC<{
    children: React.ReactNode;
    templateId: number;
}> = ({ children, templateId }) => {
    // Create date template variable mutation
    const [mutateCreate] = useMutation(
        Document.createTemplateDateVariableMutationDocument,
        {
            update(cache, { data }) {
                if (!data?.createTemplateDateVariable) return;
                const createdTemplateDateVariable =
                    data.createTemplateDateVariable;

                const existingData = cache.readQuery<Graphql.TemplateQuery>({
                    query: Graphql.TemplateDocument,
                    variables: { id: templateId },
                });

                if (!existingData?.template?.variables) return;

                // Add the new variable to the template's variables array
                cache.writeQuery({
                    query: Graphql.TemplateDocument,
                    variables: { id: templateId },
                    data: {
                        template: {
                            ...existingData.template,
                            variables: [
                                ...existingData.template.variables,
                                createdTemplateDateVariable,
                            ],
                        },
                    },
                });
            },
        },
    );

    // Update date template variable mutation
    const [mutateUpdate] = useMutation(
        Document.updateTemplateDateVariableMutationDocument,
        {
            update(cache, { data }) {
                if (!data?.updateTemplateDateVariable) return;
                const updatedTemplateDateVariable =
                    data.updateTemplateDateVariable;

                const existingData = cache.readQuery<Graphql.TemplateQuery>({
                    query: Graphql.TemplateDocument,
                    variables: { id: templateId },
                });

                if (!existingData?.template?.variables) return;

                // Update the variable in the template's variables array
                const updatedVariables = existingData.template.variables.map(
                    (variable) =>
                        variable.id === updatedTemplateDateVariable.id
                            ? updatedTemplateDateVariable
                            : variable,
                );

                cache.writeQuery({
                    query: Graphql.TemplateDocument,
                    variables: { id: templateId },
                    data: {
                        template: {
                            ...existingData.template,
                            variables: updatedVariables,
                        },
                    },
                });
            },
        },
    );

    const createTemplateDateVariableMutation = useCallback(
        (variables: Graphql.CreateTemplateDateVariableMutationVariables) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const updateTemplateDateVariableMutation = useCallback(
        (variables: Graphql.UpdateTemplateDateVariableMutationVariables) => {
            return mutateUpdate({ variables });
        },
        [mutateUpdate],
    );

    const contextValue = useMemo(
        () => ({
            createTemplateDateVariableMutation,
            updateTemplateDateVariableMutation,
        }),
        [
            createTemplateDateVariableMutation,
            updateTemplateDateVariableMutation,
        ],
    );

    return (
        <TemplateDateVariableGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateDateVariableGraphQLContext.Provider>
    );
};
