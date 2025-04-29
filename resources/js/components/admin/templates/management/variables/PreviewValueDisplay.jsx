import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Grid, Typography } from '@mui/material';

const PreviewValueInput = ({ type, value }) => {
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

PreviewValueInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
};

function PreviewValueDisplay({ variables }) {
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>Preview Values</Typography>
      <Grid container spacing={2}>
        {variables.map((variable) => (
          <Grid item xs={12} sm={6} md={4} key={variable.id}>
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
}

PreviewValueDisplay.propTypes = {
  variables: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      preview_value: PropTypes.any,
    })
  ).isRequired,
};

export default PreviewValueDisplay;
