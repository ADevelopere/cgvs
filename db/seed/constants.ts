/**
 * Seed data constants - Arabic names and other data for generating realistic test data
 */

export const arabicFirstNames = [
    "محمد",
    "أحمد",
    "عبدالله",
    "عبدالرحمن",
    "خالد",
    "سعد",
    "فهد",
    "عمر",
    "ياسر",
    "سلطان",
    "نورة",
    "سارة",
    "ريم",
    "منى",
    "لطيفة",
    "عائشة",
    "فاطمة",
    "مريم",
    "هند",
    "أسماء",
];

export const arabicMiddleNames = [
    "محمد",
    "أحمد",
    "عبدالله",
    "عبدالرحمن",
    "خالد",
    "سعد",
    "فهد",
    "عمر",
    "ياسر",
    "سلطان",
    "عبدالعزيز",
    "إبراهيم",
    "سليمان",
    "عثمان",
    "صالح",
];

export const arabicLastNames = [
    "العتيبي",
    "القحطاني",
    "الغامدي",
    "الدوسري",
    "المطيري",
    "الشهري",
    "الزهراني",
    "الحربي",
    "السلمي",
    "المالكي",
    "العمري",
    "الشمري",
    "الحارثي",
    "البقمي",
    "الغنام",
];

export interface CategoryData {
    name: string;
    description: string;
    subcategories?: CategoryData[];
}

export const templateCategoriesData: CategoryData[] = [
    {
        name: "الشهادات الأكاديمية",
        description: "شهادات التخرج والدورات الأكاديمية",
        subcategories: [
            {
                name: "شهادات البكالوريوس",
                description: "شهادات إتمام درجة البكالوريوس",
            },
            {
                name: "شهادات الماجستير",
                description: "شهادات إتمام درجة الماجستير",
            },
        ],
    },
    {
        name: "الشهادات المهنية",
        description: "شهادات التدريب والتأهيل المهني",
        subcategories: [
            {
                name: "شهادات التدريب التقني",
                description: "شهادات الدورات التقنية والبرمجة",
            },
            {
                name: "شهادات الإدارة",
                description: "شهادات في مجال الإدارة والقيادة",
            },
        ],
    },
    {
        name: "شهادات الحضور",
        description: "شهادات حضور الفعاليات والمؤتمرات",
        subcategories: [
            {
                name: "شهادات المؤتمرات",
                description: "شهادات حضور المؤتمرات العلمية",
            },
            {
                name: "شهادات ورش العمل",
                description: "شهادات حضور ورش العمل التدريبية",
            },
        ],
    },
    {
        name: "شهادات التقدير",
        description: "شهادات تقدير الإنجازات والتميز",
        subcategories: [
            {
                name: "شهادات التفوق",
                description: "شهادات تقدير للطلاب المتفوقين",
            },
            {
                name: "شهادات التميز",
                description: "شهادات تقدير للإنجازات المتميزة",
            },
        ],
    },
    {
        name: "الشهادات التطوعية",
        description: "شهادات العمل التطوعي والخدمة المجتمعية",
        subcategories: [
            {
                name: "شهادات العمل التطوعي",
                description: "شهادات المشاركة في الأعمال التطوعية",
            },
            {
                name: "شهادات خدمة المجتمع",
                description: "شهادات المساهمة في خدمة المجتمع",
            },
        ],
    },
];

export const emailDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
