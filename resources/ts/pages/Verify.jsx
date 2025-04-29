import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Verify = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Verify Certificate
          </Typography>
          <Typography variant="body1" align="center">
            Certificate verification feature will be implemented here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Verify;
