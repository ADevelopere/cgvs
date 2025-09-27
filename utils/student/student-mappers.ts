import {
    CreateStudentMutation,
    DeleteStudentMutation,
    StudentQuery,
    StudentsQuery,
    PartialUpdateStudentMutation,
    Student,
    PartialUpdateStudentInput,
} from "@/graphql/generated/types";

export type StudentSource =
    | CreateStudentMutation
    | PartialUpdateStudentMutation
    | DeleteStudentMutation
    | StudentQuery
    | StudentsQuery;

type PartialStudent = Partial<Student> & { id: string; name: string };

/**
 * Maps a student from any source to a consistent Student type
 */
const mapStudent = (
    student: PartialStudent | null | undefined,
    previousStudent?: Student | null,
): Student => {
    if (!student) {
        return {} as Student;
    }

    return {
        id: student.id,
        name: student.name,
        gender: student.gender ?? previousStudent?.gender ?? null,
        nationality: student.nationality ?? previousStudent?.nationality ?? null,
        dateOfBirth: student.dateOfBirth ?? previousStudent?.dateOfBirth ?? null,
        email: student.email ?? previousStudent?.email ?? null,
        phoneNumber: student.phoneNumber ?? previousStudent?.phoneNumber ?? null,
        createdAt: student.createdAt ?? previousStudent?.createdAt ?? new Date(),
        updatedAt: student.updatedAt ?? previousStudent?.updatedAt ?? new Date(),
        // certificates: student.certificates ?? previousStudent?.certificates ?? [],
        // recipientGroups: student.recipientGroups ?? previousStudent?.recipientGroups ?? [],
    } as Student;
};

/**
 * Maps a create student mutation result to a Student
 */
const mapCreateStudent = (source: CreateStudentMutation): Student => {
    return mapStudent(source.createStudent as PartialStudent);
};

/**
 * Maps an update student mutation result to a Student
 */
const mapPartialUpdateStudent = (
    source: PartialUpdateStudentMutation,
    previousStudent?: Student,
): Student => {
    return mapStudent(source.partialUpdateStudent as PartialStudent, previousStudent);
};

/**
 * Maps a delete student mutation result to a Student
 */
const mapDeleteStudent = (
    source: DeleteStudentMutation,
    previousStudent?: Student,
): Student => {
    return mapStudent(source.deleteStudent as PartialStudent, previousStudent);
};

/**
 * Maps any student source to a single Student or null
 */
export const mapSingleStudent = (
    source: StudentSource | undefined | null,
    previousStudent?: Student,
): Student | null => {
    if (!source) {
        return null;
    }

    // Handle student mutations and queries
    if ("createStudent" in source) {
        return mapCreateStudent(source);
    }
    if ("partialUpdateStudent" in source) {
        return mapPartialUpdateStudent(source, previousStudent);
    }
    if ("deleteStudent" in source) {
        return mapDeleteStudent(source, previousStudent);
    }
    if ("student" in source) {
        return mapStudent(source.student as PartialStudent, previousStudent);
    }

    return null;
};

/**
 * Maps any student source to an array of Students
 */
export const mapStudents = (
    source: StudentSource | undefined | null,
    previousStudents?: Student[],
): Student[] => {
    if (!source) {
        return [];
    }

    // Handle students query which returns paginated results
    if ("students" in source) {
        return source.students.data.map((student) => {
            const previousStudent = previousStudents?.find(
                (prev) => prev.id === student.id,
            );
            return mapStudent(student as PartialStudent, previousStudent);
        });
    }

    // For single student results, wrap in an array if not null
    const previousStudent =
        previousStudents?.length === 1 ? previousStudents[0] : undefined;
    const student = mapSingleStudent(source, previousStudent);
    return student ? [student] : [];
};

/**
 * Maps a student to update input 
 */
export const mapStudentToPartialUpdateInput = (
    student: Student,
): PartialUpdateStudentInput => {
    return {
        id: student.id,
        name: student.name,
        gender: student.gender,
        nationality: student.nationality,
        dateOfBirth: student.dateOfBirth,
        email: student.email,
        phoneNumber: student.phoneNumber,
    };
};
