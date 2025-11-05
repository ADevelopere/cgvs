import { GoogleFontItem } from "@/lib/font/google";
import { ElementAlignment } from "@/client/graphql/generated/gql/graphql";

// Helper to format the font string
export function getFontFamilyString(fontItem: GoogleFontItem): string | null {
  if (!fontItem) return null;
  const variants = fontItem.variants.join(",");
  return `${fontItem.family}:${variants}`;
}

/**
 * 2. The new getFlexAlignment function
 * Takes a single ElementAlignment value and returns the
 * correct flexbox properties.
 */
export const getFlexAlignment = (
  alignment: ElementAlignment
): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    display: "flex",
  };

  switch (alignment) {
    // --- Top Aligned ---
    case ElementAlignment.TopCenter:
      return {
        ...baseStyles,
        alignItems: "flex-start",
        justifyContent: "center",
      };
    case ElementAlignment.TopEnd:
      return {
        ...baseStyles,
        alignItems: "flex-start",
        justifyContent: "flex-end",
      };

    // --- Center Aligned ---
    case ElementAlignment.CenterStart:
      return {
        ...baseStyles,
        alignItems: "center",
        justifyContent: "flex-start",
      };
    case ElementAlignment.Center: // This is CenterCenter
      return { ...baseStyles, alignItems: "center", justifyContent: "center" };
    case ElementAlignment.CenterEnd:
      return {
        ...baseStyles,
        alignItems: "center",
        justifyContent: "flex-end",
      };

    // --- Bottom Aligned ---
    case ElementAlignment.BottomStart:
      return {
        ...baseStyles,
        alignItems: "flex-end",
        justifyContent: "flex-start",
      };
    case ElementAlignment.BottomCenter:
      return {
        ...baseStyles,
        alignItems: "flex-end",
        justifyContent: "center",
      };
    case ElementAlignment.BottomEnd:
      return {
        ...baseStyles,
        alignItems: "flex-end",
        justifyContent: "flex-end",
      };

    // --- Baseline Aligned ---
    case ElementAlignment.BaselineStart:
      return {
        ...baseStyles,
        alignItems: "baseline",
        justifyContent: "flex-start",
      };
    case ElementAlignment.BaselineCenter:
      return {
        ...baseStyles,
        alignItems: "baseline",
        justifyContent: "center",
      };
    case ElementAlignment.BaselineEnd:
      return {
        ...baseStyles,
        alignItems: "baseline",
        justifyContent: "flex-end",
      };

    // --- Default Case ---
    case ElementAlignment.TopStart:
    default:
      return {
        ...baseStyles,
        alignItems: "flex-start",
        justifyContent: "flex-start",
      };
  }
};
