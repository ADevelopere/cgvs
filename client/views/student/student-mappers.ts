import {
  PartialStudentUpdateInput,
  Student,
} from "@/client/graphql/generated/gql/graphql";

/**
 * Maps a student to update input
 */
export const mapStudentToPartialUpdateInput = (
  student: Student
): PartialStudentUpdateInput => {
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
