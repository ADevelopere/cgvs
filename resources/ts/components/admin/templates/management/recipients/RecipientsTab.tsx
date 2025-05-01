import { Divider, Paper, Stack, Switch, Typography } from '@mui/material';
import { useTemplateManagement } from '@/contexts/template/TemplateManagementContext';
import ImportExport from './ImportExport';
import RecipientList from './RecipientList';
import RecipientsHeader from './RecipientsHeader';

export default function RecipientsTab() {
    const { template } = useTemplateManagement();

    if (!template) {
        return null;
    }

    return (
        <Stack spacing={3} sx={{ p: 2 }}>
            <Paper sx={{ p: 2 }}>
                <RecipientsHeader />

                <Divider sx={{ my: 2 }} />

                <RecipientList templateId={template.id} />
            </Paper>

            <ImportExport
                templateId={template.id}
            />
        </Stack>
    );
}
