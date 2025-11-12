import { eq } from "drizzle-orm";
import { AppLanguage } from "@/lib/enum";
import { ElementUtils } from "../../utils/element/element.utils";
import { TemplateRepository } from "./template.repository";
import {
  TemplateConfig,
  TemplateConfigInput,
  TemplateConfigInsert,
  TemplateConfigUpdateInput,
} from "@/server/types/templateConfig.types";
import { templateConfig } from "../schema";
import { db } from "../drizzleDb";

// Changed from object literal to namespace pattern
export namespace TemplateConfigRepository {
  /**
   * Finds a template config by its ID.
   * @param id - The ID of the template config.
   * @returns The template config, or undefined if not found.
   */
  export async function findById(id: number): Promise<TemplateConfig | null> {
    const [result] = await db.select().from(templateConfig).where(eq(templateConfig.id, id)).limit(1);

    if (!result) {
      return null;
    }
    // Cast language to AppLanguage as per user's type definition
    return { ...result, language: result.language as AppLanguage };
  }

  /**
   * Finds all template configs for a given template ID.
   * @param templateId - The ID of the template.
   * @returns An array of template configs.
   */
  export async function findByTemplateId(templateId: number): Promise<TemplateConfig | null> {
    const template = await TemplateRepository.findById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found.`);
    }
    const [result] = await db.select().from(templateConfig).where(eq(templateConfig.templateId, templateId));
    if (!result) {
      return null;
    }
    // Cast locale to CountryCode for each item
    return {
      ...result,
      language: result.language as AppLanguage,
    };
  }

  /**
   * Creates a new template config.
   * @param input - The data for the new template config.
   * @returns The created template config.
   */
  export async function create(input: TemplateConfigInput): Promise<TemplateConfig> {
    // 1. Check if template exists
    const template = await TemplateRepository.findById(input.templateId);
    if (!template) {
      throw new Error(`Template with ID ${input.templateId} not found.`);
    }

    // 2. Dimensions validation
    const dimError = await ElementUtils.validateDimensions(input.width, input.height);
    if (dimError) {
      throw new Error(dimError);
    }
    const insertInput: TemplateConfigInsert = {
      templateId: template.id,
      width: input.width,
      height: input.height,
      language: input.language,
    };

    // 3. Insert into DB
    const [newConfig] = await db.insert(templateConfig).values(insertInput).returning();

    if(!newConfig) throw new Error("Failed to create template config.")

    return { ...newConfig, language: newConfig.language as AppLanguage };
  }

  /**
   * Updates an existing template config by its ID.
   * @param input - The data to update.
   * @returns The updated template config.
   */
  export async function update(input: TemplateConfigUpdateInput): Promise<TemplateConfig> {
    const { id, ...updateData } = input;

    // 1. Check if config exists
    const existingConfig = await findById(id); // No longer uses 'this'
    if (!existingConfig) {
      throw new Error(`TemplateConfig with ID ${id} not found.`);
    }

    // 2. Dimensions validation
    const width = updateData.width ?? existingConfig.width;
    const height = updateData.height ?? existingConfig.height;
    const dimError = await ElementUtils.validateDimensions(width, height);
    if (dimError) {
      throw new Error(dimError);
    }

    // 3. Update in DB
    const [updatedConfig] = await db
      .update(templateConfig)
      .set(updateData)
      .where(eq(templateConfig.id, id))
      .returning();

    if (!updatedConfig) {
      throw new Error(`Failed to update template config with ID ${id}.`);
    }

    return {
      ...updatedConfig,
      language: updatedConfig.language as AppLanguage,
    };
  }
}
