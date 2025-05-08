import React from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../common/ErrorBoundary";
import {
    Dashboard as DashboardIcon,
    Description as TemplatesIcon,
    Category as CategoryIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayoutProvider } from "@/contexts/DashboardLayoutContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import DashboardLayout from "@/components/admin/layout/DashboardLayout";
import { Navigation, Title } from "@/contexts/adminLayout.types";
import { HomeIcon } from "lucide-react";
import DashboardEndActions from "../common/DashboardEndActions";
import { TemplateCategoryManagementProvider } from "@/contexts/template/TemplateCategoryManagementContext";

const NAVIGATION: Navigation = [
    {
        kind: "header",
        title: "الإدارة",
    },
    {
        segment: "admin/dashboard",
        title: "لوحة التحكم",
        icon: <DashboardIcon />,
    },
    {
        segment: "admin/categories",
        title: "فئات الشهادات",
        icon: <CategoryIcon />,
    },
    {
        segment: "admin/templates",
        title: "الشهادات",
        icon: <TemplatesIcon />,
    },
];

const TITLE: Title = {
    titleText: "نظام إدارة الشهادات",
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
                    initialSlots={{
                        endActions: <DashboardEndActions />,
                    }}
                >
                    <DashboardLayout>
                        <TemplateCategoryManagementProvider>
                                <Outlet />
                        </TemplateCategoryManagementProvider>
                    </DashboardLayout>
                </DashboardLayoutProvider>
            </NavigationProvider>
        </ErrorBoundary>
    );
};

export default AdminLayout;
