"use client";

import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import logger from "@/lib/logger";
import { useRecipientGroupService } from "./recipientGroup.service";
import { RecipientGroupGraphQLProvider } from "./recipientGroup.apollo";

type RecipientGroupManagementContextType = {
  // States
  loading: boolean;
  selectedGroupId: number | null;

  // Dialog states
  createDialogOpen: boolean;
  infoDialogOpen: boolean;
  settingsDialogOpen: boolean;
  deleteDialogOpen: boolean;

  // Dialog handlers
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openInfoDialog: (groupId: number) => void;
  closeInfoDialog: () => void;
  openSettingsDialog: (groupId: number) => void;
  closeSettingsDialog: () => void;
  openDeleteDialog: (groupId: number) => void;
  closeDeleteDialog: () => void;

  // CRUD operations
  createGroup: (
    input: Graphql.TemplateRecipientGroupCreateInput,
  ) => Promise<boolean>;
  updateGroup: (
    input: Graphql.TemplateRecipientGroupUpdateInput,
  ) => Promise<boolean>;
  deleteGroup: (id: number) => Promise<boolean>;
  updateGroupName: (id: number, name: string) => Promise<boolean>;
};

const RecipientGroupManagementContext = createContext<
  RecipientGroupManagementContextType | undefined
>(undefined);

export const useRecipientGroupManagement = () => {
  const context = useContext(RecipientGroupManagementContext);
  if (!context) {
    throw new Error(
      "useRecipientGroupManagement must be used within a RecipientGroupManagementProvider",
    );
  }
  return context;
};

const ManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const groupService = useRecipientGroupService();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Dialog handlers
  const openCreateDialog = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const closeCreateDialog = useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  const openInfoDialog = useCallback((groupId: number) => {
    setSelectedGroupId(groupId);
    setInfoDialogOpen(true);
  }, []);

  const closeInfoDialog = useCallback(() => {
    setInfoDialogOpen(false);
    setSelectedGroupId(null);
  }, []);

  const openSettingsDialog = useCallback((groupId: number) => {
    setSelectedGroupId(groupId);
    setSettingsDialogOpen(true);
  }, []);

  const closeSettingsDialog = useCallback(() => {
    setSettingsDialogOpen(false);
    setSelectedGroupId(null);
  }, []);

  const openDeleteDialog = useCallback((groupId: number) => {
    setSelectedGroupId(groupId);
    setDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedGroupId(null);
  }, []);

  // CRUD operations
  const createGroup = useCallback(
    async (
      input: Graphql.TemplateRecipientGroupCreateInput,
    ): Promise<boolean> => {
      logger.log("Creating recipient group", input);
      setLoading(true);
      try {
        const result = await groupService.createGroup(input);
        if (result) {
          closeCreateDialog();
          return true;
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [groupService, closeCreateDialog],
  );

  const updateGroup = useCallback(
    async (
      input: Graphql.TemplateRecipientGroupUpdateInput,
    ): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await groupService.updateGroup(input);
        if (result) {
          closeSettingsDialog();
          return true;
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [groupService, closeSettingsDialog],
  );

  const updateGroupName = useCallback(
    async (id: number, name: string): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await groupService.updateGroupName(id, name);
        return !!result;
      } finally {
        setLoading(false);
      }
    },
    [groupService],
  );

  const deleteGroup = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await groupService.deleteGroup(id);
        if (result) {
          closeDeleteDialog();
          return true;
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [groupService, closeDeleteDialog],
  );

  const contextValue = useMemo(
    () => ({
      loading,
      selectedGroupId,
      createDialogOpen,
      infoDialogOpen,
      settingsDialogOpen,
      deleteDialogOpen,
      openCreateDialog,
      closeCreateDialog,
      openInfoDialog,
      closeInfoDialog,
      openSettingsDialog,
      closeSettingsDialog,
      openDeleteDialog,
      closeDeleteDialog,
      createGroup,
      updateGroup,
      deleteGroup,
      updateGroupName,
    }),
    [
      loading,
      selectedGroupId,
      createDialogOpen,
      infoDialogOpen,
      settingsDialogOpen,
      deleteDialogOpen,
      openCreateDialog,
      closeCreateDialog,
      openInfoDialog,
      closeInfoDialog,
      openSettingsDialog,
      closeSettingsDialog,
      openDeleteDialog,
      closeDeleteDialog,
      createGroup,
      updateGroup,
      deleteGroup,
      updateGroupName,
    ],
  );

  return (
    <RecipientGroupManagementContext.Provider value={contextValue}>
      {children}
    </RecipientGroupManagementContext.Provider>
  );
};

export const RecipientGroupManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <RecipientGroupGraphQLProvider>
      <ManagementProvider>{children}</ManagementProvider>
    </RecipientGroupGraphQLProvider>
  );
};
