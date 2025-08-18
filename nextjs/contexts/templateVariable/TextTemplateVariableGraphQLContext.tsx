"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type TextTemplateVariableGraphQLContextType = {
    /**
     * Mutation to create a new text template variable
     * @param variables - The creation text template variable variables
     */
    createTextTemplateVariableMutation: (
        variables: Graphql.CreateTextTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.CreateTextTemplateVariableMutation>>;

    /**
     * Mutation to update an existing text template variable
     * @param variables - The update text template variable variables
     */
    updateTextTemplateVariableMutation: (
        variables: Graphql.UpdateTextTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.UpdateTextTemplateVariableMutation>>;

    /**
     * Mutation to delete a template variable
     * @param variables - The delete template variable variables
     */
    deleteTemplateVariableMutation: (
        variables: Graphql.DeleteTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.DeleteTemplateVariableMutation>>;
};

const TextTemplateVariableGraphQLContext = createContext<
    TextTemplateVariableGraphQLContextType | undefined
>(undefined);

export const useTextTemplateVariableGraphQL = () => {
    const context = useContext(TextTemplateVariableGraphQLContext);
    if (!context) {
        throw new Error(
            "useTextTemplateVariableGraphQL must be used within a TextTemplateVariableGraphQLProvider",
        );
    }
    return context;
};


export const TextTemplateVariableGraphQLProvider: React.FC<{
    children: React.ReactNode;
    templateId: number;
}> = ({ children, templateId }) => {
    // Create text template variable mutation
    const [mutateCreate] = Graphql.useCreateTextTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.createTextTemplateVariable) return;

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
                            data.createTextTemplateVariable,
                        ],
                    },
                },
            });
        },
    });

    // Update text template variable mutation
    const [mutateUpdate] = Graphql.useUpdateTextTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.updateTextTemplateVariable) return;

            const existingData = cache.readQuery<Graphql.TemplateQuery>({
                query: Graphql.TemplateDocument,
                variables: { id: templateId },
            });

            if (!existingData?.template?.variables) return;

            // Update the variable in the template's variables array and sort by order
            const updatedVariables = existingData.template.variables
                .map((variable) =>
                    variable.id === data.updateTextTemplateVariable.id
                        ? data.updateTextTemplateVariable
                        : variable,
                )
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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

    const createTextTemplateVariableMutation = useCallback(
        (variables: Graphql.CreateTextTemplateVariableMutationVariables) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const updateTextTemplateVariableMutation = useCallback(
        (variables: Graphql.UpdateTextTemplateVariableMutationVariables) => {
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
            createTextTemplateVariableMutation,
            updateTextTemplateVariableMutation,
            deleteTemplateVariableMutation,
        }),
        [
            createTextTemplateVariableMutation,
            updateTextTemplateVariableMutation,
            deleteTemplateVariableMutation,
        ],
    );

    return (
        <TextTemplateVariableGraphQLContext.Provider value={contextValue}>
            {children}
        </TextTemplateVariableGraphQLContext.Provider>
    );
};
