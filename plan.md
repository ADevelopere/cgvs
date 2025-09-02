# File Manager UI Implementation Plan (Revision 4)

This document outlines a comprehensive plan for the file manager UI. The architecture is centered around a clear separation of concerns between core data operations, UI interaction state, and presentational components.

---

## 1. High-Level Architecture: A Multi-Context Approach

The system will be governed by four distinct contexts working together:

1.  **`StorageManagementContext` (Core):** The headless, core context responsible for all backend data operations. It fetches the file list and provides the core API for mutations (`rename`, `delete`, etc.). It contains no UI state.
2.  **`StorageUIManagerContext` (UI State):** A new UI-centric context that manages all user interaction state, including item selection, clipboard (cut/copy), and drag-and-drop states. It consumes the Core context to execute actions.
3.  **`MenuManagerContext` (Menus):** A specialized context for managing the visibility, position, and content of all context menus.
4.  **`StorageUploadContext` (Uploads):** A specialized context for handling file uploads from the user's computer.

---

## 2. Core Data (`StorageManagementCoreContext`)

This context is the single source of truth for backend operations and provides a headless API for data manipulation. It contains no UI state and focuses purely on data operations.

### State to Manage:

-   `stats`: Storage statistics from the backend

### Core Functions:

-   **Data Fetching:**

    -   `fetchList(params: StorageQueryParams): Promise<{ items: StorageItem[], pagination: PaginationInfo } | null>` - Fetch files/folders with given parameters, returns null on error
    -   `fetchDirectoryTree(): Promise<DirectoryTreeNode[] | null>` - Fetch complete directory tree for sidebar navigation, returns null on error
    -   `fetchStats(path?: string): Promise<StorageStats | null>` - Fetch storage statistics, returns null on error

-   **File Operations:**

    -   `rename(path: string, newName: string): Promise<boolean>` - Rename file/folder, returns false on error
    -   `remove(paths: string[]): Promise<boolean>` - Delete files/folders, returns false on error
    -   `move(sourcePaths: string[], destinationPath: string): Promise<boolean>` - Move files/folders, returns false on error
    -   `copy(sourcePaths: string[], destinationPath: string): Promise<boolean>` - Copy files/folders, returns false on error
    -   `createFolder(path: string, name: string): Promise<boolean>` - Create new folder, returns false on error

-   **Search:**
    -   `search(query: string, path?: string): Promise<{ items: StorageItem[], totalCount: number } | null>` - Search for files and folders, returns null on error

### Responsibilities:

-   Handle all GraphQL API calls
-   Transform data between backend and frontend formats (storage paths vs display paths)
-   Handle notifications for operation success/failure
-   Provide pure data operations without UI concerns
-   Return simple success/failure results or null for errors
-   All functions are async and return promises, eliminating need for global loading states

---

## 3. UI State & Interaction (`StorageManagementUIContext`)

This context manages all user interface state and interactions, consuming the Core context to perform data operations.

### State to Manage:

-   **Data State:**

    -   `items`: Current list of files/folders being displayed
    -   `pagination`: Pagination information for current view
    -   `directoryTree`: Directory tree structure for sidebar navigation

-   **Query Parameters:**

    -   `params`: Current query parameters (path, limit, offset, searchTerm, fileType, sortField)

-   **Selection State:**

    -   `selectedItems`: Array of paths of currently selected items
    -   `lastSelectedItem`: Path of last clicked item (for Shift-click range selection)
    -   `focusedItem`: Path of item with keyboard focus

-   **UI Interaction State:**

    -   `viewMode`: Current view mode ('grid' or 'list')
    -   `searchMode`: Boolean indicating if in search mode
    -   `searchResults`: Array of search results when in search mode
    -   `clipboard`: Object `{ operation: 'copy' | 'cut', items: StorageItem[] }`

