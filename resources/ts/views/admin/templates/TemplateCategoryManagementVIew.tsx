import TemplateCategoryManagement from '@/components/admin/templates/category/management/CategoryManagement';
import { TemplateCategoryManagementProvider } from '@/contexts/template/TemplateCategoryManagementContext';
import React from 'react';

const TemplateCategoryManagementVIew: React.FC = () => {
  return (
    <TemplateCategoryManagementProvider>
      <TemplateCategoryManagement />
    </TemplateCategoryManagementProvider>
  );
};

export default TemplateCategoryManagementVIew;
