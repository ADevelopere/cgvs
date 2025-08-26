import { TemplateManagementProvider } from '@/contexts/template/TemplateManagementContext';
import TemplateManagement from '@/views/templates/management/TemplateManagement';

const TemplateManagementPage = () => {
    return (
        <TemplateManagementProvider>
                <TemplateManagement />
        </TemplateManagementProvider>
    );
};

export default TemplateManagementPage;
