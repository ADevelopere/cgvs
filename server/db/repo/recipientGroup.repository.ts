import { db } from "@/server/db/drizzleDb";
import * as Types from "@/server/types";
import { TemplateRecipientGroupUtils } from "@/server/utils";
import { TemplateRepository } from "./template.repository";
import { templateRecipientGroups } from "@/server/db";
import { eq, inArray } from "drizzle-orm";

export namespace RecipientGroupRepository {
    export const findById = async (
        id: number,
    ): Promise<Types.RecipientGroupEntity | null> => {
        const trg = await db
            .select()
            .from(templateRecipientGroups)
            .where(eq(templateRecipientGroups.id, id))
            .then((res) => res[0]);

        if (!trg) return null;

        return trg;
    };

    export const existsById = async (id: number): Promise<boolean> => {
        return (
            (await db.$count(
                templateRecipientGroups,
                eq(templateRecipientGroups.id, id),
            )) > 0
        );
    };

    export const create = async (
        input: Types.RecipientGroupCreateInput,
    ): Promise<Types.RecipientGroupEntity> => {
        await TemplateRecipientGroupUtils.validateName(input.name).then(
            (err) => {
                if (err) throw new Error(err);
            },
        );

        await TemplateRepository.existsById(input.templateId).then(
            (templateExists) => {
                if (!templateExists) {
                    throw new Error(
                        `Template with ID ${input.templateId} does not exist.`,
                    );
                }
            },
        );

        const now = new Date();

        const insertInput: Types.RecipientGroupEntityInput = {
            ...input,
            createdAt: now,
            updatedAt: now,
        };

        try {
            const [newTrg] = await db
                .insert(templateRecipientGroups)
                .values(insertInput)
                .returning();
            return newTrg;
        } catch {
            throw new Error("Failed to create recipient group.");
        }
    };

    export const createList = async (
        input: Types.RecipientGroupCreateInput[],
    ): Promise<Types.RecipientGroupEntity[]> => {
        if (input.length === 0) return [];

        try {
            const result = await Promise.all(input.map((item) => create(item)));
            return result;
        } catch (error) {
            throw new Error(
                `Failed to create recipient groups: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    };

    export const update = async (
        input: Types.RecipientGroupUpdateInput,
    ): Promise<Types.RecipientGroupEntity> => {
        await existsById(input.id).then((exists) => {
            if (!exists) {
                throw new Error(
                    `Recipient group with ID ${input.id} does not exist.`,
                );
            }
        });

        await TemplateRecipientGroupUtils.validateName(input.name).then(
            (err) => {
                if (err) throw new Error(err);
            },
        );

        try {
            const [updatedTrg] = await db
                .update(templateRecipientGroups)
                .set({
                    ...input,
                    updatedAt: new Date(),
                })
                .where(eq(templateRecipientGroups.id, input.id))
                .returning();
            return updatedTrg;
        } catch {
            throw new Error("Failed to update recipient group.");
        }
    };

    export const findAllByTemplateId = async (
        templateId: number,
    ): Promise<Types.RecipientGroupEntity[]> => {
        return db.query.templateRecipientGroups.findMany({
            where: {
                templateId: templateId,
            },
        });
    };

    export const findByIds = async (
        ids: number[],
    ): Promise<Types.RecipientGroupEntity[]> => {
        return db
            .select()
            .from(templateRecipientGroups)
            .where(inArray(templateRecipientGroups.id, ids));
    };

    export const deleteById = async (
        id: number,
    ): Promise<Types.RecipientGroupEntity> => {
        try {
            await existsById(id).then((exists) => {
                if (!exists) {
                    throw new Error(
                        `Recipient group with ID ${id} does not exist.`,
                    );
                }
            });

            const deletedTrg = await db
                .delete(templateRecipientGroups)
                .where(eq(templateRecipientGroups.id, id))
                .returning();
            return deletedTrg[0];
        } catch {
            throw new Error("Failed to delete recipient group.");
        }
    };

    export const loadForTemplates = async (
        templateIds: number[],
    ): Promise<Types.RecipientGroupEntity[][]> => {
        if (templateIds.length === 0) return [];

        const allGroups = await Promise.all(
            templateIds.map((id) => findAllByTemplateId(id)),
        );
        return allGroups;
    };
}
