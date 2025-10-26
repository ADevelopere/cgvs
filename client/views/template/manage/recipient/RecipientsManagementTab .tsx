"use client";

import React from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Fade,
  Slide,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import {
  useRecipientStore,
  useRecipientStoreInitializer,
} from "./stores/useRecipientStore";
import RecipientGroupSelector from "../components/RecipientGroupSelector";
import SelectGroupPrompt from "./SelectGroupPrompt";
import StudentsNotInGroupTable from "./StudentsNotInGroupTable";
import StudentsInGroupTable from "./StudentsInGroupTable";
import { RecipientSubTabList } from "./components/RecipientSubTabList";
import { Template } from "@/client/graphql/generated/gql/graphql";
import { useQuery } from "@apollo/client/react";
import { templateRecipientGroupsByTemplateIdQueryDocument } from "../recipientGroup/hooks/recipientGroup.documents";
import { TemplateRecipientGroup } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";
import { useAppTheme } from "@/client/contexts";

interface RecipientsManagementTabProps {
  template: Template;
}

// Sub-tab order for determining slide direction
const SUB_TAB_ORDER: ("manage" | "add")[] = ["manage", "add"];

const RecipientsManagementTab: React.FC<RecipientsManagementTabProps> = ({
  template,
}) => {
  const { selectedGroup, setSelectedGroup, activeSubTab, setActiveSubTab } =
    useRecipientStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const strings = useAppTranslation("recipientGroupTranslations");
  const { isRtl } = useAppTheme();
  const [prevSubTabIndex, setPrevSubTabIndex] = React.useState(
    SUB_TAB_ORDER.indexOf(activeSubTab)
  );

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "manage" | "add"
  ) => {
    setPrevSubTabIndex(SUB_TAB_ORDER.indexOf(activeSubTab));
    setActiveSubTab(newValue);
  };

  // Calculate slide direction based on sub-tab indices and RTL mode
  const slideDirection = React.useMemo(() => {
    const currentSubTabIndex = SUB_TAB_ORDER.indexOf(activeSubTab);
    const baseDirection = currentSubTabIndex > prevSubTabIndex ? "left" : "right";
    // Reverse direction in RTL mode
    return isRtl
      ? baseDirection === "left"
        ? "right"
        : "left"
      : baseDirection;
  }, [activeSubTab, prevSubTabIndex, isRtl]);

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
    return fetchedGroups;
  }, [data?.templateRecipientGroupsByTemplateId]);

  // Auto-select first group if current selection is not in fetched groups
  React.useEffect(() => {
    if (firstInitializingRef.current) {
      firstInitializingRef.current = false;
      return;
    }

    // Check if selected group exists in the fetched groups
    if (!groups.some(g => g.id === selectefGroupRef.current?.id)) {
      setSelectedGroup(groups[0] ?? null);
    }
  }, [groups, setSelectedGroup]);

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
          <RecipientGroupSelector
            groups={groups}
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
            loading={groupsLoading}
          />
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
              <Fade in={activeSubTab === "manage"} timeout={300}>
                <Slide
                  direction={slideDirection}
                  in={activeSubTab === "manage"}
                  timeout={250}
                >
                  <Box sx={{ p: 2, height: "100%", overflow: "hidden" }}>
                    <StudentsInGroupTable
                      templateId={template.id}
                      isMobile={isMobile}
                    />
                  </Box>
                </Slide>
              </Fade>
            </TabPanel>
            <TabPanel value="add" sx={{ flex: 1, p: 0, overflow: "hidden" }}>
              <Fade in={activeSubTab === "add"} timeout={300}>
                <Slide
                  direction={slideDirection}
                  in={activeSubTab === "add"}
                  timeout={250}
                >
                  <Box sx={{ p: 2, height: "100%", overflow: "hidden" }}>
                    <StudentsNotInGroupTable
                      templateId={template.id}
                      isMobile={isMobile}
                    />
                  </Box>
                </Slide>
              </Fade>
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
