import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store.types';

type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeState  ={
  mode: ThemeMode;
}

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme;
  }
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'system';
  }
  return 'system';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  } as ThemeState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const selectTheme = (state: RootState): ThemeMode => state.theme.mode;

export default themeSlice.reducer;
