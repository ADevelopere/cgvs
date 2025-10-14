"use client";

import React from "react";
import { ApolloCache, gql } from "@apollo/client";
import * as Document from "./0-categories.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useMutation } from "@apollo/client/react";
import * as SharedDocument from "@/client/graphql/sharedDocuments";
import { useTemplateCategoryUIStore } from "./3-categories.store";
import { useTemplatesPageStore } from "../templates/templatesPage.store";

type TemplateCategoryGraphQLContextType = {
  /**
   * Mutation to create a new template category
   * @param variables - The create template category variables
   */
  createTemplateCategoryMutation: useMutation.MutationFunction<
    Graphql.CreateTemplateCategoryMutation,
    {
      input: Graphql.TemplateCategoryCreateInput;
    },
    ApolloCache
  >;

  /**
   * Mutation to update an existing template category
   * @param variables - The update template category variables
   */
  updateTemplateCategoryMutation: useMutation.MutationFunction<
    Graphql.UpdateTemplateCategoryMutation,
    {
      input: Graphql.TemplateCategoryUpdateInput;
    },
    ApolloCache
  >;

  /**
   * Mutation to delete a template category
   * @param variables - The delete template category variables
   */
  deleteTemplateCategoryMutation: useMutation.MutationFunction<
    Graphql.DeleteTemplateCategoryMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;

  createTemplateMutation: useMutation.MutationFunction<
    Graphql.CreateTemplateMutation,
    {
      input: Graphql.TemplateCreateInput;
    },
    ApolloCache
  >;

  updateTemplateMutation: useMutation.MutationFunction<
    Graphql.UpdateTemplateMutation,
    {
      input: Graphql.TemplateUpdateInput;
    },
    ApolloCache
  >;

  deleteTemplateMutation: useMutation.MutationFunction<
    Graphql.DeleteTemplateMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;

  suspendTemplateMutation: useMutation.MutationFunction<
    Graphql.SuspendTemplateMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;

  unsuspendTemplateMutation: useMutation.MutationFunction<
    Graphql.UnsuspendTemplateMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;
};

const TemplateCategoryGraphQLContext = React.createContext<
  TemplateCategoryGraphQLContextType | undefined
>(undefined);

