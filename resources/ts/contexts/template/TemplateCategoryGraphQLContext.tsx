"use client";

import React, { createContext, useContext, useCallback } from "react";
import * as Types from "@/graphql/generated/types";
import {
    mapTemplateCategory,
} from "@/utils/template/template-category-mapper";
import { FetchResult } from "@apollo/client";

type TemplateCategoryGraphQLContextType = {
    /**
     * Query to fetch all template categories in a flat structure
     */
    flatTemplateCategoriesQuery: () => Promise<FetchResult<Types.FlatTemplateCategoriesQuery>>;

    /**
     * Query to fetch template categories with pagination
     */
    paginatedTemplateCategoriesQuery: (
        variables?: Types.TemplateCategoriesQueryVariables,
    ) => Promise<FetchResult<Types.TemplateCategoriesQuery>>;

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

    /**
     * Mutation to reorder template categories
     * @param variables - The reorder template categories variables
     */
    reorderTemplateCategoriesMutation: (
        variables: Types.ReorderTemplateCategoriesMutationVariables,
    ) => Promise<FetchResult<Types.ReorderTemplateCategoriesMutation>>;
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
    const { refetch: refetchFlat } = Types.useFlatTemplateCategoriesQuery();

    // Query for fetching paginated categories
    const { refetch: refetchPaginated } = Types.useTemplateCategoriesQuery({
        skip: true, // Skip initial execution since we'll only use refetch
        variables: { first: 10 }, // Default page size
    });

    // Query for fetching single category
    const { refetch: refetchSingle } = Types.useTemplateCategoryQuery({
        skip: true, // Skip initial execution since we'll only use refetch
        variables: { id: "" }, // Placeholder value, will be replaced in refetch
    });

    // Create category mutation
    const [mutateCreate] = Types.useCreateTemplateCategoryMutation({
        update(cache, { data }) {
            if (!data?.createTemplateCategory) return;

            const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>(
                {
                    query: Types.FlatTemplateCategoriesDocument,
                },
            );

            if (!existingData?.flatTemplateCategories) return;

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: [
                        ...existingData.flatTemplateCategories,
                        data.createTemplateCategory,
                    ],
                },
            });
        },
    });

    // Update category mutation
    const [mutateUpdate] = Types.useUpdateTemplateCategoryMutation({
        update(cache, { data }) {
            if (!data?.updateTemplateCategory) return;

            const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>(
                {
                    query: Types.FlatTemplateCategoriesDocument,
                },
            );

            if (!existingData?.flatTemplateCategories) return;

            const updatedCategory = mapTemplateCategory(data);
            if (!updatedCategory) return;

            const updatedData = existingData.flatTemplateCategories.map(
                (category) =>
                    category.id === updatedCategory.id
                        ? data.updateTemplateCategory
                        : category,
            );

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedData,
                },
            });
        },
    });

    // Delete category mutation
    const [mutateDelete] = Types.useDeleteTemplateCategoryMutation({
        update(cache, { data }) {
            if (!data?.deleteTemplateCategory) return;

            const existingData = cache.readQuery<Types.FlatTemplateCategoriesQuery>(
                {
                    query: Types.FlatTemplateCategoriesDocument,
                },
            );

            if (!existingData?.flatTemplateCategories) return;

            const updatedData = existingData.flatTemplateCategories.filter(
                (category) => category.id !== data.deleteTemplateCategory.id,
            );

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: updatedData,
                },
            });
        },
    });

    // Reorder categories mutation
    const [mutateReorder] = Types.useReorderTemplateCategoriesMutation({
        update(cache, { data }) {
            if (!data?.reorderTemplateCategories) return;

            cache.writeQuery({
                query: Types.FlatTemplateCategoriesDocument,
                data: {
                    flatTemplateCategories: data.reorderTemplateCategories,
                },
            });
        },
    });

    // Wrapper functions for mutations and queries
    const flatTemplateCategoriesQuery = useCallback(
        async () => {
            return refetchFlat();
        },
        [refetchFlat],
    );

    const paginatedTemplateCategoriesQuery = useCallback(
        async (variables?: Types.TemplateCategoriesQueryVariables) => {
            return refetchPaginated(variables || { first: 10 });
        },
        [refetchPaginated],
    );

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

    const reorderTemplateCategoriesMutation = useCallback(
        async (variables: Types.ReorderTemplateCategoriesMutationVariables) => {
            return mutateReorder({
                variables,
            });
        },
        [mutateReorder],
    );

    const contextValue: TemplateCategoryGraphQLContextType = {
        flatTemplateCategoriesQuery,
        paginatedTemplateCategoriesQuery,
        templateCategoryQuery,
        createTemplateCategoryMutation,
        updateTemplateCategoryMutation,
        deleteTemplateCategoryMutation,
        reorderTemplateCategoriesMutation,
    };

    return (
        <TemplateCategoryGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateCategoryGraphQLContext.Provider>
    );
};
