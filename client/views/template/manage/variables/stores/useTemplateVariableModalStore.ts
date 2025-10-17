"use client";

import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface TemplateVariableModalState {
  isOpen: boolean;
  editingVariableId: number | null;
  variableType: Graphql.TemplateVariableType;
  isCreating: boolean;
}

interface TemplateVariableModalActions {
  openCreateModal: (type: Graphql.TemplateVariableType) => void;
  openEditModal: (variable: Graphql.TemplateVariable) => void;
  closeModal: () => void;
  setVariableType: (type: Graphql.TemplateVariableType) => void;
  reset: () => void;
}

const initialState: TemplateVariableModalState = {
  isOpen: false,
  editingVariableId: null,
  variableType: "TEXT",
  isCreating: false,
};

export const useTemplateVariableModalStore = create<TemplateVariableModalState & TemplateVariableModalActions>((set, get) => ({
  ...initialState,

  openCreateModal: (type) => set({
    isOpen: true,
    editingVariableId: null,
    variableType: type,
    isCreating: true,
  }),

  openEditModal: (variable) => set({
    isOpen: true,
    editingVariableId: variable.id || null,
    variableType: variable.type || "TEXT",
    isCreating: false,
  }),

  closeModal: () => set({
    isOpen: false,
    editingVariableId: null,
    isCreating: false,
  }),

  setVariableType: (type) => set({ variableType: type }),

  reset: () => set(initialState),
}));
