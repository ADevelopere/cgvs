import { StudentTranslations } from "../components";

export const student: StudentTranslations = {
    studentManagement: "إدارة الطلاب",

    // header columns, same as column id values
    name: "الاسم",
    email: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    dateOfBirth: "تاريخ الميلاد",
    gender: "الجنس",
    nationality: "الجنسية",
    createdAt: "تاريخ الإنشاء",
    updatedAt: "تاريخ التحديث",

    // actions and buttons
    actions: "الإجراءات",
    cancel: "إلغاء",
    delete: "حذف",
    confirm: "تأكيد",
    create: "إنشاء",

    sortAsc: "ترتيب تصاعدي",
    sortDesc: "ترتيب تنازلي",
    clearSort: "إزالة الترتيب",

    filter: "تصفية",
    clearFilter: "إزالة التصفية",
    filterBy: "تصفية حسب",
    contains: "يحتوي على",

    // validation messages
    nameRequired: "الاسم مطلوب",
    fullNameMinWords: "يجب أن يحتوي الاسم على ثلاث أسماء على الأقل",
    nameMinLength: "يجب أن يحتوي كل جزء من الاسم على 3 أحرف على الأقل",
    nameInvalidChars: "يمكن أن يحتوي الاسم على أحرف وشرطات وعلامات اقتباس فقط",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "صيغة البريد الإلكتروني غير صحيحة",
    genderRequired: "الجنس مطلوب",
    genderInvalid: "قيمة الجنس غير صحيحة",
    nationalityRequired: "الجنسية مطلوبة",
    nationalityInvalid: "رمز البلد غير صحيح",
    dateOfBirthRequired: "تاريخ الميلاد مطلوب",
    dateOfBirthInvalid: "صيغة التاريخ غير صحيحة",
    dateOfBirthFuture: "لا يمكن أن يكون التاريخ في المستقبل",
    phoneNumberRequired: "رقم الهاتف مطلوب",
    phoneNumberInvalid: "صيغة رقم الهاتف غير صحيحة",

    // UI placeholders and messages
    namePlaceholder: "أدخل اسم الطالب",
    emailPlaceholder: "example@domain.com",
    genderPlaceholder: "اختر الجنس",
    nationalityPlaceholder: "اختر الجنسية",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    createStudentShortcut: "إنشاء طالب جديد (Ctrl+Enter)",
    creating: "جاري الإنشاء...",
    studentCreatedSuccess: "تم إنشاء الطالب بنجاح!",
    studentCreateError: "حدث خطأ أثناء إنشاء الطالب",
};
