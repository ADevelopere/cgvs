import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";
import { RecipientGroupRepository, StudentRepository } from "@/server/db/repo";
import { TemplateRecipientGroupPothosObject } from "./recipientGroup.pothos";
import { StudentPothosObject } from "./student.pothos";

export const TemplateRecipientPothosObject = gqlSchemaBuilder
  .objectRef<Types.RecipientEntity>("TemplateRecipient")
  .implement({
    fields: t => ({
      id: t.exposeInt("id"),
      recipientGroupId: t.exposeInt("recipientGroupId"),
      studentId: t.exposeInt("studentId"),
      createdAt: t.expose("createdAt", {
        type: "DateTime",
        nullable: true,
      }),
      updatedAt: t.expose("updatedAt", {
        type: "DateTime",
        nullable: true,
      }),
    }),
  });

gqlSchemaBuilder.objectFields(TemplateRecipientPothosObject, t => ({
  recipientGroup: t.loadable({
    type: TemplateRecipientGroupPothosObject,
    load: (ids: number[]) => RecipientGroupRepository.loadByIds(ids),
    resolve: recipient => recipient.recipientGroupId,
  }),
  student: t.loadable({
    type: StudentPothosObject,
    load: (ids: number[]) => StudentRepository.loadByIds(ids),
    resolve: recipient => recipient.studentId,
  }),
}));

export const TemplateRecipientCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.RecipientCreateInput>("TemplateRecipientCreateInput")
  .implement({
    fields: t => ({
      recipientGroupId: t.int({ required: true }),
      studentId: t.int({ required: true }),
    }),
  });

export const TemplateRecipientCreateListInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.RecipientCreateListInput>("TemplateRecipientCreateListInput")
  .implement({
    fields: t => ({
      recipientGroupId: t.int({ required: true }),
      studentIds: t.intList({ required: true }),
    }),
  });
