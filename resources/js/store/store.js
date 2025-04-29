import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import variablesReducer from './variablesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    variables: variablesReducer,
  },
});

export default store;
