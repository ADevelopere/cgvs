"use client";

import React from "react";
import { Box, LinearProgress } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { TabContext } from "@mui/lab";
import { TabList as MuiTabList } from "@mui/lab";
import { Tab } from "@mui/material";
import { TemplateManagementTabType } from "./useTemplateManagementStore";

interface ManagementTabListProps {
  onChange: (
    event: React.SyntheticEvent,
    newValue: TemplateManagementTabType,
  ) => void;
  activeTab: TemplateManagementTabType;
  isLoading: boolean;
}

export const ManagementTabList: React.FC<ManagementTabListProps> = ({
  onChange,
  activeTab,
  isLoading,
}) => {
  const strings = useAppTranslation("templateCategoryTranslations");

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          fontSize: { xs: "0.875rem", sm: "1rem" },
          px: { xs: 2, sm: 3 },
        }}
      >
        <TabContext value={activeTab}>
          <MuiTabList
            onChange={onChange}
            aria-label="template management tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-scrollButtons": {
                color: "text.secondary",
              },
              "& .MuiTab-root": {
                minHeight: { xs: 48, sm: 56 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 1, sm: 2 },
                "&.Mui-selected": {
                  backgroundColor: "action.hover",
                  color: "primary.main",
                  fontWeight: 600,
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                transition: "all 0.2s ease-in-out",
              },
            }}
            id="template-management-tabs"
            slotProps={{
              indicator: {
                sx: {
                  backgroundColor: "primary.main",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              },
              list: {
                sx: {
                  display: "flex",
                  justifyContent: "center",
                  gap: 0,
                },
              },
            }}
          >
            <Tab label={strings.tabBasicInfo} value="basic" />
            <Tab label={strings.tabVariables} value="variables" />
            <Tab label={strings.tabRecipients} value="recipients" />
            <Tab label="إدارة المستلمين" value="recipientsManagement" />
            <Tab label={strings.tabEditor} value="editor" />
            <Tab label={strings.tabPreview} value="preview" />
          </MuiTabList>
        </TabContext>
      </Box>

      {/* Loading progress indicator at bottom of tabs */}
      {isLoading && (
        <LinearProgress
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: "transparent",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "primary.main",
            },
          }}
        />
      )}
    </Box>
  );
};
