"use client";

import React from "react";
import { ImageList, ImageListItem, ImageListItemBar, IconButton, useTheme, useMediaQuery, Box } from "@mui/material";
import Image from "next/image";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAppTheme } from "@/client/contexts";
import { useAppTranslation } from "@/client/locale";
import { Template } from "@/client/graphql/generated/gql/graphql";
import { TemplateUtils } from "../../utils";

interface GridViewProps {
  templates: Template[];
  manageTemplate: (templateId: number) => void;
  failedImages: Set<number>;
  onImageError: (templateId: number) => void;
}

const GridView: React.FC<GridViewProps> = ({ templates, manageTemplate, failedImages, onImageError }) => {
  const { templateCategoryTranslations: strings } = useAppTranslation();
  const { isDark } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Responsive columns
  const getCols = () => {
    if (isMobile) return 1;
    return 2;
  };

  return (
    <ImageList
      cols={getCols()}
      gap={16}
      sx={{
        // Ensure consistent width across screens
        width: "100%",
        margin: 0,
        // Remove default ImageList padding
        "& .MuiImageList-root": {
          padding: 0,
        },
        paddingInlineEnd: 1,
      }}
    >
      {templates.map(template => {
        if (!template.name) {
          throw new Error("Template name is required");
        }

        const imageHasFailed = failedImages.has(template.id);
        const imageUrl = imageHasFailed
          ? TemplateUtils.getTemplateImageUrl({}, isDark)
          : TemplateUtils.getTemplateImageUrl(template, isDark);

        return (
          <ImageListItem
            key={template.id}
            sx={{
              // Ensure consistent item size
              width: "100% !important",
              height: "auto !important",
              minHeight: 200,
              // Add some spacing between items
              mb: 2,
              // Ensure proper border radius
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 200,
                backgroundColor: "grey.100",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Image
                src={imageUrl}
                alt={template.name}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                }}
                priority={false}
                onError={() => onImageError(template.id)}
              />
            </Box>
            <ImageListItemBar
              title={template.name}
              subtitle={template.description}
              sx={{
                "& .MuiImageListItemBar-title": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                "& .MuiImageListItemBar-subtitle": {
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
              actionIcon={
                <IconButton
                  sx={{
                    color: "rgba(255, 255, 255, 0.85)",
                    padding: { xs: 1, sm: 1.5 },
                  }}
                  onClick={() => manageTemplate(template.id)}
                  title={strings.manageTemplateButtonTitle}
                >
                  <SettingsIcon
                    sx={{
                      fontSize: {
                        xs: "1.2rem",
                        sm: "1.5rem",
                      },
                    }}
                  />
                </IconButton>
              }
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

export default GridView;
