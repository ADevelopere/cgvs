/**
 * Template variable creation helpers for different category types
 */

import {
    templates,
} from "../schema";

import { TemplateVariableRepository } from "../repo";

type TemplateRecord = typeof templates.$inferSelect;

/**
 * Creates common variables for all templates
 */
export async function createCommonVariables(template: TemplateRecord) {
    // Variable 1: Student Name (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "اسم الطالب",
        description: "الاسم الكامل للطالب",
        required: true,
        previewValue: "محمد أحمد العتيبي",
        minLength: 3,
        maxLength: 100,
        pattern: null,
    });

    // Variable 2: Issue Date (DATE)
    await TemplateVariableRepository.createDateVar({
        templateId: template.id,
        name: "تاريخ الإصدار",
        description: "تاريخ إصدار الشهادة",
        required: true,
        previewValue: new Date(),
        minDate: null,
        maxDate: null,
        format: "Y-m-d",
    });

    // Variable 3: Reference Number (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "الرقم المرجعي",
        description: "الرقم المرجعي للشهادة",
        required: true,
        previewValue: "CERT2024",
        minLength: 8,
        maxLength: 8,
        pattern: "^[A-Z0-9]{8}$",
    });
}

/**
 * Creates variables specific to "Academic Certificates"
 */
export async function createAcademicVariables(template: TemplateRecord) {
    // Variable 4: Major/Specialization (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "التخصص",
        description: "التخصص الأكاديمي",
        required: true,
        previewValue: "علوم الحاسب",
        minLength: 3,
        maxLength: 100,
        pattern: null,
    });

    // Variable 5: GPA (NUMBER)
    await TemplateVariableRepository.createNumberVar({
        templateId: template.id,
        name: "المعدل",
        description: "المعدل التراكمي",
        required: true,
        previewValue: 4.5,
        minValue: 0.0,
        maxValue: 5.0,
        decimalPlaces: 2,
    });
}

/**
 * Creates variables specific to "Professional Certificates"
 */
export async function createProfessionalVariables(template: TemplateRecord) {
    // Variable 4: Field (SELECT)
    await TemplateVariableRepository.createSelectVar({
        templateId: template.id,
        name: "المجال",
        description: "مجال التدريب",
        required: true,
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
    await TemplateVariableRepository.createNumberVar({
        templateId: template.id,
        name: "مدة التدريب",
        description: "عدد ساعات التدريب",
        required: true,
        previewValue: 40,
        minValue: 1,
        maxValue: 1000,
        decimalPlaces: 0,
    });
}

/**
 * Creates variables specific to "Attendance Certificates"
 */
export async function createAttendanceVariables(template: TemplateRecord) {
    // Variable 4: Event Name (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "اسم الفعالية",
        description: "اسم المؤتمر أو ورشة العمل",
        required: true,
        previewValue: "مؤتمر التقنية السنوي",
        minLength: 5,
        maxLength: 200,
        pattern: null,
    });

    // Variable 5: Location (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "مكان الانعقاد",
        description: "مكان انعقاد الفعالية",
        required: true,
        previewValue: "الرياض",
        minLength: 3,
        maxLength: 100,
        pattern: null,
    });
}

/**
 * Creates variables specific to "Appreciation Certificates"
 */
export async function createAppreciationVariables(template: TemplateRecord) {
    // Variable 4: Reason (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "سبب التقدير",
        description: "سبب منح شهادة التقدير",
        required: true,
        previewValue: "التفوق الأكاديمي والإنجاز المتميز",
        minLength: 10,
        maxLength: 500,
        pattern: null,
    });

    // Variable 5: Level (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "المستوى",
        description: "مستوى التقدير",
        required: true,
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
    template: TemplateRecord,
) {
    // Variable 4: Volunteer Type (TEXT)
    await TemplateVariableRepository.createTextVar({
        templateId: template.id,
        name: "نوع العمل التطوعي",
        description: "وصف العمل التطوعي",
        required: true,
        previewValue: "تطوع في الأعمال الخيرية",
        minLength: 5,
        maxLength: 200,
        pattern: null,
    });

    // Variable 5: Hours (NUMBER)
    await TemplateVariableRepository.createNumberVar({
        templateId: template.id,
        name: "عدد ساعات التطوع",
        description: "إجمالي ساعات العمل التطوعي",
        required: true,
        minValue: 1,
        maxValue: 1000,
        decimalPlaces: 0,
    });
}

/**
 * Creates all variables for a template based on its category
 */
export async function createTemplateVariables(
    template: TemplateRecord,
    categoryName: string,
) {
    // Create common variables for all templates
    await createCommonVariables(template);

    // Create category-specific variables
    switch (categoryName) {
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
