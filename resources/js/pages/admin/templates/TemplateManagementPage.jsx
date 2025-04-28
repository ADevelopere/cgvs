import React from 'react';
import Management from '../../../components/admin/templates/management/Management';
import { Container } from '@mui/material';

const TemplateManagementPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Management />
    </Container>
  );
};

export default TemplateManagementPage;
