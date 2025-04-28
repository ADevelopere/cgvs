import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import DashboardPage from '../pages/admin/DashboardPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GuestLayout from '../components/layouts/GuestLayout';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestLayout>
        <Login />
      </GuestLayout>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute><Navigate to="/admin/dashboard" replace /></ProtectedRoute>,
  },
  {
    path: '/admin/*',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
]);

export default router;
