import React, { useEffect, useState } from "react";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { NodeProps } from "@xyflow/react";

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
        if (template?.image_url) {
            const img = new Image();
            img.src = template.image_url;
            img.onload = () => {
                setDimensions({
                    width: img.width,
                    height: img.height,
                });
            };
        }
    }, [template?.image_url]);
    return (
        <div
            style={{
                height: `${dimensions.height}px`,
                minHeight: `${dimensions.height}px`,
                width: `${dimensions.width}px`,
                minWidth: `${dimensions.width}px`,
                image: `url(${template?.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        ></div>
    );
};

export default BackgroundImageNode;
