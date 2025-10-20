import { db } from "@/server/db/drizzleDb";
import * as Types from "@/server/types";
import { RecipientGroupRepository } from "./recipientGroup.repository";
import { StudentRepository } from "./student.repository";
import {
  templateRecipientGroupItems,
  templateRecipientGroups,
  students,
} from "../schema";
import logger from "@/server/lib/logger";
import { eq, and, inArray, sql } from "drizzle-orm";
import { StudentFilterUtils, PaginationUtils } from "@/server/utils";
import { queryWithPagination } from "@/server/db/query.extentions";

export namespace RecipientRepository {
  export const existsById = async (id: number): Promise<boolean> => {
    return (
      (await db.$count(
        templateRecipientGroupItems,
        eq(templateRecipientGroupItems.id, id)
      )) > 0
    );
  };

  export const existsByGroupIdAndStudentId = async (
    recipientGroupId: number,
    studentId: number
  ): Promise<boolean> => {
    return (
      (await db.$count(
        templateRecipientGroupItems,
        and(
          eq(templateRecipientGroups.id, recipientGroupId),
          eq(students.id, studentId)
        )
      )) > 0
    );
  };

  export const findById = async (
    id: number
  ): Promise<Types.RecipientEntity | null> => {
    const item = await db.query.templateRecipientGroupItems.findFirst({
      where: { id },
    });
    return item ? item : null;
  };

