import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import TemplateCard from './TemplateCard';

const TemplateGrid = ({ templates }) => {
  return (
    <Grid container spacing={3}>
      {templates.map((template) => (
        <Grid item xs={12} sm={6} md={4} key={template.id}>
          <TemplateCard template={template} />
        </Grid>
      ))}
    </Grid>
  );
};

TemplateGrid.propTypes = {
  templates: PropTypes.array.isRequired,
};

export default TemplateGrid;
