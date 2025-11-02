"use client";

import React from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabPanel, TabList as MuiTabList } from "@mui/lab";
import { useEditorStore } from "../useEditorStore";
import { MiscellaneousPanelTab } from "./types";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TemplateConfigAutoUpdateForm } from "../form/config/TemplateConfigAutoUpdateForm";

export type MiscellaneousPanelProps = {
  config: GQL.TemplateConfig;
};

export const MiscellaneousPanel: React.FC<MiscellaneousPanelProps> = ({
  config,
}) => {
  const { currntMiscellaneousPanelTab, setCurrntMiscellaneousPanelTab } =
    useEditorStore();

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: MiscellaneousPanelTab
  ) => {
    setCurrntMiscellaneousPanelTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TabContext value={currntMiscellaneousPanelTab}>
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
          <MuiTabList
            onChange={handleTabChange}
            aria-label="miscellaneous panel tabs"
            variant="fullWidth"
            // sx={{
            //   "& .MuiTab-root": {
            //     minHeight: { xs: 48, sm: 56 },
            //     fontSize: { xs: "0.875rem", sm: "1rem" },
            //     px: { xs: 1, sm: 2 },
            //     "&.Mui-selected": {
            //       backgroundColor: "action.hover",
            //       color: "primary.main",
            //       fontWeight: 600,
            //       transform: "scale(1.02)",
            //     },
            //     "&:hover": {
            //       backgroundColor: "action.hover",
            //     },
            //     transition: "all 0.2s ease-in-out",
            //   },
            // }}
            // id="miscellaneous-panel-tabs"
            // slotProps={{
            //   indicator: {
            //     sx: {
            //       backgroundColor: "primary.main",
            //       height: 3,
            //       borderRadius: "3px 3px 0 0",
            //     },
            //   },
            //   list: {
            //     sx: {
            //       display: "flex",
            //       justifyContent: "center",
            //       gap: 0,
            //     },
            //   },
            // }}
          >
            <Tab label="Config" value="config" />
            <Tab label="Elements" value="elements" />
            <Tab label="Current Element" value="currentElement" />
          </MuiTabList>
        </Box>
        <TabPanel
          value="config"
          sx={{ flexGrow: 1, p: 1, width: "100%", height: "100%" }}
        >
          <TemplateConfigAutoUpdateForm config={config} />
        </TabPanel>
        <TabPanel value="elements" sx={{ flexGrow: 1, p: 1 }}>
          <div>Elements Content</div>
        </TabPanel>
        <TabPanel value="currentElement" sx={{ flexGrow: 1, p: 1 }}>
          <div>Current Element Content</div>
        </TabPanel>
      </TabContext>
    </Box>
  );
};
