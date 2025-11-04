import * as GQL from "@/client/graphql/generated/gql/graphql";
import { ContainerNodeData, ElementNodeData } from "./types";
import React from "react";
import { UseBaseElementStateReturn } from "./form/hooks";
import { UseTemplateConfigStateReturn } from "./form/config/useTemplateConfigState";

export type NodeDataContextType = {
  elementsNodeData: ElementNodeData[];
  containerData: ContainerNodeData;
  updateElementPosition: (elementId: number, x: number, y: number) => void;
  updateElementSize: (elementId: number, width: number, height: number) => void;
};

const NodeDataContext = React.createContext<NodeDataContextType | null>(
  null
);

export type NodeDataProps = {
  elements: GQL.CertificateElementUnion[];
  bases: UseBaseElementStateReturn;
  config: UseTemplateConfigStateReturn
  children: React.ReactNode;
};
export const NodeDataProvider: React.FC<NodeDataProps> = ({
  elements,
  bases,
  config: { state: configUpdateState }, 
  children,
}) => {
  const containerData: ContainerNodeData = React.useMemo(() => {
    return {
      width: configUpdateState.width,
      height: configUpdateState.height,
    };
  }, [configUpdateState.width, configUpdateState.height]);
  
  const elementsNodeData: ElementNodeData[] = React.useMemo(() => {
    return elements.map(el => {
      const activeBaseInputState = bases.baseElementStates.get(el.base.id);
      const base = activeBaseInputState ?? el.base;
      return {
        id: el.base.id,
        type: el.base.type,
        positionX: base.positionX,
        positionY: base.positionY,
        width: base.width,
        height: base.height,
        
      };
    });
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
      elementsNodeData,
      containerData,
      updateElementPosition,
      updateElementSize,
    }),
    [elementsNodeData, containerData, updateElementPosition, updateElementSize]
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
