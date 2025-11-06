"use client";

import React, { useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import { useImageProps } from "../form/hooks/useImagePropsState";

export type ImageElementNodeData = {
  elementId: number;
};


type ImageNodeProps = NodeProps & {
  data: ImageElementNodeData;
};


const ImageNode: React.FC<ImageNodeProps> = ({ data: { elementId } }) => {
  const {imagePropsState} = useImageProps({ elementId });

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height,
        });
      };
    }
  }, [imageUrl]);

  return (
    <div
      style={{
        height: `${dimensions.height}px`,
        minHeight: `${dimensions.height}px`,
        width: `${dimensions.width}px`,
        minWidth: `${dimensions.width}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  );
};

export default ImageNode;
