import React from 'react';
import {
  Typography,
  Paper,
} from '@mui/material';

const EditorTab: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Visual Editor
      </Typography>
      <Typography color="text.secondary">
        This feature will provide a visual editor to design your template layout. Coming soon.
      </Typography>
    </Paper>
  );
};

export default EditorTab;
