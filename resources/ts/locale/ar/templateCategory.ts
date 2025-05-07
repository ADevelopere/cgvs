import TemplateCategoryTranslation from "../components/TemplateCategory";

const templateCategory: TemplateCategoryTranslation = {
    templateCategoriesManagement: "إدارة فئات القوالب",
    toggleCategoriesPane: "فتح/إغلاق لوحة الفئات",
    toggleTemplatesPane: "فتح/إغلاق لوحة القوالب",

    categories: "الفئات",
    templates: "القوالب",
    name: "الإسم",
    addCategory: "إضافة فئة",
    addTemplate: "إضافة قالب",
    sort: "فرز",
    noCategories: "لا توجد فئات",
    noTemplates: "لا توجد قوالب",
    selectCategory: "اختر فئة",
    addNewCategory: "إضافة فئة جديدة",
    addNewTemplate: "إضافة قالب جديد",
    edit: "تعديل",
    move: "نقل",
    delete: "حذف",
    more: "المزيد",
    nameAsc: "الاسم (أ-ي)",
    nameDesc: "الاسم (ي-أ)",
    idAsc: "المعرف (تصاعدي)",
    idDesc: "المعرف (تنازلي)",
    cancel: "إلغاء",
    add: "إضافة",
    save: "حفظ",
    retry: "إعادة المحاولة",
    refresh: "تحديث",
    categoryAddedSuccessfully: "تمت إضافة الفئة بنجاح",
    categoryAddFailed: "فشل إضافة الفئة",
    errorLoadingCategories: "فشل تحميل الفئات",
    noDataReturned: "لم يتم إرجاع بيانات",
    categoryHiddenSuccessfully: "تم إخفاء الفئة بنجاح",
    categoryVisibleSuccessfully: "تم إظهار الفئة بنجاح",
    categoryUpdatedSuccessfully: "تم تحديث الفئة بنجاح",
    categoryUpdateFailed: "فشل تحديث الفئة",
    categoryDeletedSuccessfully: "تم حذف الفئة بنجاح",
    categoryDeleteFailed: "فشل حذف الفئة",

    selectCategoryFirst: "الرجاء تحديد فئة أولاً",
    createCategoryFirst: "الرجاء إنشاء فئة أولاً",
    confirmSwitchCategory: "هل أنت متأكد أنك تريد تبديل الفئات؟",
    switchCategoryWhileAddingTemplate:
        "أنت تقوم حاليًا بإضافة قالب. هل أنت متأكد أنك تريد تبديل الفئات؟",
    confirm: "تأكيد",

    templateAddedSuccessfully: "تمت إضافة القالب بنجاح",
    templateAddFailed: "فشل إضافة القالب",
    templateHiddenSuccessfully: "تم إخفاء القالب بنجاح",
    templateVisibleSuccessfully: "تم إظهار القالب بنجاح",
    templateUpdatedSuccessfully: "تم تحديث القالب بنجاح",
    templateUpdateFailed: "فشل تحديث القالب",
    templateDeletedSuccessfully: "تم حذف القالب بنجاح",
    templateDeleteFailed: "فشل حذف القالب",

    // Template restoration messages
    templateRestoredSuccessfully: "تمت استعادة القالب بنجاح",
    templateRestoreFailed: "فشل استعادة القالب",
    errorRestoringTemplate: "فشل في استعادة القالب:",

    nameTooShort: "يجب أن يكون اسم الفئة 3 أحرف على الأقل",
    nameTooLong: "يجب ألا يتجاوز اسم الفئة 255 حرفًا",

    // Error messages from TemplateCategoryManagementContext
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

    // Template movement messages
    templateMoveToDeletionFailed: "فشل نقل القالب إلى سلة المحذوفات",
    templateMovedToDeletionSuccessfully: "تم نقل القالب إلى سلة المحذوفات بنجاح",

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
};

export default templateCategory;
