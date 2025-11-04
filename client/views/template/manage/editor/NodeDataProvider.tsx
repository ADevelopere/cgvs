import * as GQL from "@/client/graphql/generated/gql/graphql";
import { ContainerNodeData, ElementNodeData } from "./types";
import React from "react";
import { UseBaseElementStateReturn } from "./form/hooks";
import { UseTemplateConfigStateReturn } from "./form/config/useTemplateConfigState";

export type NodeDataContextType = {
  elementsNodeData: ElementNodeData[];
  containerData: ContainerNodeData;
  updateElementPosition: (elementId: number, x: number, y: number) => void;
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

  const value = React.useMemo(
    () => ({
      elementsNodeData,
      containerData,
      updateElementPosition,
    }),
    [elementsNodeData, containerData, updateElementPosition]
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
