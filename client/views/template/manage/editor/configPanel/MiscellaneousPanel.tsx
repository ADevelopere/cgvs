/**
 * MiscellaneousPanel
 *
 * Displays a tabbed panel for managing miscellaneous template settings, elements, and current element configuration.
 * Tabs include:
 *   - Config: Template configuration auto-update form
 *   - Elements: List and management of certificate elements
 *   - Current Element: Settings for the currently selected certificate element
 *
 * Props:
 *   - elements: Array of certificate element unions to display/manage
 *   - templateConfig: Template configuration object for the current template
 *
 * Uses translation system for tab labels and integrates with editor store for tab state.
 */
"use client";

import React from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { useEditorStore } from "../hooks/useEditorStore";
import { MiscellaneousPanelTab } from "./types";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TemplateConfigAutoUpdateForm } from "../form/config/TemplateConfigAutoUpdateForm";
import { useAppTranslation } from "@/client/locale";
import { ElementsTab } from "./elements/ElementsTab";
import { CertificateElementCurrentItemSettings } from "./currentElement/CurrentElement";
import { WheelTabList } from "@/client/components";

/**
 * Props for MiscellaneousPanel component.
 * @property elements Array of certificate element unions to display/manage
 * @property templateConfig Template configuration object for the current template
 */
export type MiscellaneousPanelProps = {
  elements: GQL.CertificateElementUnion[];
  templateConfig: GQL.TemplateConfig;
};

/**
 * MiscellaneousPanel React component
 * @param elements Array of certificate element unions
 * @param templateConfig Template configuration object
 */
export const MiscellaneousPanel: React.FC<MiscellaneousPanelProps> = ({ elements, templateConfig }) => {
  const {
    templateEditorTranslations: { miscellaneousPanel: strings },
  } = useAppTranslation();
  const { currntMiscellaneousPanelTab, setCurrntMiscellaneousPanelTab } = useEditorStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: MiscellaneousPanelTab) => {
    setCurrntMiscellaneousPanelTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
            // px: { xs: 2, sm: 3 },
          }}
        >
          <WheelTabList
            onChange={handleTabChange}
            aria-label="miscellaneous panel tabs"
            variant="scrollable"
            sx={{
              "& .MuiTab-root": {
                minHeight: { xs: 48, sm: 56 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                // px: { xs: 1, sm: 2 },
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
              scrollbar: {
                sx: {
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: 0,
                  position: "relative",
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
          </WheelTabList>
        </Box>
        <TabPanel
          value="config"
          sx={{
            flexGrow: 1,
            p: 1,
            width: "100%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <TemplateConfigAutoUpdateForm />
        </TabPanel>
        <TabPanel value="elements" sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}>
          <ElementsTab elements={elements} />
        </TabPanel>
        <TabPanel value="currentElement" sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}>
          <CertificateElementCurrentItemSettings elements={elements} templateConfig={templateConfig} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
