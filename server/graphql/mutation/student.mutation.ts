import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  PartialStudentUpdateInputPothosObject,
  StudentCreateInputPothosObject,
  StudentPothosObject,
} from "../pothos";
import { StudentRepository } from "@/server/db/repo";
import { StudentUtils } from "@/server/utils";
import * as Types from "@/server/types";

gqlSchemaBuilder.mutationFields(t => ({
  createStudent: t.field({
    type: StudentPothosObject,
    nullable: true,
    args: {
      input: t.arg({
        type: StudentCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_query, args) => {
      const input = args.input as unknown as Types.StudentCreateInput;
      const student = await StudentRepository.create(input);
      return StudentUtils.mapEntityToDto(student);
    },
  }),

  partiallyUpdateStudent: t.field({
    type: StudentPothosObject,
    args: {
      input: t.arg({
        type: PartialStudentUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_query, args) =>
      await StudentRepository.partiallyUpdate(
        args.input as Types.PartialStudentUpdateInput
      ).then(s => StudentUtils.mapEntityToDto(s)),
  }),

  deleteStudent: t.field({
    type: StudentPothosObject,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_query, args) =>
      await StudentRepository.deleteById(args.id).then(s =>
        StudentUtils.mapEntityToDto(s)
      ),
  }),
}));
