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
import { Navigation, Title } from "@/contexts/adminLayout.types";
import { HomeIcon } from "lucide-react";

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

const TITLE: Title = {
    titleText: "CGVS",
    logoIcon: <HomeIcon />,
    titleVisible: true,
    titleTextVisible: true,
    titleLogoVisible: true,
    iconColor: "primary.main",
    textColor: "text.primary",
};

const AdminLayout: React.FC = () => {
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
                    initialTitle={TITLE}
                    initialNavigation={NAVIGATION}
                >
                    <DashboardLayout>
                        <Outlet />
                    </DashboardLayout>
                </DashboardLayoutProvider>
            </NavigationProvider>
        </ErrorBoundary>
    );
};

export default AdminLayout;
