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
  // Extract stable action references from store
  const isOpen = useTemplateVariableModalStore((state) => state.isOpen);
  const editingVariableId = useTemplateVariableModalStore((state) => state.editingVariableId);
  const variableType = useTemplateVariableModalStore((state) => state.variableType);
  const isCreating = useTemplateVariableModalStore((state) => state.isCreating);
  const openCreateModalAction = useTemplateVariableModalStore((state) => state.openCreateModal);
  const openEditModalAction = useTemplateVariableModalStore((state) => state.openEditModal);
  const closeModalAction = useTemplateVariableModalStore((state) => state.closeModal);

  const operations = useTemplateVariableOperations(templateId);

  const openCreateModal = useCallback((type: Graphql.TemplateVariableType) => {
    openCreateModalAction(type);
  }, [openCreateModalAction]);

  const openEditModal = useCallback((variable: Graphql.TemplateVariable) => {
    openEditModalAction(variable);
  }, [openEditModalAction]);

  const closeModal = useCallback(() => {
    closeModalAction();
  }, [closeModalAction]);

  const handleSave = useCallback(async (data: any) => {
    if (isCreating) {
      await operations.createVariable(variableType, data);
    } else if (editingVariableId) {
      await operations.updateVariable(editingVariableId, variableType, data);
    }
    closeModal();
  }, [isCreating, variableType, editingVariableId, operations, closeModal]);

  return {
    // Modal state
    isOpen,
    editingVariableId,
    variableType,
    isCreating,

    // Modal actions
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
  };
};
