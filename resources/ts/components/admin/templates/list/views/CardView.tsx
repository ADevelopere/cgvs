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

interface CardViewProps {
    templates: Template[];
}

const CardView: React.FC<CardViewProps> = ({ templates }) => {
    const { manageTemplate } = useTemplate();

    return (
        <Grid container spacing={3}>
            {templates.map((template) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={
                                template.background_url || "/placeholder.png"
                            }
                            alt={template.name}
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
