"use client";

import React from "react";
import { FontManagementView } from "./FontManagementView";
import { useFontStore } from "./stores/useFontStore";
import { useFontOperations } from "./hooks/useFontOperations";

export const FontManagementViewPage: React.FC = () => {
  const { selectedFont, queryParams, setQueryParams, isCreating, isEditing } = useFontStore();
  const { selectFont, startCreating, cancelCreating, startEditing, cancelEditing, createFont, updateFont } =
    useFontOperations();

  return (
    <FontManagementView
      selectedFont={selectedFont}
      queryParams={queryParams}
      isCreating={isCreating}
      isEditing={isEditing}
      setQueryParams={setQueryParams}
      selectFont={selectFont}
      startCreating={startCreating}
      cancelCreating={cancelCreating}
      startEditing={startEditing}
      cancelEditing={cancelEditing}
      createFont={createFont}
      updateFont={updateFont}
    />
  );
};
