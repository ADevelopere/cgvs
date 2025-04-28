import React from 'react';
import { Container, Paper } from '@mui/material';

const GuestLayout = ({ children }) => {
  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={0} sx={{ p: 2 }}>
        {children}
      </Paper>
    </Container>
  );
};

export default GuestLayout;
