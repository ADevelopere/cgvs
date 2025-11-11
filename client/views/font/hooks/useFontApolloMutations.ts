"use client";

import { useMutation, useApolloClient } from "@apollo/client/react";
import * as Document from "./font.documents";
import { useFontStore } from "../stores/useFontStore";
import logger from "@/client/lib/logger";

/**
 * Apollo mutations hook for font operations
 * Handles cache updates
 */
export const useFontApolloMutations = () => {
  const store = useFontStore();
  const client = useApolloClient();

  /**
   * Evict font families cache to force refetch
   */
  const evictFontFamiliesCache = () => {
    logger.info({ caller: "useFontApolloMutations" }, "Evicting font families cache");
    client.cache.evict({ id: "ROOT_QUERY", fieldName: "fontFamilies" });
    client.cache.gc();
  };

  /**
   * Evict font variants cache to force refetch
   */
  const evictFontVariantsCache = () => {
    logger.info({ caller: "useFontApolloMutations" }, "Evicting font variants cache");
    client.cache.evict({ id: "ROOT_QUERY", fieldName: "fontVariants" });
    client.cache.gc();
  };

  // Font Family Mutations
  const [createFamilyMutation] = useMutation(Document.createFontFamilyMutationDocument, {
    update() {
      evictFontFamiliesCache();
    },
  });

  const [updateFamilyMutation] = useMutation(Document.updateFontFamilyMutationDocument, {
    update() {
      evictFontFamiliesCache();
    },
  });

  const [deleteFamilyMutation] = useMutation(Document.deleteFontFamilyMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteFontFamily) return;
      cache.evict({ id: cache.identify({ __typename: "FontFamily", id: data.deleteFontFamily.id }) });
      evictFontFamiliesCache();
      if (store.selectedFamilyId === data.deleteFontFamily.id) {
        store.setSelectedFamilyId(null);
      }
    },
  });

  // Font Variant Mutations
  const [createVariantMutation] = useMutation(Document.createFontVariantMutationDocument, {
    update() {
      evictFontVariantsCache();
    },
  });

  const [updateVariantMutation] = useMutation(Document.updateFontVariantMutationDocument, {
    update() {
      evictFontVariantsCache();
    },
  });

  const [deleteVariantMutation] = useMutation(Document.deleteFontVariantMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteFontVariant) return;
      cache.evict({ id: cache.identify({ __typename: "FontVariant", id: data.deleteFontVariant.id }) });
      evictFontVariantsCache();
      if (store.selectedVariantId === data.deleteFontVariant.id) {
        store.setSelectedVariantId(null);
      }
    },
  });

  const [createWithFamilyMutation] = useMutation(Document.createFontWithFamilyMutationDocument, {
    update() {
      evictFontFamiliesCache();
      evictFontVariantsCache();
    },
  });

  return {
    createFontFamilyMutation: createFamilyMutation,
    updateFontFamilyMutation: updateFamilyMutation,
    deleteFontFamilyMutation: deleteFamilyMutation,
    createFontVariantMutation: createVariantMutation,
    updateFontVariantMutation: updateVariantMutation,
    deleteFontVariantMutation: deleteVariantMutation,
    createFontWithFamilyMutation: createWithFamilyMutation,
  };
};
