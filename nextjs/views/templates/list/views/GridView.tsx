"use client";

import React from "react";
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    useTheme,
    useMediaQuery,
    Box,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Template } from "@/graphql/generated/types";
import { TEMPLATE_IMAGE_PLACEHOLDER_URL } from "@/utils/templateImagePlaceHolder";
import useAppTranslation from "@/locale/useAppTranslation";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import Image from "next/image";

interface GridViewProps {
    templates: Template[];
}

const GridView: React.FC<GridViewProps> = ({ templates }) => {
    const strings = useAppTranslation("templateCategoryTranslations");
    const { manageTemplate } = useTemplateCategoryManagement();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Responsive columns
    const getCols = () => {
        if (isMobile) return 1;
        return 2;
    };

    console.log("GridView templates", templates);

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
            {templates.map((template) => (
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
                            paddingTop: "56.25%" /* 16:9 aspect ratio */,
                            width: "100%",
                            backgroundColor: "grey.100",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            src={
                                template.imageUrl ??
                                TEMPLATE_IMAGE_PLACEHOLDER_URL
                            }
                            alt={template.name}
                            layout="fill"
                            objectFit="cover"
                            priority={false} // Adjust priority if needed
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
            ))}
        </ImageList>
    );
};

export default GridView;
