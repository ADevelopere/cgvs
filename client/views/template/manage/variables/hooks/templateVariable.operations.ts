"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { templateVariablesByTemplateIdQueryDocument } from "./templateVariable.documents";
import {
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
 * Apollo queries hook for template variables
 * Uses templateVariablesByTemplateId query instead of template.variables
 */
export const useTemplateVariableApolloQueries = (templateId: number) => {
  const { data, loading, error, refetch } = useQuery(
    templateVariablesByTemplateIdQueryDocument,
    { 
      variables: { templateId },
      skip: !templateId,
    }
  );

  return {
    variables: data?.templateVariablesByTemplateId || [],
    loading,
    error,
    refetch,
  };
};

/**
 * Apollo mutations hook for template variables
 * All mutations with proper cache updates for templateVariablesByTemplateId query
 */
export const useTemplateVariableApolloMutations = () => {
  // Create text variable mutation
  const [createTextMutation] = useMutation(createTemplateTextVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.createTemplateTextVariable) return;
      
      const templateId = data.createTemplateTextVariable.template?.id;
      if (!templateId) return;

      // Update templateVariablesByTemplateId query
      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: [
              ...existingData.templateVariablesByTemplateId,
              data.createTemplateTextVariable
            ]
          }
        });
      }
    }
  });

  // Create number variable mutation
  const [createNumberMutation] = useMutation(createTemplateNumberVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.createTemplateNumberVariable) return;
      
      const templateId = data.createTemplateNumberVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: [
              ...existingData.templateVariablesByTemplateId,
              data.createTemplateNumberVariable
            ]
          }
        });
      }
    }
  });

  // Create date variable mutation
  const [createDateMutation] = useMutation(createTemplateDateVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.createTemplateDateVariable) return;
      
      const templateId = data.createTemplateDateVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: [
              ...existingData.templateVariablesByTemplateId,
              data.createTemplateDateVariable
            ]
          }
        });
      }
    }
  });

  // Create select variable mutation
  const [createSelectMutation] = useMutation(createTemplateSelectVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.createTemplateSelectVariable) return;
      
      const templateId = data.createTemplateSelectVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: [
              ...existingData.templateVariablesByTemplateId,
              data.createTemplateSelectVariable
            ]
          }
        });
      }
    }
  });

  // Update text variable mutation
  const [updateTextMutation] = useMutation(updateTemplateTextVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.updateTemplateTextVariable) return;
      
      const templateId = data.updateTemplateTextVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        const updatedVariables = existingData.templateVariablesByTemplateId.map((variable) =>
          variable.id === data.updateTemplateTextVariable.id ? data.updateTemplateTextVariable : variable
        );

        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: updatedVariables
          }
        });
      }
    }
  });

  // Update number variable mutation
  const [updateNumberMutation] = useMutation(updateTemplateNumberVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.updateTemplateNumberVariable) return;
      
      const templateId = data.updateTemplateNumberVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        const updatedVariables = existingData.templateVariablesByTemplateId.map((variable) =>
          variable.id === data.updateTemplateNumberVariable.id ? data.updateTemplateNumberVariable : variable
        );

        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: updatedVariables
          }
        });
      }
    }
  });

  // Update date variable mutation
  const [updateDateMutation] = useMutation(updateTemplateDateVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.updateTemplateDateVariable) return;
      
      const templateId = data.updateTemplateDateVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        const updatedVariables = existingData.templateVariablesByTemplateId.map((variable) =>
          variable.id === data.updateTemplateDateVariable.id ? data.updateTemplateDateVariable : variable
        );

        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: updatedVariables
          }
        });
      }
    }
  });

  // Update select variable mutation
  const [updateSelectMutation] = useMutation(updateTemplateSelectVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.updateTemplateSelectVariable) return;
      
      const templateId = data.updateTemplateSelectVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        const updatedVariables = existingData.templateVariablesByTemplateId.map((variable) =>
          variable.id === data.updateTemplateSelectVariable.id ? data.updateTemplateSelectVariable : variable
        );

        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: updatedVariables
          }
        });
      }
    }
  });

  // Delete variable mutation (common for all types)
  const [deleteMutation] = useMutation(deleteTemplateVariableMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteTemplateVariable) return;
      
      const templateId = data.deleteTemplateVariable.template?.id;
      if (!templateId) return;

      const existingData = cache.readQuery<Graphql.TemplateVariablesByTemplateIdQuery>({
        query: templateVariablesByTemplateIdQueryDocument,
        variables: { templateId }
      });

      if (existingData?.templateVariablesByTemplateId) {
        const filteredVariables = existingData.templateVariablesByTemplateId.filter(
          (variable) => variable.id !== data.deleteTemplateVariable.id
        );

        cache.writeQuery({
          query: templateVariablesByTemplateIdQueryDocument,
          variables: { templateId },
          data: {
            templateVariablesByTemplateId: filteredVariables
          }
        });
      }
    }
  });

  return {
    // Create mutations
    createTextVariable: createTextMutation,
    createNumberVariable: createNumberMutation,
    createDateVariable: createDateMutation,
    createSelectVariable: createSelectMutation,
    
    // Update mutations
    updateTextVariable: updateTextMutation,
    updateNumberVariable: updateNumberMutation,
    updateDateVariable: updateDateMutation,
    updateSelectVariable: updateSelectMutation,
    
    // Delete mutation
    deleteVariable: deleteMutation,
  };
};
