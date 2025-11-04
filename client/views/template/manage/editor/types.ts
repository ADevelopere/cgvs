import { ElementType, Template } from "@/client/graphql/generated/gql/graphql";

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
  elements: ElementNodeData[];
  container: ContainerNodeData;
};
