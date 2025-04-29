import React from 'react';
import Management from '@/components/admin/templates/management/Management';
import { Container } from '@mui/material';
import { TemplateManagementProvider } from '@/contexts/template/TemplateManagementContext';

const TemplateManagementPage = () => {
    return (
        <TemplateManagementProvider>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Management />
            </Container>
        </TemplateManagementProvider>
    );
};

export default TemplateManagementPage;
