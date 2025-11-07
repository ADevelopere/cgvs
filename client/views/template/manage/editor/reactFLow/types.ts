import { ElementType } from "@/client/graphql/generated/gql/graphql";

export type ElementBaseNodeData = {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  zIndex: number;
};

export type ElementNodeData = ElementBaseNodeData & {
  id: number;
  type: ElementType;
};

export type ContainerNodeData = {
  width: number;
  height: number;
};