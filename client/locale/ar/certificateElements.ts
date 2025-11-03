import type { CertificateElementsTranslations } from "../components/CertificateElements";

export const certificateElements: CertificateElementsTranslations = {
  textElement: {
    textElementTitle: "عنصر النص",

    // Data source types
    dataSourceLabel: "مصدر البيانات",
    dataSourceStatic: "نص ثابت",
    dataSourceStudentField: "حقل الطالب",
    dataSourceCertificateField: "حقل الشهادة",
    dataSourceTemplateTextVariable: "متغير نصي",
    dataSourceTemplateSelectVariable: "متغير اختيار",

    // Static source
    staticValueLabel: "القيمة الثابتة",
    staticValuePlaceholder: "أدخل النص الثابت",
    staticValueRequired: "القيمة الثابتة مطلوبة",

    // Student field options
    studentFieldLabel: "حقل الطالب",
    studentFieldName: "اسم الطالب",
    studentFieldEmail: "البريد الإلكتروني للطالب",
    studentFieldRequired: "حقل الطالب مطلوب",

    // Certificate field options
    certificateFieldLabel: "حقل الشهادة",
    certificateFieldVerificationCode: "رمز التحقق",
    certificateFieldRequired: "حقل الشهادة مطلوب",

    // Template variables
    templateTextVariableLabel: "متغير نصي",
    templateSelectVariableLabel: "متغير اختيار",
    selectVariable: "اختر متغير",
    noVariablesAvailable: "لا توجد متغيرات متاحة",
    variableRequired: "المتغير مطلوب",
  },

  dateElement: {
    dateElementTitle: "عنصر التاريخ",

    // Data source types
    dataSourceLabel: "مصدر البيانات",
    dataSourceStatic: "تاريخ ثابت",
    dataSourceStudentField: "حقل تاريخ الطالب",
    dataSourceCertificateField: "حقل تاريخ الشهادة",
    dataSourceTemplateVariable: "متغير التاريخ",

    // Static source
    staticValueLabel: "التاريخ الثابت",
    staticValuePlaceholder: "اختر التاريخ",
    staticValueRequired: "التاريخ الثابت مطلوب",

    // Student field options
    studentFieldLabel: "حقل تاريخ الطالب",
    studentFieldDateOfBirth: "تاريخ الميلاد",
    studentFieldRequired: "حقل تاريخ الطالب مطلوب",

    // Certificate field options
    certificateFieldLabel: "حقل تاريخ الشهادة",
    certificateFieldReleaseDate: "تاريخ الإصدار",
    certificateFieldRequired: "حقل تاريخ الشهادة مطلوب",

    // Template variables
    templateDateVariableLabel: "متغير التاريخ",
    selectVariable: "اختر متغير",
    noVariablesAvailable: "لا توجد متغيرات تاريخ متاحة",
    variableRequired: "متغير التاريخ مطلوب",

    // Date properties
    formatLabel: "تنسيق التاريخ",
    formatPlaceholder: "مثال: YYYY-MM-DD أو DD/MM/YYYY",
    formatHelper: "أمثلة: YYYY-MM-DD، DD/MM/YYYY، MMMM DD, YYYY",
    formatRequired: "تنسيق التاريخ مطلوب",
    calendarTypeLabel: "نوع التقويم",
    calendarTypeRequired: "نوع التقويم مطلوب",
    calendarTypeGregorian: "ميلادي",
    calendarTypeHijri: "هجري",
    offsetDaysLabel: "إزاحة الأيام",
    offsetDaysPlaceholder: "0",
    offsetDaysHelper:
      "عدد الأيام لإضافتها أو طرحها من التاريخ (استخدم أرقاماً سالبة للطرح)",
    offsetDaysRequired: "إزاحة الأيام مطلوبة",
    offsetDaysInvalid: "يجب أن تكون إزاحة الأيام رقماً صحيحاً",

    // Transformation
    transformationLabel: "التحويل",
    transformationPlaceholder: "اختر نوع التحويل",
    transformationAgeCalculation: "حساب العمر",
    transformationNone: "بدون",
    clearTransformation: "مسح",
    closeTransformation: "إغلاق",
  },

  numberElement: {
    numberElementTitle: "عنصر الرقم",

    // Data source
    dataSourceLabel: "مصدر البيانات",
    variableLabel: "متغير رقمي",
    variableRequired: "المتغير الرقمي مطلوب",
    noVariablesAvailable: "لا توجد متغيرات رقمية متاحة",

    // Mapping
    mappingLabel: "تنسيق المنازل العشرية",
    mappingDescription: "حدد عدد المنازل العشرية لكل لغة",
    localeLabel: "اللغة",
    decimalPlacesLabel: "عدد المنازل العشرية",
    addLocaleButton: "إضافة لغة",
    removeLocaleButton: "إزالة اللغة",
    decimalPlacesRequired: "عدد المنازل العشرية مطلوب",
    decimalPlacesInvalid: "يجب أن تكون المنازل العشرية رقماً موجباً",
  },

  countryElement: {
    // Section title
    countryElementTitle: "عنصر الدولة",

    // Representation
    representationLabel: "طريقة العرض",
    representationRequired: "طريقة العرض مطلوبة",
    representationInvalid: "طريقة عرض غير صالحة",
    representationCountryName: "اسم الدولة",
    representationNationality: "الجنسية",
    representationCountryNameHelp: "يعرض اسم الدولة (مثال: مصر)",
    representationNationalityHelp: "يعرض الجنسية (مثال: مصري)",

    // Info message
    dataSourceInfo: "مصدر البيانات دائمًا جنسية الطالب",
  },

  genderElement: {
    // Section title
    genderElementTitle: "عنصر الجنس",

    // Info message
    dataSourceInfo: "مصدر البيانات دائمًا جنس الطالب",
  },

  imageElement: {
    // Section title
    imageElementTitle: "عنصر الصورة",

    // Data Source
    dataSourceLabel: "مصدر الصورة",
    selectImageFile: "اختر ملف صورة",
    selectedFile: "الملف المحدد",
    noFileSelected: "لم يتم اختيار ملف",
    changeFile: "تغيير الملف",
    clearSelection: "إلغاء الاختيار",

    // Image Props
    fitLabel: "ملائمة الصورة",
    fitContain: "احتواء",
    fitContainDesc: "الحفاظ على النسب، الصورة بالكامل مرئية",
    fitCover: "تغطية",
    fitCoverDesc: "الحفاظ على النسب، ملء المساحة بالكامل",
    fitFill: "تمديد",
    fitFillDesc: "تمديد الصورة لملء المساحة بالكامل",

    // Form titles
    createTitle: "إنشاء عنصر صورة",
    updateTitle: "تحديث عنصر صورة",
  },

  qrCodeElement: {
    // Section title
    qrCodeElementTitle: "عنصر رمز الاستجابة السريعة",

    // QR Code Props
    foregroundColorLabel: "لون الرمز",
    foregroundColorHelper: "لون نقاط رمز الاستجابة السريعة",
    foregroundColorRequired: "لون الرمز مطلوب",
    backgroundColorLabel: "لون الخلفية",
    backgroundColorHelper: "لون خلفية رمز الاستجابة السريعة",
    backgroundColorRequired: "لون الخلفية مطلوب",
    errorCorrectionLabel: "مستوى تصحيح الخطأ",
    errorCorrectionHelper:
      "مستوى أعلى = مزيد من البيانات الزائدة ولكن أكثر موثوقية",
    errorCorrectionRequired: "مستوى تصحيح الخطأ مطلوب",
    errorCorrectionL: "منخفض (7%)",
    errorCorrectionM: "متوسط (15%)",
    errorCorrectionQ: "جيد (25%)",
    errorCorrectionH: "عالي (30%)",
    errorCorrectionLDesc: "يمكن استرداد ~7% من البيانات",
    errorCorrectionMDesc: "يمكن استرداد ~15% من البيانات",
    errorCorrectionQDesc: "يمكن استرداد ~25% من البيانات",
    errorCorrectionHDesc: "يمكن استرداد ~30% من البيانات",

    // Info message
    dataSourceInfo: "مصدر البيانات دائمًا رابط التحقق من الشهادة",
  },

  baseElement: {
    basePropertiesTitle: "الخصائص الأساسية",

    // Fields
    nameLabel: "الاسم",
    namePlaceholder: "أدخل اسم العنصر",
    nameRequired: "الاسم مطلوب",
    nameMinLength: "يجب أن يكون الاسم حرفين على الأقل",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "أدخل وصف العنصر",
    descriptionRequired: "الوصف مطلوب",

    // Position & Size
    positionLabel: "الموضع",
    positionXLabel: "الموضع الأفقي (X)",
    positionYLabel: "الموضع العمودي (Y)",
    positionRequired: "الموضع مطلوب",
    sizeLabel: "الحجم",
    widthLabel: "العرض",
    heightLabel: "الارتفاع",
    dimensionRequired: "الأبعاد مطلوبة",
    dimensionMustBePositive: "يجب أن تكون الأبعاد موجبة",

    // Alignment
    alignmentLabel: "المحاذاة",
    alignmentRequired: "المحاذاة مطلوبة",
    alignmentTopStart: "أعلى اليمين",
    alignmentTopCenter: "أعلى الوسط",
    alignmentTopEnd: "أعلى اليسار",
    alignmentCenterStart: "وسط اليمين",
    alignmentCenter: "وسط",
    alignmentCenterEnd: "وسط اليسار",
    alignmentBottomStart: "أسفل اليمين",
    alignmentBottomCenter: "أسفل الوسط",
    alignmentBottomEnd: "أسفل اليسار",
    alignmentBaselineStart: "خط الأساس اليمين",
    alignmentBaselineCenter: "خط الأساس الوسط",
    alignmentBaselineEnd: "خط الأساس اليسار",

    // Render order
    renderOrderLabel: "ترتيب العرض",
    renderOrderPlaceholder: "أدخل ترتيب العرض",
    renderOrderRequired: "ترتيب العرض مطلوب",
  },

  textProps: {
    textPropertiesTitle: "خصائص النص",

    // Font
    fontLabel: "الخط",
    fontRequired: "الخط مطلوب",
    fontSourceLabel: "مصدر الخط",
    fontSourceRequired: "مصدر الخط مطلوب",
    fontSourceGoogle: "خطوط جوجل",
    fontSourceSelfHosted: "خطوط مستضافة",
    googleFontLabel: "خط جوجل",
    googleFontPlaceholder: "ابحث عن خط جوجل",
    googleFontRequired: "معرف خط جوجل مطلوب",
    googleFontInvalidChars: "أحرف غير صالحة في معرف الخط",
    selfHostedFontLabel: "خط مستضاف",
    selfHostedFontPlaceholder: "اختر خط مستضاف",
    selfHostedFontRequired: "اختيار الخط مطلوب",
    searchFonts: "بحث عن الخطوط",
    loadingFonts: "جاري تحميل الخطوط...",
    noFontsFound: "لم يتم العثور على خطوط",

    // Color
    colorLabel: "اللون",
    colorPlaceholder: "#000000",
    colorRequired: "اللون مطلوب",
    colorInvalid: "تنسيق اللون غير صالح",

    // Font size
    fontSizeLabel: "حجم الخط",
    fontSizePlaceholder: "16",
    fontSizeRequired: "حجم الخط مطلوب",
    fontSizeMinValue: "يجب أن يكون حجم الخط موجبًا",
    fontSizeMaxValue: "لا يمكن أن يتجاوز حجم الخط 1000",

    // Overflow
    overflowLabel: "الفيض",
    overflowRequired: "الفيض مطلوب",
    overflowResizeDown: "تصغير تلقائي",
    overflowTruncate: "قص",
    overflowEllipse: "نقاط حذف",
    overflowWrap: "التفاف",
  },

  common: {
    // Actions
    create: "إنشاء",
    update: "تحديث",
    cancel: "إلغاء",
    save: "حفظ",
    submit: "إرسال",
    creating: "جاري الإنشاء...",
    updating: "جاري التحديث...",
    saving: "جاري الحفظ...",

    // Messages
    requiredField: "هذا الحقل مطلوب",
    invalidValue: "قيمة غير صالحة",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",

    // Success/Error
    createSuccess: "تم الإنشاء بنجاح",
    createError: "فشل الإنشاء",
    updateSuccess: "تم التحديث بنجاح",
    updateError: "فشل التحديث",
  },
};
