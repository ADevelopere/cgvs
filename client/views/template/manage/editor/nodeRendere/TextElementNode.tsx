"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useBaseElement } from "../form/hooks/useBaseElementState";
import { useTextProps } from "../form/hooks/useTextPropsState";
import { logger } from "@/client/lib/logger";
import React from "react";
import { FontFamily, getFontByFamily, GoogleFontItem } from "@/lib/font/google";
import WebFont from "webfontloader";
import { ElementAlignment } from "@/client/graphql/generated/gql/graphql";

export type TextElementNodeData = {
  // templateId: number;
  elementId: number;
};

type TextElementNodeProps = NodeProps & {
  data: TextElementNodeData;
};

// Helper to format the font string
function getFontFamilyString(fontItem: GoogleFontItem): string | null {
  if (!fontItem) return null;
  const variants = fontItem.variants.join(",");
  return `${fontItem.family}:${variants}`;
}

/**
 * 2. The new getFlexAlignment function
 * Takes a single ElementAlignment value and returns the
 * correct flexbox properties.
 */
const getFlexAlignment = (alignment: ElementAlignment): React.CSSProperties => {
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

export const TextElementNode = ({ data }: TextElementNodeProps) => {
  const { elementId } = data;
  const { textPropsState } = useTextProps({ elementId });
  logger.log(
    "[TextElementNode] textPropsState",
    JSON.stringify({ elementId, textPropsState })
  );
  const { baseElementState } = useBaseElement({
    elementId,
  });

  const [fontFamily, setFontFamily] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (textPropsState.fontRef.google?.identifier) {
      const family = textPropsState.fontRef.google.identifier;
      logger.log("Loading font family:", family);
      const fontFamily = family as FontFamily;
      logger.log("Resolved font family:", fontFamily);
      const font = getFontByFamily(family as FontFamily);

      if (font) {
        setFontFamily(family);
        const fontFamily = getFontFamilyString(font);
        logger.log("Loading font:", fontFamily);

        if (fontFamily) {
          WebFont.load({
            google: {
              families: [fontFamily],
            },
            active: () => {
              logger.info(`Font ${font.family} is active!`);
              // You can set a state here to update your UI
            },
          });
        }
      }
    }
  }, [textPropsState.fontRef.google?.identifier]);



  const style: React.CSSProperties = React.useMemo(() => {
    return {
      fontSize: textPropsState.fontSize,
      fontFamily: fontFamily ?? "Cairo",
      color: textPropsState.color ?? "#941717ff",
      // fontFamily: data.fontFamily ?? "Cairo",
      padding: "10px",
      border: "1px solid #eee",
      borderRadius: "5px",
      backgroundColor: "white",
      width: baseElementState.width,
      height: baseElementState.height,
      overflow: "hidden",
      textOverflow:
        textPropsState.overflow === GQL.ElementOverflow.Ellipse
          ? "ellipsis"
          : "clip",
      whiteSpace: "nowrap",
      // Add a transition to make changes smooth
      transition: "all 0.3s ease",
      ...getFlexAlignment(baseElementState.alignment),
    };
  }, [textPropsState, baseElementState, fontFamily]);
  
  if (!textPropsState || !baseElementState) {
    return <div>Loading...</div>;
  }
  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} />
      {"testingtestingtestingtestingtestingtestingtestingtesting"}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
