"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type DateTemplateVariableGraphQLContextType = {
    /**
     * Mutation to create a new date template variable
     * @param variables - The creation date template variable variables
     */
    createDateTemplateVariableMutation: (
        variables: Graphql.CreateDateTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.CreateDateTemplateVariableMutation>>;

    /**
     * Mutation to update an existing date template variable
     * @param variables - The update date template variable variables
     */
    updateDateTemplateVariableMutation: (
        variables: Graphql.UpdateDateTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.UpdateDateTemplateVariableMutation>>;

    /**
     * Mutation to delete a template variable
     * @param variables - The delete template variable variables
     */
    deleteTemplateVariableMutation: (
        variables: Graphql.DeleteTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.DeleteTemplateVariableMutation>>;
};

const DateTemplateVariableGraphQLContext = createContext<
    DateTemplateVariableGraphQLContextType | undefined
>(undefined);

export const useDateTemplateVariableGraphQL = () => {
    const context = useContext(DateTemplateVariableGraphQLContext);
    if (!context) {
        throw new Error(
            "useDateTemplateVariableGraphQL must be used within a DateTemplateVariableGraphQLProvider",
        );
    }
    return context;
};

export const DateTemplateVariableGraphQLProvider: React.FC<{
    children: React.ReactNode;
    templateId: string;
}> = ({ children, templateId }) => {
    // Create date template variable mutation
    const [mutateCreate] = Graphql.useCreateDateTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.createDateTemplateVariable) return;

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
                            data.createDateTemplateVariable,
                            ...existingData.template.variables,
                        ],
                    },
                },
            });
        },
    });

    // Update date template variable mutation
    const [mutateUpdate] = Graphql.useUpdateDateTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.updateDateTemplateVariable) return;

            const existingData = cache.readQuery<Graphql.TemplateQuery>({
                query: Graphql.TemplateDocument,
                variables: { id: templateId },
            });

            if (!existingData?.template?.variables) return;

            // Update the variable in the template's variables array
            const updatedVariables = existingData.template.variables.map(
                (variable) =>
                    variable.id === data.updateDateTemplateVariable.id
                        ? data.updateDateTemplateVariable
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

    const createDateTemplateVariableMutation = useCallback(
        (variables: Graphql.CreateDateTemplateVariableMutationVariables) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const updateDateTemplateVariableMutation = useCallback(
        (variables: Graphql.UpdateDateTemplateVariableMutationVariables) => {
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
            createDateTemplateVariableMutation,
            updateDateTemplateVariableMutation,
            deleteTemplateVariableMutation,
        }),
        [
            createDateTemplateVariableMutation,
            updateDateTemplateVariableMutation,
            deleteTemplateVariableMutation,
        ],
    );

    return (
        <DateTemplateVariableGraphQLContext.Provider value={contextValue}>
            {children}
        </DateTemplateVariableGraphQLContext.Provider>
    );
};
