import { NodeTypes } from "@xyflow/react";
import { TextElementNode } from "../nodeRenderer/TextElementNode";
import { ContainerNode } from "../nodeRenderer/ContainerNode";

export const nodeTypes: NodeTypes = {
  container: ContainerNode,
  text: TextElementNode,
};
