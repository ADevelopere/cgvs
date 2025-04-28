import React from 'react';
import { Box, Container, Paper } from '@mui/material';

const GuestLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default GuestLayout;