  export const create = async (
    input: Types.RecipientCreateInput
  ): Promise<Types.RecipientEntity> => {
    await RecipientGroupRepository.existsById(input.recipientGroupId).then(
      exists => {
        if (!exists) {
          throw new Error(
            `Recipient group with ID ${input.recipientGroupId} does not exist.`
          );
        }
      }
    );

    await StudentRepository.existsById(input.studentId).then(exists => {
      if (!exists) {
        throw new Error(`Student with ID ${input.studentId} does not exist.`);
      }
    });

    await existsByGroupIdAndStudentId(
      input.recipientGroupId,
      input.studentId
    ).then(exists => {
      if (exists) {
        throw new Error(
          `Recipient group with ID ${input.recipientGroupId} already has a student with ID ${input.studentId}.`
        );
      }
    });

    const now = new Date();

    const insertInput: Types.RecipientEntityInput = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const [newRecipient] = await db
        .insert(templateRecipientGroupItems)
        .values(insertInput)
        .returning();
      return newRecipient;
    } catch (error) {
      logger.error(error);
      throw new Error("Failed to create recipient.");
    }
  };

  // todo: transaction
  export const createList = async (
    input: Types.RecipientCreateListInput
  ): Promise<Types.RecipientEntity[]> => {
    if (input.studentIds.length === 0) return [];

    await RecipientGroupRepository.existsById(input.recipientGroupId).then(
      exists => {
        if (!exists) {
          throw new Error(
            `Recipient group with ID ${input.recipientGroupId} does not exist.`
          );
        }
      }
    );

    await StudentRepository.allExistsByIds(input.studentIds).then(exist => {
      if (!exist) {
        throw new Error("Some or all students don't exist");
      }
    });

    const existingRecipients = await db
      .select({ studentId: templateRecipientGroupItems.studentId })
      .from(templateRecipientGroupItems)
      .where(
        and(
          eq(
            templateRecipientGroupItems.recipientGroupId,
            input.recipientGroupId
          ),
          inArray(templateRecipientGroupItems.studentId, input.studentIds)
        )
      );

    const existingStudentIds = new Set(
      existingRecipients.map(r => r.studentId)
    );

    const now = new Date();

    const insertInput: Types.RecipientEntityInput[] = input.studentIds
      .filter(studentId => !existingStudentIds.has(studentId))
      .map(studentId => ({
        recipientGroupId: input.recipientGroupId,
        studentId: studentId,
        createdAt: now,
        updatedAt: now,
      }));

    if (insertInput.length === 0) {
      return [];
    }

    try {
      const result = await db
        .insert(templateRecipientGroupItems)
        .values(insertInput)
        .returning();

      return result;
    } catch (error) {
      throw new Error(
        `Failed to create recipients: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  export const deleteById = async (
    id: number
  ): Promise<Types.RecipientEntity> => {
    const existingRecipient = await findById(id);
    if (!existingRecipient) {
      throw new Error(`Recipient with ID ${id} does not exist.`);
    }
    await db
      .delete(templateRecipientGroupItems)
      .where(eq(templateRecipientGroupItems.id, id));
    return existingRecipient;
  };

  export const deleteSetByIds = async (
    ids: number[]
  ): Promise<Types.RecipientEntity[]> => {
    if (ids.length === 0) return [];

    try {
      const result = await Promise.all(ids.map(id => deleteById(id)));
      return result;
    } catch (error) {
      throw new Error(
        `Failed to delete recipients: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  export const findAllByGroupId = async (
    recipientGroupId: number
  ): Promise<Types.RecipientEntity[]> => {
    await RecipientGroupRepository.existsById(recipientGroupId).then(exists => {
      if (!exists) {
        throw new Error(
          `Recipient group with ID ${recipientGroupId} does not exist.`
        );
      }
    });

    return await db.query.templateRecipientGroupItems.findMany({
      where: { recipientGroupId },
    });
  };

  export const searchRecipientsInGroup = async (
    recipientGroupId: number,
    paginationArgs?: Types.PaginationArgs | null,
    orderBy?: Types.StudentsOrderByClause[] | null,
    filters?: Types.StudentFilterArgs | null
  ): Promise<{ data: Types.RecipientEntity[]; pageInfo: Types.PageInfo }> => {
    await RecipientGroupRepository.existsById(recipientGroupId).then(exists => {
      if (!exists) {
        throw new Error(
          `Recipient group with ID ${recipientGroupId} does not exist.`
        );
      }
    });

    // Base query joins recipients with students so we can filter/order by student fields
    let baseQuery = db
      .select({
        recipient: templateRecipientGroupItems,
        student: students,
        total: sql<number>`cast(count(*) over() as int)`,
      })
      .from(templateRecipientGroupItems)
      .innerJoin(
        students,
        eq(students.id, templateRecipientGroupItems.studentId)
      )
      .where(eq(templateRecipientGroupItems.recipientGroupId, recipientGroupId))
      .$dynamic();

    // Apply student filters and ordering, then pagination
    baseQuery = StudentFilterUtils.applyFilters(baseQuery, filters);
    baseQuery = StudentFilterUtils.applyOrdering(baseQuery, orderBy);
    baseQuery = queryWithPagination(baseQuery, paginationArgs);

    const results = await baseQuery;

    const total = (results[0] as { total: number })?.total ?? 0;
    const items: Types.RecipientEntity[] = results
      .map(r => (r as { recipient: Types.RecipientEntity }).recipient)
      .filter(Boolean);

    const pageInfo = PaginationUtils.buildPageInfoFromArgs(
      paginationArgs,
      items.length,
      total
    );

    return { data: items, pageInfo };
  };

  export const findByStudentId = async (
    studentId: number
  ): Promise<Types.RecipientEntity[]> => {
    await StudentRepository.existsById(studentId).then(exists => {
      if (!exists) {
        throw new Error(`Student with ID ${studentId} does not exist.`);
      }
    });

    return await db.query.templateRecipientGroupItems.findMany({
      where: { studentId: studentId },
    });
  };

  export const loadForGroups = async (
    groupIds: number[]
  ): Promise<Types.RecipientEntity[][]> => {
    if (groupIds.length === 0) return [];

    const allGroups = await Promise.all(
      groupIds.map(id => findAllByGroupId(id))
    );
    return allGroups;
  };

  export const countInGroup = async (groupId: number): Promise<number> => {
    return await db.$count(
      templateRecipientGroupItems,
      eq(templateRecipientGroupItems.recipientGroupId, groupId)
    );
  };
}
