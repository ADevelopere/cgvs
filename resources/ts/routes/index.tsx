import React from "react";
import {
    createBrowserRouter,
    Navigate,
    useLocation,
    RouteObject,
} from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import GuestLayout from "@/components/layouts/GuestLayout";
import TemplateLayout from "@/components/layouts/TemplateLayout";
import Login from "@/pages/auth/Login";
import TemplateIndex from "@/pages/admin/templates/Index";
import TemplateCreate from "@/pages/admin/templates/CreateTemplate";
import TemplateManagementPage from "@/pages/admin/templates/TemplateManagementPage";
import Verify from "@/pages/Verify";
import RouteError from "@/components/common/RouteError";
import { useAuth } from "@/contexts/AuthContext";
import DashboardPage from "@/pages/admin/Dashboard";

interface WithAuthProps {
    children: React.ReactNode;
}

const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
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
                path: "templates",
                element: <TemplateLayout />,
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
];

const router = createBrowserRouter(routes);

export default router;
