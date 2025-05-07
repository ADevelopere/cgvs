import React from "react";
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTemplate } from "@/contexts/template/TemplatesContext";
import { Template } from "@/graphql/generated/types";

interface GridViewProps {
    templates: Template[];
}

const GridView: React.FC<GridViewProps> = ({ templates }) => {
    const { manageTemplate } = useTemplate();

    return (
        <ImageList cols={4} gap={16}>
            {templates.map((template) => (
                <ImageListItem key={template.id}>
                    <img
                        src={template.background_url || "/placeholder.png"}
                        alt={template.name}
                        loading="lazy"
                        style={{ height: "200px", objectFit: "cover" }}
                    />
                    <ImageListItemBar
                        title={template.name}
                        subtitle={template.description}
                        actionIcon={
                            <IconButton
                                sx={{ color: "rgba(255, 255, 255, 0.85)" }}
                                onClick={() => manageTemplate(template.id)}
                                title="Manage template"
                            >
                                <SettingsIcon />
                            </IconButton>
                        }
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

export default GridView;
