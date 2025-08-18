"use client";

import React, { useEffect, useState } from "react";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { NodeProps } from "@xyflow/react";
import { TEMPLATE_IMAGE_PLACEHOLDER_URL } from "@/utils/templateImagePlaceHolder";

// A4 landscape dimensions in pixels (297mm × 210mm at 96 DPI)
const A4_WIDTH = 1123; // 297mm * 96px/25.4mm
const A4_HEIGHT = 794; // 210mm * 96px/25.4mm

const BackgroundImageNode: React.FC<NodeProps> = () => {
    const { template } = useTemplateManagement();
    const [dimensions, setDimensions] = useState({
        width: A4_WIDTH,
        height: A4_HEIGHT,
    });

    useEffect(() => {
        if (template?.imageUrl) {
            const img = new Image();
            img.src = template.imageUrl;
            img.onload = () => {
                setDimensions({
                    width: img.width,
                    height: img.height,
                });
            };
        }
    }, [template?.imageUrl]);

    return (
        <div
            style={{
                height: `${dimensions.height}px`,
                minHeight: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                minWidth: `${dimensions.width}px`,
                backgroundImage: `url(${
                template?.imageUrl ??
                TEMPLATE_IMAGE_PLACEHOLDER_URL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        ></div>
    );
};

export default BackgroundImageNode;
