import type { Template, Schema } from "@pdfme/common";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { logger } from "@/client/lib/logger";
import { UseBaseElementStateReturn, UseTextPropsStateReturn, UseTextDataSourceStateReturn } from "../../form/hooks";

const dumpVerificationCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
};

const studentEmailPreview = "example@email.com";

/**
 * Service for converting between CGVS element data and PDFMe template format
 *
 * Currently supports:
 * - Text elements (position, size, font, color, alignment)
 * - Text content display (read-only in PDFMe)
 *
 * Limitations:
 * - Text content editing in PDFMe is not synced back (would require textDataSource updates)
 * - Only text elements supported (Image, QRCode, etc. not yet implemented)
 */
export class TemplateConverter {
  /**
   * Convert CGVS elements and config to PDFMe Template
   */
  static toPdfmeTemplate(
    elements: GQL.CertificateElementUnion[],
    config: GQL.TemplateConfig,
    bases: UseBaseElementStateReturn,
    textProps: UseTextPropsStateReturn,
    textDataSource: UseTextDataSourceStateReturn
  ): Template {
    logger.debug({ caller: "TemplateConverter" }, { caller: "TemplateConverter" }, " Converting to PDFMe template", {
      elementCount: elements.length,
      configWidth: config.width,
      configHeight: config.height,
    });

    // Convert elements to schemas
    const schemas: Schema[] = [];

    for (const element of elements) {
      // Only process text elements for now
      if (element.base.type === GQL.ElementType.Text) {
        logger.debug({ caller: "TemplateConverter" }, " Processing text element", { elementId: element.base.id });
        const schema = this.textElementToSchema(element.base.id, bases, textProps, textDataSource);
        if (schema) {
          schemas.push(schema);
        }
      }
    }

    // Sort schemas by render order
    schemas.sort((a, b) => {
      const orderA = (a as Schema & { zIndex?: number }).zIndex ?? 0;
      const orderB = (b as Schema & { zIndex?: number }).zIndex ?? 0;
      return orderA - orderB;
    });

    // Create template
    const template: Template = {
      basePdf: {
        width: config.width,
        height: config.height,
        padding: [0, 0, 0, 0],
      },
      schemas: [schemas],
    };

    logger.debug({ caller: "TemplateConverter" }, " Template created", {
      schemaCount: schemas.length,
    });

    return template;
  }

  /**
   * Convert a text element to PDFMe schema
   */
  private static textElementToSchema(
    elementId: number,
    bases: UseBaseElementStateReturn,
    textProps: UseTextPropsStateReturn,
    textDataSource: UseTextDataSourceStateReturn
  ): Schema | null {
    try {
      const base = bases.baseElementStates.get(elementId) ?? bases.initBaseElementState(elementId);
      const textPropsState = textProps.textPropsStates.get(elementId) ?? textProps.initTextPropsState(elementId);
      const source =
        textDataSource.textDataSourceStates.get(elementId)?.dataSource ??
        textDataSource.initTextDataSourceState(elementId).dataSource;
      logger.debug(
        { caller: "TemplateConverter" },
        " Converting text element",
        elementId,
        base,
        textPropsState,
        source
      );
      // Get text content from data source
      const content = this.getTextContent(source);

      // Convert alignment
      const alignment = this.convertAlignment(base.alignment);

      // Create schema with text content
      const schema: Schema & { zIndex?: number } = {
        type: "text",
        content: content, // Add the actual text content
        position: {
          x: base.positionX,
          y: base.positionY,
        },
        width: base.width,
        height: base.height,
        alignment,
        fontSize: textPropsState.fontSize,
        fontColor: textPropsState.color,
        // Store element ID for reverse mapping
        id: elementId,
        name: base.name,
        // Store render order for sorting
        zIndex: base.zIndex ?? undefined,
      };

      // Add font name if available
      if (textPropsState.fontRef) {
        schema.fontName = this.convertFontRef(textPropsState.fontRef);
      }

      logger.debug({ caller: "TemplateConverter" }, " Text schema created", {
        elementId: elementId,
        content: content.substring(0, 50),
      });

      return schema;
    } catch (error) {
      logger.error({ caller: "TemplateConverter" }, " Failed to convert text element", elementId, error);
      return null;
    }
  }

