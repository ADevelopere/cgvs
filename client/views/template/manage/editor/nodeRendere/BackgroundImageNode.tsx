"use client";

import React, { useEffect, useState } from "react";
import { NodeProps, Node } from "@xyflow/react";

// A4 landscape dimensions in pixels (297mm × 210mm at 96 DPI)
const A4_WIDTH = 1123; // 297mm * 96px/25.4mm
const A4_HEIGHT = 794; // 210mm * 96px/25.4mm

const BackgroundImageNode: React.FC<NodeProps<Node<{ imageUrl: string }>>> = ({ data: { imageUrl } }) => {
  const [dimensions, setDimensions] = useState({
    width: A4_WIDTH,
    height: A4_HEIGHT,
  });

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
        backgroundImage: `url(${
          imageUrl 
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  );
};

export default BackgroundImageNode;
