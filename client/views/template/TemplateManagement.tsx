"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Box, useTheme, Fade, IconButton } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTemplateUIStore, TemplateManagementTabType } from "./useTemplateUIStore";
import BasicInfoTab from "./BasicInfoTab";
// import PreviewTab from "./tabs/PreviewTab";
// import { TemplateRecipientsProvider } from "@/contexts/template/TemplateRecipientsContext";
// import EditorTab from "./editor/EditorTab";
import { useState, useEffect } from "react";
import ManagementHeader from "./ManagementHeader";
import TemplateVariableManagement from "./variables/TemplateVariableManagement";
import RecipientGroupTab from "./recipient/RecipientGroupTab";
import RecipientsManagementTab from "./recipient/RecipientsManagementTab";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface TemplateManagementProps {
  template: Graphql.Template;
}

const TemplateManagement: React.FC<TemplateManagementProps> = ({ template }) => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activeTab, setActiveTab, setTabError } = useTemplateUIStore();
  const [showScrollTop, setShowScrollTop] = useState(false);

 useEffect(() => {
  const handleScroll = () => {
   setShowScrollTop(Boolean(window.scrollY > 300));
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
 }, []);


  const handleTabChange = async (
    _: React.SyntheticEvent,
    newValue: TemplateManagementTabType,
  ) => {
    try {
      setActiveTab(newValue);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newValue);


      router.push(`?${params.toString()}`);
    } catch {
      setTabError(newValue, {
        message: "An error occurred loading this tab",
      });
    }
  };

 const scrollToTop = () => {
  window.scrollTo({
   top: 0,
   behavior: "smooth",
  });
 };

  return (
    <Box id="template-management" sx={{ width: "100%" }}>
      <TabContext value={activeTab}>
        {/* Header */}
        <ManagementHeader
          onChange={handleTabChange}
          activeTab={activeTab}
          templateName={template?.name ?? ""}
        />

        {/* Tabs */}
        <Box
          sx={{
            // mt: { xs: 2, sm: 3 },
            "& .MuiTabPanel-root": {
              // p: { xs: 1, sm: 2, md: 3 },
            },
          }}
        >
          {/* <TemplateRecipientsProvider> */}
          <TabPanel value="basic">
            <BasicInfoTab template={template} />
          </TabPanel>
          <TabPanel value="variables">
            <TemplateVariableManagement template={template} />
          </TabPanel>
          <TabPanel value="recipients">
            <RecipientGroupTab template={template} />
          </TabPanel>
          <TabPanel value="recipientsManagement">
            <RecipientsManagementTab />
          </TabPanel>
          {/* <TabPanel value="editor">
                                    <EditorTab />
                                </TabPanel> */}
          <TabPanel value="preview">
            <Box
              sx={{
                p: 2,
                width: "100%",
                height: "100%",

                borderColor: "red",
              }}
              id="template-variable-management"
            >
              {/* PreviewTab will go here */}
              <h1>PreviewTab</h1>
            </Box>
            {/* <PreviewTab /> */}
          </TabPanel>
          {/* </TemplateRecipientsProvider> */}
        </Box>
      </TabContext>

   {/* Scroll to top button */}
   <Fade in={showScrollTop}>
    <IconButton
     onClick={scrollToTop}
     sx={{
      position: "fixed",
      bottom: 16,
      right: 16,
      bgcolor: "primary.main",
      color: "white",
      "&:hover": {
       bgcolor: "primary.dark",
      },
      zIndex: theme.zIndex.speedDial,
     }}
    >
     <KeyboardArrowUpIcon />
    </IconButton>
   </Fade>
  </Box>
 );
};

export default TemplateManagement;
