import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { PaginationArgsObject } from "../pagintaion/pagination.objects";
import { PaginationArgs } from "../pagintaion/pagintaion.types";
import * as StPothos from "./student.pothos";
import {
    fetchStudentsWithFilters,
    findStudentById,
} from "./student.repository";
import * as StTypes from "./student.types";

gqlSchemaBuilder.queryFields((t) => ({
    student: t.field({
        type: StPothos.StudentPothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) =>
            await findStudentById(args.id).then((s) =>
                StTypes.mapStudentEntityToPothosDefintion(s),
            ),
    }),

    students: t.field({
        type: StPothos.StudentsWithFiltersPothosObject,
        args: {
            paginationArgs: t.arg({
                type: PaginationArgsObject,
                required: false,
            }),
            orderBy: t.arg({
                type: [StPothos.StudentsOrderByClausePothosObject],
                required: false,
            }),
            filterArgs: t.arg({
                type: StPothos.StudentFilterArgsPothosObject,
                required: false,
            }),
        },
        resolve: async (_, args) =>
            await fetchStudentsWithFilters(
                new PaginationArgs({ ...args.paginationArgs }),
                args.filterArgs as unknown as StTypes.StudentFilterArgs,
                args.orderBy,
            ),
    }),
}));
