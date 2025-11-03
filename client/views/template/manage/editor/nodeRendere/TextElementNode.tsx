"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useBaseElement } from "../form/hooks/useBaseElementState";
import { useTextProps } from "../form/hooks/useTextPropsState";
import { logger } from "@/client/lib/logger";
import React from "react";
import { FontFamily, getFontByFamily, GoogleFontItem } from "@/lib/font/google";
import WebFont from "webfontloader";

export type TextElementNodeData = {
  // templateId: number;
  elementId: number;
  elements: GQL.CertificateElementUnion[];
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

export const TextElementNode = ({ data }: TextElementNodeProps) => {
  const { elementId, elements } = data;
  const { textPropsState } = useTextProps({ elementId, elements });
  logger.log("[TextElementNode] textPropsState", JSON.stringify({ elementId, textPropsState }));
  const { baseElementState } = useBaseElement({ elements:data.elements, elementId });

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

  if (!textPropsState || !baseElementState) {
    return <div>Loading...</div>;
  }

  const style: React.CSSProperties = {
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
    textWrap: "nowrap",
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} />
      {"testingtestingtestingtestingtestingtestingtestingtesting"}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
