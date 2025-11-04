import * as GQL from "@/client/graphql/generated/gql/graphql";
import React from "react";
import { UseBaseElementStateReturn } from "./form/hooks";
import { UseTemplateConfigStateReturn } from "./form/config/useTemplateConfigState";
import { useNodesState, Node } from "@xyflow/react";
import { TextElementNodeData } from "./nodeRenderer/TextElementNode";

export type NodeDataContextType = {
  nodes: Node[];
  updateElementPosition: (elementId: number, x: number, y: number) => void;
  updateElementSize: (elementId: number, width: number, height: number) => void;
};

const NodeDataContext = React.createContext<NodeDataContextType | null>(null);

export type NodeDataProps = {
  elements: GQL.CertificateElementUnion[];
  bases: UseBaseElementStateReturn;
  config: UseTemplateConfigStateReturn;
  children: React.ReactNode;
};
export const NodeDataProvider: React.FC<NodeDataProps> = ({
  elements,
  bases,
  config: { state: container },
  children,
}) => {
  const [nodes, setNodes] = useNodesState<Node>([]);

  const [containerNode, setContainerNode] = React.useState<Node>({
    id: "container-node",
    type: "container",
    data: {},
    position: { x: 0, y: 0 },
  });
  const [elementNodes, setElementNodes] = React.useState<Node[]>([]);

  // Update container node when container data changes
  React.useEffect(() => {
    const node: Node = {
      id: "container-node",
      type: "container",
      data: {},
      position: { x: 0, y: 0 },
      draggable: false,
      selectable: false,
      style: {
        width: container.width,
        height: container.height,
        border: "2px solid #000000",
        boxSizing: "border-box",
        backgroundColor: "transparent",
      },
    };
    setContainerNode(node);
    setNodes([node, ...elementNodes]);
  }, [container, setNodes]);

  // Update element nodes when elements change
  React.useEffect(() => {
    const nodes: Node[] = elements
      .map(element => {
        // get active base state
        const activeBaseInputState = bases.baseElementStates.get(
          element.base.id
        );
        const base = activeBaseInputState ?? element.base;
        // create node based on element type
        // text element
        if (element.base.type === GQL.ElementType.Text) {
          // text element node data
          const data: TextElementNodeData = {
            elementId: element.base.id,
          };
          // node
          const node: Node<TextElementNodeData> = {
            id: element.base.id.toString(),
            type: "text",
            position: {
              x: base.positionX,
              y: base.positionY,
            },
            width: base.width,
            height: base.height,
            data: data,
            connectable: false,
            resizing: true,
          };
          return node;
        }
      })
      .filter(node => node !== undefined);
    setElementNodes(nodes);
    setNodes([containerNode, ...nodes]);
  }, [elements, bases.baseElementStates]);

  const updateElementPosition = React.useCallback(
    (elementId: number, x: number, y: number) => {
      bases.updateBaseElementStateFn(elementId, {
        key: "positionX",
        value: x,
      });
      bases.updateBaseElementStateFn(elementId, {
        key: "positionY",
        value: y,
      });
    },
    [bases.updateBaseElementStateFn]
  );

  const updateElementSize = React.useCallback(
    (elementId: number, width: number, height: number) => {
      bases.updateBaseElementStateFn(elementId, {
        key: "width",
        value: width,
      });
      bases.updateBaseElementStateFn(elementId, {
        key: "height",
        value: height,
      });
    },
    [bases.updateBaseElementStateFn]
  );

  const value = React.useMemo(
    () => ({
      nodes,
      updateElementPosition,
      updateElementSize,
    }),
    [nodes, updateElementPosition, updateElementSize]
  );

  return (
    <NodeDataContext.Provider value={value}>
      {children}
    </NodeDataContext.Provider>
  );
};

export const useNodeData = (): NodeDataContextType => {
  const context = React.useContext(NodeDataContext);
  if (!context) {
    throw new Error("useNodeData must be used within a NodeData");
  }
  return context;
};
