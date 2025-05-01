import { Button, Divider, Paper, Stack, Switch, Typography } from '@mui/material';
import { useTemplateManagement } from '@/contexts/template/TemplateManagementContext';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ImportExport from './ImportExport';
import RecipientList from './RecipientList';
import { useTemplateRecipients } from '@/contexts/template/TemplateRecipientsContext';

export default function RecipientsTab() {
    const { template } = useTemplateManagement();
    const { 
        useClientValidation,
        setUseClientValidation,
        showImportDialog,
        setShowImportDialog,
        downloadTemplate
    } = useTemplateRecipients();

    if (!template) {
        return null;
    }

    return (
        <Stack spacing={3} sx={{ p: 2 }}>
            <Paper sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Recipients Management</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => downloadTemplate(template.id)}
                        >
                            Download Template
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => setShowImportDialog(true)}
                        >
                            Import Recipients
                        </Button>
                    </Stack>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Switch
                        checked={useClientValidation}
                        onChange={(e) => setUseClientValidation(e.target.checked)}
                    />
                    <Typography>Use client-side validation (faster)</Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <RecipientList templateId={template.id} />
            </Paper>

            <ImportExport
                templateId={template.id}
            />
        </Stack>
    );
}
