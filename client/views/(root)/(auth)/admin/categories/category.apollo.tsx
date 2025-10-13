"use client";

import React, { createContext, useContext, useCallback } from "react";
import { ApolloClient, gql } from "@apollo/client";
import * as Document from "@/client/graphql/documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useMutation, useLazyQuery } from "@apollo/client/react";

type TemplateCategoryGraphQLContextType = {
  /**
   * Query to fetch all template categories in a flat structure
   */
  templateCategoriesQuery: () => Promise<
    ApolloClient.QueryResult<Graphql.TemplateCategoriesQuery>
  >;

  /**
   * Query to fetch a single template category by ID
   */
  templateCategoryQuery: (
    variables: Graphql.QueryTemplateCategoryArgs,
  ) => Promise<ApolloClient.QueryResult<Graphql.TemplateCategoryQuery>>;

  /**
   * Query to fetch children of a specific category by parent ID
   */
  categoryChildrenQuery: (
    variables: Graphql.CategoryChildrenQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.CategoryChildrenQuery>>;

  /**
   * Mutation to create a new template category
   * @param variables - The create template category variables
   */
  createTemplateCategoryMutation: (
    variables: Graphql.CreateTemplateCategoryMutationVariables,
  ) => Promise<
    ApolloClient.MutateResult<Graphql.CreateTemplateCategoryMutation>
  >;

  /**
   * Mutation to update an existing template category
   * @param variables - The update template category variables
   */
  updateTemplateCategoryMutation: (
    variables: Graphql.UpdateTemplateCategoryMutationVariables,
  ) => Promise<
    ApolloClient.MutateResult<Graphql.UpdateTemplateCategoryMutation>
  >;

  /**
   * Mutation to delete a template category
   * @param variables - The delete template category variables
   */
  deleteTemplateCategoryMutation: (
    variables: Graphql.DeleteTemplateCategoryMutationVariables,
  ) => Promise<
    ApolloClient.MutateResult<Graphql.DeleteTemplateCategoryMutation>
  >;
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
  const [executeTemplateCategoriesQuery] = useLazyQuery(
    Document.templateCategoriesQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Query for fetching single category
  const [executeTemplateCategoryQuery] = useLazyQuery(
    Document.templateCategoryQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Query for fetching category children
  const [executeCategoryChildrenQuery] = useLazyQuery(
    Document.categoryChildrenQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Create category mutation - simplified with cache.updateQuery
  const [mutateCreate] = useMutation(
    Document.createTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateCategory) return;
        const newCategory = data.createTemplateCategory;
        const parentId = newCategory.parentCategory?.id;

        if (!parentId) {
          // Add to root query cache
          cache.updateQuery<Graphql.RootTemplateCategoriesQuery>(
            { query: Document.rootTemplateCategoriesQueryDocument },
            (existing) => {
              if (!existing?.rootTemplateCategories) return existing;
              return {
                rootTemplateCategories: [
                  ...existing.rootTemplateCategories,
                  newCategory,
                ],
              };
            },
          );
        } else {
          // Add to parent's children query cache
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: Document.categoryChildrenQueryDocument,
              variables: { parentCategoryId: parentId },
            },
            (existing) => {
              if (!existing?.categoryChildren) return existing;
              return {
                categoryChildren: [...existing.categoryChildren, newCategory],
              };
            },
          );
        }
      },
    },
  );

  // Update category mutation - simplified with cache.updateQuery
  const [mutateUpdate] = useMutation(
    Document.updateTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateCategory) return;
        const updated = data.updateTemplateCategory;
        const newParentId = updated.parentCategory?.id;

        // Get old parent to detect changes
        const oldCat = cache.readFragment<{
          parentCategory?: { id: number } | null;
        }>({
          id: cache.identify({
            __typename: "TemplateCategory",
            id: updated.id,
          }),
          fragment: gql`
            fragment Old on TemplateCategory {
              parentCategory {
                id
              }
            }
          `,
        });
        const oldParentId = oldCat?.parentCategory?.id;

        if (oldParentId === newParentId) {
          // Same parent - update in place
          if (!newParentId) {
            // Root level
            cache.updateQuery<Graphql.RootTemplateCategoriesQuery>(
              { query: Document.rootTemplateCategoriesQueryDocument },
              (existing) => {
                if (!existing?.rootTemplateCategories) return existing;
                return {
                  rootTemplateCategories: existing.rootTemplateCategories.map(
                    (c) => (c.id === updated.id ? { ...c, ...updated } : c),
                  ),
                };
              },
            );
          } else {
            // Child level
            cache.updateQuery<Graphql.CategoryChildrenQuery>(
              {
                query: Document.categoryChildrenQueryDocument,
                variables: { parentCategoryId: newParentId },
              },
              (existing) => {
                if (!existing?.categoryChildren) return existing;
                return {
                  categoryChildren: existing.categoryChildren.map((c) =>
                    c.id === updated.id ? { ...c, ...updated } : c,
                  ),
                };
              },
            );
          }
        } else {
          // Parent changed - remove from old, add to new
          // Remove from old parent
          if (oldParentId === undefined || oldParentId === null) {
            cache.updateQuery<Graphql.RootTemplateCategoriesQuery>(
              { query: Document.rootTemplateCategoriesQueryDocument },
              (existing) => {
                if (!existing?.rootTemplateCategories) return existing;
                return {
                  rootTemplateCategories:
                    existing.rootTemplateCategories.filter(
                      (c) => c.id !== updated.id,
                    ),
                };
              },
            );
          } else {
            cache.updateQuery<Graphql.CategoryChildrenQuery>(
              {
                query: Document.categoryChildrenQueryDocument,
                variables: { parentCategoryId: oldParentId },
              },
              (existing) => {
                if (!existing?.categoryChildren) return existing;
                return {
                  categoryChildren: existing.categoryChildren.filter(
                    (c) => c.id !== updated.id,
                  ),
                };
              },
            );
          }

          // Add to new parent
          if (newParentId === undefined || newParentId === null) {
            cache.updateQuery<Graphql.RootTemplateCategoriesQuery>(
              { query: Document.rootTemplateCategoriesQueryDocument },
              (existing) => {
                if (!existing?.rootTemplateCategories) return existing;
                return {
                  rootTemplateCategories: [
                    ...existing.rootTemplateCategories,
                    updated,
                  ],
                };
              },
            );
          } else {
            cache.updateQuery<Graphql.CategoryChildrenQuery>(
              {
                query: Document.categoryChildrenQueryDocument,
                variables: { parentCategoryId: newParentId },
              },
              (existing) => {
                if (!existing?.categoryChildren) return existing;
                return {
                  categoryChildren: [...existing.categoryChildren, updated],
                };
              },
            );
          }
        }
      },
    },
  );

  // Delete category mutation - simplified with cache.updateQuery
  const [mutateDelete] = useMutation(
    Document.deleteTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteTemplateCategory) return;
        const deleted = data.deleteTemplateCategory;
        const parentId = deleted.parentCategory?.id;

        if (!parentId) {
          // Remove from root query
          cache.updateQuery<Graphql.RootTemplateCategoriesQuery>(
            { query: Document.rootTemplateCategoriesQueryDocument },
            (existing) => {
              if (!existing?.rootTemplateCategories) return existing;
              return {
                rootTemplateCategories: existing.rootTemplateCategories.filter(
                  (c) => c.id !== deleted.id,
                ),
              };
            },
          );
        } else {
          // Remove from parent's children query
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: Document.categoryChildrenQueryDocument,
              variables: { parentCategoryId: parentId },
            },
            (existing) => {
              if (!existing?.categoryChildren) return existing;
              return {
                categoryChildren: existing.categoryChildren.filter(
                  (c) => c.id !== deleted.id,
                ),
              };
            },
          );
        }
      },
    },
  );

  // Wrapper functions for mutations and queries
  const templateCategoriesQuery = useCallback(async () => {
    return executeTemplateCategoriesQuery();
  }, [executeTemplateCategoriesQuery]);

  const templateCategoryQuery = useCallback(
    async (variables: Graphql.QueryTemplateCategoryArgs) => {
      return executeTemplateCategoryQuery({ variables });
    },
    [executeTemplateCategoryQuery],
  );

  const categoryChildrenQuery = useCallback(
    async (variables: Graphql.CategoryChildrenQueryVariables) => {
      return executeCategoryChildrenQuery({ variables });
    },
    [executeCategoryChildrenQuery],
  );

  const createTemplateCategoryMutation = useCallback(
    async (variables: Graphql.CreateTemplateCategoryMutationVariables) => {
      return mutateCreate({
        variables,
      });
    },
    [mutateCreate],
  );

  const updateTemplateCategoryMutation = useCallback(
    async (variables: Graphql.UpdateTemplateCategoryMutationVariables) => {
      return mutateUpdate({
        variables,
      });
    },
    [mutateUpdate],
  );

  const deleteTemplateCategoryMutation = useCallback(
    async (variables: Graphql.DeleteTemplateCategoryMutationVariables) => {
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
      categoryChildrenQuery,
      createTemplateCategoryMutation,
      updateTemplateCategoryMutation,
      deleteTemplateCategoryMutation,
    }),
    [
      templateCategoriesQuery,
      templateCategoryQuery,
      categoryChildrenQuery,
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
