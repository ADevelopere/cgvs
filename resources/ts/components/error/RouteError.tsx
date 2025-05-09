import React, { useMemo, useEffect, useState } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import ThemeMode from '@/theme/ThemeMode';
import { createAppTheme } from '@/theme';
import AppLanguage from '@/locale/AppLanguage';
import translations from '@/locale/translations';

interface RouteErrorType {
  statusText?: string;
  message?: string;
  status?: number;
}

export default function RouteError(): React.ReactElement {
  const error = useRouteError() as RouteErrorType;
  const navigate = useNavigate();

  // State for theme and language
  const [settings, setSettings] = useState(() => ({
    themeMode: (localStorage.getItem('themeMode') as ThemeMode) || ThemeMode.Dark,
    language: (localStorage.getItem('language') as AppLanguage) || AppLanguage.default
  }));

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings({
        themeMode: (localStorage.getItem('themeMode') as ThemeMode) || ThemeMode.Dark,
        language: (localStorage.getItem('language') as AppLanguage) || AppLanguage.default
      });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleStorageChange);
    window.addEventListener('themeModeChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleStorageChange);
      window.removeEventListener('themeModeChange', handleStorageChange);
    };
  }, []);

  // Create theme based on current values
  const theme = useMemo(() => {
    const direction = settings.language === 'ar' ? 'rtl' : 'ltr';
    return createAppTheme(settings.themeMode, direction);
  }, [settings]);

  // Get translations based on current language
  const ts = useMemo(() => (
    translations[settings.language]?.errorTranslations || 
    translations[AppLanguage.default].errorTranslations
  ), [settings.language]);

  return (
    <Container 
      maxWidth="sm"
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper 
          sx={{ 
            p: 4,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            color="error"
          >
            {ts.routeError}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            component="p"
          >
            {error?.message || error?.statusText || ts.unexpectedError}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ 
                mr: 2,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                }
              }}
            >
              {ts.backToHome}
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  color: theme.palette.primary.dark,
                }
              }}
            >
              {ts.tryAgain}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
