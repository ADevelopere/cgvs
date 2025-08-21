"use client";

import React from "react";
import {
    Dashboard as DashboardIcon,
    Description as TemplatesIcon,
    Category as CategoryIcon,
    People as StudentsIcon,
    Storage as StorageIcon,
} from "@mui/icons-material";
import { HomeIcon } from "lucide-react";
import { NavigationProvider } from "@/contexts/NavigationContext";
import DashboardLayout from "@/views/dashboard/layout/DashboardLayout";
import DashboardEndActions from "@/components/common/DashboardEndActions";
import { TemplateCategoryManagementProvider } from "@/contexts/template/TemplateCategoryManagementContext";
import { DashboardLayoutProvider } from "@/contexts/DashboardLayoutContext";
import { Navigation, Title } from "@/contexts/adminLayout.types";
import { TemplateCategoryGraphQLProvider } from "@/contexts/template/TemplateCategoryGraphQLContext";
import { TemplateGraphQLProvider } from "@/contexts/template/TemplateGraphQLContext";
import StudentProvider from "@/contexts/student/StudentProvider";

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
        segment: "admin/storage",
        title: "الملفات",
        icon: <StorageIcon />,
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
                            <StudentProvider>
                                <DashboardLayout>{children}</DashboardLayout>
                            </StudentProvider>
                        </TemplateCategoryManagementProvider>
                    </TemplateGraphQLProvider>
                </TemplateCategoryGraphQLProvider>
            </DashboardLayoutProvider>
        </NavigationProvider>
    );
};

export default AdminLayout;
