import React, { useEffect, useState } from "react";
import { NodeProps } from "@xyflow/react";


type ImageNodeData = {
    imageUrl: string;
};

type ImageNodeProps = NodeProps & {
    data: ImageNodeData;
};

const ImageNode: React.FC<ImageNodeProps> = ({ data: { imageUrl } }) => {
    const [dimensions, setDimensions] = useState({
        width: 20,
        height: 20,
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
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        ></div>
    );
};

export default ImageNode;
