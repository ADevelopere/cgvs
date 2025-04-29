import React, { createContext, useContext, useReducer, useCallback } from 'react';

export type TabType = 'basic' | 'variables' | 'editor' | 'recipients' | 'preview';

export interface TabError {
  message: string;
}

interface TemplateManagementState {
  activeTab: TabType;
  unsavedChanges: boolean;
  loadedTabs: TabType[];
  tabErrors: Record<TabType, TabError | undefined>;
}

type Action =
  | { type: 'SET_ACTIVE_TAB'; payload: TabType }
  | { type: 'SET_TAB_LOADED'; payload: TabType }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_TAB_ERROR'; payload: { tab: TabType; error: TabError } }
  | { type: 'CLEAR_TAB_ERROR'; payload: TabType };

const initialState: TemplateManagementState = {
  activeTab: 'basic',
  unsavedChanges: false,
  loadedTabs: [],
  tabErrors: {
    basic: undefined,
    variables: undefined,
    editor: undefined,
    recipients: undefined,
    preview: undefined,
  },
};

const reducer = (state: TemplateManagementState, action: Action): TemplateManagementState => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };
    case 'SET_TAB_LOADED':
      return {
        ...state,
        loadedTabs: state.loadedTabs.includes(action.payload)
          ? state.loadedTabs
          : [...state.loadedTabs, action.payload],
      };
    case 'SET_UNSAVED_CHANGES':
      return {
        ...state,
        unsavedChanges: action.payload,
      };
    case 'SET_TAB_ERROR':
      return {
        ...state,
        tabErrors: {
          ...state.tabErrors,
          [action.payload.tab]: action.payload.error,
        },
      };
    case 'CLEAR_TAB_ERROR':
      return {
        ...state,
        tabErrors: {
          ...state.tabErrors,
          [action.payload]: undefined,
        },
      };
    default:
      return state;
  }
};

interface TemplateManagementContextType extends TemplateManagementState {
  setActiveTab: (tab: TabType) => void;
  setTabLoaded: (tab: TabType) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  setTabError: (tab: TabType, error: TabError) => void;
  clearTabError: (tab: TabType) => void;
}

const TemplateManagementContext = createContext<TemplateManagementContextType | undefined>(undefined);

export const TemplateManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setActiveTab = useCallback((tab: TabType) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  const setTabLoaded = useCallback((tab: TabType) => {
    dispatch({ type: 'SET_TAB_LOADED', payload: tab });
  }, []);

  const setUnsavedChanges = useCallback((hasChanges: boolean) => {
    dispatch({ type: 'SET_UNSAVED_CHANGES', payload: hasChanges });
  }, []);

  const setTabError = useCallback((tab: TabType, error: TabError) => {
    dispatch({ type: 'SET_TAB_ERROR', payload: { tab, error } });
  }, []);

  const clearTabError = useCallback((tab: TabType) => {
    dispatch({ type: 'CLEAR_TAB_ERROR', payload: tab });
  }, []);

  const value = {
    ...state,
    setActiveTab,
    setTabLoaded,
    setUnsavedChanges,
    setTabError,
    clearTabError,
  };

  return (
    <TemplateManagementContext.Provider value={value}>
      {children}
    </TemplateManagementContext.Provider>
  );
};

export const useTemplateManagement = () => {
  const context = useContext(TemplateManagementContext);
  if (context === undefined) {
    throw new Error('useTemplateManagement must be used within a TemplateManagementProvider');
  }
  return context;
};
