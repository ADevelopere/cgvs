"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type SelectTemplateVariableGraphQLContextType = {
    /**
     * Mutation to create a new select template variable
     * @param variables - The creation select template variable variables
     */
    createSelectTemplateVariableMutation: (
        variables: Graphql.CreateSelectTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.CreateSelectTemplateVariableMutation>>;

    /**
     * Mutation to update an existing select template variable
     * @param variables - The update select template variable variables
     */
    updateSelectTemplateVariableMutation: (
        variables: Graphql.UpdateSelectTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.UpdateSelectTemplateVariableMutation>>;

    /**
     * Mutation to delete a template variable
     * @param variables - The delete template variable variables
     */
    deleteTemplateVariableMutation: (
        variables: Graphql.DeleteTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.DeleteTemplateVariableMutation>>;
};

const SelectTemplateVariableGraphQLContext = createContext<
    SelectTemplateVariableGraphQLContextType | undefined
>(undefined);

export const useSelectTemplateVariableGraphQL = () => {
    const context = useContext(SelectTemplateVariableGraphQLContext);
    if (!context) {
        throw new Error(
            "useSelectTemplateVariableGraphQL must be used within a SelectTemplateVariableGraphQLProvider",
        );
    }
    return context;
};

export const SelectTemplateVariableGraphQLProvider: React.FC<{
    children: React.ReactNode;
    templateId?: string;
}> = ({ children, templateId }) => {
    // Create select template variable mutation
    const [mutateCreate] = Graphql.useCreateSelectTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.createSelectTemplateVariable) return;

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
                            data.createSelectTemplateVariable,
                            ...existingData.template.variables,
                        ],
                    },
                },
            });
        },
    });

    // Update select template variable mutation
    const [mutateUpdate] = Graphql.useUpdateSelectTemplateVariableMutation({
        update(cache, { data }) {
            if (!data?.updateSelectTemplateVariable) return;

            const existingData = cache.readQuery<Graphql.TemplateQuery>({
                query: Graphql.TemplateDocument,
                variables: { id: templateId },
            });

            if (!existingData?.template?.variables) return;

            // Update the variable in the template's variables array
            const updatedVariables = existingData.template.variables.map(
                (variable) =>
                    variable.id === data.updateSelectTemplateVariable.id
                        ? data.updateSelectTemplateVariable
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

    const createSelectTemplateVariableMutation = useCallback(
        (variables: Graphql.CreateSelectTemplateVariableMutationVariables) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const updateSelectTemplateVariableMutation = useCallback(
        (variables: Graphql.UpdateSelectTemplateVariableMutationVariables) => {
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
            createSelectTemplateVariableMutation,
            updateSelectTemplateVariableMutation,
            deleteTemplateVariableMutation,
        }),
        [
            createSelectTemplateVariableMutation,
            updateSelectTemplateVariableMutation,
            deleteTemplateVariableMutation,
        ],
    );

    return (
        <SelectTemplateVariableGraphQLContext.Provider value={contextValue}>
            {children}
        </SelectTemplateVariableGraphQLContext.Provider>
    );
};