-   **Local UI State:**

    -   `sortBy`: Local sorting field for client-side sorting
    -   `sortDirection`: Local sorting direction ('asc' or 'desc')

-   **Operation States:**
    -   `loading`: Object tracking loading states for different operations (e.g., `{ fetchList: boolean, rename: boolean, delete: boolean }`)
    -   `operationErrors`: Object tracking operation-specific errors that need UI handling beyond notifications

### UI Functions:

-   **Navigation:**

    -   `navigateTo(path: string): void` - Navigate to a directory and fetch its contents
    -   `goUp(): void` - Navigate to parent directory
    -   `refresh(): void` - Refresh current directory contents

-   **Selection Management:**

    -   `toggleSelect(path: string): void` - Toggle selection of an item
    -   `selectAll(): void` - Select all items in current view
    -   `clearSelection(): void` - Clear all selections
    -   `selectRange(fromPath: string, toPath: string): void` - Select range of items (Shift+click)

-   **Parameter Management:**

    -   `setParams(partial: Partial<StorageQueryParams>): void` - Update query parameters
    -   `search(term: string): void` - Perform search and update UI state
    -   `setFilterType(type?: FileType): void` - Set file type filter
    -   `setSortField(field?: FileSortField): void` - Set backend sort field
    -   `setPage(page: number): void` - Set pagination page
    -   `setLimit(limit: number): void` - Set items per page limit

-   **Local Sorting:**

    -   `setSortBy(field: string): void` - Set local sort field
    -   `setSortDirection(direction: 'asc' | 'desc'): void` - Set local sort direction
    -   `getSortedItems(): StorageItem[]` - Get locally sorted items

-   **Clipboard Operations:**

    -   `copyItems(items: StorageItem[]): void` - Copy items to clipboard
    -   `cutItems(items: StorageItem[]): void` - Cut items to clipboard
    -   `pasteItems(): Promise<boolean>` - Paste items from clipboard

-   **File Operations (UI Layer):**
    -   `renameItem(path: string, newName: string): Promise<boolean>` - Rename with UI updates
    -   `deleteItems(paths: string[]): Promise<boolean>` - Delete with UI updates
    -   `moveItems(sourcePaths: string[], destinationPath: string): Promise<boolean>` - Move with UI updates
    -   `copyItemsTo(sourcePaths: string[], destinationPath: string): Promise<boolean>` - Copy with UI updates

### Responsibilities:

-   Manage all UI-specific state (selection, view mode, local sorting)
-   Consume Core context for backend operations
-   Handle complex UI interactions (drag-and-drop, keyboard navigation, clipboard)
-   Coordinate between user actions and backend operations
-   Maintain local state consistency after backend operations

### Interaction Logic to Implement:

1.  **Advanced Selection (No Checkboxes):**

    -   The selection state will be visually represented by styling the item rows/cards (e.g., a different background color).
    -   **Single Click:** Deselects all other items and selects the clicked item.
    -   **Ctrl + Click:** Toggles the selection state of the clicked item without affecting others.
    -   **Shift + Click:** Selects all items between the `lastSelectedItem` and the currently clicked item.
    -   **Spacebar:** Toggles the selection of the currently focused item.

2.  **Drag-to-Move:**

    -   All `StorageItem` components will be draggable.
    -   `FolderItem` components will be drop targets.
    -   The `onDrop` handler will call the `moveItems()` function from the UI context, which internally uses the Core context.
    -   **Validation:** The UI will prevent dropping a folder onto itself, one of its own children, or a non-folder item.

3.  **Copy/Cut/Paste:**
    -   **Copy:** Copies the `selectedItems` to the internal `clipboard` with `operation: 'copy'`.
    -   **Cut:** Copies the `selectedItems` to the `clipboard` with `operation: 'cut'`. The UI will visually change the cut items (e.g., make them semi-transparent).
    -   **Paste:** When in a folder, this action will read the `clipboard`. The UI context will call the appropriate Core function (`move()` for cut, `copy()` for copy operations). The clipboard is cleared after a successful paste.

