"use client";

import React from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabPanel, TabList as MuiTabList } from "@mui/lab";
import { useEditorStore } from "../useEditorStore";
import { MiscellaneousPanelTab } from "./types";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TemplateConfigAutoUpdateForm } from "../form/config/TemplateConfigAutoUpdateForm";
import { useAppTranslation } from "@/client/locale";
import { ElementsTab } from "./elements/ElementsTab";
import { CertificateElementCurrentItemSettings } from "./currentElement/CurrentElement";

export type MiscellaneousPanelProps = {
  config: GQL.TemplateConfig;
  elements: GQL.CertificateElementUnion[];
};

export const MiscellaneousPanel: React.FC<MiscellaneousPanelProps> = ({
  config,
  elements,
}) => {
  const {
    templateEditorTranslations: { miscellaneousPanel: strings },
  } = useAppTranslation();
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
            variant="scrollable"
            sx={{
              "& .MuiTab-root": {
                minHeight: { xs: 48, sm: 56 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                px: { xs: 1, sm: 2 },
                "&.Mui-selected": {
                  backgroundColor: "action.hover",
                  color: "primary.main",
                  fontWeight: 600,
                  transform: "scale(1.02)",
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                transition: "all 0.2s ease-in-out",
              },
            }}
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
                  justifyContent: "start",
                  alignItems: "center",
                  gap: 0,
                },
              },
            }}
          >
            <Tab label={strings.configTab} value="config" />
            <Tab label={strings.elementsTab} value="elements" />
            <Tab label={strings.currentElementTab} value="currentElement" />
          </MuiTabList>
        </Box>
        <TabPanel
          value="config"
          sx={{ flexGrow: 1, p: 1, width: "100%", height: "100%" }}
        >
          <TemplateConfigAutoUpdateForm config={config} />
        </TabPanel>
        <TabPanel value="elements" sx={{ flexGrow: 1, p: 1 }}>
          <ElementsTab elements={elements} />
        </TabPanel>
        <TabPanel value="currentElement" sx={{ flexGrow: 1, p: 1 }}>
          <CertificateElementCurrentItemSettings elements={elements} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
