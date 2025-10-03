"use client";

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
import { TEMPLATE_IMAGE_PLACEHOLDER_URL } from "@/utils/templateImagePlaceHolder";
import useAppTranslation from "@/client/locale/useAppTranslation";
import { useTemplateCategoryManagement } from "@/client/contexts/template/TemplateCategoryManagementContext";
import Image from "next/image";
import { Template } from "@/client/graphql/generated/gql/graphql";

interface CardViewProps {
    templates: Template[];
}

const CardView: React.FC<CardViewProps> = ({ templates }) => {
    const strings = useAppTranslation("templateCategoryTranslations");

    const { manageTemplate } = useTemplateCategoryManagement();

    return (
        <Grid
            container
            spacing={3}
            sx={{
                // To make the Grid container itself scrollable on large screens
                // when its content is taller than, for example, 70% of the viewport height:
                overflowY: "auto", // Show scrollbar only when needed
                paddingInlineEnd: 1,
            }}
        >
            {templates.map((template) => (
                <Grid size={{ xs: 16, sm: 6, md: 4 }} key={template.id}>
                    <Card>
                        <CardMedia>
                            <Image
                                src={
                                    template.imageUrl ||
                                    TEMPLATE_IMAGE_PLACEHOLDER_URL
                                }
                                alt={template.name}
                                layout="responsive"
                                width={500} // Adjust width as needed
                                height={300} // Adjust height as needed
                                objectFit="cover"
                            />
                        </CardMedia>
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
                                {strings.createdLabel}
                                {formatDate(template.createdAt)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                startIcon={<SettingsIcon />}
                                onClick={() => manageTemplate(template.id)}
                            >
                                {strings.manage}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CardView;
