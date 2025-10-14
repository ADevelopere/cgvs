import { TemplateManagementProvider } from "@/client/contexts";
import TemplateManagement from "@/client/views/template/TemplateManagement";

const TemplateManagementPage = () => {
  return (
    <TemplateManagementProvider>
      <TemplateManagement />
    </TemplateManagementProvider>
  );
};

export default TemplateManagementPage;