### Keyboard Navigation

To ensure accessibility and provide power-user capabilities, the file manager will be fully navigable via the keyboard. The `StorageManagementUIContext` will manage the focused state.

-   **State to Manage:**

    -   `focusedItem`: The path of the item that currently has keyboard focus, distinct from selection.

-   **Focus Movement:**

    -   **Arrow Keys (Up/Down/Left/Right):** Change the `focusedItem`. The logic will adapt to the current view (list or grid) to move focus intuitively.
    -   **Home/End:** Move focus to the first/last item in the list.

-   **Item Interaction:**

    -   **Enter:**
        -   On a folder: Navigates into it (calls `navigateTo`).
        -   On a file: Triggers the primary action (e.g., opens a preview or downloads).
    -   **Menu Key / Shift+F10:** Opens the context menu for the `focusedItem`.
    -   **F2:** Initiates the rename process for the `focusedItem`.
    -   **Delete:** Triggers the delete action for all `selectedItems`.

-   **Selection via Keyboard:**

    -   **Shift + Arrow Keys:** Extends the selection from the `lastSelectedItem` to the newly focused item.
    -   **Ctrl + Spacebar:** Toggles the selection state of the `focusedItem` without deselecting other items.
    -   **Ctrl + A:** Selects all items in the current view.

-   **Clipboard Shortcuts:**
    -   **Ctrl + C:** Copies the `selectedItems` to the clipboard.
    -   **Ctrl + X:** Cuts the `selectedItems` to the clipboard.
    -   **Ctrl + V:** Pastes from the clipboard into the current directory.

---

## 4. Menu System & Uploads Architecture

This section details the architecture for handling context menus and file uploads.

### Menu Architecture

A flexible system for displaying context menus, decoupled from the trigger mechanism (works for both right-click and left-click).

-   **`MenuManagerContext`:** A central context will hold the state of the currently active menu (its type, target data, and position).
-   **`MenuManager` Component:** A single `MenuManager`, placed high in the app layout, will read from this context and render the appropriate menu component (`FileMenu`, `FolderMenu`, etc.) at the correct position.
-   **Triggering:** Any component can trigger a menu by calling the `openMenu` function from the `MenuManagerContext`.

### Upload Architecture

-   **`UploadDropzone` Component:** A specialized component to handle file uploads via drag-and-drop. It will use the `StorageUploadContext` to access the `uploadFiles` function.
-   **`uploadPath` Prop:** The component will be configured with an `uploadPath` prop to specify the destination directory, making it adaptable for dropping files on the main view or directly onto folders.

---

## 5. Menu Actions & Content (Updated)

This section defines the content of each menu.

### `FileMenu`

-   **Cut**
-   **Copy**
-   **Download:** Create a link (`<a>`) with its `href` set to the file's `mediaLink` property.
-   **Rename:** Trigger a modal and call the context's `rename()` function.
-   **Delete:** Show a confirmation dialog and call the context's `remove()` function.
-   **Get Info:** Open a details panel showing `name`, `size`, `contentType`, `lastModified`, `created`, and `path`.

### `FolderMenu`

-   **Open:** Call the context's `navigateTo()` function.
-   **Cut**
-   **Copy**
-   **Paste:** (Disabled if clipboard is empty).
-   **Rename**
-   **Delete**
-   **Get Info:** Open a details panel showing `name`, `path`, `fileCount`, `folderCount`, `totalSize`, etc.

### `ViewAreaMenu`

-   **Paste:** (Disabled if clipboard is empty).
-   **Upload Files:** Call `startUpload()` from `StorageUploadContext`.
-   **New Folder:** Call `createFolder()` from `StorageManagementContext`.
-   **Refresh:** Call the context's `refresh()` function.
-   **Select All**

---

## 6. Views: Grid and List Rendering (Updated & Merged)

