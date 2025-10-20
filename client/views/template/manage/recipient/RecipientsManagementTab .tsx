"use client";

import React from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
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
import { useQuery } from "@apollo/client/react";
import { templateRecipientGroupsByTemplateIdQueryDocument } from "../recipientGroup/hooks/recipientGroup.documents";
import { TemplateRecipientGroup } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";

interface RecipientsManagementTabProps {
  template: Template;
}

const RecipientsManagementTab: React.FC<RecipientsManagementTabProps> = ({
  template,
}) => {
  const { selectedGroup, setSelectedGroup, activeSubTab, setActiveSubTab } =
    useRecipientStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const strings = useAppTranslation("recipientGroupTranslations");

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "manage" | "add"
  ) => {
    setActiveSubTab(newValue);
  };

  const { loading: storeInitializing } = useRecipientStoreInitializer();
  const firstInitializingRef = React.useRef(true);

  const {
    data,
    loading: groupsLoading,
    error: groupsError,
  } = useQuery(templateRecipientGroupsByTemplateIdQueryDocument, {
    variables: { templateId: template.id },
    fetchPolicy: "cache-and-network",
  });

  const selectefGroupRef = React.useRef<TemplateRecipientGroup | null>(
    selectedGroup
  );
  selectefGroupRef.current = selectedGroup;

  const groups: readonly TemplateRecipientGroup[] = React.useMemo(() => {
    const fetchedGroups: TemplateRecipientGroup[] =
      data?.templateRecipientGroupsByTemplateId ?? [];
    //  setSelectedGroup to the first group if it is not in the fetched groups
    if (!fetchedGroups.some(g => g.id === selectefGroupRef.current?.id)) {
      setSelectedGroup(fetchedGroups[0] ?? null);
    }
    firstInitializingRef.current = false;
    return fetchedGroups;
  }, [data?.templateRecipientGroupsByTemplateId, setSelectedGroup]);

  // Show error state if there's an error
  if (groupsError) {
    return (
      <Alert
        severity="error"
        sx={{
          minWidth: { xs: 200, sm: 250, md: 300 },
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {strings.errorFetchingGroups}
      </Alert>
    );
  }

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
          }}
        >
          <RecipientGroupSelector groups={groups} loading={groupsLoading} />
        </Box>
      </Box>

      {/* Content Area */}
      {storeInitializing || firstInitializingRef.current ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: 8,
          }}
        >
          <CircularProgress />
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
                <StudentsInGroupTable
                  templateId={template.id}
                  isMobile={isMobile}
                />
              </Box>
            </TabPanel>
            <TabPanel value="add" sx={{ flex: 1, p: 0, overflow: "hidden" }}>
              <Box sx={{ p: 2, height: "100%", overflow: "hidden" }}>
                <StudentsNotInGroupTable
                  templateId={template.id}
                  isMobile={isMobile}
                />
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
