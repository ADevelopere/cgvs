"use client";

import { useCallback } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useTemplateVariableModalStore } from "../stores";
import { useTemplateVariableOperations } from "./useTemplateVariableOperations";

/**
 * Modal management hook for template variables
 * Combines modal store + operations hook
 */
export const useTemplateVariableModal = (templateId: number) => {
  const modalStore = useTemplateVariableModalStore();
  const operations = useTemplateVariableOperations(templateId);

  const openCreateModal = useCallback((type: Graphql.TemplateVariableType) => {
    modalStore.openCreateModal(type);
  }, [modalStore]);

  const openEditModal = useCallback((variable: Graphql.TemplateVariable) => {
    modalStore.openEditModal(variable);
  }, [modalStore]);

  const closeModal = useCallback(() => {
    modalStore.closeModal();
  }, [modalStore]);

  const handleSave = useCallback(async (data: any) => {
    if (modalStore.isCreating) {
      await operations.createVariable(modalStore.variableType, data);
    } else if (modalStore.editingVariableId) {
      await operations.updateVariable(modalStore.editingVariableId, modalStore.variableType, data);
    }
    closeModal();
  }, [modalStore.isCreating, modalStore.variableType, modalStore.editingVariableId, operations, closeModal]);

  return {
    // Modal state
    isOpen: modalStore.isOpen,
    editingVariableId: modalStore.editingVariableId,
    variableType: modalStore.variableType,
    isCreating: modalStore.isCreating,
    
    // Modal actions
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    
    // Store access for advanced usage
    modalStore,
  };
};
