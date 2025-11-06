"use client";

import React, { useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import { useImageProps } from "../form/hooks/useImagePropsState";
import { useImageDataSource } from "../form/hooks";
import logger from "@/client/lib/logger";

export type ImageElementNodeData = {
  elementId: number;
  width: number;
  height: number;
};

type ImageNodeProps = NodeProps & {
  data: ImageElementNodeData;
};

const ImageNode: React.FC<ImageNodeProps> = ({ data: { elementId, width, height } }) => {
  logger.debug("Rendering ImageNode", { elementId, width, height });
  const { imageDataSourceState: source } = useImageDataSource({ elementId });
  const { imagePropsState } = useImageProps({ elementId });
  const imageUrl = source.storageFile.url;
  logger.debug("ImageNode source", { imageUrl, source });

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
  }, [imageUrl]);

  return (
    <div
      style={{
        height: `${height}px`,
        minHeight: `${height}px`,
        width: `${width}px`,
        minWidth: `${width}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${imagePropsState?.fit || "contain"}`,
        backgroundPosition: "center",
      }}
    ></div>
  );
};

export default ImageNode;
