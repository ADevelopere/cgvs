import { RecipientGroupTranslation } from "../components";

export const recipientGroup: RecipientGroupTranslation = {
 // Field labels
 name: "الإسم",
 description: "الوصف",
 date: "التاريخ",
 createdAt: "تاريخ الإنشاء",
 updatedAt: "تاريخ التحديث",
 studentCount: "عدد الطلاب",

 // Actions
 manage: "إدارة",
 delete: "حذف",
 settings: "الإعدادات",
 info: "معلومات",
 cancel: "إلغاء",
 save: "حفظ",
 close: "إغلاق",

 // Create group
 createGroup: "إنشاء مجموعة",
 createFirstGroup: "إنشاء أول مجموعة",
 createGroupTitle: "إنشاء مجموعة جديدة",
 createGroupDescription: "أنشئ مجموعة جديدة لتنظيم المستلمين",

 // Update group
 updateGroup: "تحديث المجموعة",
 updateGroupTitle: "تحديث المجموعة",

 // Delete group
 deleteGroup: "حذف المجموعة",
 deleteGroupTitle: "تأكيد الحذف",
 confirmDelete:
  "هل أنت متأكد أنك تريد حذف هذه المجموعة؟ لا يمكن التراجع عن هذا الإجراء.",

 // Info dialog
 groupInfo: "معلومات المجموعة",
 groupInfoTitle: "معلومات المجموعة",

 // Empty state
 noGroups: "لا توجد مجموعات بعد",
 noGroupsDescription: "ابدأ بإنشاء مجموعة لتنظيم المستلمين الخاصين بك",

 // Validation
 nameRequired: "الإسم مطلوب",

 // Success messages
 groupCreated: "تم إنشاء المجموعة بنجاح",
 groupUpdated: "تم تحديث المجموعة بنجاح",
 groupDeleted: "تم حذف المجموعة بنجاح",

 // Error messages
 errorCreating: "فشل إنشاء المجموعة",
 errorUpdating: "فشل تحديث المجموعة",
 errorDeleting: "فشل حذف المجموعة",
 cannotDeleteGroupWithStudents: "لا يمكن حذف المجموعة التي تحتوي على طلاب",

 // Add students to group
 selectGroup: "اختر مجموعة",
 selectGroupToAddStudents: "اختر مجموعة لإضافة طلاب",
 studentsNotInGroup: "الطلاب غير الموجودين في المجموعة",
 noStudentsAvailable: "لا يوجد طلاب متاحون للإضافة",
 selectedStudents: "الطلاب المحددون",
 addToGroup: "إضافة إلى المجموعة",
 clearAllSelection: "إلغاء تحديد الكل",
 addedToGroup: "تمت إضافة الطلاب إلى المجموعة بنجاح",
 errorAddingToGroup: "فشل في إضافة الطلاب إلى المجموعة",
 goToStudentsPage: "الانتقال إلى صفحة الطلاب",
 manageGroups: "إدارة المجموعات",
 addStudents: "إضافة طلاب",

 // Confirmation dialogs
 confirmClearSelection: "تأكيد إلغاء التحديد",
 confirmClearSelectionMessage:
  "هل أنت متأكد أنك تريد إلغاء تحديد جميع الطلاب المحددين؟",
 confirmAddStudents: "تأكيد إضافة الطلاب",
 confirmAddStudentsMessage:
  "هل أنت متأكد أنك تريد إضافة الطلاب المحددين إلى المجموعة؟",
};
