"use client";

import React from "react";
import { gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useMutation } from "@apollo/client/react";
import * as Document from "./hooks/recipientGroup.documents";

/**
 * A custom React hook that provides mutation functions for managing
 * template recipient groups, including Apollo cache updates.
 */
export const useRecipientGroupApolloMutations = () => {
  // Create recipient group mutation
  const [createTemplateRecipientGroupMutation] = useMutation(
    Document.createTemplateRecipientGroupMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateRecipientGroup) return;
        const newGroup = data.createTemplateRecipientGroup;
        const templateId = newGroup.template?.id;

        if (!templateId) return;

        // Add to template's recipient groups query cache
        cache.updateQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>(
          {
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateRecipientGroupsByTemplateId) return existing;
            return {
              templateRecipientGroupsByTemplateId: [
                ...existing.templateRecipientGroupsByTemplateId,
                newGroup,
              ],
            };
          },
        );
      },
    },
  );

  // Update recipient group mutation
  const [updateTemplateRecipientGroupMutation] = useMutation(
    Document.updateTemplateRecipientGroupMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateRecipientGroup) return;
        const updated = data.updateTemplateRecipientGroup;
        const templateId = updated.template?.id;

        if (!templateId) return;

        // Update in template's recipient groups query cache
        cache.updateQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>(
          {
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateRecipientGroupsByTemplateId)
              return existing;
            const existingIndex = existing.templateRecipientGroupsByTemplateId.findIndex(
              (g) => g.id === updated.id,
            );
            if (existingIndex > -1) {
              const newGroups = [...existing.templateRecipientGroupsByTemplateId];
              newGroups[existingIndex] = {
                ...newGroups[existingIndex],
                ...updated,
              };
              return { templateRecipientGroupsByTemplateId: newGroups };
            }
            return existing;
          },
        );
      },
    },
  );

  // Delete recipient group mutation
  const [deleteTemplateRecipientGroupMutation] = useMutation(
    Document.deleteTemplateRecipientGroupMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteTemplateRecipientGroup) return;
        const deleted = data.deleteTemplateRecipientGroup;
        const templateId = deleted.template?.id;

        if (!templateId) return;

        // Remove from template's recipient groups query cache
        cache.updateQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>(
          {
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateRecipientGroupsByTemplateId) return existing;
            return {
              templateRecipientGroupsByTemplateId: existing.templateRecipientGroupsByTemplateId.filter(
                (g) => g.id !== deleted.id,
              ),
            };
          },
        );
      },
    },
  );

  // useMemo ensures the hook returns a stable object, preventing unnecessary re-renders
  return React.useMemo(
    () => ({
      /**
       * Mutation to create a new template recipient group
       * @param variables - The create template recipient group variables
       */
      createTemplateRecipientGroupMutation,
      /**
       * Mutation to update an existing template recipient group
       * @param variables - The update template recipient group variables
       */
      updateTemplateRecipientGroupMutation,
      /**
       * Mutation to delete a template recipient group
       * @param variables - The delete template recipient group variables
       */
      deleteTemplateRecipientGroupMutation,
    }),
    [
      createTemplateRecipientGroupMutation,
      updateTemplateRecipientGroupMutation,
      deleteTemplateRecipientGroupMutation,
    ],
  );
};
