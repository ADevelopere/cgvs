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
import { formatDate } from "@/client/utils/dateUtils";
import { useAppTranslation } from "@/client/locale";
import { useTemplatesList } from "../TemplatesContext";
import { getTemplateImageUrl } from "@/client/utils/template/getTemplateImageUrl";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import Image from "next/image";
import { Template } from "@/client/graphql/generated/gql/graphql";

interface CardViewProps {
  templates: Template[];
}

const CardView: React.FC<CardViewProps> = ({ templates }) => {
  const strings = useAppTranslation("templateCategoryTranslations");
  const { isDark } = useAppTheme();

  const { manageTemplate } = useTemplatesList();

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
      {templates.map((template) => {
        if (!template.name) {
          throw new Error("Template name is required");
        }

        return (
          <Grid size={{ xs: 16, sm: 6, md: 4 }} key={template.id}>
            <Card>
              <CardMedia
                sx={{
                  height: 200,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={getTemplateImageUrl(template, isDark)}
                  alt={template.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
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
        );
      })}
    </Grid>
  );
};

export default CardView;
