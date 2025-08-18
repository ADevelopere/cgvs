"use client";

import React from "react";
import {
    Dashboard as DashboardIcon,
    Description as TemplatesIcon,
    Category as CategoryIcon,
    People as StudentsIcon,
} from "@mui/icons-material";
import { HomeIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import DashboardLayout from "@/views/dashboard/layout/DashboardLayout";
import DashboardEndActions from "@/components/common/DashboardEndActions";
import { TemplateCategoryManagementProvider } from "@/contexts/template/TemplateCategoryManagementContext";
import { DashboardLayoutProvider } from "@/contexts/DashboardLayoutContext";
import { Navigation, Title } from "@/contexts/adminLayout.types";
import { TemplateCategoryGraphQLProvider } from "@/contexts/template/TemplateCategoryGraphQLContext";
import { TemplateGraphQLProvider } from "@/contexts/template/TemplateGraphQLContext";

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
    {
        segment: "admin/students",
        title: "الطلاب",
        icon: <StudentsIcon />,
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

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    // const { isAuthenticated, isLoading } = useAuth();

    // if (isLoading) {
    //     return null; // or a loading spinner
    // }

    // if (!isAuthenticated) {
    //     return null;
    // }

    return (
        <NavigationProvider>
            <DashboardLayoutProvider
                initialTitle={TITLE}
                initialNavigation={NAVIGATION}
                initialSlots={{
                    endActions: <DashboardEndActions />,
                }}
            >
                <TemplateCategoryGraphQLProvider>
                    <TemplateGraphQLProvider>
                        <TemplateCategoryManagementProvider>
                            <DashboardLayout>{children}</DashboardLayout>
                        </TemplateCategoryManagementProvider>
                    </TemplateGraphQLProvider>
                </TemplateCategoryGraphQLProvider>
            </DashboardLayoutProvider>
        </NavigationProvider>
    );
};

export default AdminLayout;
