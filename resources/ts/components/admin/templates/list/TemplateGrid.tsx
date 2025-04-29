import React from 'react';
import { Grid } from '@mui/material';
import TemplateCard from './TemplateCard';

interface Template {
  id: number;
  name: string;
  description?: string;
  background_image?: string;
  created_at: string;
  updated_at: string;
}

interface TemplateGridProps {
  templates: Template[];
}

const TemplateGrid: React.FC<TemplateGridProps> = ({ templates }) => {
  return (
    <Grid container spacing={3}>
      {templates.map((template) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
          <TemplateCard template={template} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TemplateGrid;
