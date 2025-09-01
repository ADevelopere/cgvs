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

## 2. Menu Actions & Content

This section defines the content of each menu, based on analysis of the GraphQL types and the `StorageManagementContext`.

### `FileMenu` (for a `FileInfo` object)
-   **Download:** Create a link (`<a>`) with its `href` set to the file's `mediaLink` property. Action should be disabled if `mediaLink` is not present.
-   **Rename:** Trigger a modal and call the context's `rename()` function.
-   **Delete:** Show a confirmation dialog and call the context's `remove()` function.
-   **Get Info:** Open a details panel showing `name`, `size`, `contentType`, `lastModified`, `created`, and `path` from the `FileInfo` object.

### `FolderMenu` (for a `FolderInfo` object)
-   **Open:** Call the context's `navigateTo()` function.
-   **Rename:** Trigger a modal and call `rename()`.
-   **Delete:** Show a confirmation dialog and call `remove()`.
-   **Get Info:** Open a details panel showing `name`, `path`, `fileCount`, `folderCount`, `totalSize`, `lastModified`, and `created` from the `FolderInfo` object.

### `ViewAreaMenu` (for the empty background area)
-   **Upload Files:** Call the `startUpload()` function from `StorageUploadContext`.
-   **New Folder:** Call a `createFolder()` function (Note: this function needs to be added to the `StorageManagementContext`).
-   **Refresh:** Call the context's `refresh()` function.
-   **Select All:** Call the context's `selectAll()` function.

---

## 3. Menu System Architecture

A flexible system for displaying the menus defined above. It is decoupled from the trigger mechanism (works for both right-click and left-click).

- **Architecture:**
    1.  A central `MenuManagerContext` will hold the state of the currently active menu (its type, target data, and position).
    2.  A single `MenuManager` component, placed high in the app layout, will read from this context and render the appropriate menu component at the correct position.
- **Key Feature:** Any component can trigger a menu by calling the `openMenu` function from the `MenuManagerContext`.

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

## 4. UI Analysis Summary

This plan is based on the following analysis of the required UI:

-   **Grid View**: A responsive grid of "cards".
    -   **Folder Card**: Shows a large folder icon with the name underneath.
    -   **File Card**: Shows a `FilePreview` area (a large icon for now), the filename, and other details.

-   **List View**: A table-like list.
    -   **Header**: Columns for Name, Size, and Last Modified.
    -   **Folder Row**: Shows a folder icon, name, and placeholder dashes for size/date.
    -   **File Row**: Shows a file-type icon, name, size, and last modified date.

---

## 5. Views: Grid and List Rendering

This section details the components responsible for rendering the file browser.

**Note:** The implementation will use standard HTML elements (`div`, `table`, etc.) and will not rely on a UI library like MUI for its core structure.

### `StorageItemsView.tsx`
This is the main component that brings everything together.
-   **Responsibilities:**
    -   Consumes the `useStorageManagement` context to get the list of items.
    -   Contains the logic for switching between grid and list views.
    -   Displays a toolbar with view-switcher controls (grid/list).
    -   Renders the appropriate container (`div` for grid view, `table` for list view).
    -   Maps over the items and renders a `StorageItem` for each, passing down props.
    -   Displays headers for the list view.

### `StorageItem.tsx`
This component acts as a router for an individual item, deciding whether to render the grid or list version.
-   **Props:** `item` (FileInfo or FolderInfo), `viewMode`, `selected`, selection handlers.
-   **Logic:**
    -   If `viewMode` is 'grid', it renders a `StorageItemGrid` component.
    -   If `viewMode` is 'list', it renders a `StorageItemListRow` component.
    -   Handles the double-click action to navigate into a folder.

### `StorageItemGrid.tsx`
Renders a single "card" in the grid view.
-   **Props:** `item`, `selected`, `onToggleSelect`.
-   **Logic:**
    -   Uses a `div` styled as a card, with a nested button or clickable `div` for actions.
    -   A checkbox will be overlaid to show and manage the selection state.
    -   If the item is a folder, it displays a large `FileTypeIcon`.
    -   If the item is a file, it renders the `FilePreview` component.
    -   Displays the `item.name` below the icon/preview with text truncation.

### `FilePreview.tsx`
A specialized sub-component for the grid view's preview area.
-   **Props:** `file` (FileInfo).
-   **Logic:**
    -   Renders the large preview area within the `StorageItemGrid` card.
    -   Initially, it will use the `FileTypeIcon` to show a large, centered icon.
    -   **Future Enhancement:** Can be enhanced to check `file.contentType`. If it's an image, render an `<img>` tag. For other types, fall back to the icon.

### `StorageItemListRow.tsx`
Renders a single row in the list view.
-   **Props:** `item`, `selected`, `onToggleSelect`.
-   **Logic:**
    -   Uses a `<tr>` (table row) element.
    -   Uses `<td>` cells for columns:
        -   A checkbox for selection.
        -   The `FileTypeIcon` component.
        -   The `item.name`.
        -   The formatted `item.size`.
        -   The formatted `item.lastModified` date.
    -   For folders, the size and date columns will display a dash (—).

### `FileTypeIcon.tsx`
A small, reusable helper component to centralize the logic for choosing an icon.
-   **Props:** `item` (StorageItem).
-   **Logic:** Inspects the item's type to return the appropriate icon (e.g., Folder, Image, Article). This ensures consistency between views.

### Files:
- `nextjs/views/storage/browser/`
    - `StorageItemsView.tsx`
    - `StorageItem.tsx`
    - `StorageItemGrid.tsx`
    - `StorageItemListRow.tsx`
    - `FilePreview.tsx`
    - `FileTypeIcon.tsx`