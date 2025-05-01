import Management from '@/components/admin/templates/management/Management';
import { TemplateManagementProvider } from '@/contexts/template/TemplateManagementContext';

const TemplateManagementPage = () => {
    return (
        <TemplateManagementProvider>
                <Management />
        </TemplateManagementProvider>
    );
};

export default TemplateManagementPage;
