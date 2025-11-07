import * as GQL from "@/client/graphql/generated/gql/graphql";

/**
 * Collect all unique font families from text elements
 * Complexity: 4 (loop + conditional + set operations)
 */
export function collectFontFamilies(elements: GQL.CertificateElementUnion[]): string[] {
  const families = new Set<string>();
  
  for (const el of elements) {
    if (el.__typename === "TextElement") {
      const fontFamily = extractFontFamily(el.textProps.fontRef);
      families.add(fontFamily);
    }
  }
  
  return Array.from(families);
}

/**
 * Extract font family identifier from font reference
 * Complexity: 3 (conditional checks)
 */
export function extractFontFamily(fontRef: GQL.FontReference): string {
  if (fontRef.__typename === "FontReferenceGoogle" && fontRef.identifier) {
    return fontRef.identifier;
  }
  return "Roboto";
}

/**
 * Get font family from text element with fallback
 * Complexity: 2 (conditional)
 */
export function getFontFamilyFromElement(element: GQL.TextElement): string {
  return extractFontFamily(element.textProps.fontRef);
}
