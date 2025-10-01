import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    users: {
        sessions: r.many.sessions({
            from: r.users.id,
            to: r.sessions.userId,
        }),
    },
    sessions: {
        user: r.one.users({
            from: r.sessions.userId,
            to: r.users.id,
        }),
    },
    // certificates: {
    //     template: r.one.templates({
    //         from: r.certificates.templateId,
    //         to: r.templates.id,
    //     }),
    //     student: r.one.students({
    //         from: r.certificates.studentId,
    //         to: r.students.id,
    //     }),
    //     templateRecipientGroup: r.one.templateRecipientGroups({
    //         from: r.certificates.templateRecipientGroupId,
    //         to: r.templateRecipientGroups.id,
    //     }),
    // },
    // students: {
    //     recipientGroupItems: r.many.templateRecipientGroupItems({
    //         from: r.students.id,
    //         to: r.templateRecipientGroupItems.studentId,
    //     }),
    //     certificates: r.many.certificates({
    //         from: r.students.id,
    //         to: r.certificates.studentId,
    //     }),
    // },
    templates: {
        category: r.one.templateCategories({
            from: r.templates.categoryId,
            to: r.templateCategories.id,
            alias: "category",
        }),
        preSuspensionCategory: r.one.templateCategories({
            from: r.templates.preSuspensionCategoryId,
            to: r.templateCategories.id,
            alias: "preSuspensionCategory",
        }),
        // certificates: r.many.certificates({
        //     from: r.templates.id,
        //     to: r.certificates.templateId,
        // }),
        // recipientGroups: r.many.templateRecipientGroups({
        //     from: r.templates.id,
        //     to: r.templateRecipientGroups.templateId,
        // }),
        // templateVariables: r.many.templateVariableBases({
        //     from: r.templates.id,
        //     to: r.templateVariableBases.templateId,
        // }),
        // elements: r.many.templateElements({
        //     from: r.templates.id,
        //     to: r.templateElements.templateId,
        // }),
    },
    templateCategories: {
        parentCategory: r.one.templateCategories({
            from: r.templateCategories.parentCategoryId,
            to: r.templateCategories.id,
            alias: "parentCategory",
        }),
        subCategories: r.many.templateCategories({
            from: r.templateCategories.id,
            to: r.templateCategories.parentCategoryId,
            alias: "subCategories",
        }),
        templates: r.many.templates({
            from: r.templateCategories.id,
            to: r.templates.categoryId,
        }),
        preSuspensionTemplates: r.many.templates({
            from: r.templateCategories.id,
            to: r.templates.preSuspensionCategoryId,
            alias: "preSuspensionTemplates",
        }),
    },
    // templateRecipientGroups: {
    //     template: r.one.templates({
    //         from: r.templateRecipientGroups.templateId,
    //         to: r.templates.id,
    //     }),
    //     items: r.many.templateRecipientGroupItems(),
    //     certificates: r.many.certificates(),
    // },
}));
