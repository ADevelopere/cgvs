import React from 'react';
import {
  Typography,
  Paper,
} from '@mui/material';

const RecipientsTab = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recipients Management
      </Typography>
      <Typography color="text.secondary">
        This feature will allow you to manage recipient data and import lists. Coming soon.
      </Typography>
    </Paper>
  );
};

export default RecipientsTab;
