import React from "react";
import {
    createBrowserRouter,
    Navigate,
    useLocation,
    RouteObject,
} from "react-router-dom";
import AdminLayout from "@/components/layouts/admin/AdminLayout";
import GuestLayout from "@/components/layouts/GuestLayout";
import Login from "@/views/auth/Login";
import TemplateManagementPage from "@/views/admin/templates/TemplateManagementView";
import Verify from "@/views/Verify";
import RouteError from "@/components/error/RouteError";
import { useAuth } from "@/contexts/AuthContext";
import DashboardPage from "@/views/admin/Dashboard";
import TemplateCategoryManagement from "@/components/admin/templates/category/management/CategoryManagement";
import GraphiQLApp from "@/views/GraphiQL";
import NewTemplateList from "@/components/admin/templates/list/TemplateListContainer";
import StudentsLayout from "@/components/layouts/admin/student/StudentsLayout";
import AppContent from "@/components/demo/DemoTableContent";
import StudentTable from "@/components/admin/student/StudentTable";

interface WithAuthProps {
    children: React.ReactNode;
}

const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Pass the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to="/admin/dashboard" replace />,
        errorElement: <RouteError />,
    },
    {
        path: "/verify",
        element: (
            <GuestLayout>
                <Verify />
            </GuestLayout>
        ),
    },
    {
        path: "/login",
        element: (
            <GuestLayout>
                <Login />
            </GuestLayout>
        ),
    },
    {
        path: "/admin",
        element: (
            <WithAuth>
                <AdminLayout />
            </WithAuth>
        ),
        errorElement: <RouteError />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "table",
                element: <AppContent />,
            },
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "categories",
                element: <TemplateCategoryManagement />,
            },
            {
                path: "templates",
                children: [
                    {
                        index: true,
                        element: <NewTemplateList />,
                    },
                    {
                        path: ":id/manage",
                        element: <TemplateManagementPage />,
                    },
                ],
            },
            {
                path: "students",
                element: <StudentsLayout />,
                children: [
                    {
                        index: true,
                        element: <StudentTable />,
                    },
                ],
            },
        ],
    },
    {
        path: "graphiql",
        element: (
            <WithAuth>
                {" "}
                <GraphiQLApp />
            </WithAuth>
        ),
    },
];

const router = createBrowserRouter(routes);

export default router;
