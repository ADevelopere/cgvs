import { NodeTypes } from "@xyflow/react";
import { TextElementNode } from "../nodeRenderer/TextElementNode";
import { ContainerNode } from "../nodeRenderer/ContainerNode";
import ImageNode from "../nodeRenderer/ImageNode";

export const nodeTypes: NodeTypes = {
  container: ContainerNode,
  text: TextElementNode,
  image: ImageNode,
};
