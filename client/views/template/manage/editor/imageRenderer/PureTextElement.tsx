import React from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { getFlexAlignment } from "../nodeRenderer/utils";

export interface PureTextElementProps {
  base: GQL.CertificateElementBase;
  textProps: GQL.TextProps;
  textContent: string;
  fontFamily: string;
}

/**
 * Pure stateless text element renderer
 * No hooks, no context - just props in, JSX out
 */
export const PureTextElement: React.FC<PureTextElementProps> = ({
  base,
  textProps,
  textContent,
  fontFamily,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: base.positionX,
    top: base.positionY,
    width: base.width,
    height: base.height,
    fontSize: textProps.fontSize,
    fontFamily: fontFamily,
    color: textProps.color,
    overflow: "hidden",
    textOverflow:
      textProps.overflow === GQL.ElementOverflow.Ellipse
        ? "ellipsis"
        : "clip",
    whiteSpace: "nowrap",
    zIndex: base.renderOrder,
    ...getFlexAlignment(base.alignment),
  };

  if (base.hidden) {
    return null;
  }

  return <div style={style}>{textContent}</div>;
};
