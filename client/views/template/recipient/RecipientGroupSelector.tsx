"use client";

import React, { useMemo } from "react";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";
import { useRecipientManagement } from "@/client/contexts/recipient";
import { useAppTranslation } from "@/client/locale";
import { TemplateRecipientGroup, Template } from "@/client/graphql/generated/gql/graphql";

const RecipientGroupSelector: React.FC = () => {
    const strings = useAppTranslation("recipientGroupTranslations");
    const { selectedGroupId, setSelectedGroupId } = useRecipientManagement();

    const template: Template = {
        id: 1,
        name: "Test Template",
        recipientGroups: [],
    } as Template;

    const groups = useMemo(() => {
        return template?.recipientGroups || [];
    }, [template]);

    // const selectedGroup = useMemo(() => {
    //     if (!selectedGroupId) return null;
    //     return groups.find((g) => g.id === selectedGroupId) || null;
    // }, [selectedGroupId, groups]);

    const selectedGroup: TemplateRecipientGroup | null = useMemo(() => {
        if (!selectedGroupId) return null;
        return groups.find((g) => g.id === selectedGroupId) || null;
    }, [selectedGroupId, groups]);

    return (
        <Autocomplete
            value={selectedGroup}
            onChange={(_event, newValue) => {
                setSelectedGroupId(newValue?.id || null);
            }}
            options={groups}
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={strings.selectGroup}
                    placeholder={strings.selectGroupToAddStudents}
                />
            )}
            renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                        <span>{option.name}</span>
                        <Chip
                            label={option.studentCount || 0}
                            size="small"
                            color="primary"
                            sx={{ ml: "auto" }}
                        />
                    </Box>
                </Box>
            )}
            sx={{ minWidth: 300 }}
        />
    );
};

export default RecipientGroupSelector;

