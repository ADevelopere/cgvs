"use client";

import { useQuery, useMutation } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./recipientGroup.documents";

/**
 * Apollo Query Hook for Recipient Groups
 * Provides query operations for fetching recipient groups by template ID
 */
export const useRecipientGroupApolloQueries = (templateId: number) => {
  const { data, loading, error, refetch } = useQuery(
    Document.templateRecipientGroupsByTemplateIdQueryDocument,
    { 
      variables: { templateId },
      skip: !templateId 
    }
  );
  
  return {
    groups: data?.templateRecipientGroupsByTemplateId || [],
    loading,
    error,
    refetch
  };
};

/**
 * Apollo Mutations Hook for Recipient Groups
 * Provides mutation operations with proper cache updates for templateRecipientGroupsByTemplateId query
 */
export const useRecipientGroupApolloMutations = () => {
  // Create recipient group mutation
  const [createMutation] = useMutation(
    Document.createTemplateRecipientGroupMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateRecipientGroup) return;
        const newGroup = data.createTemplateRecipientGroup;
        const templateId = newGroup.template?.id;
        
        if (!templateId) return;
        
        // Update templateRecipientGroupsByTemplateId query
        const existingData = cache.readQuery({
          query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
          variables: { templateId }
        });
        
        if (existingData?.templateRecipientGroupsByTemplateId) {
          cache.writeQuery({
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
            data: {
              templateRecipientGroupsByTemplateId: [
                ...existingData.templateRecipientGroupsByTemplateId,
                newGroup
              ]
            }
          });
        }
      }
    }
  );

  // Update recipient group mutation
  const [updateMutation] = useMutation(
    Document.updateTemplateRecipientGroupMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateRecipientGroup) return;
        const updatedGroup = data.updateTemplateRecipientGroup;
        const templateId = updatedGroup.template?.id;
        
        if (!templateId) return;
        
        // Update templateRecipientGroupsByTemplateId query
        const existingData = cache.readQuery({
          query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
          variables: { templateId }
        });
        
        if (existingData?.templateRecipientGroupsByTemplateId) {
          cache.writeQuery({
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
            data: {
              templateRecipientGroupsByTemplateId: existingData.templateRecipientGroupsByTemplateId.map(
                group => group.id === updatedGroup.id ? updatedGroup : group
              )
            }
          });
        }
      }
    }
  );

  // Delete recipient group mutation
  const [deleteMutation] = useMutation(
    Document.deleteTemplateRecipientGroupMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteTemplateRecipientGroup) return;
        const deletedGroup = data.deleteTemplateRecipientGroup;
        const templateId = deletedGroup.template?.id;
        
        if (!templateId) return;
        
        // Update templateRecipientGroupsByTemplateId query
        const existingData = cache.readQuery({
          query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
          variables: { templateId }
        });
        
        if (existingData?.templateRecipientGroupsByTemplateId) {
          cache.writeQuery({
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
            data: {
              templateRecipientGroupsByTemplateId: existingData.templateRecipientGroupsByTemplateId.filter(
                group => group.id !== deletedGroup.id
              )
            }
          });
        }
      }
    }
  );
  
  return {
    createGroup: (input: Graphql.TemplateRecipientGroupCreateInput) => 
      createMutation({ variables: { input } }),
    updateGroup: (input: Graphql.TemplateRecipientGroupUpdateInput) => 
      updateMutation({ variables: { input } }),
    deleteGroup: (id: number) => 
      deleteMutation({ variables: { id } })
  };
};
