"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import {
  useRecipientStore,
  useRecipientStoreInitializer,
} from "./stores/useRecipientStore";
import RecipientGroupSelector from "./RecipientGroupSelector";
import SelectGroupPrompt from "./SelectGroupPrompt";
import StudentsNotInGroupTable from "./StudentsNotInGroupTable";
import StudentsInGroupTable from "./StudentsInGroupTable";
import { RecipientSubTabList } from "./components/RecipientSubTabList";
import { Template } from "@/client/graphql/generated/gql/graphql";

interface RecipientsManagementTabProps {
  template: Template;
}

const RecipientsManagementTab: React.FC<RecipientsManagementTabProps> = ({
  template,
}) => {
  const { selectedGroup, activeSubTab, setActiveSubTab } = useRecipientStore();
  const { loading: initializing } = useRecipientStoreInitializer();

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "manage" | "add"
  ) => {
    setActiveSubTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sub-tabs and Group Selector Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          gap: 2,
          minHeight: 0, // Prevent overflow
        }}
      >
        {/* Sub-tabs (left side) */}
        <Box sx={{ flexShrink: 0 }}>
          <RecipientSubTabList
            onChange={handleTabChange}
            activeTab={activeSubTab}
          />
        </Box>

        {/* Group Selector (right side, flex-grow) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <RecipientGroupSelector template={template} />
        </Box>
      </Box>

      {/* Content Area */}
      {initializing ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.default",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      ) : selectedGroup ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <TabContext value={activeSubTab}>
            <TabPanel value="manage" sx={{ flex: 1, p: 0, overflow: "hidden" }}>
              <Box sx={{ p: 2, height: "100%", overflow: "hidden" }}>
                <StudentsInGroupTable templateId={template.id} />
              </Box>
            </TabPanel>
            <TabPanel value="add" sx={{ flex: 1, p: 0, overflow: "hidden" }}>
              <Box sx={{ p: 2, height: "100%", overflow: "hidden" }}>
                <StudentsNotInGroupTable templateId={template.id} />
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      ) : (
        <SelectGroupPrompt />
      )}
    </Box>
  );
};

export default RecipientsManagementTab;
