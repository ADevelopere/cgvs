import {
    Button,
    Stack,
    Switch,
    Typography,
    Paper,
    Divider,
    useTheme,
    alpha,
    styled,
    useMediaQuery
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { useTemplateRecipients } from "@/contexts/template/TemplateRecipientsContext";

// Styled components for enhanced visuals
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(8px)',
    transition: theme.transitions.create(['box-shadow', 'background-color'], {
        duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        boxShadow: theme.shadows[2],
    },
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color'], {
        duration: theme.transitions.duration.short,
    }),
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
}));

export default function RecipientsHeader() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { template } = useTemplateManagement();
    const {
        getTemplate,
        setShowImportDialog,
        useClientTemplate,
        setUseClientTemplate,
        useClientValidation,
        setUseClientValidation,
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
        <StyledPaper>
            <Stack 
                direction="column" 
                spacing={3}
                divider={<Divider flexItem />}
            >
                <Stack
                    direction={isMobile ? "column" : "row"}
                    alignItems={isMobile ? "stretch" : "center"}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <StyledSwitch
                            size="small"
                            checked={useClientTemplate}
                            onChange={(e) => {
                                console.log(
                                    "Switching client template generation:",
                                    e.target.checked
                                );
                                setUseClientTemplate(e.target.checked);
                            }}
                        />
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            Use client-side generation (faster)
                        </Typography>
                    </Stack>
                    <StyledButton
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadTemplate}
                        sx={{
                            minWidth: isMobile ? '100%' : 'auto',
                        }}
                    >
                        Download Template
                    </StyledButton>
                </Stack>

                <Stack
                    direction={isMobile ? "column" : "row"}
                    alignItems={isMobile ? "stretch" : "center"}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <StyledSwitch
                            size="small"
                            checked={useClientValidation}
                            onChange={(e) => setUseClientValidation(e.target.checked)}
                        />
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                        >
                            Use client-side validation
                        </Typography>
                    </Stack>
                    <StyledButton
                        variant="contained"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => setShowImportDialog(true)}
                        sx={{
                            minWidth: isMobile ? '100%' : 'auto',
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            }
                        }}
                    >
                        Import Recipients
                    </StyledButton>
                </Stack>
            </Stack>
        </StyledPaper>
    );
}
