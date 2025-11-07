"use client";

import React from "react";
import Image from "next/image";
import { NodeProps } from "@xyflow/react";
import { useImageProps } from "../../form/hooks/useImagePropsState";
import { useBaseElement, useImageDataSource } from "../../form/hooks";
import { NodeResizer } from '@xyflow/react';

export enum ElementImageFit {
  Contain = 'CONTAIN',
  Cover = 'COVER',
  Fill = 'FILL'
}

/**
 * Maps ElementImageFit enum values to CSS object-fit property values
 */
export const mapImageFitToCss = (
  fit: ElementImageFit
): "contain" | "cover" | "fill" => {
  switch (fit) {
    case ElementImageFit.Contain:
      return 'contain';
    case ElementImageFit.Cover:
      return 'cover';
    case ElementImageFit.Fill:
      return 'fill';
    default:
      return 'contain';
  }
};

export type ImageElementNodeData = {
  elementId: number;
};

type ImageNodeProps = NodeProps & {
  data: ImageElementNodeData;
};

const ImageNode: React.FC<ImageNodeProps> = ({ data: { elementId } }) => {
  const {baseElementState: { width, height }} = useBaseElement({ elementId });
  const { imageDataSourceState: source } = useImageDataSource({ elementId });
  const { imagePropsState } = useImageProps({ elementId });
  const imageUrl = source.storageFile.url;
  const fit = imagePropsState?.fit || ElementImageFit.Contain;

  return (
    <>
      <NodeResizer minWidth={10} minHeight={10} />
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          style={{
            objectFit: mapImageFitToCss(fit),
            objectPosition: 'center',
          }}
        />
      </div>
    </>
  );
};

export default ImageNode;
