import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { StudentRepository } from "@/server/db/repo";
import * as Types from "@/server/types";
import * as Pothos from "@/server/graphql/pothos";
import { StudentUtils } from "@/server/utils";

gqlSchemaBuilder.queryFields(t => ({
  student: t.field({
    type: Pothos.StudentPothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_query, args) =>
      await StudentRepository.findById(args.id).then(s => StudentUtils.mapEntityToDto(s)),
  }),

  students: t.field({
    type: Pothos.StudentsWithFiltersPothosObject,
    nullable: false,
    args: {
      paginationArgs: t.arg({
        type: Pothos.PaginationArgsObject,
        required: false,
      }),
      orderBy: t.arg({
        type: [Pothos.StudentsOrderByClausePothosObject],
        required: false,
      }),
      filterArgs: t.arg({
        type: Pothos.StudentFilterArgsPothosObject,
        required: false,
      }),
    },
    resolve: async (_, args) =>
      await StudentRepository.fetchWithFilters(
        new Types.PaginationArgs({ ...args.paginationArgs }),
        args.filterArgs as unknown as Types.StudentFilterArgs,
        args.orderBy
      ),
  }),

  studentsInRecipientGroup: t.field({
    type: Pothos.StudentsWithFiltersPothosObject,
    nullable: false,
    args: {
      recipientGroupId: t.arg.int({ required: true }),
      paginationArgs: t.arg({
        type: Pothos.PaginationArgsObject,
        required: false,
      }),
      orderBy: t.arg({
        type: [Pothos.StudentsOrderByClausePothosObject],
        required: false,
      }),
      filterArgs: t.arg({
        type: Pothos.StudentFilterArgsPothosObject,
        required: false,
      }),
    },
    resolve: async (_, args) =>
      await StudentRepository.searchStudentsRecipientInGroup(
        args.recipientGroupId,
        new Types.PaginationArgs({ ...args.paginationArgs }),
        args.orderBy,
        args.filterArgs as unknown as Types.StudentFilterArgs
      ),
  }),

  studentsNotInRecipientGroup: t.field({
    type: Pothos.StudentsWithFiltersPothosObject,
    nullable: false,
    args: {
      recipientGroupId: t.arg.int({ required: true }),
      paginationArgs: t.arg({
        type: Pothos.PaginationArgsObject,
        required: false,
      }),
      orderBy: t.arg({
        type: [Pothos.StudentsOrderByClausePothosObject],
        required: false,
      }),
      filterArgs: t.arg({
        type: Pothos.StudentFilterArgsPothosObject,
        required: false,
      }),
    },
    resolve: async (_, args) =>
      await StudentRepository.searchStudentsNotInRecipientGroup(
        args.recipientGroupId,
        new Types.PaginationArgs({ ...args.paginationArgs }),
        args.orderBy,
        args.filterArgs as unknown as Types.StudentFilterArgs
      ),
  }),
}));
