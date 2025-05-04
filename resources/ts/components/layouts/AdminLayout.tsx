import React from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../common/ErrorBoundary";
import {
    Dashboard as DashboardIcon,
    Description as TemplatesIcon,
    FileCopy as CertificatesIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";

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

const DefaultToolbarActions = () => <ThemeSwitcher />;

const AdminLayout: React.FC = () => {
    const { theme } = useAppTheme();
    const { isAuthenticated, isLoading } = useAuth();
    const { slots } = useDashboardLayout();

    React.useEffect(() => {
        // Set default toolbar actions
        slots.toolbarActions = DefaultToolbarActions;
    }, []);

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <ReactRouterAppProvider
            navigation={NAVIGATION}
            branding={BRANDING}
            theme={theme}
        >
            <ErrorBoundary>
                <DashboardLayout slots={slots}>
                    <Outlet />
                </DashboardLayout>
            </ErrorBoundary>
        </ReactRouterAppProvider>
    );
};

export default AdminLayout;
