import { TemplateVariableTranslation } from "../components";

export const templateVariable: TemplateVariableTranslation = {
  name: "الإسم",
  description: "الوصف",
  minimumLength: "الحد الأدنى للطول",
  maximumLength: "الحد الأقصى للطول",
  pattern: "النمط",
  patternHelperText: "نمط التعبير العادي للتحقق من الصحة",
  previewValue: "قيمة المعاينة",
  required: "مطلوب",
  updateVariable: "تحديث المتغير",
  options: "الخيارات",
  addOptionPlaceholder: "أضف خيارًا واضغط Enter",
  allowMultipleSelection: "السماح بتحديد متعدد",
  minimumValue: "الحد الأدنى للقيمة",
  maximumValue: "الحد الأقصى للقيمة",
  decimalPlaces: "المنازل العشرية",
  format: "تنسيق التاريخ",
  formatHelperText: "صيغة تنسيق عرض التاريخ (مثال: YYYY-MM-DD، DD/MM/YYYY)",
  invalidDateRangeError: "تاريخ غير صالح أو خارج النطاق المحدد",
  minimumDate: "الحد الأدنى للتاريخ",
  maximumDate: "الحد الأقصى للتاريخ",
  invalidDateError: "تاريخ غير صالح",

  noVariables: "لا توجد متغيرات تم إنشاؤها بعد. انقر على 'إنشاء متغير' للبدء.",

  // Delete variable
  deleteVariable: "حذف المتغير",
  delete: "حذف",
  cancel: "إلغاء",
  confirm: "تأكيد",
  confirmDelete: "هل أنت متأكد أنك تريد حذف هذا المتغير؟ لا يمكن التراجع عن هذا الإجراء.",

  // create variable
  createVariable: "إنشاء متغير",
  textVariable: "نصي",
  numberVariable: "رقمي",
  dateVariable: "تاريخ",
  selectVariable: "اختيار",

  // type labels
  textTypeLabel: "نصي",
  numberTypeLabel: "رقمي",
  dateTypeLabel: "تاريخ",
  selectTypeLabel: "اختيار",

  // edit/create modal
  editVariable: "تعديل متغير",

  // operation results
  variableAddedSuccessfully: "تمت إضافة المتغير بنجاح",
  variableAddFailed: "فشل في إضافة المتغير",
  variableUpdatedSuccessfully: "تم تحديث المتغير بنجاح",
  variableUpdateFailed: "فشل في تحديث المتغير",
  variableDeletedSuccessfully: "تم حذف المتغير بنجاح",
  variableDeleteFailed: "فشل في حذف المتغير",
};
