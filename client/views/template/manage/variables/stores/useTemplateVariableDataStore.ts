"use client";

import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface TemplateVariableDataState {
  templateId: number | null;
  variables: Graphql.TemplateVariable[];
  loading: boolean;
  error: string | null;
}

interface TemplateVariableDataActions {
  setTemplateId: (id: number) => void;
  setVariables: (variables: Graphql.TemplateVariable[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addVariable: (variable: Graphql.TemplateVariable) => void;
  updateVariable: (variable: Graphql.TemplateVariable) => void;
  removeVariable: (id: number) => void;
  reset: () => void;
}

const initialState: TemplateVariableDataState = {
  templateId: null,
  variables: [],
  loading: false,
  error: null,
};

export const useTemplateVariableDataStore = create<TemplateVariableDataState & TemplateVariableDataActions>((set, get) => ({
  ...initialState,

  setTemplateId: (id) => set({ templateId: id }),

  setVariables: (variables) => set({ variables }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  addVariable: (variable) => set((state) => ({
    variables: [...state.variables, variable],
  })),

  updateVariable: (variable) => set((state) => ({
    variables: state.variables.map((v) => (v.id === variable.id ? variable : v)),
  })),

  removeVariable: (id) => set((state) => ({
    variables: state.variables.filter((v) => v.id !== id),
  })),

  reset: () => set(initialState),
}));
