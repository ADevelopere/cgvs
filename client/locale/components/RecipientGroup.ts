export type RecipientGroupTranslation = {
    // Field labels
    name: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    studentCount: string;

    // Actions
    manage: string;
    delete: string;
    settings: string;
    info: string;
    cancel: string;
    save: string;
    close: string;

    // Create group
    createGroup: string;
    createFirstGroup: string;
    createGroupTitle: string;
    createGroupDescription: string;

    // Update group
    updateGroup: string;
    updateGroupTitle: string;

    // Delete group
    deleteGroup: string;
    deleteGroupTitle: string;
    confirmDelete: string;

    // Info dialog
    groupInfo: string;
    groupInfoTitle: string;

    // Empty state
    noGroups: string;
    noGroupsDescription: string;

    // Validation
    nameRequired: string;

    // Success messages
    groupCreated: string;
    groupUpdated: string;
    groupDeleted: string;

    // Error messages
    errorCreating: string;
    errorUpdating: string;
    errorDeleting: string;
    cannotDeleteGroupWithStudents: string;

    // Add students to group
    selectGroup: string;
    selectGroupToAddStudents: string;
    studentsNotInGroup: string;
    noStudentsAvailable: string;
    selectedStudents: string;
    addToGroup: string;
    clearSelection: string;
    addedToGroup: string;
    errorAddingToGroup: string;
    goToStudentsPage: string;
    manageGroups: string;
    addStudents: string;
};

