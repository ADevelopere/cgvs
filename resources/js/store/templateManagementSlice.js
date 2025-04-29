import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'basic',
  unsavedChanges: false,
  loadedTabs: [], // Track which tabs have loaded their data
  tabErrors: {}, // Store errors per tab
};

const templateManagementSlice = createSlice({
  name: 'templateManagement',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setTabLoaded: (state, action) => {
      if (!state.loadedTabs.includes(action.payload)) {
        state.loadedTabs.push(action.payload);
      }
    },
    setUnsavedChanges: (state, action) => {
      state.unsavedChanges = action.payload;
    },
    setTabError: (state, action) => {
      state.tabErrors[action.payload.tab] = action.payload.error;
    },
    clearTabError: (state, action) => {
      delete state.tabErrors[action.payload];
    },
  },
});

export const {
  setActiveTab,
  setTabLoaded,
  setUnsavedChanges,
  setTabError,
  clearTabError,
} = templateManagementSlice.actions;

export const selectActiveTab = (state) => state.templateManagement.activeTab;
export const selectTabLoaded = (state, tab) => state.templateManagement.loadedTabs.includes(tab);
export const selectUnsavedChanges = (state) => state.templateManagement.unsavedChanges;
export const selectTabError = (state, tab) => state.templateManagement.tabErrors[tab];

export default templateManagementSlice.reducer;
