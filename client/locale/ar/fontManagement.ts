import { FontManagementTranslations } from "../components";

export const fontManagement: FontManagementTranslations = {
  // List section
  fonts: "الخطوط",
  newFont: "خط جديد",
  searchPlaceholder: "البحث في الخطوط...",
  noFontsFound: "لم يتم العثور على خطوط",
  noFontsYet: "لا توجد خطوط بعد",
  tryDifferentSearch: "جرب مصطلح بحث مختلف",
  createFirstFont: "أنشئ أول خط للبدء",
  createFont: "إنشاء خط",
  errorLoadingFonts: "خطأ في تحميل الخطوط: %{error}",
  font: "خط",
  fontCount: "%{count}",

  // Detail section - View mode
  noFontSelected: "لم يتم اختيار خط",
  selectFontFromList: "اختر خطاً من القائمة لعرض التفاصيل",
  fontId: "معرف الخط: %{id}",
  fontName: "اسم الخط",
  supportedLocales: "اللغات المدعومة",
  storageFilePath: "مسار ملف التخزين",
  created: "تاريخ الإنشاء",
  lastUpdated: "آخر تحديث",

  // Detail section - Create/Edit mode
  createNewFont: "إنشاء خط جديد",
  editFont: "تعديل الخط",

  // Form section
  fontNameLabel: "اسم الخط",
  fontNamePlaceholder: "مثال: Roboto، Cairo، Noto Sans",
  supportedLocalesLabel: "اللغات المدعومة",
  supportedLocalesHelper:
    'اختر "جميع اللغات" للخطوط العالمية، أو اختر لغات محددة',
  fontFileLabel: "ملف الخط",
  preview: "معاينة",

  // Form validation errors
  fontNameRequired: "اسم الخط مطلوب",
  localeRequired: "يجب اختيار لغة واحدة على الأقل",
  fontFileRequired: "ملف الخط مطلوب",

  // FilePicker section
  fontFileSelected: "تم اختيار ملف الخط",
  change: "تغيير",
  selectFontFile: "اختيار ملف الخط",
  fontFileFormats: ".ttf, .otf, .woff, .woff2",

  // Preview section
  failedToLoadPreview: "فشل تحميل معاينة الخط",
  previewFont: "الخط: %{fontName}",

  // Delete dialog section
  deleteFont: "حذف الخط",
  confirmDeleteMessage: 'هل أنت متأكد أنك تريد حذف "%{fontName}"؟',
  checkingUsage: "جاري التحقق من الاستخدام...",
  cannotDeleteFont: "لا يمكن حذف هذا الخط",
  fontUsedInElements:
    "هذا الخط مستخدم في %{count} عنصر(عناصر) من عناصر الشهادات.",
  cannotUndone: "لا يمكن التراجع عن هذا الإجراء.",
  deleteWarning: "سيتم حذف الخط نهائياً من النظام.",
  deletingFont: "جاري حذف الخط...",

  // LocaleSelector section
  selectLocalesPlaceholder: "اختر اللغات...",

  // Common actions
  save: "حفظ",
  cancel: "إلغاء",
  edit: "تعديل",
  delete: "حذف",
  saving: "جاري الحفظ...",
  deleting: "جاري الحذف...",
  saveChanges: "حفظ التغييرات",
};

