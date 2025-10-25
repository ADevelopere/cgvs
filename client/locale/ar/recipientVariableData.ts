import { RecipientVariableDataTranslation } from "../components";

export const recipientVariableData: RecipientVariableDataTranslation = {
  // Tab label
  tabDataManagement: "إدارة البيانات",

  // Headers
  studentName: "اسم الطالب",
  readyStatus: "جاهز",
  ready: "جاهز",
  notReady: "غير جاهز",
  none: "لا شيء",

  // Actions
  selectGroup: "اختر المجموعة",
  selectGroupPrompt: "يرجى اختيار مجموعة لعرض بيانات المستلمين",

  // Success messages
  valueUpdatedSuccess: "تم تحديث القيمة بنجاح",

  // Error messages
  errorFetchingData: "خطأ في جلب البيانات",
  errorUpdatingValue: "خطأ في تحديث القيمة",
  validationError: "خطأ في التحقق من صحة البيانات",

  // Validation messages
  requiredField: "هذا الحقل مطلوب",
  invalidNumber: "رقم غير صحيح",
  numberTooLow: "الرقم منخفض جداً (الحد الأدنى {min})",
  numberTooHigh: "الرقم مرتفع جداً (الحد الأقصى {max})",
  invalidDate: "تاريخ غير صحيح",
  dateTooEarly: "التاريخ مبكر جداً (الحد الأدنى {min})",
  dateTooLate: "التاريخ متأخر جداً (الحد الأقصى {max})",
  textTooShort: "النص قصير جداً (الحد الأدنى {min} حرف)",
  textTooLong: "النص طويل جداً (الحد الأقصى {max} حرف)",
  patternMismatch: "النص لا يطابق النمط المطلوب",
  invalidSelection: "اختيار غير صحيح",
  tooManyDecimalPlaces: "عدد كبير جداً من الأرقام العشرية (الحد الأقصى {max})",
  multipleSelectionNotAllowed: "لا يُسمح بالاختيار المتعدد",

  // Status tooltips
  missingRequiredFields: "الحقول المطلوبة مفقودة: {fields}",
  invalidValues: "قيم غير صحيحة: {fields}",
  missingAndInvalidFields: "مفقودة: {missing}. غير صحيحة: {invalid}",
  allRequiredFieldsComplete: "جميع الحقول المطلوبة مكتملة",

  // Table messages
  noRecipientsFound: "لم يتم العثور على مستلمين في هذه المجموعة",
  loadingData: "جاري تحميل البيانات...",

  // Group selector
  selectGroupFirst: "يرجى اختيار مجموعة أولاً",
  noGroupsAvailable: "لا توجد مجموعات متاحة",

  // Variable fallback
  variableWithId: "متغير {id}",
};
