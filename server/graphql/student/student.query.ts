import { SortDirectionPothosObject } from "../enum/enum.pothos";
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { PaginationArgsObject } from "../pagintaion/pagination.objects";
import { PaginationArgs } from "../pagintaion/pagintaion.types";
import {
    StudentFilterArgsPothosObject,
    StudentPothosObject,
    StudentsWithFiltersPothosObject,
} from "./student.pothos";
import {
    fetchStudentsWithFilters,
    findStudentById,
} from "./student.repository";
import { mapStudentEntityToPothosDefintion } from "./student.types";

gqlSchemaBuilder.queryFields((t) => ({
    student: t.field({
        type: StudentPothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) =>
            await findStudentById(args.id).then((s) =>
                mapStudentEntityToPothosDefintion(s),
            ),
    }),

    students: t.field({
        type: StudentsWithFiltersPothosObject,
        args: {
            paginationArgs: t.arg({
                type: PaginationArgsObject,
                required: false,
            }),
            orderBy: t.arg({
                type: SortDirectionPothosObject,
                required: false,
            }),
            filterArgs: t.arg({
                type: StudentFilterArgsPothosObject,
                required: false,
            }),
        },
        resolve: (_, args) =>
            await fetchStudentsWithFilters(
                new PaginationArgs({...args.paginationArgs}),
                args.orderBy,
                args.filterArgs,
            ),
    }),
}));
