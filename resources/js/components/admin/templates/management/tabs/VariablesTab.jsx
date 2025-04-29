import React from 'react';
import {
  Typography,
  Paper,
} from '@mui/material';

const VariablesTab = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Variables
      </Typography>
      <Typography color="text.secondary">
        This feature will allow you to define dynamic variables for your template. Coming soon.
      </Typography>
    </Paper>
  );
};

export default VariablesTab;
