import StudentTranslations from "../components/Student";

const student: StudentTranslations = {
    studentManagement: "إدارة الطلاب",

    // header columns, same as column id values
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone_number: "رقم الهاتف",
    date_of_birth: "تاريخ الميلاد",
    gender: "الجنس",
    nationality: "الجنسية",
    created_at: "تاريخ الإنشاء",
    updated_at: "تاريخ التحديث",

    // actions and buttons
    actions: "الإجراءات",
    cancel: "إلغاء",
    delete: "حذف",

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
};

export default student;
