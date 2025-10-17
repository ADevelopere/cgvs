"use client";

import { create } from "zustand";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface RecipientGroupDataState {
  templateId: number | null;
  groups: Graphql.TemplateRecipientGroup[];
  loading: boolean;
  error: string | null;
}

interface RecipientGroupDataActions {
  setTemplateId: (id: number) => void;
  setGroups: (groups: Graphql.TemplateRecipientGroup[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addGroup: (group: Graphql.TemplateRecipientGroup) => void;
  updateGroup: (group: Graphql.TemplateRecipientGroup) => void;
  removeGroup: (id: number) => void;
  reset: () => void;
}

const initialState: RecipientGroupDataState = {
  templateId: null,
  groups: [],
  loading: false,
  error: null
};

export const useRecipientGroupDataStore = create<RecipientGroupDataState & RecipientGroupDataActions>((set) => ({
  ...initialState,
  
  setTemplateId: (id) => set({ templateId: id }),
  setGroups: (groups) => set({ groups }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addGroup: (group) => set((state) => ({ 
    groups: [...state.groups, group] 
  })),
  
  updateGroup: (group) => set((state) => ({
    groups: state.groups.map(g => g.id === group.id ? group : g)
  })),
  
  removeGroup: (id) => set((state) => ({
    groups: state.groups.filter(g => g.id !== id)
  })),
  
  reset: () => set(initialState)
}));
