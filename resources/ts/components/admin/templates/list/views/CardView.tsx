import React from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { formatDate } from "@/utils/dateUtils";
import { useTemplate } from "@/contexts/template/TemplatesContext";
import { Template } from "@/graphql/generated/types";
import { TEMPLATE_IMAGE_PLACEHOLDER_URL } from "@/utils/templateImagePlaceHolder";

interface CardViewProps {
    templates: Template[];
}

const CardView: React.FC<CardViewProps> = ({ templates }) => {
    const { manageTemplate } = useTemplate();

    return (
        <Grid container spacing={3}>
            {templates.map((template) => (
                <Grid size={{ xs: 16, sm: 6, md: 4 }} key={template.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={
                                template.background_url || TEMPLATE_IMAGE_PLACEHOLDER_URL
                            }
                            alt={template.name}
                            sx={{
                                height: { xs: 140, sm: 170, md: 200 },
                                objectFit: "cover",
                            }}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                            >
                                {template.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {template.description}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 1, display: "block" }}
                                 gutterBottom
                            >
                                Created: {formatDate(template.created_at)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                startIcon={<SettingsIcon />}
                                onClick={() => manageTemplate(template.id.toString())}
                            >
                                Manage
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CardView;
