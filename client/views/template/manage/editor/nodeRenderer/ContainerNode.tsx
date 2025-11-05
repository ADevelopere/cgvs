import { NodeProps } from "@xyflow/react";
import { ContainerNodeData } from "../types";

type ContainerNodeProps = NodeProps & {
  data: ContainerNodeData;
};

export const ContainerNode: React.FC<ContainerNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        width: data.width ?? 100,
        height: data.height ?? 100,
        border: "2px solid #ffffffff",
        boxSizing: "border-box",
        backgroundColor: "transparent",
      }}
    ></div>
  );
};
