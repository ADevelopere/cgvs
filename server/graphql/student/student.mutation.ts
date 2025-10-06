import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    StudentCreateInputPothosObject,
    StudentPothosObject,
} from "./student.pothos";
import { createStudent } from "./student.repository";
import { mapStudentEntityToPothosDefintion } from "./student.types";
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
}));