export const useTemplateCategoryGraphQL = () => {
  const context = React.useContext(TemplateCategoryGraphQLContext);
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
  const categoryStore = useTemplateCategoryUIStore();
  const templatesPageStore = useTemplatesPageStore();

  // Create category mutation - simplified with cache.updateQuery
  const [createTemplateCategoryMutation] = useMutation(
    Document.createTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateCategory) return;
        const newCategory = data.createTemplateCategory;
        const parentId = newCategory.parentCategory?.id;

        // Add to parent's children query cache (null for root categories)
        cache.updateQuery<Graphql.CategoryChildrenQuery>(
          {
            query: SharedDocument.categoryChildrenQueryDocument,
            variables: { parentCategoryId: parentId ?? null },
          },
          (existing) => {
            if (!existing?.categoryChildren) return existing;
            return {
              categoryChildren: [...existing.categoryChildren, newCategory],
            };
          },
        );
      },
    },
  );

  // Update category mutation - simplified with cache.updateQuery
  const [updateTemplateCategoryMutation] = useMutation(
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
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: SharedDocument.categoryChildrenQueryDocument,
              variables: { parentCategoryId: newParentId ?? null },
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
        } else {
          // Parent changed - remove from old, add to new
          // Remove from old parent
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: SharedDocument.categoryChildrenQueryDocument,
              variables: { parentCategoryId: oldParentId ?? null },
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

          // Add to new parent
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: SharedDocument.categoryChildrenQueryDocument,
              variables: { parentCategoryId: newParentId ?? null },
            },
            (existing) => {
              if (!existing?.categoryChildren) return existing;
              return {
                categoryChildren: [...existing.categoryChildren, updated],
              };
            },
          );
        }
      },
    },
  );

  // Delete category mutation - simplified with cache.updateQuery
  const [deleteTemplateCategoryMutation] = useMutation(
    Document.deleteTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteTemplateCategory) return;
        const deleted = data.deleteTemplateCategory;
        const parentId = deleted.parentCategory?.id;

        // Remove from parent's children query (null for root categories)
        cache.updateQuery<Graphql.CategoryChildrenQuery>(
          {
            query: SharedDocument.categoryChildrenQueryDocument,
            variables: { parentCategoryId: parentId ?? null },
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
      },
    },
  );

  // Create template mutation
  const [createTemplateMutation] = useMutation(
    Document.createTemplateQueryDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplate) return;
        const createdTemplate = data.createTemplate;

        const categoryId = createdTemplate.category?.id;

        // Skip if category doesn't exist
        if (!categoryId) {
          return;
        }

        // Evict cache for category page store
        const categoryQueryVars =
          categoryStore.getTemplateQueryVariables(categoryId);
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "templatesByCategoryId",
          args: {
            categoryId,
            ...categoryQueryVars,
          },
        });

        // Evict cache for templates page store (if category matches or if viewing all)
        const templatesPageCategoryId = templatesPageStore.currentCategoryId;
        if (
          templatesPageCategoryId === categoryId ||
          templatesPageCategoryId === null
        ) {
          cache.evict({
            id: "ROOT_QUERY",
            fieldName: "templatesByCategoryId",
            args: {
              categoryId: templatesPageCategoryId ?? undefined,
              ...templatesPageStore.templateQueryVariables,
            },
          });
        }

        cache.gc();
      },
    },
  );

  // Update template mutation
  const [updateTemplateMutation] = useMutation(
    Document.updateTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplate) return;

        const updatedTemplate = data.updateTemplate;

        // First, get the old template to check the old category ID
        let existingTemplateData: Graphql.TemplateQuery | null = null;
        try {
          existingTemplateData = cache.readQuery<Graphql.TemplateQuery>({
            query: SharedDocument.templateQueryDocument,
            variables: { id: updatedTemplate.id },
          });
        } catch {
          // Template not in cache, skip update
          return;
        }

        if (!existingTemplateData?.template) {
          // Template not in cache, skip update
          return;
        }

        const oldTemplate = existingTemplateData.template;
        const oldCategoryId = oldTemplate.category?.id;
        const newCategoryId = updatedTemplate.category?.id;

        // Skip if categories don't exist
        if (!oldCategoryId || !newCategoryId) {
          return;
        }

        // Evict cache for category page store
        const oldQueryVars =
          categoryStore.getTemplateQueryVariables(oldCategoryId);
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "templatesByCategoryId",
          args: {
            categoryId: oldCategoryId,
            ...oldQueryVars,
          },
        });

        if (oldCategoryId !== newCategoryId) {
          const newQueryVars =
            categoryStore.getTemplateQueryVariables(newCategoryId);
          cache.evict({
            id: "ROOT_QUERY",
            fieldName: "templatesByCategoryId",
            args: {
              categoryId: newCategoryId,
              ...newQueryVars,
            },
          });
        }

        // Evict cache for templates page store
        const templatesPageCategoryId = templatesPageStore.currentCategoryId;
        if (
          templatesPageCategoryId === oldCategoryId ||
          templatesPageCategoryId === newCategoryId ||
          templatesPageCategoryId === null
        ) {
          cache.evict({
            id: "ROOT_QUERY",
            fieldName: "templatesByCategoryId",
            args: {
              categoryId: templatesPageCategoryId ?? undefined,
              ...templatesPageStore.templateQueryVariables,
            },
          });
        }

        cache.gc();
      },
    },
  );

  // Delete template mutation
  const [deleteTemplateMutation] = useMutation(
    Document.deleteTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteTemplate) return;

        const deletedTemplate = data.deleteTemplate;
        const categoryId = deletedTemplate.category?.id;

        // Skip if category doesn't exist
        if (!categoryId) {
          return;
        }

        // Evict cache for category page store
        const categoryQueryVars =
          categoryStore.getTemplateQueryVariables(categoryId);
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "templatesByCategoryId",
          args: {
            categoryId,
            ...categoryQueryVars,
          },
        });

        // Evict cache for templates page store (if category matches or if viewing all)
        const templatesPageCategoryId = templatesPageStore.currentCategoryId;
        if (
          templatesPageCategoryId === categoryId ||
          templatesPageCategoryId === null
        ) {
          cache.evict({
            id: "ROOT_QUERY",
            fieldName: "templatesByCategoryId",
            args: {
              categoryId: templatesPageCategoryId ?? undefined,
              ...templatesPageStore.templateQueryVariables,
            },
          });
        }

        cache.gc();
      },
    },
  );

  // Move to deletion category mutation
  const [suspendTemplateMutation] = useMutation(
    Document.suspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.suspendTemplate) return;

        const suspendedTemplate = data.suspendTemplate;

        // Use preSuspensionCategory from the suspended template
        const oldCategoryId = suspendedTemplate.preSuspensionCategory?.id;

        // Skip if old category doesn't exist
        if (!oldCategoryId) {
          return;
        }

        // Evict cache for category page store
        const categoryQueryVars =
          categoryStore.getTemplateQueryVariables(oldCategoryId);
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "templatesByCategoryId",
          args: {
            categoryId: oldCategoryId,
            ...categoryQueryVars,
          },
        });

        // Evict cache for templates page store (if category matches or if viewing all)
        const templatesPageCategoryId = templatesPageStore.currentCategoryId;
        if (
          templatesPageCategoryId === oldCategoryId ||
          templatesPageCategoryId === null
        ) {
          cache.evict({
            id: "ROOT_QUERY",
            fieldName: "templatesByCategoryId",
            args: {
              categoryId: templatesPageCategoryId ?? undefined,
              ...templatesPageStore.templateQueryVariables,
            },
          });
        }

        // Evict suspended templates cache
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "suspendedTemplates",
        });

        cache.gc();
      },
    },
  );

  // Restore template mutation
  const [unsuspendTemplateMutation] = useMutation(
    Document.unsuspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.unsuspendTemplate) return;

        const unsuspendedTemplate = data.unsuspendTemplate;

        // Get the destination category ID from the unsuspended template
        const newCategoryId = unsuspendedTemplate.category?.id;

        // Skip if destination category doesn't exist
        if (!newCategoryId) {
          return;
        }

        // Evict suspended templates cache
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "suspendedTemplates",
        });

        // Evict cache for category page store
        const categoryQueryVars =
          categoryStore.getTemplateQueryVariables(newCategoryId);
        cache.evict({
          id: "ROOT_QUERY",
          fieldName: "templatesByCategoryId",
          args: {
            categoryId: newCategoryId,
            ...categoryQueryVars,
          },
        });

        // Evict cache for templates page store (if category matches or if viewing all)
        const templatesPageCategoryId = templatesPageStore.currentCategoryId;
        if (
          templatesPageCategoryId === newCategoryId ||
          templatesPageCategoryId === null
        ) {
          cache.evict({
            id: "ROOT_QUERY",
            fieldName: "templatesByCategoryId",
            args: {
              categoryId: templatesPageCategoryId ?? undefined,
              ...templatesPageStore.templateQueryVariables,
            },
          });
        }

        cache.gc();
      },
    },
  );

  const contextValue = React.useMemo(
    () => ({
      createTemplateCategoryMutation,
      updateTemplateCategoryMutation,
      deleteTemplateCategoryMutation,
      createTemplateMutation,
      updateTemplateMutation,
      deleteTemplateMutation,
      suspendTemplateMutation,
      unsuspendTemplateMutation,
    }),
    [
      createTemplateCategoryMutation,
      updateTemplateCategoryMutation,
      deleteTemplateCategoryMutation,
      createTemplateMutation,
      updateTemplateMutation,
      deleteTemplateMutation,
      suspendTemplateMutation,
      unsuspendTemplateMutation,
    ],
  );

  return (
    <TemplateCategoryGraphQLContext.Provider value={contextValue}>
      {children}
    </TemplateCategoryGraphQLContext.Provider>
  );
};
