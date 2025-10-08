import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    PartialStudentUpdateInputPothosObject,
    StudentCreateInputPothosObject,
    StudentPothosObject,
} from "./student.pothos";
import { StudentRepository } from "./student.repository";
import {
    mapStudentEntityToPothosDefintion,
    PartialStudentUpdateInput,
} from "./student.types";
import * as StTypes from "./student.types";

gqlSchemaBuilder.mutationFields((t) => ({
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
            const input = args.input as unknown as StTypes.StudentCreateInput;
            const student = await StudentRepository.create(input);
            return mapStudentEntityToPothosDefintion(student);
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
                args.input as PartialStudentUpdateInput,
            ).then((s) => mapStudentEntityToPothosDefintion(s)),
    }),

    deleteStudent: t.field({
        type: StudentPothosObject,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) =>
            await StudentRepository.deleteById(args.id).then((s) =>
                mapStudentEntityToPothosDefintion(s),
            ),
    }),
}));
