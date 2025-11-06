import type { Template, Schema } from "@pdfme/common";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { logger } from "@/client/lib/logger";

/**
 * Service for converting between CGVS element data and PDFMe template format
 * Currently supports text elements only
 */
export class TemplateConverter {
  /**
   * Convert CGVS elements and config to PDFMe Template
   */
  static toPdfmeTemplate(
    elements: GQL.CertificateElementUnion[],
    config: GQL.TemplateConfig
  ): Template {
    logger.debug("TemplateConverter: Converting to PDFMe template", {
      elementCount: elements.length,
      configWidth: config.width,
      configHeight: config.height,
    });

    // Convert elements to schemas
    const schemas: Schema[] = [];

    for (const element of elements) {
      // Only process text elements for now
      if (element.base.type === GQL.ElementType.Text) {
        const schema = this.textElementToSchema(element as GQL.TextElement);
        if (schema) {
          schemas.push(schema);
        }
      }
    }

    // Sort schemas by render order
    schemas.sort((a, b) => {
      const orderA = (a as Schema & { renderOrder?: number }).renderOrder ?? 0;
      const orderB = (b as Schema & { renderOrder?: number }).renderOrder ?? 0;
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

    logger.debug("TemplateConverter: Template created", {
      schemaCount: schemas.length,
    });

    return template;
  }

  /**
   * Convert a text element to PDFMe schema
   */
  private static textElementToSchema(
    element: GQL.TextElement
  ): Schema | null {
    try {
      const { base, textProps, textDataSource } = element;

      // Get text content from data source
      const content = this.getTextContent(textDataSource);

      // Convert alignment
      const alignment = this.convertAlignment(base.alignment);

      // Create schema
      const schema: Schema & { renderOrder?: number } = {
        type: "text",
        position: {
          x: base.positionX,
          y: base.positionY,
        },
        width: base.width,
        height: base.height,
        alignment,
        fontSize: textProps.fontSize,
        fontColor: textProps.color,
        // Store element ID for reverse mapping
        name: base.id.toString(),
        // Store render order for sorting
        renderOrder: base.renderOrder,
      };

      // Add font name if available
      if (textProps.fontRef) {
        schema.fontName = this.convertFontRef(textProps.fontRef);
      }

      logger.debug("TemplateConverter: Text schema created", {
        elementId: base.id,
        content: content.substring(0, 50),
      });

      return schema;
    } catch (error) {
      logger.error("TemplateConverter: Failed to convert text element", {
        elementId: element.base.id,
        error,
      });
      return null;
    }
  }

  /**
   * Get text content from data source
   */
  private static getTextContent(dataSource: GQL.TextDataSource): string {
    if ("value" in dataSource && dataSource.value) {
      return dataSource.value;
    }

    // For non-static data sources, return placeholder
    if ("certificateField" in dataSource && dataSource.certificateField) {
      return `{${dataSource.certificateField}}`;
    }

    if ("studentField" in dataSource && dataSource.studentField) {
      return `{${dataSource.studentField}}`;
    }

    if ("textVariableId" in dataSource && dataSource.textVariableId) {
      return `{Variable ${dataSource.textVariableId}}`;
    }

    if ("selectVariableId" in dataSource && dataSource.selectVariableId) {
      return `{Variable ${dataSource.selectVariableId}}`;
    }

    return "";
  }

  /**
   * Convert CGVS alignment to PDFMe alignment
   */
  private static convertAlignment(
    alignment: GQL.ElementAlignment
  ): "left" | "center" | "right" {
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
  private static convertFontRef(fontRef: GQL.FontReference): string {
    // Handle Google fonts
    if ("identifier" in fontRef && fontRef.identifier) {
      return fontRef.identifier;
    }

    // Handle self-hosted fonts
    if ("fontId" in fontRef && fontRef.fontId) {
      // TODO: Implement proper font mapping for self-hosted fonts
      return `font-${fontRef.fontId}`;
    }

    return "sans-serif";
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

    logger.debug("TemplateConverter: Extracting element updates", {
      schemaCount: newTemplate.schemas[0]?.length ?? 0,
      elementCount: currentElements.length,
    });

    // Get schemas from first page
    const schemas = newTemplate.schemas[0] || [];

    for (const schema of schemas) {
      // Get element ID from schema name
      const elementId = parseInt(schema.name || "0", 10);
      if (isNaN(elementId) || elementId === 0) {
        continue;
      }

      // Find corresponding element
      const element = currentElements.find((e) => e.base.id === elementId);
      if (!element) {
        logger.warn("TemplateConverter: Element not found for schema", {
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
      if (
        schema.height !== undefined &&
        schema.height !== element.base.height
      ) {
        update.height = schema.height;
      }

      // Only add to map if there are actual updates
      if (Object.keys(update).length > 0) {
        updates.set(elementId, update);
        logger.debug("TemplateConverter: Element update detected", {
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
