import React from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import ErrorBoundary from "../common/ErrorBoundary";
import {
    AppBar,
    Box,
    Button,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Description as TemplatesIcon,
    FileCopy as CertificatesIcon,
} from "@mui/icons-material";
import ThemeSwitcher from "../common/ThemeSwitcher";
import UserMenu from "../common/UserMenu";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

interface AdminLayoutProps {
    children?: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/admin/dashboard",
    },
    {
        text: "Templates",
        icon: <TemplatesIcon />,
        path: "/admin/templates",
    },
    {
        text: "Certificates",
        icon: <CertificatesIcon />,
        path: "/admin/certificates",
    },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <AppBar position="sticky" elevation={1} id="admin-header-appbar">
                <Toolbar>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/admin/dashboard"
                        sx={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        CGVS
                    </Typography>

                    {/* Navigation Links */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            ml: 4,
                            flex: 1,
                            display: { xs: "none", md: "flex" },
                        }}
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

            <Box
                component="main"
            >
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </Box>
        </Box>
    );
};

export default AdminLayout;