This section details the components responsible for rendering the file browser, now driven by the new `StorageUIManagerContext`. The implementation will use standard HTML elements (`div`, `table`, etc.) and will not rely on a UI library like MUI for its core structure.

### `StorageBrowserView.tsx` (New)

-   **Responsibilities:**
    -   Acts as the main container for the file browser UI.
    -   Will be wrapped by all necessary contexts (`StorageManagementProvider`, `StorageUIManagerProvider`, etc.).
    -   Uses the `SplitPaneViewController` component to create a two-pane layout:
        -   **First Pane:** Directory tree navigation (`StorageDirectoryTree`)
        -   **Second Pane:** Main file browser view (`StorageMainView`)
        -   **Title:** The `StorageSearch` component is passed as the title prop to the split pane controller

### `StorageDirectoryTree.tsx` (New)

-   **Responsibilities:**
    -   Renders the folder tree navigation in the first pane of the split layout.
    -   Uses the `TreeView` component from `nextjs/components/common/TreeView.tsx`.
    -   Consumes `StorageManagementContext` to get the directory structure.
    -   Handles navigation by calling `navigateTo` from the context when folders are selected.
-   **TreeView Configuration:**
    -   `items`: Directory tree structure fetched from the backend
    -   `selectedItemId`: Current directory path from `StorageManagementContext`
    -   `onSelectItem`: Calls `navigateTo` to navigate to the selected folder
    -   `childrenKey`: "children" (for nested folder structure)
    -   `labelKey`: "name" (folder name display)
    -   `itemRenderer`: Custom renderer to show folder icons and names
    -   `searchText`: "Search folders..."
    -   `noItemsMessage`: "No folders found"

### `StorageMainView.tsx` (New)

-   **Responsibilities:**
    -   Acts as the container for the main file browser content in the second pane.
    -   Renders the `StorageBreadcrumb` component at the top.
    -   Renders the `StorageToolbar.tsx` component below the breadcrumb.
    -   Renders the `StorageItemsView` component at the bottom.

### `StorageToolbar.tsx` (New)

-   **Responsibilities:**
    -   Acts as a conditional container that sits between the breadcrumb and the items view.
    -   Consumes `StorageUIManagerContext` to check if any items are selected.
    -   If `selectedItems` is empty, it renders the `StorageFilters` component.
    -   If `selectedItems` has one or more items, it renders the `StorageSelectionActions` component.

### `StorageFilters.tsx` (New)

-   **Responsibilities:**
    -   Displays a set of filter dropdowns to refine the list of files. This component is only visible when no items are selected.
    -   The filtering will be achieved by updating the URL query parameters, which will trigger a data re-fetch from the `StorageManagementContext`.
-   **Filters to Implement:**
    -   **Type Filter:** A dropdown menu that allows users to filter by file type (e.g., Folders, Documents, Spreadsheets, Presentations, Videos, Forms, Photos & images, PDFs, Videos, Archives, Audio, Drawings, Sites, Shortcuts), as seen in the type filtering menu design.
    -   **Modified Filter:** A dropdown menu that allows users to filter by a date range (e.g., Today, Last 7 days, Last 30 days, This year, Last year, Custom date range), as seen in the modified filtering menu design.

### `StorageSelectionActions.tsx` (New)

-   **Responsibilities:**
    -   Displays a toolbar with actions for the currently selected items. This component is only visible when one or more items are selected.
    -   Consumes `StorageUIManagerContext` to get the list of `selectedItems`.
-   **Actions to Implement:**
    -   **Download:** Available for any selection.
    -   **Move To:** Available for any selection. Will trigger a dialog in the future.
    -   **Delete:** Available for any selection. Will trigger a confirmation dialog.
    -   **Rename:** Conditionally rendered. It will only be visible if `selectedItems.length === 1`.

### `StorageSearch.tsx` (New)

