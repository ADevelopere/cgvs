import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const getThemeConfig = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: '#90caf9',
          },
          secondary: {
            main: '#f48fb1',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        }),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.12)' : '0 1px 3px rgba(255,255,255,0.12)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active': {
          transitionDelay: '5000s',
        },
      },
    },
  },
});

const createAppTheme = (mode: 'light' | 'dark' | 'system'): Theme => {
  let effectiveMode: PaletteMode = mode as PaletteMode;
  if (mode === 'system') {
    effectiveMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return createTheme(getThemeConfig(effectiveMode));
};

export default createAppTheme;
