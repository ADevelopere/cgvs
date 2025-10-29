import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { TextElementObject } from "./text.element.pothos";
import { DateElementObject } from "./date.element.pothos";
import { NumberElementObject } from "./number.element.pothos";
import { CountryElementObject } from "./country.element.pothos";
import { GenderElementObject } from "./gender.element.pothos";
import { ImageElementObject } from "./image.element.pothos";
import { QRCodeElementObject } from "./qrcode.element.pothos";

/**
 * GraphQL Union for all Certificate Element types
 * Used for queries that return elements without knowing their specific type
 */
export const CertificateElementUnion = gqlSchemaBuilder.unionType(
  "CertificateElementUnion",
  {
    types: [
      TextElementObject,
      DateElementObject,
      NumberElementObject,
      CountryElementObject,
      GenderElementObject,
      ImageElementObject,
      QRCodeElementObject,
    ],
    resolveType: element => {
      switch (element.type) {
        case Types.ElementType.TEXT:
          return "TextElement";
        case Types.ElementType.DATE:
          return "DateElement";
        case Types.ElementType.NUMBER:
          return "NumberElement";
        case Types.ElementType.COUNTRY:
          return "CountryElement";
        case Types.ElementType.GENDER:
          return "GenderElement";
        case Types.ElementType.IMAGE:
          return "ImageElement";
        case Types.ElementType.QR_CODE:
          return "QRCodeElement";
        default:
          throw new Error(`Unknown element type: ${element.type}`);
      }
    },
  }
);

