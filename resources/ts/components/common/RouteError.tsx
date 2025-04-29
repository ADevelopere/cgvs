import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

interface RouteErrorType {
  statusText?: string;
  message?: string;
  status?: number;
}

export default function RouteError(): React.ReactElement {
  const error = useRouteError() as RouteErrorType;
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" component="p">
            {error?.message || error?.statusText || 'An unexpected error occurred'}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Back to Home
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
