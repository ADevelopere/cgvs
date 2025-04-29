import type { ThunkAction, Action } from '@reduxjs/toolkit';
import type { store } from './index';

// Import all slice state types
import { AuthState } from './authSlice';
import { TemplateState } from './templateSlice';
import { ThemeState } from './themeSlice';
import { VariablesState } from './variablesSlice';
import { TemplateManagementState } from './templateManagementSlice';

// Define the complete store state type
export interface RootState {
  auth: AuthState;
  templates: TemplateState;
  theme: ThemeState;
  templateManagement: TemplateManagementState;
  variables: VariablesState;
}

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
