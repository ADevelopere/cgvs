"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import { useRecipientGroupDialogs } from "./hooks/useRecipientGroupDialogs";
import { useAppTranslation } from "@/client/locale";

const EmptyGroupsState: React.FC = () => {
  const { recipientGroupTranslations: strings } = useAppTranslation();
  const { openCreateDialog } = useRecipientGroupDialogs();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        textAlign: "center",
        padding: 4,
      }}
    >
      <GroupsIcon sx={{ fontSize: 80, color: "grey.500", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {strings.noGroups}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {strings.noGroupsDescription}
      </Typography>
      <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={openCreateDialog}>
        {strings.createFirstGroup}
      </Button>
    </Box>
  );
};

export default EmptyGroupsState;
