import { NodeTypes, Node } from "@xyflow/react";
import BackgroundImageNode from "../nodeRendere/BackgroundImageNode";
import { TextElementNode } from "../nodeRendere/TextElementNode";

export const nodeTypes: NodeTypes = {
  image: BackgroundImageNode,
  text: TextElementNode,
};

export const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "image",
    position: { x: 0, y: 0 },
    data: {},
    resizing: false,
    draggable: false,
    dragging: false,
    selectable: false,
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
      imageUrl: "/storage/template_backgrounds/265-500x500.jpg",
    },
  },
  // Certificate text nodes
  {
    id: "student-name",
    type: "text",
    position: { x: 100, y: 100 },
    data: {
      text: "محمد أحمد العبدالله",
      fontSize: 64,
      color: "#1a237e", // Dark blue
      fontFamily: "Cairo",
    },
    draggable: true,
    resizing: true,
  },
  {
    id: "manager-signature",
    type: "text",
    position: { x: 100, y: 300 },
    data: {
      text: "د. فاطمة الزهراء\nمديرة الأكاديمية",
      fontSize: 48,
      color: "#1b5e20", // Dark green
      fontFamily: "Reem Kufi Ink",
    },
    draggable: true,
    resizing: true,
  },
  {
    id: "verification-code",
    type: "text",
    position: { x: 400, y: 400 },
    data: {
      text: "Verification Code:\nCERT-2025-XYZ789",
      fontSize: 32,
      color: "#424242", // Dark grey
      fontFamily: "Cairo",
    },
    draggable: true,
    resizing: true,
  },
];
