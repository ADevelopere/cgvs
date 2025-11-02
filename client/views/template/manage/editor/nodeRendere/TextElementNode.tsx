"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import { useEffect } from "react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useBaseElementState, useTextPropsState } from "../form/hooks";
import { useBaseElement } from "../form/hooks/useBaseElementState";
import { useTextProps } from "../form/hooks/useTextPropsState";

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
  const {
    textPropsState,
    updateTextProps,
    pushTextPropsUpdate,
    textPropsErrors,
  } = useTextProps({
    elements,
    elementId,
  });
  const { baseElementState, updateBaseElementState, pushBaseElementUpdate } =
    useBaseElement({
      elements,
      elementId,
    });

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

  const style = {
    fontSize: `${textPropsState.fontSize ?? 16}px`,
    color: textPropsState.color ?? "#000000",
    // fontFamily: data.fontFamily ?? "Cairo",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "5px",
    backgroundColor: "white",
    width: baseElementState.width,
    height: baseElementState.height,
  };

  return (
    <div style={style}>
      <Handle type="target" position={Position.Top} />
      {"testing"}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};