-   **Props:** None (consumes context directly).
-   **State to Manage:**
    -   `searchQuery`: Current search input value.
    -   `searchHistory`: Array of previous search queries (persisted in localStorage).
    -   `showHistory`: Boolean to control the visibility of the search history dropdown.
    -   `isSearching`: Boolean to show loading state during search.
-   **Logic:**
    -   Renders a search input field with a search icon.
    -   Maintains search history in localStorage (key: `storage-search-history`).
    -   Shows a dropdown with search history when the input is focused and has history.
    -   Clicking on a history item populates the search field and triggers the search.
    -   On search submission (Enter key or search button):
        -   Calls `search()` from `StorageManagementContext`.
        -   Adds the query to search history (avoiding duplicates).
        -   Updates the UI to show search results instead of current directory listing.
    -   Provides a "Clear" or "X" button to exit search mode and return to directory browsing.
    -   Search history management:
        -   Stores up to 10 recent searches.
        -   Removes duplicates by moving existing queries to the top.
        -   Provides option to clear individual history items or entire history.

### `StorageItemsView.tsx`

-   **State to Manage:**
    -   `sortBy`: The field to sort by (e.g., 'name', 'size', 'lastModified').
    -   `sortDirection`: The sorting direction ('asc' or 'desc').
-   **Responsibilities:**
    -   Consumes `StorageManagementContext` to get the list of items (either directory listing or search results).
    -   **Performs local (client-side) sorting** on the currently fetched list of files based on `sortBy` and `sortDirection`. This does not require a new API call.
    -   Detects whether the current view is showing search results or directory contents.
    -   Contains the logic for switching between grid and list views.
    -   Displays a toolbar with view switching controls.
    -   For search results: Shows the number of results found and the search query.
    -   Renders the appropriate container (`div` for grid, `table` for list) and maps over the sorted items, rendering a `StorageItem` for each.
-   **Sorting Logic:**
    -   **List View:** Renders a `<table>` with a `<thead>`. Each column header (Name, Size, Last Modified) will be clickable to update the `sortBy` and `sortDirection` state, providing interactive column sorting.
    -   **Grid View:** Does not have visible column headers. A separate sort menu/button in the toolbar will be displayed to allow the user to select the `sortBy` field and `sortDirection`.

### `StorageBreadcrumb.tsx` (New)

-   **Props:** `path` (string), `onNavigateToPath` (function).
-   **Logic:**
    -   Renders the breadcrumb navigation based on the current path, as seen in the design.
    -   Each part of the path should be a clickable link to navigate to that directory.
    -   For paths that are too long to fit the container, it should intelligently truncate the path, showing the beginning and the end, with an ellipsis in the middle (e.g., `My Drive > ... > very > long > path`).

### `StorageItem.tsx`

-   **Responsibilities:**
    -   Acts as a router for an individual item, deciding whether to render the grid or list version.
    -   Consumes `StorageUIManagerContext` to determine if it is `isSelected` or `isCut` and applies styles accordingly.
    -   Its `onClick` handler will call the advanced selection logic from the UI context (handling ctrl/shift keys).
    -   Handles the double-click action to navigate into a folder.
    -   It will be a **draggable source** for the drag-to-move functionality.
    -   If the item is a folder, it will also be a **drop target**.
    -   Decides whether to render a `StorageItemGrid` or `StorageItemListRow` component.

### `StorageItemGrid.tsx`

-   **Props:** `item`, `isSelected`.
-   **Logic:**
    -   Renders a single "card" in the grid view using a `div`.
    -   If the item is a folder, it displays a large `FileTypeIcon`.
    -   If the item is a file, it renders the `FilePreview` component.
    -   Displays the `item.name` below the icon/preview with text truncation.
    -   The `onClick` and drag/drop logic is handled by the parent `StorageItem`.

### `StorageItemListRow.tsx`

