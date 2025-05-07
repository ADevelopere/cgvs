import React from "react";
import {
    createBrowserRouter,
    Navigate,
    useLocation,
    RouteObject,
} from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import GuestLayout from "@/components/layouts/GuestLayout";
import Login from "@/views/auth/Login";
import TemplateIndex from "@/views/admin/templates/Index";
import TemplateCreate from "@/views/admin/templates/CreateTemplateView";
import TemplateManagementPage from "@/views/admin/templates/TemplateManagementView";
import Verify from "@/views/Verify";
import RouteError from "@/components/common/RouteError";
import { useAuth } from "@/contexts/AuthContext";
import DashboardPage from "@/views/admin/Dashboard";
import TemplateCategoryManagement from "@/components/admin/templates/category/management/CategoryManagement";
import GraphiQLApp from "@/views/GraphiQL";

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
                        element: <TemplateIndex />,
                    },
                    {
                        path: "create",
                        element: <TemplateCreate />,
                    },
                    {
                        path: ":id/manage",
                        element: <TemplateManagementPage />,
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
