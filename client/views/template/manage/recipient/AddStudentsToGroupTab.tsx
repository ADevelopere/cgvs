"use client";

import React from "react";
import { Box } from "@mui/material";
import { useRecipientStore } from "./stores/useRecipientStore";
import RecipientGroupSelector from "./RecipientGroupSelector";
import SelectGroupPrompt from "./SelectGroupPrompt";
import StudentsNotInGroupTable from "./StudentsNotInGroupTable";
import { Template } from "@/client/graphql/generated/gql/graphql";

interface AddStudentsToGroupTabProps {
  template: Template;
}

const AddStudentsToGroupTab: React.FC<AddStudentsToGroupTabProps> = ({
  template,
}) => {
  const { selectedGroupId } = useRecipientStore();

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
      {selectedGroupId ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            p: 2,
          }}
        >
          <StudentsNotInGroupTable />
        </Box>
      ) : (
        <SelectGroupPrompt />
      )}
    </Box>
  );
};

export default AddStudentsToGroupTab;
