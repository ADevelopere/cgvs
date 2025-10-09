import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { StudentRepository } from "@/server/db/repo";
import * as Types from "@/server/types";
import * as Pothos from "@/server/graphql/pothos";

gqlSchemaBuilder.queryFields((t) => ({
    student: t.field({
        type: Pothos.StudentPothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) =>
            await StudentRepository.findById(args.id).then((s) =>
                Types.mapStudentEntityToPothosDefintion(s),
            ),
    }),

    students: t.field({
        type: Pothos.StudentsWithFiltersPothosObject,
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
                args.orderBy,
            ),
    }),
}));
