"use client";

import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
    RecipientGroupGraphQLProvider,
    useRecipientGroupGraphQL,
} from "./RecipientGroupGraphQLContext";
import logger from "@/lib/logger";
import { useAppTranslation } from "@/client/locale";

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
    const notifications = useNotifications();
    const strings = useAppTranslation("recipientGroupTranslations");

    const [loading, setLoading] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const {
        createTemplateRecipientGroupMutation,
        updateTemplateRecipientGroupMutation,
        deleteTemplateRecipientGroupMutation,
    } = useRecipientGroupGraphQL();

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
                const result = await createTemplateRecipientGroupMutation({
                    input,
                });

                if (result.data?.createTemplateRecipientGroup) {
                    notifications.show(strings.groupCreated, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    closeCreateDialog();
                    return true;
                }
                notifications.show(strings.errorCreating, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error creating recipient group:", error);
                notifications.show(strings.errorCreating, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [createTemplateRecipientGroupMutation, notifications, strings, closeCreateDialog],
    );

    const updateGroup = useCallback(
        async (
            input: Graphql.TemplateRecipientGroupUpdateInput,
        ): Promise<boolean> => {
            setLoading(true);
            try {
                const result = await updateTemplateRecipientGroupMutation({
                    input,
                });
                if (result.data?.updateTemplateRecipientGroup) {
                    notifications.show(strings.groupUpdated, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    closeSettingsDialog();
                    return true;
                }
                notifications.show(strings.errorUpdating, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error updating recipient group:", error);
                notifications.show(strings.errorUpdating, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [notifications, updateTemplateRecipientGroupMutation, strings, closeSettingsDialog],
    );

    const updateGroupName = useCallback(
        async (id: number, name: string): Promise<boolean> => {
            setLoading(true);
            try {
                const result = await updateTemplateRecipientGroupMutation({
                    input: { id, name },
                });
                if (result.data?.updateTemplateRecipientGroup) {
                    notifications.show(strings.groupUpdated, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show(strings.errorUpdating, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error updating recipient group name:", error);
                notifications.show(strings.errorUpdating, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [notifications, updateTemplateRecipientGroupMutation, strings],
    );

    const deleteGroup = useCallback(
        async (id: number): Promise<boolean> => {
            setLoading(true);
            try {
                const result = await deleteTemplateRecipientGroupMutation({
                    id,
                });
                if (result.data?.deleteTemplateRecipientGroup) {
                    notifications.show(strings.groupDeleted, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    closeDeleteDialog();
                    return true;
                }
                notifications.show(strings.errorDeleting, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error deleting recipient group:", error);
                notifications.show(strings.errorDeleting, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [deleteTemplateRecipientGroupMutation, notifications, strings, closeDeleteDialog],
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
    templateId: number;
}> = ({ children, templateId }) => {
    return (
        <RecipientGroupGraphQLProvider templateId={templateId}>
            <ManagementProvider>{children}</ManagementProvider>
        </RecipientGroupGraphQLProvider>
    );
};

