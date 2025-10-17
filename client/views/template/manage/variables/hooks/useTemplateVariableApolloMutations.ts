"use client";

import React from "react";
import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  templateVariablesByTemplateIdQueryDocument,
  createTemplateTextVariableMutationDocument,
  createTemplateNumberVariableMutationDocument,
  createTemplateDateVariableMutationDocument,
  createTemplateSelectVariableMutationDocument,
  updateTemplateTextVariableMutationDocument,
  updateTemplateNumberVariableMutationDocument,
  updateTemplateDateVariableMutationDocument,
  updateTemplateSelectVariableMutationDocument,
  deleteTemplateVariableMutationDocument,
} from "./templateVariable.documents";

/**
 * Apollo Mutations Hook for Template Variables
 * Follows TemplatePane pattern with cache.updateQuery for all mutations
 */
export const useTemplateVariableApolloMutations = () => {
  // Create text variable mutation
  const [createTextMutation] = useMutation(
    createTemplateTextVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateTextVariable) return;
        const newVariable = data.createTemplateTextVariable;
        const templateId = newVariable.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId: [
                ...existing.templateVariablesByTemplateId,
                newVariable,
              ],
            };
          },
        );
      },
    },
  );

  // Create number variable mutation
  const [createNumberMutation] = useMutation(
    createTemplateNumberVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateNumberVariable) return;
        const newVariable = data.createTemplateNumberVariable;
        const templateId = newVariable.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId: [
                ...existing.templateVariablesByTemplateId,
                newVariable,
              ],
            };
          },
        );
      },
    },
  );

  // Create date variable mutation
  const [createDateMutation] = useMutation(
    createTemplateDateVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateDateVariable) return;
        const newVariable = data.createTemplateDateVariable;
        const templateId = newVariable.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId: [
                ...existing.templateVariablesByTemplateId,
                newVariable,
              ],
            };
          },
        );
      },
    },
  );

  // Create select variable mutation
  const [createSelectMutation] = useMutation(
    createTemplateSelectVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateSelectVariable) return;
        const newVariable = data.createTemplateSelectVariable;
        const templateId = newVariable.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId: [
                ...existing.templateVariablesByTemplateId,
                newVariable,
              ],
            };
          },
        );
      },
    },
  );

  // Update text variable mutation
  const [updateTextMutation] = useMutation(
    updateTemplateTextVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateTextVariable) return;
        const updated = data.updateTemplateTextVariable;
        const templateId = updated.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId:
                existing.templateVariablesByTemplateId.map((v) =>
                  v.id === updated.id ? updated : v,
                ),
            };
          },
        );
      },
    },
  );

  // Update number variable mutation
  const [updateNumberMutation] = useMutation(
    updateTemplateNumberVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateNumberVariable) return;
        const updated = data.updateTemplateNumberVariable;
        const templateId = updated.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId:
                existing.templateVariablesByTemplateId.map((v) =>
                  v.id === updated.id ? updated : v,
                ),
            };
          },
        );
      },
    },
  );

  // Update date variable mutation
  const [updateDateMutation] = useMutation(
    updateTemplateDateVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateDateVariable) return;
        const updated = data.updateTemplateDateVariable;
        const templateId = updated.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId:
                existing.templateVariablesByTemplateId.map((v) =>
                  v.id === updated.id ? updated : v,
                ),
            };
          },
        );
      },
    },
  );

  // Update select variable mutation
  const [updateSelectMutation] = useMutation(
    updateTemplateSelectVariableMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateSelectVariable) return;
        const updated = data.updateTemplateSelectVariable;
        const templateId = updated.template?.id;
        if (!templateId) return;

        cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
          {
            query: templateVariablesByTemplateIdQueryDocument,
            variables: { templateId },
          },
          (existing) => {
            if (!existing?.templateVariablesByTemplateId) return existing;
            return {
              templateVariablesByTemplateId:
                existing.templateVariablesByTemplateId.map((v) =>
                  v.id === updated.id ? updated : v,
                ),
            };
          },
        );
      },
    },
  );

  // Delete variable mutation (common for all types)
  const [deleteMutation] = useMutation(deleteTemplateVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteTemplateVariable) return;
      const deleted = data.deleteTemplateVariable;
      const templateId = deleted.template?.id;
      if (!templateId) return;

      cache.updateQuery<Graphql.TemplateVariablesByTemplateIdQuery>(
        {
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
        },
        (existing) => {
          if (!existing?.templateVariablesByTemplateId) return existing;
          return {
            templateVariablesByTemplateId:
              existing.templateVariablesByTemplateId.filter(
                (v) => v.id !== deleted.id,
              ),
          };
        },
      );
    },
  });

  return React.useMemo(
    () => ({
      /**
       * Mutation to create a text template variable
       */
      createTextVariableMutation: createTextMutation,
      /**
       * Mutation to create a number template variable
       */
      createNumberVariableMutation: createNumberMutation,
      /**
       * Mutation to create a date template variable
       */
      createDateVariableMutation: createDateMutation,
      /**
       * Mutation to create a select template variable
       */
      createSelectVariableMutation: createSelectMutation,
      /**
       * Mutation to update a text template variable
       */
      updateTextVariableMutation: updateTextMutation,
      /**
       * Mutation to update a number template variable
       */
      updateNumberVariableMutation: updateNumberMutation,
      /**
       * Mutation to update a date template variable
       */
      updateDateVariableMutation: updateDateMutation,
      /**
       * Mutation to update a select template variable
       */
      updateSelectVariableMutation: updateSelectMutation,
      /**
       * Mutation to delete a template variable
       */
      deleteVariableMutation: deleteMutation,
    }),
    [
      createTextMutation,
      createNumberMutation,
      createDateMutation,
      createSelectMutation,
      updateTextMutation,
      updateNumberMutation,
      updateDateMutation,
      updateSelectMutation,
      deleteMutation,
    ],
  );
};
