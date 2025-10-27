"use client";

import { useMutation, useApolloClient } from "@apollo/client/react";
import { gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./font.documents";
import { useFontStore } from "../stores/useFontStore";
import logger from "@/client/lib/logger";

/**
 * Apollo mutations hook for font operations
 * Handles cache updates and optimistic responses
 */
export const useFontApolloMutations = () => {
  const store = useFontStore();
  const client = useApolloClient();

  /**
   * Evict fonts cache to force refetch
   */
  const evictFontsCache = () => {
    logger.info("Evicting fonts cache");

    // Evict fonts query
    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "fonts",
    });

    // Evict search results
    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "searchFonts",
    });

    // Run garbage collection
    client.cache.gc();
  };

  /**
   * Create font mutation
   */
  const [createMutation] = useMutation(Document.createFontMutationDocument, {
    update(cache, { data }) {
      if (!data?.createFont) return;

      logger.info("Font created, updating cache:", data.createFont);

      // Evict cache to force refetch
      evictFontsCache();
    },
    onError(error) {
      logger.error("Create font mutation error:", error);
    },
  });

  /**
   * Update font mutation with optimistic response
   */
  const [updateMutation] = useMutation(Document.updateFontMutationDocument, {
    optimisticResponse: vars => {
      logger.info("Optimistic update for font:", vars.input.id);

      try {
        // Read existing font from cache
        const existingFont = client.cache.readFragment<
          Graphql.FontQuery["font"]
        >({
          id: client.cache.identify({
            __typename: "Font",
            id: vars.input.id,
          }),
          fragment: gql`
            fragment FontFields on Font {
              id
              name
              locale
              storageFilePath
              createdAt
              updatedAt
            }
          `,
        });

        // Return optimistic response
        return {
          __typename: "Mutation" as const,
          updateFont: {
            __typename: "Font" as const,
            id: vars.input.id,
            name: vars.input.name,
            locale: vars.input.locale,
            storageFilePath: vars.input.storageFilePath,
            createdAt: existingFont?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      } catch (error) {
        logger.error("Error creating optimistic response:", error);
        // Return partial data if cache read fails
        return {
          __typename: "Mutation" as const,
          updateFont: {
            __typename: "Font" as const,
            id: vars.input.id,
            name: vars.input.name,
            locale: vars.input.locale,
            storageFilePath: vars.input.storageFilePath,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      }
    },
    update(cache, { data }) {
      if (!data?.updateFont) return;

      logger.info("Font updated, evicting cache:", data.updateFont);

      // Evict fonts list to refetch with updated data
      evictFontsCache();
    },
    onError(error) {
      logger.error("Update font mutation error:", error);
    },
  });

  /**
   * Delete font mutation
   */
  const [deleteMutation] = useMutation(Document.deleteFontMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteFont) return;

      logger.info("Font deleted, updating cache:", data.deleteFont);

      // Remove from cache
      cache.evict({
        id: cache.identify({
          __typename: "Font",
          id: data.deleteFont.id,
        }),
      });

      // Evict fonts list
      evictFontsCache();

      // Clear selection if deleted font was selected
      if (store.selectedFont?.id === data.deleteFont.id) {
        store.setSelectedFont(null);
      }
    },
    onError(error) {
      logger.error("Delete font mutation error:", error);
    },
  });

  return {
    createFontMutation: createMutation,
    updateFontMutation: updateMutation,
    deleteFontMutation: deleteMutation,
    evictFontsCache,
  };
};
