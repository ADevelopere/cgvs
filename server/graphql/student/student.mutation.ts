import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    PartialStudentUpdateInputPothosObject,
    StudentCreateInputPothosObject,
    StudentPothosObject,
} from "./student.pothos";
import {
    createStudent,
    deleteStudentById,
    partiallyUpdateStudent,
} from "./student.repository";
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
            const student = await createStudent(input);
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
            await partiallyUpdateStudent(
                args.input as PartialStudentUpdateInput,
            ).then((s) => mapStudentEntityToPothosDefintion(s)),
    }),

    deleteStudent: t.field({
        type: StudentPothosObject,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) =>
            await deleteStudentById(args.id).then((s) =>
                mapStudentEntityToPothosDefintion(s),
            ),
    }),
}));
