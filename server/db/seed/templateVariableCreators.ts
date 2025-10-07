/**
 * Template variable creation helpers for different category types
 */

import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
    templateVariableBases,
    templateTextVariables,
    templateNumberVariables,
    templateDateVariables,
    templateSelectVariables,
} from "../schema/templateVariables";
import type { templates } from "../schema/templates";

type TemplateRecord = typeof templates.$inferSelect;

/**
 * Creates base variables common to all templates
 */
export async function createBaseVariables(
    db: NodePgDatabase,
    template: TemplateRecord,
    now: Date,
) {
    // Variable 1: Student Name (TEXT)
    const [studentNameBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "TEXT",
            name: "اسم الطالب",
            description: "الاسم الكامل للطالب",
            required: true,
            order: 1,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: studentNameBase.id,
        previewValue: "محمد أحمد العتيبي",
        minLength: 3,
        maxLength: 100,
        pattern: null,
    });

    // Variable 2: Issue Date (DATE)
    const [issueDateBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "DATE",
            name: "تاريخ الإصدار",
            description: "تاريخ إصدار الشهادة",
            required: true,
            order: 2,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateDateVariables).values({
        id: issueDateBase.id,
        previewValue: now,
        minDate: null,
        maxDate: null,
        format: "Y-m-d",
    });

    // Variable 3: Reference Number (TEXT)
    const [refNumberBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "TEXT",
            name: "الرقم المرجعي",
            description: "الرقم المرجعي للشهادة",
            required: true,
            order: 3,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: refNumberBase.id,
        previewValue: "CERT2024",
        minLength: 8,
        maxLength: 8,
        pattern: "^[A-Z0-9]{8}$",
    });
}

/**
 * Creates variables specific to "Academic Certificates"
 */
export async function createAcademicVariables(
    db: NodePgDatabase,
    template: TemplateRecord,
    now: Date,
) {
    // Variable 4: Major/Specialization (TEXT)
    const [majorBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            name: "التخصص",
            description: "التخصص الأكاديمي",
            required: true,
            order: 4,
            type: "TEXT",
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: majorBase.id,
        previewValue: "علوم الحاسب",
        minLength: 3,
        maxLength: 100,
        pattern: null,
    });

    // Variable 5: GPA (NUMBER)
    const [gpaBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "NUMBER",
            name: "المعدل",
            description: "المعدل التراكمي",
            required: true,
            order: 5,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateNumberVariables).values({
        id: gpaBase.id,
        previewValue: "4.50",
        minValue: "0.00",
        maxValue: "5.00",
        decimalPlaces: 2,
    });
}

/**
 * Creates variables specific to "Professional Certificates"
 */
export async function createProfessionalVariables(
    db: NodePgDatabase,
    template: TemplateRecord,
    now: Date,
) {
    // Variable 4: Field (SELECT)
    const [fieldBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "SELECT",
            name: "المجال",
            description: "مجال التدريب",
            required: true,
            order: 4,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateSelectVariables).values({
        id: fieldBase.id,
        previewValue: "تقنية المعلومات",
        options: [
            "تقنية المعلومات",
            "إدارة الأعمال",
            "الموارد البشرية",
            "التسويق الرقمي",
            "إدارة المشاريع",
        ],
        multiple: false,
    });

    // Variable 5: Training Duration (NUMBER)
    const [durationBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "NUMBER",
            name: "مدة التدريب",
            description: "عدد ساعات التدريب",
            required: true,
            order: 5,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateNumberVariables).values({
        id: durationBase.id,
        previewValue: "40",
        minValue: "1",
        maxValue: "1000",
        decimalPlaces: 0,
    });
}

/**
 * Creates variables specific to "Attendance Certificates"
 */
export async function createAttendanceVariables(
    db: NodePgDatabase,
    template: TemplateRecord,
    now: Date,
) {
    // Variable 4: Event Name (TEXT)
    const [eventBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "TEXT",
            name: "اسم الفعالية",
            description: "اسم المؤتمر أو ورشة العمل",
            required: true,
            order: 4,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: eventBase.id,
        previewValue: "مؤتمر التقنية السنوي",
        minLength: 5,
        maxLength: 200,
        pattern: null,
    });

    // Variable 5: Location (TEXT)
    const [locationBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "TEXT",
            name: "مكان الانعقاد",
            description: "مكان انعقاد الفعالية",
            required: true,
            order: 5,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: locationBase.id,
        previewValue: "الرياض",
        minLength: 3,
        maxLength: 100,
        pattern: null,
    });
}

/**
 * Creates variables specific to "Appreciation Certificates"
 */
export async function createAppreciationVariables(
    db: NodePgDatabase,
    template: TemplateRecord,
    now: Date,
) {
    // Variable 4: Reason (TEXT)
    const [reasonBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "TEXT",
            name: "سبب التقدير",
            description: "سبب منح شهادة التقدير",
            required: true,
            order: 4,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: reasonBase.id,
        previewValue: "التفوق الأكاديمي والإنجاز المتميز",
        minLength: 10,
        maxLength: 500,
        pattern: null,
    });

    // Variable 5: Level (TEXT)
    const [levelBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "TEXT",
            name: "المستوى",
            description: "مستوى التقدير",
            required: true,
            order: 5,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: levelBase.id,
        previewValue: "ممتاز",
        minLength: null,
        maxLength: null,
        pattern: null,
    });
}

/**
 * Creates variables specific to "Volunteer Certificates"
 */
export async function createVolunteerVariables(
    db: NodePgDatabase,
    template: TemplateRecord,
    now: Date,
) {
    // Variable 4: Volunteer Type (TEXT)
    const [typeBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "TEXT",
            name: "نوع العمل التطوعي",
            description: "وصف العمل التطوعي",
            required: true,
            order: 4,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateTextVariables).values({
        id: typeBase.id,
        previewValue: "تطوع في الأعمال الخيرية",
        minLength: 5,
        maxLength: 200,
        pattern: null,
    });

    // Variable 5: Hours (NUMBER)
    const [hoursBase] = await db
        .insert(templateVariableBases)
        .values({
            templateId: template.id,
            type: "NUMBER",
            name: "عدد ساعات التطوع",
            description: "إجمالي ساعات العمل التطوعي",
            required: true,
            order: 5,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    await db.insert(templateNumberVariables).values({
        id: hoursBase.id,
        previewValue: "100",
        minValue: "1",
        maxValue: "1000",
        decimalPlaces: 0,
    });
}

/**
 * Creates all variables for a template based on its category
 */
export async function createTemplateVariables(
    db: NodePgDatabase,
    template: TemplateRecord,
    categoryName: string,
    now: Date,
) {
    // Create base variables for all templates
    await createBaseVariables(db, template, now);

    // Create category-specific variables
    switch (categoryName) {
        case "الشهادات الأكاديمية":
            await createAcademicVariables(db, template, now);
            break;
        case "الشهادات المهنية":
            await createProfessionalVariables(db, template, now);
            break;
        case "شهادات الحضور":
            await createAttendanceVariables(db, template, now);
            break;
        case "شهادات التقدير":
            await createAppreciationVariables(db, template, now);
            break;
        case "الشهادات التطوعية":
            await createVolunteerVariables(db, template, now);
            break;
    }
}
