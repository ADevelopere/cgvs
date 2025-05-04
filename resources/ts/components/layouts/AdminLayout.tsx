import React from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../common/ErrorBoundary";
import {
    Dashboard as DashboardIcon,
    Description as TemplatesIcon,
    FileCopy as CertificatesIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { DashboardLayoutProvider } from "@/contexts/DashboardLayoutContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import DashboardLayout from "@/components/admin/layout/DashboardLayout";
import {
    Navigation,
    SIDEBAR_STATE_STORAGE_KEY,
    SidebarState,
} from "@/components/admin/layout/adminLayout.types";

const NAVIGATION: Navigation = [
    {
        kind: "header",
        title: "Dashboard",
    },
    {
        segment: "admin/dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
    },
    {
        segment: "admin/templates",
        title: "Templates",
        icon: <TemplatesIcon />,
    },
    {
        segment: "admin/certificates",
        title: "Certificates",
        icon: <CertificatesIcon />,
    },
];

const BRANDING = {
    title: "CGVS",
};

const AdminLayout: React.FC = () => {
    const { theme } = useAppTheme();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <ErrorBoundary>
            <NavigationProvider>
                <DashboardLayoutProvider
                    branding={BRANDING}
                    navigation={NAVIGATION}
                >
                    <DashboardLayout>
                        {/* keep it disabled for now */}
                        {/* <Outlet /> */}
                    </DashboardLayout>
                </DashboardLayoutProvider>
            </NavigationProvider>
        </ErrorBoundary>
    );
};

export default AdminLayout;
