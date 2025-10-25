export type RecipientTranslation = {
  // Table column labels
  name: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  createdAt: string;

  // Success messages
  recipientCreated: string;
  recipientDeleted: string;
  recipientsDeleted: string;
  addedToGroup: string;
  removedFromGroup: string;

  // Error messages
  errorFetchingRecipient: string;
  errorFetchingRecipients: string;
  errorCreatingRecipient: string;
  errorDeletingRecipient: string;
  errorDeletingRecipients: string;
  errorAddingToGroup: string;
  errorRemovingFromGroup: string;
  errorFetchingStudentsNotInGroup: string;
  errorFetchingStudentsInGroup: string;

  // Action buttons and dialogs
  addToGroup: string;
  removeFromGroup: string;
  confirmAddStudents: string;
  confirmAddStudentsMessage: string;
  confirmRemoveStudents: string;
  confirmRemoveStudentsMessage: string;

  // Tab labels
  tabManageAdded: string;
  tabAddNew: string;
};
