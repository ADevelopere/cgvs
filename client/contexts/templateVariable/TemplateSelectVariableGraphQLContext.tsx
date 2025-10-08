"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloLink } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

type TemplateSelectVariableGraphQLContextType = {
    /**
     * Mutation to create a new select template variable
     * @param variables - The creation select template variable variables
     */
    createTemplateSelectVariableMutation: (
        variables: Graphql.CreateTemplateSelectVariableMutationVariables,
    ) => Promise<
        ApolloLink.Result<Graphql.CreateTemplateSelectVariableMutation>
    >;

    /**
     * Mutation to update an existing select template variable
     * @param variables - The update select template variable variables
     */
    updateTemplateSelectVariableMutation: (
        variables: Graphql.UpdateTemplateSelectVariableMutationVariables,
    ) => Promise<
        ApolloLink.Result<Graphql.UpdateTemplateSelectVariableMutation>
    >;
};

const TemplateSelectVariableGraphQLContext = createContext<
    TemplateSelectVariableGraphQLContextType | undefined
>(undefined);

export const useTemplateSelectVariableGraphQL = () => {
    const context = useContext(TemplateSelectVariableGraphQLContext);
    if (!context) {
        throw new Error(
            "useTemplateSelectVariableGraphQL must be used within a TemplateSelectVariableGraphQLProvider",
        );
    }
    return context;
};

export const TemplateSelectVariableGraphQLProvider: React.FC<{
    children: React.ReactNode;
    templateId: number;
}> = ({ children, templateId }) => {
    // Create select template variable mutation
    const [mutateCreate] = useMutation(
        Document.createTemplateSelectVariableMutationDocument,
        {
            update(cache, { data }) {
                if (!data?.createTemplateSelectVariable) return;

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
                                data.createTemplateSelectVariable,
                            ],
                        },
                    },
                });
            },
        },
    );

    // Update select template variable mutation
    const [mutateUpdate] = useMutation(
        Document.updateTemplateSelectVariableMutationDocument,
        {
            update(cache, { data }) {
                if (!data?.updateTemplateSelectVariable) return;
                const updatedVariable = data.updateTemplateSelectVariable;

                const existingData = cache.readQuery<Graphql.TemplateQuery>({
                    query: Graphql.TemplateDocument,
                    variables: { id: templateId },
                });

                if (!existingData?.template?.variables) return;

                // Update the variable in the template's variables array
                const updatedVariables = existingData.template.variables.map(
                    (variable) =>
                        variable.id === updatedVariable.id
                            ? updatedVariable
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

    const createTemplateSelectVariableMutation = useCallback(
        (variables: Graphql.CreateTemplateSelectVariableMutationVariables) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const updateTemplateSelectVariableMutation = useCallback(
        (variables: Graphql.UpdateTemplateSelectVariableMutationVariables) => {
            return mutateUpdate({ variables });
        },
        [mutateUpdate],
    );

    const contextValue = useMemo(
        () => ({
            createTemplateSelectVariableMutation,
            updateTemplateSelectVariableMutation,
        }),
        [
            createTemplateSelectVariableMutation,
            updateTemplateSelectVariableMutation,
        ],
    );

    return (
        <TemplateSelectVariableGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateSelectVariableGraphQLContext.Provider>
    );
};
