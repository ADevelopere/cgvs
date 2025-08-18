import { StudentFilterAndSortProvider } from "@/contexts/student/StudentFilterContext";
import { StudentGraphQLProvider } from "@/contexts/student/StudentGraphQLContext";
import { StudentManagementProvider } from "@/contexts/student/StudentManagementContext";


// Next.js layout component: receives children as prop
const StudentsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <StudentGraphQLProvider>
            <StudentManagementProvider>
                <StudentFilterAndSortProvider>
                    {children}
                </StudentFilterAndSortProvider>
            </StudentManagementProvider>
        </StudentGraphQLProvider>
    );
};

export default StudentsLayout;
