import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import templateReducer from './templateSlice.js';
import themeReducer from './themeSlice.js';
import templateManagementReducer from './templateManagementSlice.js';
import variablesReducer from './variablesSlice.js';

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
