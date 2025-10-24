"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { TemplateRecipientGroup } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";

interface RecipientVariableDataGroupSelectorProps {
  groups: readonly TemplateRecipientGroup[];
  selectedGroup: TemplateRecipientGroup | null;
  onGroupChange: (group: TemplateRecipientGroup | null) => void;
  loading: boolean;
}

const RecipientVariableDataGroupSelector: React.FC<
  RecipientVariableDataGroupSelectorProps
> = ({ groups, selectedGroup, onGroupChange, loading }) => {
  const strings = useAppTranslation("recipientVariableDataTranslations");

  const handleGroupChange = (event: unknown) => {
    const target = (event as { target: { value: unknown } }).target;
    const groupId = String(target.value);
    const group = groups.find(g => g.id === parseInt(groupId, 10)) || null;
    onGroupChange(group);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 200,
        }}
      >
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          {strings.selectGroup}
        </Typography>
      </Box>
    );
  }

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 300,
        "& .MuiInputLabel-root": {
          fontSize: "0.875rem",
        },
        "& .MuiSelect-select": {
          fontSize: "0.875rem",
        },
      }}
    >
      <InputLabel id="group-selector-label">{strings.selectGroup}</InputLabel>
      <Select
        labelId="group-selector-label"
        value={selectedGroup?.id || ""}
        label={strings.selectGroup}
        onChange={handleGroupChange}
        disabled={groups.length === 0}
      >
        {groups.map(group => (
          <MenuItem key={group.id} value={group.id || 0}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {group.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {group.studentCount || 0} students
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RecipientVariableDataGroupSelector;
