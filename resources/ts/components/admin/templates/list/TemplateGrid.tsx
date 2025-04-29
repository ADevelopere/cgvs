import React from "react";
import { Grid } from "@mui/material";
import TemplateCard from "./TemplateCard";
import { Template } from "@/contexts/template/template.types";

interface TemplateGridProps {
    templates: Template[];
}

const TemplateGrid: React.FC<TemplateGridProps> = ({ templates }) => {
    return (
        <Grid container spacing={3}>
            {templates.map((template) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                    <TemplateCard template={template} />
                </Grid>
            ))}
        </Grid>
    );
};

export default TemplateGrid;
