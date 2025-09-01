# File Manager UI Implementation Plan

This document outlines the plan for creating the core UI components for the file manager. The architecture is based on a decoupled, context-driven approach.

## 1. Uploads: The `UploadDropzone`

A specialized component to handle file uploads via drag-and-drop.

- **Architecture:** A wrapper component (`UploadDropzone`) will use the `StorageUploadContext` to access the `uploadFiles` function. It will manage drag-and-drop UI states internally.
- **Key Feature:** The component will be configured with an `uploadPath` prop to specify the destination directory, making it adaptable for dropping files on the main view or directly onto folders.

### Files:
- `nextjs/components/storage/dropzone/index.ts`
- `nextjs/components/storage/dropzone/UploadDropzone.tsx`
- `nextjs/components/storage/dropzone/useUploadDropzone.ts`

---

## 2. Menus: Decoupled Menu System

A flexible system for displaying context menus that is decoupled from the trigger mechanism (works for both right-click and left-click on a "more options" button).

- **Architecture:**
    1.  A central `MenuManagerContext` will hold the state of the currently active menu (its type, target data, and position).
    2.  A single `MenuManager` component, placed high in the app layout, will read from this context and render the appropriate menu component at the correct position.
    3.  Specific menu components (`FileMenu`, `FolderMenu`, `ViewAreaMenu`) will be responsible only for rendering the menu items. They will get their actions from the `StorageManagementContext`.
- **Key Feature:** Any component can trigger any menu by calling the `openMenu` function from the `MenuManagerContext`.

### Files:
- `nextjs/contexts/MenuManagerContext.tsx`
- `nextjs/components/storage/menu/`
    - `index.ts`
    - `MenuManager.tsx`
    - `FileMenu.tsx`
    - `FolderMenu.tsx`
    - `ViewAreaMenu.tsx`
    - `Menu.tsx` (Base UI for the menu box)
    - `menu.types.ts`

---

## 3. UI Analysis Summary

This plan is based on the following analysis of the required UI:

-   **Grid View**: A responsive grid of "cards".
    -   **Folder Card**: Shows a large folder icon with the name underneath.
    -   **File Card**: Shows a `FilePreview` area (a large icon for now), the filename, and other details.

-   **List View**: A table-like list.
    -   **Header**: Columns for Name, Size, and Last Modified.
    -   **Folder Row**: Shows a folder icon, name, and placeholder dashes for size/date.
    -   **File Row**: Shows a file-type icon, name, size, and last modified date.

---

## 4. Views: Grid and List Rendering

A set of components to render the file browser in either a grid or list format, based on the user-provided analysis. This system will use standard HTML elements for layout and will not rely on a UI library like MUI.

- **Architecture:**
    - `StorageItemsView.tsx`: The main controller component that fetches the file/folder list from `useStorageManagement` and switches between the two view types.
    - `StorageItem.tsx`: A "router" component that decides whether to render an item in its grid or list representation.
    - `StorageItemGrid.tsx`: Renders a single "card" for the grid view.
    - `StorageItemListRow.tsx`: Renders a single `<tr>` for the list view.
- **Helper Components:**
    - `FilePreview.tsx`: Renders the large preview area in the grid view card (initially as a large icon).
    - `FileTypeIcon.tsx`: A reusable component to render a consistent icon based on file/folder type.

### Files:
- `nextjs/views/storage/browser/`
    - `StorageItemsView.tsx`
    - `StorageItem.tsx`
    - `StorageItemGrid.tsx`
    - `StorageItemListRow.tsx`
    - `FilePreview.tsx`
    - `FileTypeIcon.tsx`