import { NodeProps } from "@xyflow/react";
import { ContainerNodeData } from "../types";

type ContainerNodeProps = NodeProps & {
  data: ContainerNodeData;
};

export const ContainerNode: React.FC<ContainerNodeProps> = ({ data }) => {
    return (<div
        style={{
            width: data.width,
            height: data.height,
            border: "2px solid #ffffffff",
            boxSizing: "border-box",
            backgroundColor: "transparent",
        }}
    >   
    </div>)
};