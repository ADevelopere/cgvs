"use client";

import React from "react";
import { ApolloCache, gql } from "@apollo/client";
import * as Document from "./categories.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as SharedDocument from "@/client/graphql/sharedDocuments";
import { useTemplateCategoryStore } from "./useTemplateCategoryStore";
import { useTemplatesPageStore } from "@/client/views/templates/useTemplatesPageStore";
import { useMutation } from "@apollo/client/react";

/**
 * A custom React hook that provides mutation functions for managing
 * template categories and templates, including Apollo cache updates.
 */
export const useTemplateCategoryApolloMutations = () => {
  const categoryStore = useTemplateCategoryStore();
  const templatesPageStore = useTemplatesPageStore();

  // Create category mutation
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

  // Update category mutation
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

        if (oldParentId !== newParentId) {
          // Parent changed: remove from old list
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: SharedDocument.categoryChildrenQueryDocument,
              variables: { parentCategoryId: oldParentId ?? null },
            },
            (existing) => ({
              categoryChildren:
                existing?.categoryChildren.filter((c) => c.id !== updated.id) ??
                [],
            }),
          );
        }

        // Add to new list (or update in place if parent is the same)
        cache.updateQuery<Graphql.CategoryChildrenQuery>(
          {
            query: SharedDocument.categoryChildrenQueryDocument,
            variables: { parentCategoryId: newParentId ?? null },
          },
          (existing) => {
            if (!existing?.categoryChildren)
              return { categoryChildren: [updated] };
            const existingIndex = existing.categoryChildren.findIndex(
              (c) => c.id === updated.id,
            );
            if (existingIndex > -1) {
              const newChildren = [...existing.categoryChildren];
              newChildren[existingIndex] = {
                ...newChildren[existingIndex],
                ...updated,
              };
              return { categoryChildren: newChildren };
            }
            return {
              categoryChildren: [...existing.categoryChildren, updated],
            };
          },
        );
      },
    },
  );

  // Delete category mutation
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

  // Helper function to evict template queries from the cache
  const evictTemplateQueries = (
    cache: ApolloCache,
    categoryId: number | null | undefined,
  ) => {
    if (categoryId === undefined) return;

    // Evict for the specific category's view
    const categoryQueryVars = categoryStore.getTemplateQueryVariables(
      categoryId as number,
    );
    cache.evict({
      id: "ROOT_QUERY",
      fieldName: "templatesByCategoryId",
      args: { categoryId, ...categoryQueryVars },
    });

    // Evict for the main templates page view if it's showing this category or all categories
    const templatesPageCategoryId = templatesPageStore.currentCategory?.id;
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
  };

  // Create template mutation
  const [createTemplateMutation] = useMutation(
    Document.createTemplateQueryDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplate) return;
        evictTemplateQueries(cache, data.createTemplate.category?.id);
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
        const newCategoryId = updatedTemplate.category?.id;

        const existingTemplateData = cache.readQuery<Graphql.TemplateQuery>({
          query: SharedDocument.templateQueryDocument,
          variables: { id: updatedTemplate.id },
        });
        const oldCategoryId = existingTemplateData?.template?.category?.id;

        evictTemplateQueries(cache, oldCategoryId);
        if (oldCategoryId !== newCategoryId) {
          evictTemplateQueries(cache, newCategoryId);
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
        evictTemplateQueries(cache, data.deleteTemplate.category?.id);
        cache.gc();
      },
    },
  );

  // Suspend template mutation
  const [suspendTemplateMutation] = useMutation(
    Document.suspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.suspendTemplate) return;
        evictTemplateQueries(
          cache,
          data.suspendTemplate.preSuspensionCategory?.id,
        );
        cache.evict({ id: "ROOT_QUERY", fieldName: "suspendedTemplates" });
        cache.gc();
      },
    },
  );

  // Unsuspend template mutation
  const [unsuspendTemplateMutation] = useMutation(
    Document.unsuspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.unsuspendTemplate) return;
        evictTemplateQueries(cache, data.unsuspendTemplate.category?.id);
        cache.evict({ id: "ROOT_QUERY", fieldName: "suspendedTemplates" });
        cache.gc();
      },
    },
  );

  // useMemo ensures the hook returns a stable object, preventing unnecessary re-renders
  return React.useMemo(
    () => ({
      /**
       * Mutation to create a new template category
       * @param variables - The create template category variables
       */
      createTemplateCategoryMutation,
      /**
       * Mutation to update an existing template category
       * @param variables - The update template category variables
       */
      updateTemplateCategoryMutation,
      /**
       * Mutation to delete a template category
       * @param variables - The delete template category variables
       */
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
};
