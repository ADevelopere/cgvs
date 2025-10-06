import { db } from "@/server/db/drizzleDb";
import { students } from "@/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import {
    buildPageInfoFromArgs,
    PaginationArgs,
} from "../pagintaion/pagintaion.types";
import * as StTypes from "./student.types";
import {
    applyStudentFilters,
    applyStudentOrdering,
} from "./student.filterUtils";
import { queryWithPagination } from "@/server/db/query.extentions";
import { validateStudentName } from "./student.utilt";
import { mapStudentEntityToPothosDefintion } from "./student.types";

export const findStudentById = async (
    id: number,
): Promise<StTypes.StudentEntity | null | undefined> => {
    return await db.query.students.findFirst({
        where: { id: id },
    });
};

export const createStudent = async (
    input: StTypes.StudentCreateInput,
): Promise<StTypes.StudentEntity> => {
    validateStudentName(input.name).then((err) => {
        if (err) throw new Error(err);
    });

    const insertInput: StTypes.StudentEntityInput = {
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

export const loadStudetnsByIds = async (
    ids: number[],
): Promise<(StTypes.StudentPothosDefintion | Error)[]> => {
    if (ids.length === 0) return [];

    const foundStudents = await db
        .select()
        .from(students)
        .where(inArray(students.id, ids));

    const studentList: (StTypes.StudentPothosDefintion | Error)[] = ids.map(
        (id) => {
            const s = foundStudents.find((c) => c.id === id);
            if (!s) return new Error(`Student ${id} not found`);
            return mapStudentEntityToPothosDefintion(s);
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

export const deleteStudentById = async (
    id: number,
): Promise<StTypes.StudentEntity | Error> => {
    const existingStudent = await findStudentById(id);
    if (!existingStudent) {
        return new Error(`Student ${id} not found`);
    }
    await db.delete(students).where(eq(students.id, id));
    return existingStudent;
};

export const partiallyUpdateStudent = async (
    input: StTypes.PartialStudentUpdateInput,
): Promise<StTypes.StudentEntity | Error> => {
    const existingStudent = await findStudentById(input.id);
    if (!existingStudent) {
        return new Error(`Student ${input.id} not found`);
    }

    if (input.name) {
        validateStudentName(input.name).then((err) => {
            if (err) throw new Error(err);
        });
    }

    const updateInput: StTypes.StudentEntityInput = {
        id: input.id,
        name: input.name ?? existingStudent.name,
        email: input.email?.value ?? existingStudent.email,
        phoneNumber: input.phoneNumber?.number ?? existingStudent.phoneNumber,
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
            throw new Error(`Failed to update student with ID ${input.id}.`);
        }
        return updatedStudent;
    } catch {
        throw new Error(`Failed to update student with ID ${input.id}.`);
    }
};

export const fetchStudentsWithFilters = async (
    paginationArgs: PaginationArgs | null,
    orderBy: StTypes.StudentsOrderByClause[] | null,
    filters: StTypes.StudentFilterArgs | null,
): Promise<StTypes.StudentsWithFiltersResponse> => {
    const total = await countAllStudents();
    let query = db.select().from(students).$dynamic();
    query = applyStudentFilters(query, filters);
    query = applyStudentOrdering(query, orderBy);
    query = queryWithPagination(query, paginationArgs);
    const items: StTypes.StudentPothosDefintion[] = (await query).map((s) =>
        StTypes.mapStudentEntityToPothosDefintion(s),
    );
    const pageInfo = buildPageInfoFromArgs(paginationArgs, items.length, total);
    return {
        data: items,
        pageInfo: pageInfo,
    };
};
