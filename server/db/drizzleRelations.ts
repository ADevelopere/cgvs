import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, r => ({
  users: {
    sessions: r.many.sessions({
      from: r.users.id,
      to: r.sessions.userId,
    }),
    roles: r.many.roles(),
    userRoles: r.many.userRoles({
      from: r.users.id,
      to: r.userRoles.userId,
    }),
    manySelf: r.many.users({
      from: r.users.id,
      to: r.users.id,
    }),
  },
  roles: {
    users: r.many.users({
      from: r.roles.id.through(r.userRoles.roleId),
      to: r.users.id.through(r.userRoles.userId),
    }),
    userRoles: r.many.userRoles({
      from: r.roles.id,
      to: r.userRoles.roleId,
    }),
  },
  userRoles: {
    role: r.one.roles({}),
    user: r.one.users({}),
  },
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
  certificates: {
    template: r.one.templates({
      from: r.certificates.templateId,
      to: r.templates.id,
    }),
    student: r.one.students({
      from: r.certificates.studentId,
      to: r.students.id,
    }),
    templateRecipientGroup: r.one.templateRecipientGroups({
      from: r.certificates.templateRecipientGroupId,
      to: r.templateRecipientGroups.id,
    }),
  },
  students: {
    recipientGroupItems: r.many.templateRecipientGroupItems({
      from: r.students.id,
      to: r.templateRecipientGroupItems.studentId,
    }),
    certificates: r.many.certificates({
      from: r.students.id,
      to: r.certificates.studentId,
    }),
  },
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
    certificates: r.many.certificates({
      from: r.templates.id,
      to: r.certificates.templateId,
    }),
    recipientGroups: r.many.templateRecipientGroups({
      from: r.templates.id,
      to: r.templateRecipientGroups.templateId,
    }),
    templateVariables: r.many.templateVariableBases({
      from: r.templates.id,
      to: r.templateVariableBases.templateId,
    }),
    config: r.one.templateConfig({
      from: r.templates.id,
      to: r.templateConfig.templateId,
    }),
    elements: r.many.certificateElement({
      from: r.templates.id,
      to: r.certificateElement.templateId,
    }),
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
  templateVariableBases: {
    template: r.one.templates({
      from: r.templateVariableBases.templateId,
      to: r.templates.id,
    }),
  },
  templateRecipientGroups: {
    template: r.one.templates({
      from: r.templateRecipientGroups.templateId,
      to: r.templates.id,
    }),
    items: r.many.templateRecipientGroupItems(),
  },
  templateRecipientGroupItems: {
    student: r.one.students({
      from: r.templateRecipientGroupItems.studentId,
      to: r.students.id,
    }),
    templateRecipientGroup: r.one.templateRecipientGroups({
      from: r.templateRecipientGroupItems.recipientGroupId,
      to: r.templateRecipientGroups.id,
    }),
  },
  templateConfig: {
    template: r.one.templates({
      from: r.templateConfig.templateId,
      to: r.templates.id,
    }),
  },
  certificateElement: {
    template: r.one.templates({
      from: r.certificateElement.templateId,
      to: r.templates.id,
    }),
    elementImage: r.one.elementImage({
      from: r.certificateElement.id,
      to: r.elementImage.id,
    }),
    elementText: r.one.elementText({
      from: r.certificateElement.id,
      to: r.elementText.id,
    }),
    elementDate: r.one.elementDate({
      from: r.certificateElement.id,
      to: r.elementDate.id,
    }),
    elementNumberVariable: r.one.elementNumberVariable({
      from: r.certificateElement.id,
      to: r.elementNumberVariable.id,
    }),
    elementGender: r.one.elementGender({
      from: r.certificateElement.id,
      to: r.elementGender.id,
    }),

    elementCountry: r.one.elementCountry({
      from: r.certificateElement.id,
      to: r.elementCountry.id,
    }),
  },
  elementTextProps: {
    font: r.one.font({
      from: r.elementTextProps.fontId,
      to: r.font.id,
    }),
    elementTexts: r.many.elementText({
      from: r.elementTextProps.id,
      to: r.elementText.textPropsId,
    }),
    elementDates: r.many.elementDate({
      from: r.elementTextProps.id,
      to: r.elementDate.textPropsId,
    }),
    elementNumberVariables: r.many.elementNumberVariable({
      from: r.elementTextProps.id,
      to: r.elementNumberVariable.textPropsId,
    }),
    elementGenders: r.many.elementGender({
      from: r.elementTextProps.id,
      to: r.elementGender.textPropsId,
    }),
    elementCountries: r.many.elementCountry({
      from: r.elementTextProps.id,
      to: r.elementCountry.textPropsId,
    }),
  },
  font: {
    storageFile: r.one.storageFiles({
      from: r.font.storageFileId,
      to: r.storageFiles.id,
    }),
    elementTextProps: r.many.elementTextProps({
      from: r.font.id,
      to: r.elementTextProps.fontId,
    }),
  },
  elementImage: {
    certificateElement: r.one.certificateElement({
      from: r.elementImage.id,
      to: r.certificateElement.id,
    }),
    storageFile: r.one.storageFiles({
      from: r.elementImage.storageFileId,
      to: r.storageFiles.id,
    }),
  },
  elementText: {
    certificateElement: r.one.certificateElement({
      from: r.elementText.id,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.elementText.textPropsId,
      to: r.elementTextProps.id,
    }),
  },
  elementDate: {
    certificateElement: r.one.certificateElement({
      from: r.elementDate.id,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.elementDate.textPropsId,
      to: r.elementTextProps.id,
    }),
    templateVariable: r.one.templateVariableBases({
      from: r.elementDate.templateVariableId,
      to: r.templateVariableBases.id,
    }),
  },
  elementNumberVariable: {
    certificateElement: r.one.certificateElement({
      from: r.elementNumberVariable.id,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.elementNumberVariable.textPropsId,
      to: r.elementTextProps.id,
    }),
    templateVariable: r.one.templateVariableBases({
      from: r.elementNumberVariable.templateVariableId,
      to: r.templateVariableBases.id,
    }),
  },
  elementGender: {
    certificateElement: r.one.certificateElement({
      from: r.elementGender.id,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.elementGender.textPropsId,
      to: r.elementTextProps.id,
    }),
  },
  elementCountry: {
    certificateElement: r.one.certificateElement({
      from: r.elementCountry.id,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.elementCountry.textPropsId,
      to: r.elementTextProps.id,
    }),
  },
}));
