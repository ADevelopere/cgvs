import { db } from "@/server/db/drizzleDb";
import { students, templateRecipientGroupItems } from "@/server/db/schema";
import { eq, inArray, sql, notInArray } from "drizzle-orm";
import * as Types from "@/server/types";
import {
    StudentFilterUtils,
    StudentUtils,
    PaginationUtils,
} from "@/server/utils";
import { queryWithPagination } from "@/server/db/query.extentions";
import { RecipientGroupRepository } from "./recipientGroup.repository";
import { PgSelect } from "drizzle-orm/pg-core";

const _processStudentQuery = async <T extends PgSelect>(
    query: T,
    paginationArgs?: Types.PaginationArgs | null,
    orderBy?: Types.StudentsOrderByClause[] | null,
    filters?: Types.StudentFilterArgs | null,
): Promise<Types.StudentsWithFiltersResponse> => {
    let processedQuery = query;
    processedQuery = StudentFilterUtils.applyFilters(processedQuery, filters);
    processedQuery = StudentFilterUtils.applyOrdering(processedQuery, orderBy);
    processedQuery = queryWithPagination(processedQuery, paginationArgs);

    const results = await processedQuery;

    const total = (results[0] as { total: number })?.total ?? 0;
    const items: Types.StudentDto[] = results
        .map((r) => {
            const s: Types.StudentEntity = (
                r as { student: Types.StudentEntity }
            ).student;
            return StudentUtils.mapEntityToDto(s);
        })
        .filter((s) => s !== null);

    const pageInfo = PaginationUtils.buildPageInfoFromArgs(
        paginationArgs,
        items.length,
        total,
    );

    return {
        data: items,
        pageInfo: pageInfo,
    };
};

const _getStudentsByGroupQueryBase = (
    recipientGroupId: number,
    isInGroup: boolean,
) => {
    const studentIdsInGroupSubQuery = db
        .select({ studentId: templateRecipientGroupItems.studentId })
        .from(templateRecipientGroupItems)
        .where(
            eq(templateRecipientGroupItems.recipientGroupId, recipientGroupId),
        );

    const condition = isInGroup
        ? inArray(students.id, studentIdsInGroupSubQuery)
        : notInArray(students.id, studentIdsInGroupSubQuery);

    return db
        .select({
            student: students,
            total: sql<number>`cast(count(*) over() as int)`,
        })
        .from(students)
        .where(condition)
        .$dynamic();
};
export namespace StudentRepository {
    export const findById = async (
        id: number,
    ): Promise<Types.StudentEntity | null | undefined> => {
        return await db.query.students.findFirst({
            where: { id: id },
        });
    };

