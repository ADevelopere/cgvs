"use client";

import React from "react";
import { ApolloCache } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { TemplateDocuments } from "./index";

/**
 * Hook for template mutations
 * Provides mutation functions for template operations
 */
export const useTemplateMutations = () => {
  // Helper function to evict template queries from the cache
  const evictTemplateQueries = React.useCallback((cache: ApolloCache) => {
    // Evict ALL variations of templatesByCategoryId query (no args = evict all)
    // This ensures fresh data on next query and cleans up old cached pages
    cache.evict({
      id: "ROOT_QUERY",
      fieldName: "templatesByCategoryId",
    });
  }, []);

  // Update template mutation
  const [updateTemplateMutation] = useMutation(TemplateDocuments.updateTemplateMutationDocument, {
    update(cache, { data }) {
      if (!data?.updateTemplate) return;
      evictTemplateQueries(cache);
      cache.gc();
    },
  });

  // Create template mutation
  const [createTemplateMutation] = useMutation(TemplateDocuments.createTemplateQueryDocument, {
    update(cache, { data }) {
      if (!data?.createTemplate) return;
      evictTemplateQueries(cache);
      cache.gc();
    },
  });

  // Delete template mutation
  const [deleteTemplateMutation] = useMutation(TemplateDocuments.deleteTemplateMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteTemplate) return;
      evictTemplateQueries(cache);
      cache.gc();
    },
  });

  // Suspend template mutation
  const [suspendTemplateMutation] = useMutation(TemplateDocuments.suspendTemplateMutationDocument, {
    update(cache, { data }) {
      if (!data?.suspendTemplate) return;
      evictTemplateQueries(cache);
      cache.evict({ id: "ROOT_QUERY", fieldName: "suspendedTemplates" });
      cache.gc();
    },
  });

  // Unsuspend template mutation
  const [unsuspendTemplateMutation] = useMutation(TemplateDocuments.unsuspendTemplateMutationDocument, {
    update(cache, { data }) {
      if (!data?.unsuspendTemplate) return;
      evictTemplateQueries(cache);
      cache.evict({ id: "ROOT_QUERY", fieldName: "suspendedTemplates" });
      cache.gc();
    },
  });

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
    ]
  );
};
