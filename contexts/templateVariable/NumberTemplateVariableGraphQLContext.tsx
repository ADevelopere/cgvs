"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { ApolloLink } from "@apollo/client";

type NumberTemplateVariableGraphQLContextType = {
    /**
     * Mutation to create a new number template variable
     * @param variables - The creation number template variable variables
     */
    createNumberTemplateVariableMutation: (
        variables: Graphql.CreateNumberTemplateVariableMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.CreateNumberTemplateVariableMutation>>;

    /**
     * Mutation to update an existing number template variable
     * @param variables - The update number template variable variables
     */
    updateNumberTemplateVariableMutation: (
        variables: Graphql.UpdateNumberTemplateVariableMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.UpdateNumberTemplateVariableMutation>>;

    /**
     * Mutation to delete a template variable
     * @param variables - The delete template variable variables
     */
    deleteTemplateVariableMutation: (
        variables: Graphql.DeleteTemplateVariableMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.DeleteTemplateVariableMutation>>;
};

const NumberTemplateVariableGraphQLContext = createContext<
    NumberTemplateVariableGraphQLContextType | undefined
>(undefined);

export const useNumberTemplateVariableGraphQL = () => {
    const context = useContext(NumberTemplateVariableGraphQLContext);
    if (!context) {
        throw new Error(
            "useNumberTemplateVariableGraphQL must be used within a NumberTemplateVariableGraphQLProvider",
        );
    }
    return context;
};

export const NumberTemplateVariableGraphQLProvider: React.FC<{
    children: React.ReactNode;
    templateId: number;
}> = ({ children, templateId }) => {
    // Create number template variable mutation
    const [mutateCreate] = Graphql.useCreateNumberTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.createNumberTemplateVariable) return;

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
                            data.createNumberTemplateVariable,
                        ],
                    },
                },
            });
        },
    });

    // Update number template variable mutation
    const [mutateUpdate] = Graphql.useUpdateNumberTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.updateNumberTemplateVariable) return;

            const existingData = cache.readQuery<Graphql.TemplateQuery>({
                query: Graphql.TemplateDocument,
                variables: { id: templateId },
            });

            if (!existingData?.template?.variables) return;

            // Update the variable in the template's variables array
            const updatedVariables = existingData.template.variables.map(
                (variable) =>
                    variable.id === data.updateNumberTemplateVariable.id
                        ? data.updateNumberTemplateVariable
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
    });

    // Delete template variable mutation
    const [mutateDelete] = Graphql.useDeleteTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.deleteTemplateVariable) return;

            const existingData = cache.readQuery<Graphql.TemplateQuery>({
                query: Graphql.TemplateDocument,
                variables: { id: templateId },
            });

            if (!existingData?.template?.variables) return;

            // Remove the variable from the template's variables array
            cache.writeQuery({
                query: Graphql.TemplateDocument,
                variables: { id: templateId },
                data: {
                    template: {
                        ...existingData.template,
                        variables: existingData.template.variables.filter(
                            (variable) => variable.id !== data.deleteTemplateVariable.id,
                        ),
                    },
                },
            });
        },
    });

    const createNumberTemplateVariableMutation = useCallback(
        (variables: Graphql.CreateNumberTemplateVariableMutationVariables) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const updateNumberTemplateVariableMutation = useCallback(
        (variables: Graphql.UpdateNumberTemplateVariableMutationVariables) => {
            return mutateUpdate({ variables });
        },
        [mutateUpdate],
    );

    const deleteTemplateVariableMutation = useCallback(
        (variables: Graphql.DeleteTemplateVariableMutationVariables) => {
            return mutateDelete({ variables });
        },
        [mutateDelete],
    );

    const contextValue = useMemo(
        () => ({
            createNumberTemplateVariableMutation,
            updateNumberTemplateVariableMutation,
            deleteTemplateVariableMutation,
        }),
        [
            createNumberTemplateVariableMutation,
            updateNumberTemplateVariableMutation,
            deleteTemplateVariableMutation,
        ],
    );

    return (
        <NumberTemplateVariableGraphQLContext.Provider value={contextValue}>
            {children}
        </NumberTemplateVariableGraphQLContext.Provider>
    );
};
