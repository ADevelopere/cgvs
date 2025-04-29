import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TabType =
    | "basic"
    | "variables"
    | "editor"
    | "recipients"
    | "preview";

export interface TabError {
    message: string;
}

export type TemplateManagementState = {
    activeTab: TabType;
    unsavedChanges: boolean;
    loadedTabs: TabType[];
    tabErrors: Record<TabType, TabError | undefined>;
};

type SetTabErrorPayload = {
    tab: TabType;
    error: TabError;
};

const initialState: TemplateManagementState = {
    activeTab: "basic",
    unsavedChanges: false,
    loadedTabs: [], // Track which tabs have loaded their data
    tabErrors: {
        basic: undefined,
        variables: undefined,
        editor: undefined,
        recipients: undefined,
        preview: undefined,
    },
};

const templateManagementSlice = createSlice({
    name: "templateManagement",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<TabType>) => {
            state.activeTab = action.payload;
        },
        setTabLoaded: (state, action: PayloadAction<TabType>) => {
            if (!state.loadedTabs.includes(action.payload)) {
                state.loadedTabs.push(action.payload);
            }
        },
        setUnsavedChanges: (state, action: PayloadAction<boolean>) => {
            state.unsavedChanges = action.payload;
        },
        setTabError: (state, action: PayloadAction<SetTabErrorPayload>) => {
            state.tabErrors[action.payload.tab] = action.payload.error;
        },
        clearTabError: (state, action: PayloadAction<TabType>) => {
            state.tabErrors[action.payload] = undefined;
        },
    },
});

export const {
    setActiveTab,
    setTabLoaded,
    setUnsavedChanges,
    setTabError,
    clearTabError,
} = templateManagementSlice.actions;

// Type-safe selectors
export const selectActiveTab = (state: {
    templateManagement: TemplateManagementState;
}): TabType => state.templateManagement.activeTab;

export const selectTabLoaded = (
    state: { templateManagement: TemplateManagementState },
    tab: TabType
): boolean => state.templateManagement.loadedTabs.includes(tab);

export const selectUnsavedChanges = (state: {
    templateManagement: TemplateManagementState;
}): boolean => state.templateManagement.unsavedChanges;

export const selectTabError = (
    state: { templateManagement: TemplateManagementState },
    tab: TabType
): TabError | undefined => state.templateManagement.tabErrors[tab];

export default templateManagementSlice.reducer;
