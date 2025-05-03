import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
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
import { PageContainer } from '@toolpad/core/PageContainer';

interface NavItem {
    text: string;
    icon: React.ReactNode;
    path: string;
}

interface AdminLayoutProps {
    children?: React.ReactNode;
}

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

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();
    // const router = useDemoRouter("/page");

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
            <ErrorBoundary>
                <DashboardLayout>
                    <PageContainer>
                        <Outlet />
                    </PageContainer>
                </DashboardLayout>
            </ErrorBoundary>
        </ReactRouterAppProvider>
    );
};

export default AdminLayout;
