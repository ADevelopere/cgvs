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
import DashboardLayout from "@/client/views/dashboard/layout/DashboardLayout";
import DashboardEndActions from "@/client/views/dashboard/layout/DashboardEndActions";
import { DashboardLayoutProvider } from "@/client/contexts/DashboardLayoutContext";
import { Navigation, Title } from "@/client/contexts/adminLayout.types";
import StudentProvider from "@/client/contexts/student/StudentProvider";

const NAVIGATION: Navigation = [
 {
  kind: "header",
  title: "الإدارة",
 },
 {
  id: "dashboard",
  segment: "admin/dashboard",
  title: "لوحة التحكم",
  icon: <DashboardIcon />,
 },
 {
  id: "templateCategories",
  segment: "admin/categories",
  title: "فئات الشهادات",
  icon: <CategoryIcon />,
 },
 {
  id: "templates",
  segment: "admin/templates",
  title: "الشهادات",
  icon: <TemplatesIcon />,
 },
 {
  id: "storage",
  segment: "admin/storage",
  title: "الملفات",
  icon: <StorageIcon />,
 },
 {
  id: "students",
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

const AdminLayoutContent: React.FC<{ children: React.ReactNode }> = ({
 children,
}: {
 children: React.ReactNode;
}) => {
 return (
   <StudentProvider>
    <DashboardLayout>{children}</DashboardLayout>
   </StudentProvider>
 );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
 children,
}: {
 children: React.ReactNode;
}) => {
 return (
   <DashboardLayoutProvider
    initialTitle={TITLE}
    initialNavigation={NAVIGATION}
    initialSlots={{
     endActions: <DashboardEndActions />,
    }}
   >
     <AdminLayoutContent>{children}</AdminLayoutContent>
   </DashboardLayoutProvider>
 );
};

export default AdminLayout;
