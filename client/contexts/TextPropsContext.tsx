"use client";
import React from "react";
import {
  useTextPropsState,
  UseTextPropsStateReturn,
  UseTextPropsStateParams,
} from "@/client/views/template/manage/editor/form/hooks/useTextPropsState";

export const TextPropsContext =
  React.createContext<UseTextPropsStateReturn | null>(null);

export const TextPropsProvider: React.FC<
  React.PropsWithChildren<UseTextPropsStateParams>
> = ({ children, ...props }) => {
  const state = useTextPropsState(props);
  return (
    <TextPropsContext.Provider value={state}>
      {children}
    </TextPropsContext.Provider>
  );
};
