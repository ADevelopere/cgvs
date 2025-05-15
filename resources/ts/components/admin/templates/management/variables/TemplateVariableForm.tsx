import { FC, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTemplateVariableManagement } from "@/contexts/templateVariable/TemplateVariableManagementContext";
import NumberTemplateVariableForm from "./forms/NumberTemplateVariableForm";
import SelectTemplateVariableForm from "./forms/SelectTemplateVariableForm";
import DateTemplateVariableForm from "./forms/DateTemplateVariableForm";
import TextTemplateVariableForm from "./forms/TextTemplateVariableFormClass";

const TemplateVariableForm: FC = () => {
    const { formPaneState } = useTemplateVariableManagement();
    const { mode, editingVariable, createType } = formPaneState;
    console.log("Form pane state:", formPaneState);

    // Determine the current form type
    const currentType = useMemo(() => {
        return mode === "create" ? createType : editingVariable?.type;
    }, [mode, createType, editingVariable?.type]);

    if (!currentType) {
        return null;
    }

    // Render appropriate form based on type
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                {mode === "edit" ? "Edit" : "Create"}{" "}
                {currentType.charAt(0).toUpperCase() + currentType.slice(1)}{" "}
                Variable
            </Typography>

            {currentType === "text" && <TextTemplateVariableForm />}
            {currentType === "number" && <NumberTemplateVariableForm />}
            {currentType === "select" && <SelectTemplateVariableForm />}
            {currentType === "date" && <DateTemplateVariableForm />}
        </Box>
    );
};

export default TemplateVariableForm;
