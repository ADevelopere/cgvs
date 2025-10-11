import { TemplateManagementProvider } from "@/client/contexts/template/TemplateManagementContext";
import TemplateManagement from "@/client/views/templates/management/TemplateManagement";

const TemplateManagementPage = () => {
 return (
  <TemplateManagementProvider>
   <TemplateManagement />
  </TemplateManagementProvider>
 );
};

export default TemplateManagementPage;
