import { Button, Stack, Switch, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { useTemplateRecipients } from "@/contexts/template/TemplateRecipientsContext";

export default function RecipientsHeader() {
    const { template } = useTemplateManagement();
    const {
        getTemplate,
        setShowImportDialog,
        useClientTemplate,
        setUseClientTemplate,
    } = useTemplateRecipients();

    const handleDownloadTemplate = async () => {
        try {
            console.log('Starting template download...');
            console.log('Template:', template);
            console.log('useClientTemplate:', useClientTemplate);
            
            const result = await getTemplate();
            console.log('Template download result:', result);

            if (!result) {
                console.error('No template result received');
                return;
            }

            const { content, filename } = result;
            console.log('Got template content:', content.size, 'bytes');
            console.log('Filename:', filename);
            
            const url = window.URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            console.log('Download initiated');
        } catch (error) {
            console.error("Failed to download template:", error);
        }
    };

    if (!template) {
        return null;
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
        >
            <Typography variant="h6">Recipients Management</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadTemplate}
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

            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Switch
                    checked={useClientTemplate}
                    onChange={(e) => {
                        console.log(
                            "Switching client template generation:",
                            e.target.checked
                        );
                        setUseClientTemplate(e.target.checked);
                    }}
                />
                <Typography>Use client-side generation (faster)</Typography>
            </Stack>
        </Stack>
    );
}
