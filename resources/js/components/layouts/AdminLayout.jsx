import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBoundary from '../common/ErrorBoundary';
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as TemplatesIcon,
  FileCopy as CertificatesIcon,
} from '@mui/icons-material';
import ThemeSwitcher from '../common/ThemeSwitcher';
import UserMenu from '../common/UserMenu';
import PropTypes from 'prop-types';
import { checkAuth } from '../../store/authSlice';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Templates', icon: <TemplatesIcon />, path: '/admin/templates' },
    { text: 'Certificates', icon: <CertificatesIcon />, path: '/admin/certificates' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/admin/dashboard"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            CGVS
          </Typography>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ ml: 4, flex: 1, display: { xs: 'none', md: 'flex' } }}
          >
            {navItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
              >
                {item.text}
              </Button>
            ))}
          </Stack>

          {/* Right Section */}
          <Stack direction="row" spacing={1} alignItems="center">
            <ThemeSwitcher />
            <UserMenu />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Container maxWidth="xl">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Container>
      </Box>
    </Box>
  );
};
AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;
