import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from '../components/layouts/AdminLayout';
import GuestLayout from '../components/layouts/GuestLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/admin/Dashboard';
import TemplateIndex from '../pages/admin/templates/Index';
import TemplateCreate from '../pages/admin/templates/Create';
import TemplateManagementPage from '../pages/admin/templates/TemplateManagementPage';
import Verify from '../pages/Verify';
import RouteError from '../components/common/RouteError';

import PropTypes from 'prop-types';

const WithAuth = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

WithAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />,
    errorElement: <RouteError />,
  },
  {
    path: '/verify',
    element: <GuestLayout><Verify /></GuestLayout>,
  },
  {
    path: '/login',
    element: <GuestLayout><Login /></GuestLayout>,
  },
  {
    path: '/admin',
    element: (
      <WithAuth>
        <AdminLayout />
      </WithAuth>
    ),
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'templates',
        children: [
          {
            index: true,
            element: <TemplateIndex />,
          },
          {
            path: 'create',
            element: <TemplateCreate />,
          },
          {
            path: ':id/manage',
            element: <TemplateManagementPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
