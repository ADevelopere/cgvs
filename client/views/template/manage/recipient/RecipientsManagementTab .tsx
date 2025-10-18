"use client";

import React from "react";
import { Box } from "@mui/material";
import { useRecipientStore } from "./stores/useRecipientStore";
import RecipientGroupSelector from "./RecipientGroupSelector";
import SelectGroupPrompt from "./SelectGroupPrompt";
import StudentsNotInGroupTable from "./add/StudentsNotInGroupTable";
import { Template } from "@/client/graphql/generated/gql/graphql";

interface RecipientsManagementTabProps {
  template: Template;
}

const RecipientsManagementTab: React.FC<RecipientsManagementTabProps> = ({
  template,
}) => {
  const { selectedGroup } = useRecipientStore();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Group Selector */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <RecipientGroupSelector template={template} />
      </Box>

      {/* Content Area */}
      {selectedGroup ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            p: 2,
          }}
        >
          <StudentsNotInGroupTable templateId={template.id} />
        </Box>
      ) : (
        <SelectGroupPrompt />
      )}
    </Box>
  );
};

export default RecipientsManagementTab;
