import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import templateReducer from './templateSlice.js';
import themeReducer from './themeSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
    theme: themeReducer,
  },
});

export default store;
