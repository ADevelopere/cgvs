"use client";

import React, { createContext, useContext, useCallback } from "react";
import * as Types from "@/graphql/generated/types";
import {
    mapTemplateCategory,
} from "@/utils/template/template-category-mapper";
import { FetchResult } from "@apollo/client";

type TemplateCategoryGraphQLContextType = {
    /**
     * Query to fetch all template categories
     */
    templateCategoriesQuery: (
        variables?: Types.TemplateCategoriesQueryVariables,
    ) => Promise<FetchResult<Types.TemplateCategoriesQuery>>;

    /**
     * Mutation to create a new template category
     * @param variables - The create template category variables
     */
    createTemplateCategoryMutation: (
        variables: Types.CreateTemplateCategoryMutationVariables,
    ) => Promise<FetchResult<Types.CreateTemplateCategoryMutation>>;

    /**
     * Mutation to update an existing template category
     * @param variables - The update template category variables
     */
    updateTemplateCategoryMutation: (
        variables: Types.UpdateTemplateCategoryMutationVariables,
    ) => Promise<FetchResult<Types.UpdateTemplateCategoryMutation>>;

    /**
     * Mutation to delete a template category
     * @param variables - The delete template category variables
     */
    deleteTemplateCategoryMutation: (
        variables: Types.DeleteTemplateCategoryMutationVariables,
    ) => Promise<FetchResult<Types.DeleteTemplateCategoryMutation>>;
};

const TemplateCategoryGraphQLContext = createContext<
    TemplateCategoryGraphQLContextType | undefined
>(undefined);

export const useTemplateCategoryGraphQL = () => {
    const context = useContext(TemplateCategoryGraphQLContext);
    if (!context) {
        throw new Error(
            "useTemplateCategoryGraphQL must be used within a TemplateCategoryGraphQLProvider",
        );
    }
    return context;
};

export const TemplateCategoryGraphQLProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    // Query for fetching categories
    const { refetch } = Types.useTemplateCategoriesQuery({
        variables: {
            first: 2147483647,
        },
    });

    // Create category mutation
    const [mutateCreate] = Types.useCreateTemplateCategoryMutation({
        update(cache, { data }) {
            if (!data?.createTemplateCategory) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>(
                {
                    query: Types.TemplateCategoriesDocument,
                    variables: { first: 2147483647 },
                },
            );

            if (!existingData?.templateCategories?.data) return;

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
                data: {
                    templateCategories: {
                        ...existingData.templateCategories,
                        data: [
                            ...existingData.templateCategories.data,
                            data.createTemplateCategory,
                        ],
                    },
                },
            });
        },
    });

    // Update category mutation
    const [mutateUpdate] = Types.useUpdateTemplateCategoryMutation({
        update(cache, { data }) {
            if (!data?.updateTemplateCategory) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>(
                {
                    query: Types.TemplateCategoriesDocument,
                    variables: { first: 2147483647 },
                },
            );

            if (!existingData?.templateCategories?.data) return;

            const updatedCategory = mapTemplateCategory(data);
            if (!updatedCategory) return;

            const updatedData = existingData.templateCategories.data.map(
                (category) =>
                    category.id === updatedCategory.id
                        ? data.updateTemplateCategory
                        : category,
            );

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
                data: {
                    templateCategories: {
                        ...existingData.templateCategories,
                        data: updatedData,
                    },
                },
            });
        },
    });

    // Delete category mutation
    const [mutateDelete] = Types.useDeleteTemplateCategoryMutation({
        update(cache, { data }) {
            if (!data?.deleteTemplateCategory) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>(
                {
                    query: Types.TemplateCategoriesDocument,
                    variables: { first: 2147483647 },
                },
            );

            if (!existingData?.templateCategories?.data) return;

            const updatedData = existingData.templateCategories.data.filter(
                (category) => category.id !== data.deleteTemplateCategory.id,
            );

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                variables: { first: 2147483647 },
                data: {
                    templateCategories: {
                        ...existingData.templateCategories,
                        data: updatedData,
                    },
                },
            });
        },
    });

    // Wrapper functions for mutations and queries
    const templateCategoriesQuery = useCallback(
        async (variables?: Types.TemplateCategoriesQueryVariables) => {
            return refetch(variables);
        },
        [refetch],
    );

    const createTemplateCategoryMutation = useCallback(
        async (variables: Types.CreateTemplateCategoryMutationVariables) => {
            return mutateCreate({
                variables,
            });
        },
        [mutateCreate],
    );

    const updateTemplateCategoryMutation = useCallback(
        async (variables: Types.UpdateTemplateCategoryMutationVariables) => {
            return mutateUpdate({
                variables,
            });
        },
        [mutateUpdate],
    );

    const deleteTemplateCategoryMutation = useCallback(
        async (variables: Types.DeleteTemplateCategoryMutationVariables) => {
            return mutateDelete({
                variables,
            });
        },
        [mutateDelete],
    );

    const contextValue: TemplateCategoryGraphQLContextType = {
        templateCategoriesQuery,
        createTemplateCategoryMutation,
        updateTemplateCategoryMutation,
        deleteTemplateCategoryMutation,
    };

    return (
        <TemplateCategoryGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateCategoryGraphQLContext.Provider>
    );
};
