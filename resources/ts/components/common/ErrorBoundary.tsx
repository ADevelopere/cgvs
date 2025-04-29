import React, { ErrorInfo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error caught by boundary:', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom color="error">
                Component Error
              </Typography>
              <Typography variant="body1" color="text.secondary" component="p">
                {this.state.error?.message || 'An unexpected error occurred in this component'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
              >
                Retry
              </Button>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
