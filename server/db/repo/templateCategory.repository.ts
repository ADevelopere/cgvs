import { db } from "@/server/db/drizzleDb";
import { eq, inArray, max, isNull, count, and, not, or, ilike } from "drizzle-orm";
import { templateCategories, templates } from "@/server/db/schema";
import {
  TemplateCategoryCreateInput,
  TemplateCategoryInsertInput,
  TemplateCategorySelectType,
  TemplateCategoryUpdateInput,
  TemplateCategoryWithParentTree,
} from "@/server/types";
import { TemplateCategoryUtils } from "@/server/utils";
import logger from "@/server/lib/logger";

export namespace TemplateCategoryRepository {
  export const findById = async (id?: number | null): Promise<TemplateCategorySelectType | null> => {
    if (!id) return null;
    const category = await db
      .select()
      .from(templateCategories)
      .where(eq(templateCategories.id, id))
      .then(res => res[0]);
    return category || null;
  };

  export const findAll = async (): Promise<TemplateCategorySelectType[]> => {
    return db.select().from(templateCategories).orderBy(templateCategories.order);
  };

  export const existsById = async (id: number): Promise<boolean> => {
    return (await db.$count(templateCategories, eq(templateCategories.id, id))) > 0;
  };

  export const findCategoryChildren = async (
    parentCategoryId?: number | null
  ): Promise<TemplateCategorySelectType[]> => {
    if (!parentCategoryId) {
      return db
        .select()
        .from(templateCategories)
        .where(
          and(
            isNull(templateCategories.parentCategoryId),
            or(isNull(templateCategories.specialType), not(eq(templateCategories.specialType, "Suspension")))
          )
        )
        .orderBy(templateCategories.order);
    }

    await existsById(parentCategoryId).then(exists => {
      if (!exists) {
        throw new Error(`Category with ID ${parentCategoryId} does not exist.`);
      }
    });

    return db
      .select()
      .from(templateCategories)
      .where(eq(templateCategories.parentCategoryId, parentCategoryId))
      .orderBy(templateCategories.order);
  };

  export const loadByIds = async (ids: number[]): Promise<(TemplateCategorySelectType | Error)[]> => {
    if (ids.length === 0) return [];
    const filteredCategories = await db.select().from(templateCategories).where(inArray(templateCategories.id, ids));

    const categories: (TemplateCategorySelectType | Error)[] = ids.map(id => {
      const matchingCategory: TemplateCategorySelectType | undefined = filteredCategories.find(c => c.id === id);
      if (!matchingCategory) return new Error(`TemplateCategory ${id} not found`);
      return matchingCategory;
    });
    return categories;
  };

  export const loadSubForParents = async (parentCategoryIds: number[]): Promise<TemplateCategorySelectType[][]> => {
    if (parentCategoryIds.length === 0) return [];
    const subCategories = await db
      .select()
      .from(templateCategories)
      .where(inArray(templateCategories.parentCategoryId, parentCategoryIds))
      .orderBy(templateCategories.order);

    return parentCategoryIds.map(parentId => subCategories.filter(cat => cat.parentCategoryId === parentId));
  };

  export const findTemplatesMainCategory = async (): Promise<TemplateCategorySelectType> => {
    const [category] = await db.select().from(templateCategories).where(eq(templateCategories.specialType, "Main"));
    if (!category) {
      throw new Error("Main category not found.");
    }
    return category;
  };

  export const findTemplatesSuspensionCategory = async (): Promise<TemplateCategorySelectType> => {
    const [category] = await db
      .select()
      .from(templateCategories)
      .where(eq(templateCategories.specialType, "Suspension"));
    if (!category) {
      throw new Error("Suspension category not found.");
    }
    return category;
  };

