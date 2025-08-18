import { Alert, Box, Paper, SxProps, Theme, Typography } from '@mui/material';
import { useTemplateRecipients } from '@/contexts/template/TemplateRecipientsContext';

interface ValidationResultsProps {
    sx?: SxProps<Theme>;
}

export default function ValidationResults({ sx }: ValidationResultsProps) {
    const { validationResult } = useTemplateRecipients();
    if (!validationResult) return null;
    
    const { valid_rows, total_rows, errors } = validationResult;

    return (
        <Box sx={sx}>
            <Alert 
                severity={errors.length > 0 ? "warning" : "success"}
                sx={{ mb: 2 }}
            >
                {valid_rows} of {total_rows} rows are valid
            </Alert>

            {errors.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom>
                        Validation Errors
                    </Typography>
                    {errors.map(({ row, errors }, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="error">
                                Row {row}:
                            </Typography>
                            {errors.map((error, i) => (
                                <Typography key={i} variant="body2" color="error.light">
                                    • {error}
                                </Typography>
                            ))}
                        </Box>
                    ))}
                </Paper>
            )}
        </Box>
    );
}
