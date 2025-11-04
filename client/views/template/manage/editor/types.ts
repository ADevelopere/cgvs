import { ElementType, Template } from "@/client/graphql/generated/gql/graphql";
import {Node } from "@xyflow/react";

export type ElementNodeData = {
  id: number;
  type: ElementType;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
};

export type ContainerNodeData = {
  width: number;
  height: number;
};

export type FlowEditorProps = {
  template: Template;
  nodes: Node[];
};
