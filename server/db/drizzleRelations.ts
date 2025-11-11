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
    textElements: r.many.textElement({
      from: r.templateVariableBases.id,
      to: r.textElement.variableId,
    }),
    dateElements: r.many.dateElement({
      from: r.templateVariableBases.id,
      to: r.dateElement.variableId,
    }),
    numberElements: r.many.numberElement({
      from: r.templateVariableBases.id,
      to: r.numberElement.variableId,
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
    textElement: r.one.textElement({
      from: r.certificateElement.id,
      to: r.textElement.elementId,
    }),
    dateElement: r.one.dateElement({
      from: r.certificateElement.id,
      to: r.dateElement.elementId,
    }),
    numberElement: r.one.numberElement({
      from: r.certificateElement.id,
      to: r.numberElement.elementId,
    }),
    countryElement: r.one.countryElement({
      from: r.certificateElement.id,
      to: r.countryElement.elementId,
    }),
    genderElement: r.one.genderElement({
      from: r.certificateElement.id,
      to: r.genderElement.elementId,
    }),
    imageElement: r.one.imageElement({
      from: r.certificateElement.id,
      to: r.imageElement.elementId,
    }),
    qrCodeElement: r.one.qrCodeElement({
      from: r.certificateElement.id,
      to: r.qrCodeElement.elementId,
    }),
  },
  fontFamily: {
    variants: r.many.fontVariant({
      from: r.fontFamily.id,
      to: r.fontVariant.familyId,
    }),
  },
  fontVariant: {
    family: r.one.fontFamily({
      from: r.fontVariant.familyId,
      to: r.fontFamily.id,
    }),
    storageFile: r.one.storageFiles({
      from: r.fontVariant.storageFileId,
      to: r.storageFiles.id,
    }),
    textProps: r.many.elementTextProps({
      from: r.fontVariant.id,
      to: r.elementTextProps.fontVariantId,
    }),
  },

  elementTextProps: {
    fontVariant: r.one.fontVariant({
      from: r.elementTextProps.fontVariantId,
      to: r.fontVariant.id,
    }),
    textElements: r.many.textElement({
      from: r.elementTextProps.id,
      to: r.textElement.textPropsId,
    }),
    dateElements: r.many.dateElement({
      from: r.elementTextProps.id,
      to: r.dateElement.textPropsId,
    }),
    numberElements: r.many.numberElement({
      from: r.elementTextProps.id,
      to: r.numberElement.textPropsId,
    }),
    countryElements: r.many.countryElement({
      from: r.elementTextProps.id,
      to: r.countryElement.textPropsId,
    }),
    genderElements: r.many.genderElement({
      from: r.elementTextProps.id,
      to: r.genderElement.textPropsId,
    }),
  },
  textElement: {
    element: r.one.certificateElement({
      from: r.textElement.elementId,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.textElement.textPropsId,
      to: r.elementTextProps.id,
    }),
    variable: r.one.templateVariableBases({
      from: r.textElement.variableId,
      to: r.templateVariableBases.id,
    }),
  },
  dateElement: {
    element: r.one.certificateElement({
      from: r.dateElement.elementId,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.dateElement.textPropsId,
      to: r.elementTextProps.id,
    }),
    variable: r.one.templateVariableBases({
      from: r.dateElement.variableId,
      to: r.templateVariableBases.id,
    }),
  },
  numberElement: {
    element: r.one.certificateElement({
      from: r.numberElement.elementId,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.numberElement.textPropsId,
      to: r.elementTextProps.id,
    }),
    variable: r.one.templateVariableBases({
      from: r.numberElement.variableId,
      to: r.templateVariableBases.id,
    }),
  },
  countryElement: {
    element: r.one.certificateElement({
      from: r.countryElement.elementId,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.countryElement.textPropsId,
      to: r.elementTextProps.id,
    }),
  },
  genderElement: {
    element: r.one.certificateElement({
      from: r.genderElement.elementId,
      to: r.certificateElement.id,
    }),
    textProps: r.one.elementTextProps({
      from: r.genderElement.textPropsId,
      to: r.elementTextProps.id,
    }),
  },
  imageElement: {
    element: r.one.certificateElement({
      from: r.imageElement.elementId,
      to: r.certificateElement.id,
    }),
    storageFile: r.one.storageFiles({
      from: r.imageElement.storageFileId,
      to: r.storageFiles.id,
    }),
  },
  qrCodeElement: {
    element: r.one.certificateElement({
      from: r.qrCodeElement.elementId,
      to: r.certificateElement.id,
    }),
  },
  storageFiles: {
    imageElements: r.many.imageElement({
      from: r.storageFiles.id,
      to: r.imageElement.storageFileId,
    }),
  },
}));
