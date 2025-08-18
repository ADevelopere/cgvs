import React from 'react';
import {
  Typography,
  Paper,
} from '@mui/material';

const PreviewTab: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Template Preview
      </Typography>
      <Typography color="text.secondary">
        This feature will show a preview of your template with sample data. Coming soon.
      </Typography>
    </Paper>
  );
};

export default PreviewTab;
