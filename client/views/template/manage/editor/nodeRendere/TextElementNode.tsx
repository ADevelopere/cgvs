"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useBaseElement } from "../form/hooks/useBaseElementState";
import { useTextProps } from "../form/hooks/useTextPropsState";
import { logger } from "@/client/lib/logger";

export type TextElementNodeData = {
  // templateId: number;
  elementId: number;
  elements: GQL.CertificateElementUnion[];
};

type TextElementNodeProps = NodeProps & {
  data: TextElementNodeData;
};

export const TextElementNode = ({ data }: TextElementNodeProps) => {
  const { elements, elementId } = data;
  const { textPropsState } = useTextProps({ elements, elementId });
  const { baseElementState } = useBaseElement({ elements, elementId });

  logger.log("TextElementNode render:", {
    elementId,
    textPropsState,
    baseElementState,
  });

  if (!textPropsState || !baseElementState) {
    return <div>Loading...</div>;
  }

  // useEffect(() => {
  //   // Load Google Fonts dynamically
  //   const link = document.createElement("link");
  //   link.href =
  //     "https://fonts.googleapis.com/css2?family=Cairo&family=Reem+Kufi+Ink&display=swap";
  //   link.rel = "stylesheet";
  //   document.head.appendChild(link);

  //   return () => {
  //     document.head.removeChild(link);
  //   };
  // }, []);

  const style: React.CSSProperties = {
    fontSize: textPropsState.fontSize,
    color: textPropsState.color ?? "#941717ff",
    // fontFamily: data.fontFamily ?? "Cairo",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "5px",
    backgroundColor: "white",
    width: baseElementState.width,
    height: baseElementState.height,
    overflow: "hidden",
    textOverflow: textPropsState.overflow === GQL.ElementOverflow.Ellipse ? "ellipsis" : "clip",
    textWrap: "nowrap"
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} />
      {"testingtestingtestingtestingtestingtestingtestingtesting"}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
