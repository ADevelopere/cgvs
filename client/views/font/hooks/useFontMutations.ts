"use client";

import { useMutation } from "@apollo/client/react";
import { deleteFontVariantMutationDocument } from "./font.documents";

/**
 * Font Mutations Hook
 *
 * Provides GraphQL mutations for font operations
 */
export const useFontMutations = () => {
  const [deleteFontVariantMutation] = useMutation(deleteFontVariantMutationDocument, {
    refetchQueries: ["fontFamilies", "fontVariants"],
  });

  return {
    deleteFontVariantMutation,
  };
};
