"use client";

import React from "react";
import { ApolloCache } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { TemplateDocuments } from "./index";
import { useTemplateCategoryStore, useTemplateListStore } from "./index";

/**
 * Hook for template mutations
 * Provides mutation functions for template operations
 */
export const useTemplateMutations = () => {
  const categoryStore = useTemplateCategoryStore();
  const templateListStore = useTemplateListStore();

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
    const templatesPageCategoryId = templateListStore.currentCategory?.id;
    if (
      templatesPageCategoryId === categoryId ||
      templatesPageCategoryId === null
    ) {
      cache.evict({
        id: "ROOT_QUERY",
        fieldName: "templatesByCategoryId",
        args: {
          categoryId: templatesPageCategoryId ?? undefined,
          ...templateListStore.templateQueryVariables,
        },
      });
    }
  };

  // Update template mutation
  const [updateTemplateMutation] = useMutation(
    TemplateDocuments.updateTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplate) return;
        const updatedTemplate = data.updateTemplate;
        const newCategoryId = updatedTemplate.category?.id;

        const existingTemplateData = cache.readQuery<Graphql.TemplateQuery>({
          query: TemplateDocuments.templateQueryDocument,
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

  // Create template mutation
  const [createTemplateMutation] = useMutation(
    TemplateDocuments.createTemplateQueryDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplate) return;
        evictTemplateQueries(cache, data.createTemplate.category?.id);
        cache.gc();
      },
    },
  );

  // Delete template mutation
  const [deleteTemplateMutation] = useMutation(
    TemplateDocuments.deleteTemplateMutationDocument,
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
    TemplateDocuments.suspendTemplateMutationDocument,
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
    TemplateDocuments.unsuspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.unsuspendTemplate) return;
        evictTemplateQueries(cache, data.unsuspendTemplate.category?.id);
        cache.evict({ id: "ROOT_QUERY", fieldName: "suspendedTemplates" });
        cache.gc();
      },
    },
  );

  return React.useMemo(
    () => ({
      createTemplateMutation,
      updateTemplateMutation,
      deleteTemplateMutation,
      suspendTemplateMutation,
      unsuspendTemplateMutation,
    }),
    [
      createTemplateMutation,
      updateTemplateMutation,
      deleteTemplateMutation,
      suspendTemplateMutation,
      unsuspendTemplateMutation,
    ],
  );
};
