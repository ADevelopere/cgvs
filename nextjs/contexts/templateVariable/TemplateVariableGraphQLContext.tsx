"use client";

import { createContext, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";
import {
    TextTemplateVariableGraphQLProvider,
    useTextTemplateVariableGraphQL,
} from "./TextTemplateVariableGraphQLContext";
import {
    NumberTemplateVariableGraphQLProvider,
    useNumberTemplateVariableGraphQL,
} from "./NumberTemplateVariableGraphQLContext";
import {
    DateTemplateVariableGraphQLProvider,
    useDateTemplateVariableGraphQL,
} from "./DateTemplateVariableGraphQLContext";
import {
    SelectTemplateVariableGraphQLProvider,
    useSelectTemplateVariableGraphQL,
} from "./SelectTemplateVariableGraphQLContext";

type TemplateVariableGraphQLContextType = {
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
     * Mutation to create a new number template variable
     * @param variables - The creation number template variable variables
     */
    createNumberTemplateVariableMutation: (
        variables: Graphql.CreateNumberTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.CreateNumberTemplateVariableMutation>>;

    /**
     * Mutation to update an existing number template variable
     * @param variables - The update number template variable variables
     */
    updateNumberTemplateVariableMutation: (
        variables: Graphql.UpdateNumberTemplateVariableMutationVariables,
    ) => Promise<FetchResult<Graphql.UpdateNumberTemplateVariableMutation>>;

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

const TemplateVariableGraphQLContext = createContext<
    TemplateVariableGraphQLContextType | undefined
>(undefined);

export const useTemplateVariableGraphQL = () => {
    const context = useContext(TemplateVariableGraphQLContext);
    if (!context) {
        throw new Error(
            "useTemplateVariableGraphQL must be used within a TemplateVariableGraphQLProvider",
        );
    }
    return context;
};

export const Provider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    // Get functions from individual hooks
    const textContext = useTextTemplateVariableGraphQL();
    const numberContext = useNumberTemplateVariableGraphQL();
    const dateContext = useDateTemplateVariableGraphQL();
    const selectContext = useSelectTemplateVariableGraphQL();

    const contextValue = useMemo(
        () => ({
            // Text template variable mutations
            createTextTemplateVariableMutation:
                textContext.createTextTemplateVariableMutation,
            updateTextTemplateVariableMutation:
                textContext.updateTextTemplateVariableMutation,

            // Number template variable mutations
            createNumberTemplateVariableMutation:
                numberContext.createNumberTemplateVariableMutation,
            updateNumberTemplateVariableMutation:
                numberContext.updateNumberTemplateVariableMutation,

            // Date template variable mutations
            createDateTemplateVariableMutation:
                dateContext.createDateTemplateVariableMutation,
            updateDateTemplateVariableMutation:
                dateContext.updateDateTemplateVariableMutation,

            // Select template variable mutations
            createSelectTemplateVariableMutation:
                selectContext.createSelectTemplateVariableMutation,
            updateSelectTemplateVariableMutation:
                selectContext.updateSelectTemplateVariableMutation,

            // Delete mutation (available in any context, we'll take it from text)
            deleteTemplateVariableMutation:
                textContext.deleteTemplateVariableMutation,
        }),
        [textContext, numberContext, dateContext, selectContext],
    );

    return (
        <TemplateVariableGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateVariableGraphQLContext.Provider>
    );
};

const WithGraphQL: React.FC<{
    children: React.ReactNode;
    templateId: number;
}> = ({ children, templateId }) => {
    return (
        <TextTemplateVariableGraphQLProvider templateId={templateId}>
            <NumberTemplateVariableGraphQLProvider templateId={templateId}>
                <DateTemplateVariableGraphQLProvider templateId={templateId}>
                    <SelectTemplateVariableGraphQLProvider
                        templateId={templateId}
                    >
                        <Provider>{children}</Provider>
                    </SelectTemplateVariableGraphQLProvider>
                </DateTemplateVariableGraphQLProvider>
            </NumberTemplateVariableGraphQLProvider>
        </TextTemplateVariableGraphQLProvider>
    );
};

export const TemplateVariableGraphQLProvider = WithGraphQL;
