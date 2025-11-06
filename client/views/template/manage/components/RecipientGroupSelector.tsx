"use client";

import React from "react";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { TemplateRecipientGroup } from "@/client/graphql/generated/gql/graphql";

type RecipientGroupSelectorProps = {
  groups: readonly TemplateRecipientGroup[];
  selectedGroup: TemplateRecipientGroup | null;
  onGroupChange: (group: TemplateRecipientGroup | null) => void;
  loading?: boolean;
};

const RecipientGroupSelector: React.FC<RecipientGroupSelectorProps> = ({
  groups,
  selectedGroup,
  onGroupChange,
  loading = false,
}) => {
  const { recipientGroupTranslations: strings } = useAppTranslation();

  return (
    <Autocomplete
      value={selectedGroup}
      // u cant use selectGroupId here, cause it will need a computed opject, so we need to pass the whole object so it will be the same reference
      onChange={(_, newValue: TemplateRecipientGroup | null) => {
        if (newValue) {
          onGroupChange(newValue);
        }
      }}
      options={groups}
      loading={loading}
      openOnFocus
      getOptionLabel={option => option.name || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText={strings.noOptionsAvailable}
      renderInput={params => <TextField {...params} label={strings.selectGroup} placeholder={strings.selectGroup} />}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <span>{option.name}</span>
            <Chip label={option.studentCount || 0} size="small" color="primary" sx={{ ml: "auto" }} />
          </Box>
        </li>
      )}
      sx={{
        minWidth: { xs: 200, sm: 250, md: 300 },
        width: "100%",
        maxWidth: "100%",
      }}
    />
  );
};

export default RecipientGroupSelector;
