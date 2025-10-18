"use client";

import React, { useCallback, useMemo, useState } from "react";
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
  const { selectedGroupId, setSelectedGroupId } = useRecipientStore();

  const {
    data,
    loading: apolloLoading,
    error,
  } = useQuery(templateRecipientGroupsByTemplateIdQueryDocument, {
    variables: {
      templateId: template.id,
    },
  });

  const [updating, setUpdating] = useState(true);
  const loading = useMemo(() => {
    return updating || apolloLoading;
  }, [updating, apolloLoading]);

  const groups: TemplateRecipientGroup[] = useMemo(() => {
    if (data?.templateRecipientGroupsByTemplateId) {
      setUpdating(false);
      return data.templateRecipientGroupsByTemplateId;
    }
    setUpdating(false);
    return [];
  }, [data, setUpdating]);

  const selectedGroup: TemplateRecipientGroup | null = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find((g) => g.id === selectedGroupId) || null;
  }, [selectedGroupId, groups]);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

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
      onChange={(_, newValue: TemplateRecipientGroup | null) => {
        if (newValue) {
          setSelectedGroupId(newValue.id ?? null);
        }
      }}
      inputValue={searchTerm}
      onInputChange={(_, newInputValue) => {
        handleSearch(newInputValue);
      }}
      options={groups}
      loading={loading}
      openOnFocus
      getOptionLabel={(option) => option.name || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText={strings.noOptionsAvailable}
      renderInput={(params) => (
        <TextField
          {...params}
          label={strings.selectGroup}
          placeholder={strings.selectGroupToAddStudents}
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