-   **Props:** `item`, `isSelected`.
-   **Logic:**
    -   Renders a single row in the list view using a `<tr>` (table row) element.
    -   Uses `<td>` cells for columns:
        -   The `FileTypeIcon` component.
        -   The `item.name`.
        -   The formatted `item.size`.
        -   The formatted `item.lastModified` date.
    -   For folders, the size and date columns will display a dash (—).

### `FilePreview.tsx`

-   **Props:** `file` (FileInfo).
-   **Logic:**
    -   Renders the large preview area within the `StorageItemGrid` card.
    -   Initially, it will use the `FileTypeIcon` to show a large, centered icon.
    -   **Future Enhancement:** Can be enhanced to check `file.contentType`. If it's an image, render an `<img>` tag. For other types, fall back to the icon.

### `FileTypeIcon.tsx`

-   **Props:** `item` (StorageItem).
-   **Logic:** A small, reusable helper component to centralize the logic for choosing an icon. It inspects the item's type to return the appropriate icon (e.g., Folder, Image, Article). This ensures consistency between views.

---

## 7. Final File List

-   **Contexts:**
    -   `nextjs/contexts/storage/StorageManagementCoreContext.tsx` (New)
    -   `nextjs/contexts/storage/StorageManagementUIContext.tsx` (New)
    -   `nextjs/contexts/MenuManagerContext.tsx`
-   **Components:**
    -   `nextjs/components/storage/dropzone/...`
    -   `nextjs/components/storage/menu/...`
-   **Views:**
    -   `nextjs/views/storage/browser/StorageBrowserView.tsx` (New)
    -   `nextjs/views/storage/browser/StorageDirectoryTree.tsx` (New)
    -   `nextjs/views/storage/browser/StorageMainView.tsx` (New)
    -   `nextjs/views/storage/browser/StorageToolbar.tsx` (New)
    -   `nextjs/views/storage/browser/StorageFilters.tsx` (New)
    -   `nextjs/views/storage/browser/StorageSelectionActions.tsx` (New)
    -   `nextjs/views/storage/browser/StorageSearch.tsx` (New)
    -   `nextjs/views/storage/browser/StorageItemsView.tsx`
    -   `nextjs/views/storage/browser/StorageBreadcrumb.tsx` (New)
    -   `nextjs/views/storage/browser/StorageItem.tsx`
    -   `nextjs/views/storage/browser/StorageItemGrid.tsx`
    -   `nextjs/views/storage/browser/StorageItemListRow.tsx`
    -   `nextjs/views/storage/browser/FilePreview.tsx`
    -   `nextjs/views/storage/browser/FileTypeIcon.tsx`

---

