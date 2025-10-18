"use client";

import React from "react";
import { Autocomplete, TextField, Chip, Box, Alert } from "@mui/material";
import { useRecipientStore } from "./stores/useRecipientStore";
import { useAppTranslation } from "@/client/locale";
import {
  Template,
  TemplateRecipientGroup,
} from "@/client/graphql/generated/gql/graphql";
import { templateRecipientGroupsByTemplateIdQueryDocument } from "../recipientGroup/hooks/recipientGroup.documents";
import { useQuery } from "@apollo/client/react";

type RecipientGroupSelectorProps = {
  template: Template;
};

const RecipientGroupSelector: React.FC<RecipientGroupSelectorProps> = ({
  template,
}) => {
  const strings = useAppTranslation("recipientGroupTranslations");
  const { selectedGroup, setSelectedGroup } = useRecipientStore();

  const {
    data,
    loading: apolloLoading,
    error,
  } = useQuery(templateRecipientGroupsByTemplateIdQueryDocument, {
    variables: {
      templateId: template.id,
    },
    fetchPolicy: "cache-and-network", // Ensure we have the latest data
  });

  const groups: readonly TemplateRecipientGroup[] = React.useMemo(
    () => data?.templateRecipientGroupsByTemplateId ?? [],
    [data],
  );

  // Show error state if there's an error
  if (error) {
    return (
      <Alert severity="error" sx={{ minWidth: 300 }}>
        {strings.errorFetchingGroups}
      </Alert>
    );
  }

  return (
    <Autocomplete
      value={selectedGroup}
      // u cant use selectGroupId here, cause it will need a computed opject, so we need to pass the whole object so it will be the same reference
      onChange={(_, newValue: TemplateRecipientGroup | null) => {
        if (newValue) {
          setSelectedGroup(newValue);
        }
      }}
      options={groups}
      loading={apolloLoading}
      openOnFocus
      getOptionLabel={(option) => option.name || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText={strings.noOptionsAvailable}
      renderInput={(params) => (
        <TextField
          {...params}
          label={strings.selectGroup}
          placeholder={strings.selectGroup}
        />
      )}
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
            <Chip
              label={option.studentCount || 0}
              size="small"
              color="primary"
              sx={{ ml: "auto" }}
            />
          </Box>
        </li>
      )}
      sx={{ minWidth: 300 }}
    />
  );
};

export default RecipientGroupSelector;
