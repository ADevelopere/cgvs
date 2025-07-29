import { StudentFilterAndSortProvider } from "@/contexts/student/StudentFilterContext";
import { StudentGraphQLProvider } from "@/contexts/student/StudentGraphQLContext";
import { StudentManagementProvider } from "@/contexts/student/StudentManagementContext";
import { Outlet } from "react-router-dom";

const StudentsLayout: React.FC = () => {
    return (
        <StudentGraphQLProvider>
            <StudentManagementProvider>
                <StudentFilterAndSortProvider>
                    <Outlet />
                </StudentFilterAndSortProvider>
            </StudentManagementProvider>
        </StudentGraphQLProvider>
    );
};

export default StudentsLayout;