## 8. ASCII Component Architecture Chart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              StorageBrowserView.tsx                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        SplitPaneViewController                         │  │
│  │                                                                       │  │
│  │  Title: StorageSearch.tsx                                            │  │
│  │  ┌─────────────────────────┐                                         │  │
│  │  │      [Search Input]     │                                         │  │
│  │  └─────────────────────────┘                                         │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐  ┌─────────────────────────────────────────┐ │  │
│  │  │    First Pane       │  │           Second Pane                   │ │  │
│  │  │                     │  │                                         │ │  │
│  │  │ StorageDirectoryTree│  │         StorageMainView                 │ │  │
│  │  │                     │  │  ┌───────────────────────────────────┐  │ │  │
│  │  │ ┌─────────────────┐ │  │  │     StorageBreadcrumb.tsx         │  │ │  │
│  │  │ │   TreeView      │ │  │  │ My Drive > ubuntu > folder...     │  │ │  │
│  │  │ │                 │ │  │  └───────────────────────────────────┘  │ │  │
│  │  │ │ + Folder A      │ │  │                                         │ │  │
│  │  │ │ + Folder B      │ │  │  ┌───────────────────────────────────┐  │ │  │
│  │  │ │ - Folder C      │ │  │  │      StorageToolbar.tsx           │  │ │  │
│  │  │ │   + SubFolder   │ │  │  │                                   │  │ │  │
│  │  │ │ + Folder D      │ │  │  │  [Has Selection?]                 │  │ │  │
│  │  │ │                 │ │  │  │       │                           │  │ │  │
│  │  │ └─────────────────┘ │  │  │  ┌────┴──────┐                    │  │ │  │
│  │  │                     │  │  │  │NO         │YES                 │  │ │  │
│  │  └─────────────────────┘  │  │  │           │                    │  │ │  │
│  │                           │  │  │ ┌─────────▼──────┐ ┌──────────▼─┐ │ │  │
│  │                           │  │  │ │StorageFilters  │ │ Selection  │ │ │  │
│  │                           │  │  │ │ [Type] [Date]  │ │ Actions    │ │ │  │
│  │                           │  │  │ └────────────────┘ │[Rename][Del]│ │ │  │
│  │                           │  │  │                    └─────────────┘ │ │  │
│  │                           │  │  └───────────────────────────────────┘  │ │  │
│  │                           │  │                                         │ │  │
│  │                           │  │  ┌───────────────────────────────────┐  │ │  │
│  │                           │  │  │      StorageItemsView.tsx         │  │ │  │
│  │                           │  │  │                                   │  │ │  │
│  │                           │  │  │  [Items Array] ──→ [Sort Logic]   │  │ │  │
│  │                           │  │  │                         │         │  │ │  │
│  │                           │  │  │                    ┌────▼─────┐   │  │ │  │
│  │                           │  │  │                    │View Mode?│   │  │ │  │
│  │                           │  │  │                    │          │   │  │ │  │
│  │                           │  │  │              ┌─────┴─┐   ┌────┴─┐ │  │ │  │
│  │                           │  │  │              │ GRID  │   │ LIST │ │  │ │  │
│  │                           │  │  │              │       │   │      │ │  │ │  │
│  │                           │  │  │       ┌──────▼─────┐ │   │ ┌────▼┐ │ │  │
│  │                           │  │  │       │StorageItem │ │   │ │Item ││ │ │  │
│  │                           │  │  │       │    Grid    │ │   │ │Row  ││ │ │  │
│  │                           │  │  │       │            │ │   │ │     ││ │ │  │
│  │                           │  │  │       │ ┌────────┐ │ │   │ │ [📁]││ │ │  │
│  │                           │  │  │       │ │Preview │ │ │   │ │Name ││ │ │  │
│  │                           │  │  │       │ │   or   │ │ │   │ │Size ││ │ │  │
│  │                           │  │  │       │ │FileIcon│ │ │   │ │Date ││ │ │  │
│  │                           │  │  │       │ └────────┘ │ │   │ └─────┘│ │ │  │
│  │                           │  │  │       │  FileName  │ │   │        │ │ │  │
│  │                           │  │  │       └────────────┘ │   │        │ │ │  │
│  │                           │  │  │                      │   │        │ │ │  │
│  │                           │  │  │       FileTypeIcon <─┴───┴────────┘ │ │  │
│  │                           │  │  │                                   │  │ │  │
│  │                           │  │  └───────────────────────────────────┘  │ │  │
│  │                           │  └─────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

Context Providers (Wrapping the entire view):
┌─────────────────────────────────────────────────────────────────────────────┐
│ StorageManagementCoreContext (Data Operations)                               │
│  └─ StorageUIManagerContext (UI State & Interactions)                       │
│     └─ MenuManagerContext (Context Menus)                                   │
│        └─ StorageUploadContext (File Uploads)                               │
│           └─ [All Components Above]                                         │
└─────────────────────────────────────────────────────────────────────────────┘

Legend:
┌─┐ = Container/Component
│ │ = Component boundary  
▼   = Data/Control flow
─   = Relationship/Connection
[X] = UI Element/Action
```