    export const create = async (
        input: Types.StudentCreateInput,
    ): Promise<Types.StudentEntity> => {
        await StudentUtils.validateName(input.name).then((err) => {
            if (err) throw new Error(err);
        });

        const insertInput: Types.StudentEntityInput = {
            name: input.name,
            email: input.email?.value,
            phoneNumber: input.phoneNumber?.number,
            dateOfBirth: input.dateOfBirth,
            gender: input.gender,
            nationality: input.nationality,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        try {
            const [createdStudent] = await db
                .insert(students)
                .values(insertInput)
                .returning();
            if (!createdStudent) {
                throw new Error("Failed to create student");
            }
            return createdStudent;
        } catch {
            throw new Error("Failed to create student");
        }
    };

    export const createList = async (
        input: Types.StudentCreateInput[],
    ): Promise<Types.StudentEntity[]> => {
        if (input.length === 0) return [];

        try {
            const result = await Promise.all(input.map((item) => create(item)));
            return result;
        } catch (error) {
            throw new Error(
                `Failed to create students: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    };

    export const loadByIds = async (
        ids: number[],
    ): Promise<(Types.StudentDto | Error)[]> => {
        if (ids.length === 0) return [];

        const foundStudents = await db
            .select()
            .from(students)
            .where(inArray(students.id, ids));

        const studentList: (Types.StudentDto | Error)[] = ids.map((id) => {
            const s = foundStudents.find((c) => c.id === id);
            if (!s) return new Error(`Student ${id} not found`);
            return StudentUtils.mapEntityToDto(s) as Types.StudentDto;
        });
        return studentList;
    };

    export const existsById = async (id: number): Promise<boolean> => {
        return (await db.$count(students, eq(students.id, id))) > 0;
    };

    export const allExistsByIds = async (ids: number[]): Promise<boolean> => {
        return (
            (await db.$count(students, inArray(students.id, ids))) ===
            ids.length
        );
    };

    export const countAllStudents = async (): Promise<number> => {
        return await db.$count(students);
    };

    export const deleteById = async (
        id: number,
    ): Promise<Types.StudentEntity> => {
        const existingStudent = await findById(id);
        if (!existingStudent) {
            throw new Error(`Student ${id} not found`);
        }
        await db.delete(students).where(eq(students.id, id));
        return existingStudent;
    };

    export const partiallyUpdate = async (
        input: Types.PartialStudentUpdateInput,
    ): Promise<Types.StudentEntity> => {
        const existingStudent = await findById(input.id);
        if (!existingStudent) {
            throw new Error(`Student ${input.id} not found`);
        }

        if (input.name) {
            StudentUtils.validateName(input.name).then((err) => {
                if (err) throw new Error(err);
            });
        }

        const updateInput: Types.StudentEntityInput = {
            id: input.id,
            name: input.name ?? existingStudent.name,
            email: input.email?.value ?? existingStudent.email,
            phoneNumber:
                input.phoneNumber?.number ?? existingStudent.phoneNumber,
            dateOfBirth: input.dateOfBirth ?? existingStudent.dateOfBirth,
            gender: input.gender ?? existingStudent.gender,
            nationality: input.nationality ?? existingStudent.nationality,
            createdAt: existingStudent.createdAt,
            updatedAt: new Date(),
        };

        try {
            const [updatedStudent] = await db
                .update(students)
                .set(updateInput)
                .where(eq(students.id, input.id))
                .returning();

            if (!updatedStudent) {
                throw new Error(
                    `Failed to update student with ID ${input.id}.`,
                );
            }
            return updatedStudent;
        } catch {
            throw new Error(`Failed to update student with ID ${input.id}.`);
        }
    };

    export const fetchWithFilters = async (
        paginationArgs: Types.PaginationArgs | null,
        filters?: Types.StudentFilterArgs | null,
        orderBy?: Types.StudentsOrderByClause[] | null,
    ): Promise<Types.StudentsWithFiltersResponse> => {
        const baseQuery = db
            .select({
                student: students,
                total: sql<number>`cast(count(*) over() as int)`,
            })
            .from(students)
            .$dynamic();

        return await _processStudentQuery(
            baseQuery,
            paginationArgs,
            orderBy,
            filters,
        );
    };

    export const findStudentsInGroup = async (
        recipientGroupId: number,
        paginationArgs?: Types.PaginationArgs | null,
        orderBy?: Types.StudentsOrderByClause[] | null,
        filters?: Types.StudentFilterArgs | null,
    ): Promise<Types.StudentsWithFiltersResponse> => {
        await RecipientGroupRepository.existsById(recipientGroupId).then(
            (exists) => {
                if (!exists) {
                    throw new Error(
                        `Recipient group ${recipientGroupId} not found`,
                    );
                }
            },
        );

        const baseQuery = _getStudentsByGroupQueryBase(recipientGroupId, true);
        return await _processStudentQuery(
            baseQuery,
            paginationArgs,
            orderBy,
            filters,
        );
    };

    export const searchStudentsNotInGroup = async (
        recipientGroupId: number,
        paginationArgs?: Types.PaginationArgs | null,
        orderBy?: Types.StudentsOrderByClause[] | null,
        filters?: Types.StudentFilterArgs | null,
    ): Promise<Types.StudentsWithFiltersResponse> => {
        await RecipientGroupRepository.existsById(recipientGroupId).then(
            (exists) => {
                if (!exists) {
                    throw new Error(
                        `Recipient group ${recipientGroupId} not found`,
                    );
                }
            },
        );

        const baseQuery = _getStudentsByGroupQueryBase(recipientGroupId, false);
        return await _processStudentQuery(
            baseQuery,
            paginationArgs,
            orderBy,
            filters,
        );
    };
}