  /**
   * Get text content from data source
   */
  private static getTextContent(source: GQL.TextDataSourceInput): string {
    // if ("value" in dataSource && dataSource.value) {
    //   return dataSource.value;
    // }

    // // For non-static data sources, return placeholder
    // if ("certificateField" in dataSource && dataSource.certificateField) {
    //   return `{${dataSource.certificateField}}`;
    // }

    // if ("studentField" in dataSource && dataSource.studentField) {
    //   return `{${dataSource.studentField}}`;
    // }

    // if ("textVariableId" in dataSource && dataSource.textVariableId) {
    //   return `{Variable ${dataSource.textVariableId}}`;
    // }

    // if ("selectVariableId" in dataSource && dataSource.selectVariableId) {
    //   return `{Variable ${dataSource.selectVariableId}}`;
    // }

    // return "";

    if (source.static) {
      return source.static.value;
    }
    if (source.certificateField) {
      if (source.certificateField.field === GQL.CertificateTextField.VerificationCode) {
        return dumpVerificationCode();
      }
      return `{{${source.certificateField.field}}}`;
    }
    if (source.studentField) {
      if (source.studentField.field === GQL.StudentTextField.StudentEmail) {
        return studentEmailPreview;
      }
    }
    // return textElement.textPreviewValue;
    return "";
  }

  /**
   * Convert CGVS alignment to PDFMe alignment
   */
  private static convertAlignment(alignment: GQL.ElementAlignment): "left" | "center" | "right" {
    switch (alignment) {
      case GQL.ElementAlignment.CenterStart:
      case GQL.ElementAlignment.BottomStart:
      case GQL.ElementAlignment.BaselineStart:
        return "left";
      case GQL.ElementAlignment.Center:
      case GQL.ElementAlignment.TopCenter:
      case GQL.ElementAlignment.BottomCenter:
      case GQL.ElementAlignment.BaselineCenter:
        return "center";
      case GQL.ElementAlignment.CenterEnd:
      case GQL.ElementAlignment.BottomEnd:
      case GQL.ElementAlignment.BaselineEnd:
        return "right";
      default:
        return "left";
    }
  }

  /**
   * Convert font reference to font name
   */
  private static convertFontRef(fontRef: GQL.FontReferenceInput): string {
    if (fontRef.google?.family) {
      const family = fontRef.google.family;
      if (family) {
        return family;
      } else {
        return GQL.FontFamilyName.Roboto;
      }
    } else {
      // TODO: Add support for self-hosted fonts
      return GQL.FontFamilyName.Roboto;
    }
  }

  /**
   * Extract element updates from PDFMe template changes
   * Returns a map of element ID to property updates
   */
  static extractElementUpdates(
    newTemplate: Template,
    currentElements: GQL.CertificateElementUnion[]
  ): Map<number, ElementUpdate> {
    const updates = new Map<number, ElementUpdate>();

    logger.debug({ caller: "TemplateConverter" }, " Extracting element updates", {
      schemaCount: newTemplate.schemas[0]?.length ?? 0,
      elementCount: currentElements.length,
    });

    // Get schemas from first page
    const schemas = newTemplate.schemas[0] || [];

    for (const schema of schemas) {
      // Get element ID from schema name
      const elementId = schema.id as number;
      if (isNaN(elementId) || elementId === 0) {
        continue;
      }

      // Find corresponding element
      const element = currentElements.find(e => e.base.id === elementId);
      if (!element) {
        logger.warn({ caller: "TemplateConverter" }, " Element not found for schema", {
          elementId,
        });
        continue;
      }

      // Extract updates
      const update: ElementUpdate = {};

      // Position updates
      if (schema.position) {
        if (schema.position.x !== element.base.positionX) {
          update.positionX = schema.position.x;
        }
        if (schema.position.y !== element.base.positionY) {
          update.positionY = schema.position.y;
        }
      }

      // Size updates
      if (schema.width !== undefined && schema.width !== element.base.width) {
        update.width = schema.width;
      }
      if (schema.height !== undefined && schema.height !== element.base.height) {
        update.height = schema.height;
      }

      // Only add to map if there are actual updates
      if (Object.keys(update).length > 0) {
        updates.set(elementId, update);
        logger.debug({ caller: "TemplateConverter" }, " Element update detected", {
          elementId,
          updates: Object.keys(update),
        });
      }
    }

    return updates;
  }
}

/**
 * Element update type
 */
export interface ElementUpdate {
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
}
