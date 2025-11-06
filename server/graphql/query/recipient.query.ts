import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  TemplateRecipientPothosObject,
  RecipientsWithFiltersPothosObject,
  PaginationArgsObject,
  StudentsOrderByClausePothosObject,
  StudentFilterArgsPothosObject,
} from "../pothos";
import { RecipientRepository } from "@/server/db/repo";
import * as Types from "@/server/types";

gqlSchemaBuilder.queryFields(t => ({
  recipient: t.field({
    type: TemplateRecipientPothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => await RecipientRepository.findById(args.id),
  }),

  recipientsByGroupId: t.field({
    type: [TemplateRecipientPothosObject],
    nullable: false,
    args: {
      recipientGroupId: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => await RecipientRepository.findAllByGroupId(args.recipientGroupId),
  }),

  recipientsByStudentId: t.field({
    type: [TemplateRecipientPothosObject],
    nullable: false,
    args: {
      studentId: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => await RecipientRepository.findByStudentId(args.studentId),
  }),

  recipientsByGroupIdFiltered: t.field({
    type: RecipientsWithFiltersPothosObject,
    nullable: false,
    args: {
      recipientGroupId: t.arg.int({ required: true }),
      paginationArgs: t.arg({ type: PaginationArgsObject, required: false }),
      orderBy: t.arg({
        type: [StudentsOrderByClausePothosObject],
        required: false,
      }),
      filterArgs: t.arg({
        type: StudentFilterArgsPothosObject,
        required: false,
      }),
    },
    resolve: async (_, args) =>
      await RecipientRepository.searchRecipientsInGroup(
        args.recipientGroupId,
        new Types.PaginationArgs({ ...args.paginationArgs }),
        args.orderBy ?? null,
        (args.filterArgs as unknown as Types.StudentFilterArgs) ?? null
      ),
  }),
}));
