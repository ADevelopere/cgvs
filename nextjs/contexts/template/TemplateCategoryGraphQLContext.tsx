"use client";

import React, { createContext, useContext, useCallback } from "react";
import * as Types from "@/graphql/generated/types";
import { mapTemplateCategory } from "@/utils/template/template-category-mapper";
import { FetchResult } from "@apollo/client";

type TemplateCategoryGraphQLContextType = {
    /**
     * Query to fetch all template categories in a flat structure
     */
    templateCategoriesQuery: () => Promise<
        FetchResult<Types.TemplateCategoriesQuery>
    >;

    /**
     * Query to fetch a single template category by ID
     */
    templateCategoryQuery: (
        variables: Types.QueryTemplateCategoryArgs,
    ) => Promise<FetchResult<Types.TemplateCategoryQuery>>;

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
    // Query for fetching flat categories
    const { refetch: refetchFlat } = Types.useTemplateCategoriesQuery();

    // Query for fetching paginated categories
    const { refetch: refetchPaginated } = Types.useTemplateCategoriesQuery({
        skip: true, // Skip initial execution since we'll only use refetch
    });

    // Query for fetching single category
    const { refetch: refetchSingle } = Types.useTemplateCategoryQuery({
        skip: true, // Skip initial execution since we'll only use refetch
    });

    // Create category mutation
    const [mutateCreate] = Types.useCreateTemplateCategoryMutation({
        update(cache, { data }) {
            if (!data?.createTemplateCategory) return;

            const existingData = cache.readQuery<Types.TemplateCategoriesQuery>(
                {
                    query: Types.TemplateCategoriesDocument,
                },
            );

            if (!existingData?.templateCategories) return;

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                data: {
                    templateCategories: [
                        ...existingData.templateCategories,
                        {
                            ...data.createTemplateCategory,
                            templates: [],
                        },
                    ],
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
                },
            );

            if (!existingData?.templateCategories) return;

            const updatedCategory = mapTemplateCategory(data);
            if (!updatedCategory) return;

            const updatedData = existingData.templateCategories.map(
                (category) =>
                    category.id === updatedCategory.id
                        ? { 
                            ...data.updateTemplateCategory,
                            templates: category.templates,
                        }
                        : category,
            );

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                data: {
                    templateCategories: updatedData,
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
                },
            );

            if (!existingData?.templateCategories) return;

            const updatedData = existingData.templateCategories.filter(
                (category) => category.id !== data.deleteTemplateCategory.id,
            );

            cache.writeQuery({
                query: Types.TemplateCategoriesDocument,
                data: {
                    templateCategories: updatedData,
                },
            });
        },
    });

    // Wrapper functions for mutations and queries
    const templateCategoriesQuery = useCallback(async () => {
        return refetchFlat();
    }, [refetchFlat]);

    const templateCategoryQuery = useCallback(
        async (variables: Types.QueryTemplateCategoryArgs) => {
            return refetchSingle(variables);
        },
        [refetchSingle],
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

    const contextValue = React.useMemo(
        () => ({
            templateCategoriesQuery,
            templateCategoryQuery,
            createTemplateCategoryMutation,
            updateTemplateCategoryMutation,
            deleteTemplateCategoryMutation,
        }),
        [
            templateCategoriesQuery,
            templateCategoryQuery,
            createTemplateCategoryMutation,
            updateTemplateCategoryMutation,
            deleteTemplateCategoryMutation,
        ],
    );

    return (
        <TemplateCategoryGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateCategoryGraphQLContext.Provider>
    );
};
