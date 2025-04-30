import { TemplateProvider } from '@/contexts/template/TemplatesContext';
import React from 'react';
import { Outlet } from 'react-router-dom';

const TemplateLayout: React.FC = () => {
  return (
    <TemplateProvider>
      <Outlet />
    </TemplateProvider>
  );
};

export default TemplateLayout;
