import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import templateReducer from './templateSlice';
import themeReducer from './themeSlice';
import templateManagementReducer from './templateManagementSlice';
import variablesReducer from './variablesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
    theme: themeReducer,
    templateManagement: templateManagementReducer,
    variables: variablesReducer,
  },
});

export default store;