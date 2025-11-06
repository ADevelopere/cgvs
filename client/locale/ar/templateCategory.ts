import { TemplateCategoryTranslation } from "../components";

export const templateCategory: TemplateCategoryTranslation = {
  // Management and navigation
  templateCategoriesManagement: "إدارة الفئات",
  theDeleted: "المحذوفة",
  toggleCategoriesPane: "فتح/إغلاق لوحة الفئات",
  toggleTemplatesPane: "فتح/إغلاق لوحة القوالب",
  showCategoriesPane: "إظهار لوحة الفئات",
  hideCategoriesPane: "إخفاء لوحة الفئات",

  // General terms
  categories: "الفئات",
  templates: "القوالب",
  allTemplates: "جميع القوالب",
  name: "الإسم",
  image: "الصورة",
  actions: "الإجراءات",
  createdAt: "تاريخ الإنشاء",
  deletedAt: "تاريخ الحذف",

  // Empty states
  noCategories: "لا توجد فئات",
  noTemplates: "لا توجد قوالب",
  noDeletedTemplates: "لا توجد قوالب محذوفة",
  unnamed: "بدون اسم",

  // Form and button actions
  addCategory: "إضافة فئة",
  addTemplate: "إضافة قالب",
  selectCategory: "اختر فئة",
  searchCategories: "البحث في الفئات",
  selectParentCategory: "اختر الفئة الرئيسية",
  createChildCategory: "إنشاء فئة فرعية",
  addNewCategory: "إضافة فئة جديدة",
  addNewTemplate: "إضافة قالب جديد",
  edit: "تعديل",
  move: "نقل",
  delete: "حذف",
  more: "المزيد",
  manage: "إدارة",
  manageButton: "إدارة",
  restoreTemplate: "استعادة القالب",
  description: "الوصف",
  parentCategory: "الفئة الرئيسية",
  manageTemplateButtonTitle: "إدارة القالب",

  // Sorting options
  sort: "فرز",
  nameAsc: "الاسم (أ-ي)",
  nameDesc: "الاسم (ي-أ)",
  idAsc: "المعرف (تصاعدي)",
  idDesc: "المعرف (تنازلي)",

  // Action buttons
  cancel: "إلغاء",
  add: "إضافة",
  save: "حفظ",
  saving: "جاري الحفظ...",
  retry: "إعادة المحاولة",
  refresh: "تحديث",
  confirm: "تأكيد",
  filter: "تصفية",
  loading: "جاري التحميل...",

  // Success messages
  categoryAddedSuccessfully: "تمت إضافة الفئة بنجاح",
  categoryHiddenSuccessfully: "تم إخفاء الفئة بنجاح",
  categoryVisibleSuccessfully: "تم إظهار الفئة بنجاح",
  categoryUpdatedSuccessfully: "تم تحديث الفئة بنجاح",
  categoryDeletedSuccessfully: "تم حذف الفئة بنجاح",
  templateAddedSuccessfully: "تمت إضافة القالب بنجاح",
  templateHiddenSuccessfully: "تم إخفاء القالب بنجاح",
  templateVisibleSuccessfully: "تم إظهار القالب بنجاح",
  templateUpdatedSuccessfully: "تم تحديث القالب بنجاح",
  templateDeletedSuccessfully: "تم حذف القالب بنجاح",
  templateRestoredSuccessfully: "تمت استعادة القالب بنجاح",
  templateMovedToDeletionSuccessfully: "تم نقل القالب إلى سلة المحذوفات بنجاح",

  // Error messages
  categoryAddFailed: "فشل إضافة الفئة",
  errorLoadingCategories: "فشل تحميل الفئات",
  noDataReturned: "لم يتم إرجاع بيانات",
  categoryUpdateFailed: "فشل تحديث الفئة",
  categoryDeleteFailed: "فشل حذف الفئة",
  templateAddFailed: "فشل إضافة القالب",
  templateUpdateFailed: "فشل تحديث القالب",
  templateDeleteFailed: "فشل حذف القالب",
  templateRestoreFailed: "فشل استعادة القالب",
  templateMoveToDeletionFailed: "فشل نقل القالب إلى سلة المحذوفات",
  errorRestoringTemplate: "فشل في استعادة القالب:",
  categoryNameRequired: "اسم الفئة مطلوبة",

  // Validation messages
  nameTooShort: "يجب أن يكون اسم الفئة 3 أحرف على الأقل",
  nameTooLong: "يجب ألا يتجاوز اسم الفئة 255 حرفًا",

  // Category selection and switching
  selectCategoryFirst: "الرجاء تحديد فئة أولاً",
  createCategoryFirst: "الرجاء إنشاء فئة أولاً",
  confirmSwitchCategory: "هل أنت متأكد أنك تريد تبديل الفئات؟",
  switchCategoryWhileAddingTemplate: "أنت تقوم حاليًا بإضافة قالب. هل أنت متأكد أنك تريد تبديل الفئات؟",

  // Error messages from context
  invalidDataFormat: "تم استلام بيانات غير صالحة من واجهة برمجة التطبيقات",
  categoryNotFound: "لم يتم العثور على الفئة",
  invalidCategoryId: "معرف الفئة غير صالح",
  failedToDeleteCategory: "فشل حذف الفئة",

  // Logging messages
  fetchingCategories: "جاري تحميل فئات القوالب...",
  rawApiResponse: "استجابة API الخام:",
  responseDataType: "نوع بيانات الاستجابة:",
  responseData: "بيانات الاستجابة:",
  expectedArrayButReceived: "متوقع مصفوفة من الفئات ولكن تم استلام:",
  failedToCreateCategory: "فشل في إنشاء الفئة:",
  failedToUpdateCategory: "فشل في تحديث الفئة:",
  invalidCategoryIdProvided: "تم تقديم معرف فئة غير صالح:",
  attemptingToDeleteCategory: "محاولة حذف الفئة:",
  errorDeletingCategory: "فشل في حذف الفئة:",
  movingTemplateToDeletion: "جاري نقل القالب إلى سلة المحذوفات:",
  errorMovingToDeletion: "فشل في نقل القالب إلى سلة المحذوفات:",
  errorUpdatingTemplate: "فشل في تحديث القالب:",

  // Context error messages
  useCategoryContextError: "يجب استخدام useCategory داخل CategoryProvider",

  // Template generation and processing messages
  failedToProcessFile: "فشل في معالجة الملف",
  noTemplateDataReceived: "لم يتم استلام بيانات القالب من الخادم",
  generatedTemplateEmpty: "القالب المنشأ فارغ",
  noTemplateVariablesDefined: "لم يتم تعريف متغيرات للقالب",
  serverReturnedStatus: "أعاد الخادم الحالة",
  receivedEmptyTemplate: "تم استلام قالب فارغ من الخادم",
  failedToGenerateContent: "فشل في إنشاء محتوى القالب",
  templateIdRequired: "معرف القالب مطلوب",
  templateNotFound: "لم يتم العثور على القالب",

  // Template list search and empty states
  searchTemplatesPlaceholder: "البحث في القوالب...",
  noTemplatesFoundSearch: "لا توجد قوالب تطابق بحثك.",
  noTemplatesFoundCreate: "لا توجد قوالب. أنشئ قالبك الأول للبدء.",

  // List view column headers
  columnBackground: "الخلفية",
  columnName: "الاسم",
  columnDescription: "الوصف",
  columnCreated: "تاريخ الإنشاء",
  columnActions: "الإجراءات",

  // List view actions
  buttonManage: "إدارة",

  // Card view strings
  createdLabel: "تم الإنشاء: ",

  // Template management tabs
  tabBasicInfo: "معلومات أساسية",
  tabVariables: "المتغيرات",
  tabRecipientGroups: "المجموعات",
  tabRecipients: "الطلاب",
  tabDataManagement: "إدارة البيانات",
  tabEditor: "المحرر",
  tabPreview: "المعاينة",

  // basic info tab
  recommendedImageSize: "حجم الصورة الموصى به",
  uploadImage: "رفع الصورة",

  // Pagination
  showing: "عرض",
  of: "من",
  perPage: "لكل صفحة",
  goToPage: "الذهاب إلى الصفحة",

  // Template loading and error states
  loadingTemplate: "جاري تحميل القالب...",
  templateNotFoundTitle: "القالب غير موجود",
  templateNotFoundMessage: "لم يتم العثور على القالب المطلوب. يرجى العودة لاستكشاف قوالب أخرى.",
  backToTemplates: "العودة إلى القوالب",
};
