import { NodeTypes, Node } from "@xyflow/react";
import BackgroundImageNode from "./nodeRendere/BackgroundImageNode";
import ImageNode from "./nodeRendere/ImageNode";

export const nodeTypes: NodeTypes = {
    backgroundImage: BackgroundImageNode,
    image: ImageNode,
};

export const initialNodes: Node[] = [
    {
        id: "node-1",
        type: "backgroundImage",
        position: { x: 0, y: 0 },
        data: {},
        resizing: false,
        draggable: false,
        dragging: false,
    },
    {
        id: "1",
        position: { x: 0, y: 0 },
        data: { label: "Hello" },
    },
    {
        id: "3",
        type: "image",
        position: { x: 0, y: 0 },
        data: {
            imageUrl: "template_backgrounds/265-500x500.jpg",
        },
    },
];
