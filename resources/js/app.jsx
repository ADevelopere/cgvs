import './bootstrap';
import '../css/app.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import createAppTheme from './theme';
import store from './store';
import router from './routes';
import { checkAuth } from './store/authSlice';
import { selectTheme } from './store/themeSlice';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectTheme);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Force a re-render by updating a state
        dispatch({ type: 'theme/systemThemeChanged' });
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode, dispatch]);

  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

const NoThemeApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const Root = () => (
  <React.StrictMode>
    <NoThemeApp />
  </React.StrictMode>
);

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Root />);
