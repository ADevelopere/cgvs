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
    alignmentStart: "البداية",
    alignmentEnd: "النهاية",
    alignmentTop: "أعلى",
    alignmentBottom: "أسفل",
    alignmentCenter: "وسط",
    alignmentBaseline: "خط الأساس",

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

