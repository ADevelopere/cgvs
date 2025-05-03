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
import { PageContainer } from "@toolpad/core/PageContainer";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";

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

interface AdminLayoutProps {
    children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

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
        >
            <ErrorBoundary>
                <DashboardLayout
                    slots={{
                        // appTitle: CustomAppTitle,
                        toolbarActions: ThemeSwitcher,
                        // sidebarFooter: SidebarFooter,
                    }}
                >
                    {/* <PageContainer> */}
                        <Outlet />
                    {/* </PageContainer> */}
                </DashboardLayout>
            </ErrorBoundary>
        </ReactRouterAppProvider>
    );
};

export default AdminLayout;
