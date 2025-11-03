import React from "react";
import { NodeProps } from "@xyflow/react";

export type ContainerNodeProps = NodeProps & {
  data: {
    width: number;
    height: number;
  };
};

export const ContainerNode: React.FC<ContainerNodeProps> = ({ data }) => {
  const { width, height } = data;
  const style: React.CSSProperties = React.useMemo(() => {
    return {
      width: width,
      height: height,
      border: "2px solid #000000",
      boxSizing: "border-box",
      backgroundColor: "#f0f0f0",
    };
  }, [width, height]);
  return <div style={style}></div>;
};
