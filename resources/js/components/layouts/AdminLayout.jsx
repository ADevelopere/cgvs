import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

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
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;