  export const create = async (input: TemplateCategoryCreateInput): Promise<TemplateCategorySelectType> => {
    TemplateCategoryUtils.validateName(input.name);

    let newOrder: number;

    // Validate parent category ID if provided
    if (input.parentCategoryId != null) {
      const parentCategoryId = input.parentCategoryId;
      if (parentCategoryId <= 0) {
        throw new Error("Parent category ID must be a positive integer.");
      }

      // Check if the parent category exists
      const existingParentCategory = await findById(parentCategoryId);
      if (!existingParentCategory) {
        throw new Error(`Parent category with ID ${input.parentCategoryId} does not exist.`);
      }

      // Validate not suspension category
      if (existingParentCategory.specialType === "Suspension") {
        throw new Error("Cannot create a category under the suspension category.");
      }

      // Find the new category order by getting the max order of the parent category
      const maxOrderResult = await findTemplateCategoryMaxOrderByParentCategoryId(parentCategoryId);
      newOrder = maxOrderResult + 1;
    } else {
      // For root categories (no parent)
      const maxOrderResult = await findTemplateCategoryMaxOrderByParentCategoryId(null);
      newOrder = maxOrderResult + 1;
    }

    const inputData: TemplateCategoryInsertInput = {
      name: input.name,
      description: input.description,
      parentCategoryId: input.parentCategoryId,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create the category
    const [category] = await db.insert(templateCategories).values(inputData).returning();

    if (!category) {
      throw new Error("Failed to create category.");
    }

    return category;
  };

  export const update = async (input: TemplateCategoryUpdateInput): Promise<TemplateCategorySelectType> => {
    const existingCategory = await findById(input.id);
    if (!existingCategory) {
      throw new Error(`Category with ID ${input.id} does not exist.`);
    }

    TemplateCategoryUtils.validateName(input.name);

    const newParentCategoryId = input.parentCategoryId;

    // Validate parent category ID if provided
    if (newParentCategoryId) {
      // Check if the parent category exists
      const existingParentCategory = await findById(newParentCategoryId);
      if (!existingParentCategory) {
        throw new Error(`Parent category with ID ${newParentCategoryId} does not exist.`);
      }

      // Validate not suspension category
      if (existingParentCategory.specialType === "Suspension") {
        throw new Error("Cannot set the parent category to the suspension category.");
      }

      // check if the parent category is not the same as the current category
      if (newParentCategoryId === existingCategory.id) {
        throw new Error("A category cannot be its own parent.");
      }
    }

    let newOrder = existingCategory.order;
    if (existingCategory.parentCategoryId !== newParentCategoryId) {
      // Parent category changed, need to recalculate order
      if (newParentCategoryId != null) {
        const maxOrderResult = await findTemplateCategoryMaxOrderByParentCategoryId(newParentCategoryId);
        newOrder = maxOrderResult + 1;
      } else {
        // For root categories (no parent)
        const maxOrderResult = await findTemplateCategoryMaxOrderByParentCategoryId(null);
        newOrder = maxOrderResult + 1;
      }
    }

    const inputData: TemplateCategoryInsertInput = {
      name: input.name,
      description: input.description,
      parentCategoryId: input.parentCategoryId,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [updatedCategory] = await db
      .update(templateCategories)
      .set(inputData)
      .where(eq(templateCategories.id, input.id))
      .returning();

    return updatedCategory;
  };

  export const createMainCategoryIfNotExisting = async (): Promise<TemplateCategorySelectType> => {
    const [existingMainCategory] = await await db
      .select()
      .from(templateCategories)
      .where(eq(templateCategories.specialType, "Main"));
    if (existingMainCategory) return existingMainCategory;

    const now = new Date();
    const input: TemplateCategoryInsertInput = {
      name: "قوالب غير مصنفة",
      specialType: "Main",
      parentCategoryId: null,
      order: 1,
      createdAt: now,
      updatedAt: now,
    };
    try {
      const [mainCategory] = await db.insert(templateCategories).values(input).returning();

      return mainCategory;
    } catch (err) {
      logger.error(err);
      throw new Error("Failed to create the main category");
    }
  };

  export const createSuspensionCategoryIfNotExisting = async (): Promise<TemplateCategorySelectType> => {
    const [existingSuspensionCategory] = await db
      .select()
      .from(templateCategories)
      .where(eq(templateCategories.specialType, "Suspension"));
    if (existingSuspensionCategory) return existingSuspensionCategory;

    const now = new Date();
    const input: TemplateCategoryInsertInput = {
      name: "فئة القوالب المحذوفة",
      specialType: "Suspension",
      parentCategoryId: null,
      order: 2,
      createdAt: now,
      updatedAt: now,
    };
    try {
      const [suspensionCategory] = await db.insert(templateCategories).values(input).returning();

      return suspensionCategory;
    } catch (err) {
      logger.error(err);
      throw new Error("Failed to create the Suspension category");
    }
  };

  export const deleteById = async (id: number): Promise<TemplateCategorySelectType> => {
    const existingCategory = await findById(id);

    if (!existingCategory) {
      throw new Error(`Category with ID ${id} does not exist.`);
    }

    // Prevent deletion of special categories
    if (existingCategory.specialType === "Main") {
      throw new Error("Cannot delete the main category.");
    } else if (existingCategory.specialType === "Suspension") {
      throw new Error("Cannot delete the suspension category.");
    }

    // Check if the category has sub-categories
    const subCategoryCountResult = await db
      .select({ count: count() })
      .from(templateCategories)
      .where(eq(templateCategories.parentCategoryId, id))
      .then(res => res[0]);

    if (subCategoryCountResult.count > 0) {
      throw new Error(
        "Cannot delete category with existing sub-categories. Please remove or reassign sub-categories first."
      );
    }

    // Check if the category has templates
    const templateCountResult = await db
      .select({ count: count() })
      .from(templates)
      .where(eq(templates.categoryId, id))
      .then(res => res[0]);

    if (templateCountResult.count > 0) {
      throw new Error("Cannot delete category with existing templates. Please remove or reassign templates first.");
    }

    // Proceed to delete the category
    const [deletedCategory] = await db.delete(templateCategories).where(eq(templateCategories.id, id)).returning();

    return deletedCategory;
  };

  export const findTemplateCategoryMaxOrderByParentCategoryId = async (
    parentCategoryId: number | null
  ): Promise<number> => {
    const [{ maxOrder }] = await db
      .select({ maxOrder: max(templateCategories.order) })
      .from(templateCategories)
      .where(
        parentCategoryId === null
          ? isNull(templateCategories.parentCategoryId)
          : eq(templateCategories.parentCategoryId, parentCategoryId)
      );

    // if root categories, then max order to start with is 2, (1, 2) reserved for main and suspenstion categories
    return maxOrder ?? (parentCategoryId ? 0 : 2);
  };

  export const searchByName = async (
    searchTerm: string,
    limit: number = 10,
    includeParentTree: boolean = false
  ): Promise<TemplateCategoryWithParentTree[]> => {
    // Search for categories by name, excluding Suspension category
    const categories = await db
      .select()
      .from(templateCategories)
      .where(
        and(
          ilike(templateCategories.name, `%${searchTerm}%`),
          or(isNull(templateCategories.specialType), not(eq(templateCategories.specialType, "Suspension")))
        )
      )
      .orderBy(templateCategories.name)
      .limit(limit);

    // Build parent tree for each category if requested
    const result: TemplateCategoryWithParentTree[] = [];

    for (const category of categories) {
      const parentTree: number[] = [];

      if (includeParentTree) {
        // Start with current category ID
        parentTree.push(category.id);

        // Traverse up to build parent tree
        let currentParentId = category.parentCategoryId;
        while (currentParentId !== null) {
          parentTree.push(currentParentId);
          const parent = await findById(currentParentId);
          if (!parent) break;
          currentParentId = parent.parentCategoryId;
        }
      }

      result.push({
        ...category,
        parentTree,
      });
    }

    return result;
  };
}
