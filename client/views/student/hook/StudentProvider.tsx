import { StudentGraphQLProvider } from "@/client/views/student/hook/student.apollo";
import { StudentManagementProvider } from "@/client/views/student/hook/StudentManagementContext";
import { StudentTableManagementProvider } from "@/client/views/student/hook/StudentTableManagementContext";
import { TableLocaleProvider } from "@/client/locale/table/TableLocaleContext";
import { StudentFilterAndSortProvider } from "./StudentFilterContext";

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
