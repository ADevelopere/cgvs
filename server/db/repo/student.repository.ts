import { db } from "@/server/db/drizzleDb";
import { students } from "@/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import {
    buildPageInfoFromArgs,
    PaginationArgs,
} from "../../types/pagination.types";
import * as Types from "@/server/types";
import { StudentFilterUtils, StudentUtils } from "@/server/utils";
import { queryWithPagination } from "@/server/db/query.extentions";

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

    export const loadByIds = async (
        ids: number[],
    ): Promise<(Types.StudentPothosDefintion | Error)[]> => {
        if (ids.length === 0) return [];

        const foundStudents = await db
            .select()
            .from(students)
            .where(inArray(students.id, ids));

        const studentList: (Types.StudentPothosDefintion | Error)[] = ids.map(
            (id) => {
                const s = foundStudents.find((c) => c.id === id);
                if (!s) return new Error(`Student ${id} not found`);
                return StudentUtils.mapEntityToPothosDefintion(
                    s,
                ) as Types.StudentPothosDefintion;
            },
        );
        return studentList;
    };

    export const studentExistsById = async (id: number): Promise<boolean> => {
        return (await db.$count(students, eq(students.id, id))) > 0;
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
        paginationArgs: PaginationArgs | null,
        filters?: Types.StudentFilterArgs | null,
        orderBy?: Types.StudentsOrderByClause[] | null,
    ): Promise<Types.StudentsWithFiltersResponse> => {
        const total = await countAllStudents();
        let query = db.select().from(students).$dynamic();
        query = StudentFilterUtils.applyFilters(query, filters);
        query = StudentFilterUtils.applyOrdering(query, orderBy);
        query = queryWithPagination(query, paginationArgs);
        const items: Types.StudentPothosDefintion[] = (await query).map(
            (s) =>
                StudentUtils.mapEntityToPothosDefintion(
                    s,
                ) as Types.StudentPothosDefintion,
        );
        const pageInfo = buildPageInfoFromArgs(
            paginationArgs,
            items.length,
            total,
        );
        return {
            data: items,
            pageInfo: pageInfo,
        };
    };
}
