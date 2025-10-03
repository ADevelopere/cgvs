import { StudentFilterAndSortProvider } from "@/client/contexts/student/StudentFilterContext";
import { StudentGraphQLProvider } from "@/client/contexts/student/StudentGraphQLContext";
import { StudentManagementProvider } from "@/client/contexts/student/StudentManagementContext";
import { StudentTableManagementProvider } from "@/client/contexts/student/StudentTableManagementContext";
import { TableLocaleProvider } from "@/locale/table/TableLocaleContext";

// Next.js layout component: receives children as prop
const StudentProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StudentGraphQLProvider>
            <StudentManagementProvider>
                <StudentTableManagementProvider>
                    <StudentFilterAndSortProvider>
                        <TableLocaleProvider>{children}</TableLocaleProvider>
                    </StudentFilterAndSortProvider>
                </StudentTableManagementProvider>
            </StudentManagementProvider>
        </StudentGraphQLProvider>
    );
};

export default StudentProvider;