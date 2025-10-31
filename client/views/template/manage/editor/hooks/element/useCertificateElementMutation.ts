"use client";

import React from "react";
import { ApolloCache } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import * as Documents from "./documents";

/**
 * Hook for certificate element mutations
 * Provides mutation functions for all element operations with cache management
 */
export const useCertificateElementMutation = () => {
  // Helper function to evict element queries from the cache
  const evictElementQueries = React.useCallback((cache: ApolloCache) => {
    // Evict ALL variations of elementsByTemplateId query
    // This ensures fresh data on next query and cleans up old cached data
    cache.evict({
      id: "ROOT_QUERY",
      fieldName: "elementsByTemplateId",
    });
  }, []);

  // ==================== Country Element Mutations ====================
  const [createCountryElementMutation] = useMutation(
    Documents.createCountryElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createCountryElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [updateCountryElementMutation] = useMutation(
    Documents.updateCountryElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateCountryElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  // ==================== Date Element Mutations ====================
  const [createDateElementMutation] = useMutation(
    Documents.createDateElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createDateElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [updateDateElementMutation] = useMutation(
    Documents.updateDateElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateDateElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  // ==================== Gender Element Mutations ====================
  const [createGenderElementMutation] = useMutation(
    Documents.createGenderElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createGenderElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [updateGenderElementMutation] = useMutation(
    Documents.updateGenderElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateGenderElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  // ==================== Image Element Mutations ====================
  const [createImageElementMutation] = useMutation(
    Documents.createImageElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createImageElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [updateImageElementMutation] = useMutation(
    Documents.updateImageElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateImageElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  // ==================== Number Element Mutations ====================
  const [createNumberElementMutation] = useMutation(
    Documents.createNumberElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createNumberElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [updateNumberElementMutation] = useMutation(
    Documents.updateNumberElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateNumberElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  // ==================== QRCode Element Mutations ====================
  const [createQRCodeElementMutation] = useMutation(
    Documents.createQRCodeElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createQRCodeElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [updateQRCodeElementMutation] = useMutation(
    Documents.updateQRCodeElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateQRCodeElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  // ==================== Text Element Mutations ====================
  const [createTextElementMutation] = useMutation(
    Documents.createTextElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTextElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [updateTextElementMutation] = useMutation(
    Documents.updateTextElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTextElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  // ==================== General Element Mutations ====================
  const [deleteElementMutation] = useMutation(
    Documents.deleteElementMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteElement) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  const [deleteElementsByIdsMutation] = useMutation(
    Documents.deleteElementsByIdsMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteElements) return;
        evictElementQueries(cache);
        cache.gc();
      },
    }
  );

  return React.useMemo(
    () => ({
      // Country Element
      createCountryElementMutation,
      updateCountryElementMutation,
      // Date Element
      createDateElementMutation,
      updateDateElementMutation,
      // Gender Element
      createGenderElementMutation,
      updateGenderElementMutation,
      // Image Element
      createImageElementMutation,
      updateImageElementMutation,
      // Number Element
      createNumberElementMutation,
      updateNumberElementMutation,
      // QRCode Element
      createQRCodeElementMutation,
      updateQRCodeElementMutation,
      // Text Element
      createTextElementMutation,
      updateTextElementMutation,
      // General mutations
      deleteElementMutation,
      deleteElementsByIdsMutation,
    }),
    [
      createCountryElementMutation,
      updateCountryElementMutation,
      createDateElementMutation,
      updateDateElementMutation,
      createGenderElementMutation,
      updateGenderElementMutation,
      createImageElementMutation,
      updateImageElementMutation,
      createNumberElementMutation,
      updateNumberElementMutation,
      createQRCodeElementMutation,
      updateQRCodeElementMutation,
      createTextElementMutation,
      updateTextElementMutation,
      deleteElementMutation,
      deleteElementsByIdsMutation,
    ]
  );
};
