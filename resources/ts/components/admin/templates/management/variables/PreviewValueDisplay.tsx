import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Grid, Typography } from '@mui/material';

interface PreviewValueInputProps {
  type: string;
  value: any;
}

const PreviewValueInput: React.FC<PreviewValueInputProps> = ({ type, value }) => {
  switch (type) {
    case 'text':
      return <Typography>{value}</Typography>;
    case 'date':
      return <Typography>{new Date(value).toLocaleDateString()}</Typography>;
    case 'number':
      return <Typography>{value}</Typography>;
    case 'gender':
      return <Typography>{value === 'male' ? 'Male' : 'Female'}</Typography>;
    default:
      return <Typography>{value}</Typography>;
  }
};

interface Variable {
  id: string | number;
  name: string;
  type: string;
  preview_value: any;
}

interface PreviewValueDisplayProps {
  variables: Variable[];
}

const PreviewValueDisplay: React.FC<PreviewValueDisplayProps> = ({ variables }) => {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>Preview Values</Typography>
      <Grid container spacing={2}>
        {variables.map((variable, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {variable.name}
              </Typography>
              <PreviewValueInput 
                type={variable.type}
                value={variable.preview_value}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PreviewValueDisplay;
