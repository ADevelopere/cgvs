import { ElementType, Template } from "@/client/graphql/generated/gql/graphql";
import { Node } from "@xyflow/react";

export type ElementBaseNodeData = {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
};

export type ElementNodeData = ElementBaseNodeData & {
  id: number;
  type: ElementType;
};

export type ContainerNodeData = {
  width: number;
  height: number;
};

export type FlowEditorProps = {
  template: Template;
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
};
