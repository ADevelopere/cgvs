/* eslint-disable no-console */
import {
    CategorySpecialType,
    CountryCode,
    Gender,
    Student,
    Template,
    TemplateCategory,
    TemplateRecipientGroup,
    TemplateVariableType,
    type Prisma,
} from "@prisma/client";

import * as bcrypt from "bcryptjs";
import prismaClient from "./client";

const now = new Date();

// --- Data Constants (from original Kotlin script) ---

const arabicFirstNames = [
    "محمد",
    "أحمد",
    "عبدالله",
    "عبدالرحمن",
    "خالد",
    "سعد",
    "فهد",
    "عمر",
    "ياسر",
    "سultan",
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
const arabicMiddleNames = [
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
const arabicLastNames = [
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

interface CategoryData {
    name: string;
    description: string;
    subcategories?: CategoryData[];
}

const templateCategoriesData: CategoryData[] = [
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

// --- Seeder Functions ---

/**
 * Creates an admin user for testing authentication.
 */
async function createAdminUser() {
    console.log("Creating admin user...");
    const existingAdmin = await prismaClient.users.findUnique({
        where: { email: "admin@cgvs.com" },
    });

    if (existingAdmin) {
        console.log("⚠️ Admin user already exists, skipping creation.");
        return existingAdmin;
    }

    const hashedPassword = await bcrypt.hash("cgvs@123", 12);

    const adminUser = await prismaClient.users.create({
        data: {
            name: "System Administrator",
            email: "admin@cgvs.com",
            password: hashedPassword,
            isAdmin: true,
            createdAt: now,
            updatedAt: now,
        },
    });

    console.log("✅ Admin user created successfully:");
    console.log("   Email: admin@cgvs.com");
    console.log("   Password: cgvs@123");
    console.log("   Role: Administrator");
    return adminUser;
}

/**
 * Creates template categories, including special types and nested categories.
 */
async function createTemplateCategories(): Promise<TemplateCategory[]> {
    console.log("📁 Creating template categories...");
    const allCategories: TemplateCategory[] = [];

    // Use upsert to create special categories idempotently
    const mainCategory = await prismaClient.templateCategory.upsert({
        where: { categorySpecialType: CategorySpecialType.Main },
        update: {},
        create: {
            name: "الفئة الرئيسية",
            description: "الفئة الرئيسية لجميع الشهادات",
            order: 0,
            categorySpecialType: CategorySpecialType.Main,
            createdAt: now,
            updatedAt: now,
        },
    });
    allCategories.push(mainCategory);
    console.log("   ✅ Main category ensured.");

    const suspensionCategory = await prismaClient.templateCategory.upsert({
        where: { categorySpecialType: CategorySpecialType.Suspension },
        update: {},
        create: {
            name: "فئة الإيقاف",
            description: "فئة الشهادات الموقوفة أو المعلقة",
            order: 1,
            categorySpecialType: CategorySpecialType.Suspension,
            createdAt: now,
            updatedAt: now,
        },
    });
    allCategories.push(suspensionCategory);
    console.log("   ✅ Suspension category ensured.");

    // Create the rest of the categories
    for (const [index, categoryData] of templateCategoriesData.entries()) {
        const parentCategory = await prismaClient.templateCategory.create({
            data: {
                name: categoryData.name,
                description: categoryData.description,
                order: index + 2, // Shift order to avoid conflicts with special types
                createdAt: now,
                updatedAt: now,
            },
        });
        allCategories.push(parentCategory);

        if (
            categoryData.subcategories &&
            categoryData.subcategories.length > 0
        ) {
            const subcategoriesData = categoryData.subcategories.map(
                (sub, subIndex) => ({
                    name: sub.name,
                    description: sub.description,
                    parentCategoryId: parentCategory.id,
                    order: subIndex + 1,
                    createdAt: now,
                    updatedAt: now,
                }),
            );
            // const createdSubcategories =
            await prismaClient.templateCategory.createMany({
                data: subcategoriesData,
            });
            // To get the full objects, we need to fetch them
            const subs = await prismaClient.templateCategory.findMany({
                where: { parentCategoryId: parentCategory.id },
            });
            allCategories.push(...subs);
        }
    }

    console.log(`   ✅ Created/verified ${allCategories.length} categories.`);
    return allCategories;
}

/**
 * Creates sample templates, one for each top-level category.
 */
async function createTemplates(
    categories: TemplateCategory[],
): Promise<Template[]> {
    console.log("📋 Creating templates...");
    const createdTemplates: Template[] = [];

    // Filter for top-level categories, excluding special types
    const topLevelCategories = categories.filter(
        (c) => c.parentCategoryId === null && c.categorySpecialType === null,
    );

    for (const category of topLevelCategories) {
        const template = await prismaClient.template.create({
            data: {
                name: `نموذج ${category.name}`,
                description: `نموذج تجريبي لـ${category.name}`,
                categoryId: category.id,
                order: 1,
                // imageFileId is omitted as we don't have the file service
                createdAt: now,
                updatedAt: now,
            },
        });
        createdTemplates.push(template);

        // Create variables for this template using the new modular structure
        await createTemplateVariables(template, category);
    }

    console.log(
        `   ✅ Created ${createdTemplates.length} templates with variables.`,
    );
    return createdTemplates;
}

// --- Template Variable Creation Functions ---

/**
 * Orchestrates the creation of variables for a given template.
 * First creates base variables, then adds category-specific ones.
 */
async function createTemplateVariables(
    template: Template,
    category: TemplateCategory,
) {
    // Create base variables for all templates
    await createBaseVariables(template);

    // Create category-specific variables
    switch (category.name) {
        case "الشهادات الأكاديمية":
            await createAcademicVariables(template);
            break;
        case "الشهادات المهنية":
            await createProfessionalVariables(template);
            break;
        case "شهادات الحضور":
            await createAttendanceVariables(template);
            break;
        case "شهادات التقدير":
            await createAppreciationVariables(template);
            break;
        case "الشهادات التطوعية":
            await createVolunteerVariables(template);
            break;
    }
}

/**
 * Creates the set of variables common to all templates.
 */
async function createBaseVariables(template: Template) {
    const baseVariables: Prisma.TemplateVariableBaseCreateInput[] = [
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.TEXT,
            name: "اسم الطالب",
            description: "الاسم الكامل للطالب",
            required: true,
            order: 1,
            TextTemplateVariable: {
                create: {
                    previewValue: "محمد أحمد العتيبي",
                    minLength: 3,
                    maxLength: 100,
                    pattern: null,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.DATE,
            name: "تاريخ الإصدار",
            description: "تاريخ إصدار الشهادة",
            required: true,
            order: 2,
            DateTemplateVariable: {
                create: {
                    previewValue: now,
                    minDate: null,
                    maxDate: null,
                    format: "Y-m-d",
                },
            },
            createdAt: now,
            updatedAt: now,
        },
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.TEXT,
            name: "الرقم المرجعي",
            description: "الرقم المرجعي للشهادة",
            required: true,
            order: 3,
            TextTemplateVariable: {
                create: {
                    previewValue: "CERT2024",
                    minLength: 8,
                    maxLength: 8,
                    pattern: "^[A-Z0-9]{8}$",
                },
            },
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const variable of baseVariables) {
        await prismaClient.templateVariableBase.create({
            data: variable,
        });
    }
}

/**
 * Creates variables specific to "Academic Certificates".
 */
async function createAcademicVariables(template: Template) {
    const academicVariables: Prisma.TemplateVariableBaseCreateInput[] = [
        {
            template: {
                connect: { id: template.id },
            },
            name: "التخصص",
            description: "التخصص الأكاديمي",
            required: true,
            order: 4,
            type: TemplateVariableType.TEXT,
            TextTemplateVariable: {
                create: {
                    previewValue: "علوم الحاسب",
                    minLength: 3,
                    maxLength: 100,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.NUMBER,
            name: "المعدل",
            description: "المعدل التراكمي",
            required: true,
            order: 5,
            NumberTemplateVariable: {
                create: {
                    previewValue: 4.5,
                    minValue: 0.0,
                    maxValue: 5.0,
                    decimalPlaces: 2,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const variable of academicVariables) {
        await prismaClient.templateVariableBase.create({
            data: variable,
        });
    }
}

/**
 * Creates variables specific to "Professional Certificates".
 */
async function createProfessionalVariables(template: Template) {
    const professionalVariables: Prisma.TemplateVariableBaseCreateInput[] = [
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.SELECT,
            name: "المجال",
            description: "مجال التدريب",
            required: true,
            order: 4,
            SelectTemplateVariable: {
                create: {
                    previewValue: "تقنية المعلومات",
                    options: [
                        "تقنية المعلومات",
                        "إدارة الأعمال",
                        "الموارد البشرية",
                        "التسويق الرقمي",
                        "إدارة المشاريع",
                    ],
                    multiple: false,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.NUMBER,
            name: "مدة التدريب",
            description: "عدد ساعات التدريب",
            required: true,
            order: 5,
            NumberTemplateVariable: {
                create: {
                    previewValue: 40,
                    minValue: 1,
                    maxValue: 1000,
                    decimalPlaces: 0,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const variable of professionalVariables) {
        await prismaClient.templateVariableBase.create({
            data: variable,
        });
    }
}

/**
 * Creates variables specific to "Attendance Certificates".
 */
async function createAttendanceVariables(template: Template) {
    const attendanceVariables: Prisma.TemplateVariableBaseCreateInput[] = [
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.TEXT,
            name: "اسم الفعالية",
            description: "اسم المؤتمر أو ورشة العمل",
            required: true,
            order: 4,
            TextTemplateVariable: {
                create: {
                    previewValue: "مؤتمر التقنية السنوي",
                    minLength: 5,
                    maxLength: 200,
                },
            },
            //
            createdAt: now,
            updatedAt: now,
        },
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.TEXT,
            name: "مكان الانعقاد",
            description: "مكان انعقاد الفعالية",
            required: true,
            order: 5,
            TextTemplateVariable: {
                create: {
                    previewValue: "الرياض",
                    minLength: 3,
                    maxLength: 100,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const variable of attendanceVariables) {
        await prismaClient.templateVariableBase.create({
            data: variable,
        });
    }
}

/**
 * Creates variables specific to "Appreciation Certificates".
 */
async function createAppreciationVariables(template: Template) {
    const appreciationVariables: Prisma.TemplateVariableBaseCreateInput[] = [
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.TEXT,
            name: "سبب التقدير",
            description: "سبب منح شهادة التقدير",
            required: true,
            order: 4,
            TextTemplateVariable: {
                create: {
                    previewValue: "التفوق الأكاديمي والإنجاز المتميز",
                    minLength: 10,
                    maxLength: 500,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.SELECT,
            name: "المستوى",
            description: "مستوى التقدير",
            required: true,
            order: 5,
            TextTemplateVariable: {
                create: {
                    previewValue: "ممتاز",
                },
            },
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const variable of appreciationVariables) {
        await prismaClient.templateVariableBase.create({
            data: variable,
        });
    }
}

/**
 * Creates variables specific to "Volunteer Certificates".
 */
async function createVolunteerVariables(template: Template) {
    const volunteerVariables: Prisma.TemplateVariableBaseCreateInput[] = [
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.TEXT,
            name: "نوع العمل التطوعي",
            description: "وصف العمل التطوعي",
            required: true,
            order: 4,
            TextTemplateVariable: {
                create: {
                    previewValue: "تطوع في الأعمال الخيرية",
                    minLength: 5,
                    maxLength: 200,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
        {
            template: {
                connect: { id: template.id },
            },
            type: TemplateVariableType.NUMBER,
            name: "عدد ساعات التطوع",
            description: "إجمالي ساعات العمل التطوعي",
            required: true,
            order: 5,
            NumberTemplateVariable: {
                create: {
                    previewValue: 100,
                    minValue: 1,
                    maxValue: 1000,
                    decimalPlaces: 0,
                },
            },
            createdAt: now,
            updatedAt: now,
        },
    ];

    for (const variable of volunteerVariables) {
        await prismaClient.templateVariableBase.create({
            data: variable,
        });
    }
}

/**
 * Creates 1000 sample students with randomized data.
 */
async function createStudents(): Promise<Student[]> {
    console.log("🎓 Creating students...");
    const studentsData: Prisma.StudentCreateInput[] = [];
    const nationalities = Object.values(CountryCode);
    const genders = Object.values(Gender);

    for (let i = 0; i < 1000; i++) {
        const firstName =
            arabicFirstNames[
                Math.floor(Math.random() * arabicFirstNames.length)
            ];
        const middleName =
            arabicMiddleNames[
                Math.floor(Math.random() * arabicMiddleNames.length)
            ];
        const lastName =
            arabicLastNames[Math.floor(Math.random() * arabicLastNames.length)];

        studentsData.push({
            name: `${firstName} ${middleName} ${lastName}`,
            email:
                Math.random() < 0.7 ? generateEmail(firstName, lastName) : null,
            phoneNumber: Math.random() < 0.6 ? generatePhoneNumber() : null,
            dateOfBirth: Math.random() < 0.8 ? generateDateOfBirth() : null,
            gender:
                Math.random() < 0.9
                    ? genders[Math.floor(Math.random() * genders.length)]
                    : null,
            nationality:
                Math.random() < 0.75
                    ? nationalities[
                          Math.floor(Math.random() * nationalities.length)
                      ]
                    : null,
            createdAt: now,
            updatedAt: now,
        });
        if ((i + 1) % 100 == 0) {
            console.log(`   📝 Prepared ${i + 1} students...`);
        }
    }

    // Using createMany for performance
    await prismaClient.student.createMany({
        data: studentsData,
        skipDuplicates: true, // Skip if a randomly generated email conflicts
    });

    // Fetch the created students to return their full objects with IDs
    const createdStudents = await prismaClient.student.findMany({
        orderBy: { createdAt: "desc" },
        take: 1000,
    });

    console.log("   ✅ Created 1000 students.");
    return createdStudents.reverse(); // Maintain original creation order
}

// --- Student Data Generators ---

function generateEmail(firstName: string, lastName: string): string {
    const domains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
    const randomNum = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    const firstNameSafe = `${firstName.replace(/\s/g, "")}${Math.floor(Math.random() * 9000) + 1000}`;
    const lastNameSafe = `${lastName.replace(/\s/g, "")}${Math.floor(Math.random() * 900) + 100}`;
    return `${firstNameSafe}.${lastNameSafe}${randomNum}@${domains[Math.floor(Math.random() * domains.length)]}`.toLowerCase();
}

function generatePhoneNumber(): string {
    const secondDigit = Math.floor(Math.random() * 10);
    const rest = Math.floor(Math.random() * (9999999 - 1000000 + 1) + 1000000);
    return `+9665${secondDigit}${rest}`;
}

function generateDateOfBirth(): Date {
    const year = Math.floor(Math.random() * (2004 - 1980 + 1) + 1980);
    const month = Math.floor(Math.random() * 12); // 0-11
    const day = Math.floor(Math.random() * (28 - 1 + 1) + 1); // Safe day range
    return new Date(year, month, day);
}

/**
 * Creates recipient groups, two for each template.
 */
async function createRecipientGroups(
    templates: Template[],
): Promise<TemplateRecipientGroup[]> {
    console.log("👥 Creating recipient groups...");
    if (templates.length === 0) {
        console.log("   ⚠️ No templates available to create recipient groups.");
        return [];
    }

    const groupsData: Prisma.TemplateRecipientGroupCreateManyInput[] =
        templates.flatMap((template) =>
            Array.from({ length: 2 }, (_, i) => ({
                templateId: template.id,
                name: `مجموعة ${template.name} ${i + 1}`,
                description: `وصف لمجموعة ${template.name} ${i + 1}`,
                date: now,
                createdAt: now,
                updatedAt: now,
            })),
        );

    await prismaClient.templateRecipientGroup.createMany({ data: groupsData });
    const createdGroups = await prismaClient.templateRecipientGroup.findMany({
        where: { templateId: { in: templates.map((t) => t.id) } },
    });

    console.log(`   ✅ Created ${createdGroups.length} recipient groups.`);
    return createdGroups;
}

/**
 * Adds a random number of students to each recipient group.
 */
async function createRecipientGroupItems(
    groups: TemplateRecipientGroup[],
    students: Student[],
): Promise<number> {
    console.log("👥 Creating recipient group items...");
    if (groups.length === 0 || students.length === 0) {
        console.log("   ⚠️ No groups or students available to create items.");
        return 0;
    }

    let totalItems = 0;
    const allItemsData: Prisma.TemplateRecipientGroupItemCreateManyInput[] = [];

    // Shuffle students once for better random distribution
    const shuffledStudents = [...students].sort(() => 0.5 - Math.random());

    groups.forEach((group) => {
        const studentCount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        const selectedStudents = shuffledStudents.slice(0, studentCount);

        selectedStudents.forEach((student) => {
            allItemsData.push({
                templateRecipientGroupId: group.id,
                studentId: student.id,
                createdAt: now,
                updatedAt: now,
            });
        });
    });

    const result = await prismaClient.templateRecipientGroupItem.createMany({
        data: allItemsData,
        skipDuplicates: true, // Replicates the try/catch logic from Kotlin
    });

    totalItems = result.count;
    console.log(`   ✅ Created ${totalItems} recipient group items.`);
    return totalItems;
}

// --- Main Execution ---

async function main() {
    console.log("🌱 Starting demo data seeding...");

    // 1. Create admin user
    await createAdminUser();

    // 2. Create template categories
    const categories = await createTemplateCategories();

    // 3. Create templates
    const templates = await createTemplates(categories);

    // 4. Create students
    const students = await createStudents();

    // 5. Create recipient groups
    const groups = await createRecipientGroups(templates);

    // 6. Create recipient group items
    const itemsCount = await createRecipientGroupItems(groups, students);

    console.log("\n✅ Demo data seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Admin user: admin@cgvs.com (password: cgvs@123)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Templates: ${templates.length}`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Recipient Groups: ${groups.length}`);
    console.log(`   - Recipient Group Items: ${itemsCount}`);
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
