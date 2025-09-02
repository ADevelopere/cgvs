# File Manager UI Implementation Plan (Revision 4)

This document outlines a comprehensive plan for the file manager UI. The architecture is centered around a clear separation of concerns between core data operations, UI interaction state, and presentational components.

## Implementation Progress

**Major Contexts Completed (2/4):**

- ✅ **StorageManagementCoreContext** - Completed (2025-09-02)
  - Headless core context for all backend data operations
  - Depends on StorageGraphQLContext as required
  - Handles all file operations, data fetching, and search
  - Provides proper error handling and notifications
  - Exports all required types for UI components

- ✅ **StorageManagementUIContext** - Completed (2025-09-02)
  - UI-centric context managing all user interaction state
  - Consumes StorageManagementCoreContext for backend operations
  - Handles selection, clipboard, navigation, and local sorting
  - Implements lazy loading directory tree with hover pre-fetching
  - Provides all UI functions for file browser components
  - Full TypeScript support with proper error handling

**Ready for Implementation:**
- ⏳ **File Browser Components** (Views & UI Components with Material-UI)
- ⏳ **Directory Tree Component** with TreeView integration
- ⏳ **File Operations Dialogs** (MoveToDialog, etc.)

**Foundation Complete:** ✅ The core architecture is now ready for UI component development.

---

## 1. High-Level Architecture: A Multi-Context Approach

The system will be governed by three distinct contexts working together:

1.  **`StorageManagementCoreContext` (Core):** The headless, core context responsible for all backend data operations. It fetches the file list and provides the core API for mutations (`rename`, `delete`, etc.). It contains no UI state.
2.  **`StorageUIManagerContext` (UI State):** A new UI-centric context that manages all user interaction state, including item selection, clipboard (cut/copy), and drag-and-drop states. It consumes the Core context to execute actions.
3.  **`StorageUploadContext` (Uploads):** A specialized context for handling file uploads from the user's computer. **Note: Upload progress UI is already implemented** via `UploadProgress.tsx` and related components in `nextjs/views/storage/uploading/` - this floating component manages upload states and should wrap the entire application.

---

## 2. Core Data (`StorageManagementCoreContext`)

This context is the single source of truth for backend operations and provides a headless API for data manipulation. It contains no UI state and focuses purely on data operations.

### State to Manage:

-   `stats`: Storage statistics from the backend

### Core Functions:

-   **Data Fetching:**

    -   `fetchList(params: StorageQueryParams): Promise<{ items: StorageItem[], pagination: PaginationInfo } | null>` - Fetch files/folders with given parameters, returns null on error
    -   `fetchDirectoryChildren(path?: string): Promise<DirectoryTreeNode[] | null>` - Fetch children of a specific directory for lazy loading (if path is undefined/empty, fetches root level), returns null on error
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
-   **Implement lazy directory tree loading:** Uses only `fetchDirectoryChildren()` - starts with root level (empty/undefined path), then loads specific directory children on-demand
-   **Cache directory children:** Store fetched directory children to avoid redundant API calls and enable instant expansion

---

## 3. UI State & Interaction (`StorageManagementUIContext`)

This context manages all user interface state and interactions, consuming the Core context to perform data operations.

### State to Manage:

-   **Data State:**

    -   `items`: Current list of files/folders being displayed
    -   `pagination`: Pagination information for current view
    -   `directoryTree`: Directory tree structure for sidebar navigation (initially only top-level directories)
    -   `expandedNodes`: Set of directory paths that have been expanded and their children loaded
    -   `prefetchedNodes`: Set of directory paths that have been pre-fetched on hover but not yet expanded

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
    -   `loading`: Object tracking loading states for different operations (e.g., `{ fetchList: boolean, rename: boolean, delete: boolean, expandingNode: string | null, prefetchingNode: string | null }`)
    -   `operationErrors`: Object tracking operation-specific errors that need UI handling beyond notifications

### UI Functions:

-   **Navigation:**

    -   `navigateTo(path: string): void` - Navigate to a directory and fetch its contents
    -   `goUp(): void` - Navigate to parent directory
    -   `refresh(): void` - Refresh current directory contents
    -   `expandDirectoryNode(path: string): Promise<void>` - Expand a directory node in the tree, loading its children if not already loaded
    -   `collapseDirectoryNode(path: string): void` - Collapse a directory node in the tree
    -   `prefetchDirectoryChildren(path: string): Promise<void>` - Pre-fetch directory children on hover for faster expansion

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

---

## 4. Lazy Loading Directory Tree Implementation

This section details the implementation strategy for lazy loading the directory tree with hover pre-fetching optimization.

### Core Lazy Loading Strategy

The directory tree will implement a two-tier loading approach:

1. **Initial Load:** Fetch only root-level directories when the component mounts (using `fetchDirectoryChildren()` with empty/undefined path)
2. **On-Demand Loading:** Load subdirectories when users explicitly expand nodes (click/double-click)
3. **Hover Pre-fetching:** Silently pre-fetch subdirectories when users hover over parent nodes

### Implementation Details

#### 1. Data Structure Changes

The `DirectoryTreeNode` interface should support lazy loading:

```typescript
interface DirectoryTreeNode {
  id: string;
  name: string;
  path: string;
  children?: DirectoryTreeNode[]; // undefined = not loaded, [] = loaded but empty, [...] = loaded with content
  hasChildren: boolean; // server indicates if this node has subdirectories
  isExpanded: boolean; // client-side expansion state
  isLoading: boolean; // loading state for this specific node
  isPrefetched: boolean; // whether children have been pre-fetched
}
```

#### 2. Loading States

Track different loading operations separately:

- `expandingNode: string | null` - Path of node being expanded (shows loading spinner)
- `prefetchingNode: string | null` - Path of node being pre-fetched (silent, no UI indication)
- `expandedNodes: Set<string>` - Paths of currently expanded nodes
- `prefetchedNodes: Set<string>` - Paths of nodes with pre-fetched children

#### 3. API Strategy

Use only the single `fetchDirectoryChildren()` function:

- `fetchDirectoryChildren(path?: string)` - Returns immediate children of specified path
  - When `path` is undefined/empty/null: Returns root-level directories
  - When `path` is specified: Returns children of that specific directory
- Each response includes `hasChildren` flag to show expand/collapse icons

#### 4. UX Behavior

**Initial State:**
- Tree shows only root-level directories (fetched via `fetchDirectoryChildren()` with undefined path)
- Folders with children show expand icon (►)
- Folders without children show no expand icon

**User Expansion:**
- Click expand icon → Show loading spinner → Fetch children → Update tree → Hide spinner
- If already pre-fetched → Instant expansion (no loading spinner)

**Hover Pre-fetching:**
- Hover on folder (300ms debounce) → Silent background fetch → Cache results
- No visual loading indicators for hover pre-fetching
- Pre-fetched data enables instant expansion when user clicks

**Cache Management:**
- Keep fetched children in memory for session duration
- Clear cache on page refresh or navigation away
- Implement LRU cache if memory becomes concern

#### 5. Performance Optimizations

**Debouncing:**
- Hover events debounced to 300ms to prevent rapid API calls
- Cancel pending pre-fetch requests if user hovers away quickly

**Request Deduplication:**
- Track in-flight requests to prevent duplicate API calls
- If user hovers then immediately clicks, use single request for both

**Smart Pre-fetching:**
- Only pre-fetch first-level children (not recursive)
- Skip pre-fetching if node already expanded or pre-fetched
- Consider user behavior patterns (commonly accessed paths)

#### 6. Error Handling

**Expansion Errors:**
- Show error notification and retry option
- Keep node in collapsed state on error

**Pre-fetch Errors:**
- Fail silently for hover pre-fetching
- Log errors for debugging but don't interrupt user experience
- Fallback to regular loading when user explicitly expands

#### 7. Accessibility

**Screen Reader Support:**
- Announce loading states: "Loading folder contents"
- Announce expansion: "Folder expanded, 5 items"
- Use proper ARIA labels for loading states

**Keyboard Navigation:**
- Space/Enter to expand/collapse maintains loading behavior
- Focus management during loading states
- Skip pre-fetching for keyboard navigation (only on explicit actions)

### Benefits of This Approach

1. **Fast Initial Load:** Only root-level directories loaded initially via single API call
2. **Responsive Expansion:** Hover pre-fetching makes expansion feel instant
3. **Reduced Server Load:** Only fetch what's needed + strategic pre-fetching
4. **Better UX:** No loading delays for commonly accessed paths
5. **Progressive Enhancement:** Works without JavaScript (graceful degradation)
6. **Scalable Architecture:** No exhaustive tree fetching - handles any directory depth efficiently

---

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

## 5. Menu System & Uploads Architecture

This section details the architecture for handling context menus and file uploads.

### Menu Architecture

Context menus will be implemented using Material-UI's `Menu` component directly in each component that needs them. This approach leverages MUI's built-in positioning, accessibility, and theming capabilities.

-   **Implementation Pattern:** Each component requiring a context menu will manage its own menu state using the standard MUI pattern:
    ```tsx
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    ```
-   **Menu Components:** Individual menu components (`FileMenu`, `FolderMenu`, `ViewAreaMenu`) will be rendered directly using MUI's `Menu` and `MenuItem` components.
-   **Benefits:** 
    - Consistent with existing codebase patterns
    - Leverages MUI's accessibility features
    - Simpler architecture without additional context layer
    - Better performance with localized state management

### Upload Architecture

**⚠️ IMPORTANT: Upload progress UI is already implemented and should NOT be recreated.**

The existing upload system consists of:
- `nextjs/views/storage/uploading/UploadProgress.tsx` - Main floating upload progress component
- `nextjs/views/storage/uploading/UploadProgressUIContext.tsx` - Context for upload UI state
- Related components in `nextjs/views/storage/uploading/` directory

This floating upload progress component should wrap the entire application and is already fully functional.

**New components to implement:**
-   **`UploadDropzone` Component:** A specialized component to handle file uploads via drag-and-drop. It will use the existing `StorageUploadContext` to access the `uploadFiles` function.
-   **`uploadPath` Prop:** The component will be configured with an `uploadPath` prop to specify the destination directory, making it adaptable for dropping files on the main view or directly onto folders.

---

## 6. Menu Actions & Content

This section defines the content of each menu. All menus will be implemented using Material-UI's `Menu` and `MenuItem` components.

### `FileMenu` (MUI Menu Component)

-   **Cut** - MUI `MenuItem` with cut icon
-   **Copy** - MUI `MenuItem` with copy icon  
-   **Download** - MUI `MenuItem` that creates a link (`<a>`) with its `href` set to the file's `mediaLink` property
-   **Rename** - MUI `MenuItem` that triggers a MUI `Dialog` and calls the context's `rename()` function
-   **Delete** - MUI `MenuItem` that shows a MUI confirmation dialog and calls the context's `remove()` function
-   **Get Info** - MUI `MenuItem` that opens a MUI details panel/dialog showing `name`, `size`, `contentType`, `lastModified`, `created`, and `path`

### `FolderMenu` (MUI Menu Component)

-   **Open** - MUI `MenuItem` that calls the context's `navigateTo()` function
-   **Cut** - MUI `MenuItem` with cut icon
-   **Copy** - MUI `MenuItem` with copy icon
-   **Paste** - MUI `MenuItem` (disabled if clipboard is empty)
-   **Rename** - MUI `MenuItem` that triggers rename dialog
-   **Delete** - MUI `MenuItem` that triggers confirmation dialog
-   **Get Info** - MUI `MenuItem` that opens details panel showing `name`, `path`, `fileCount`, `folderCount`, `totalSize`, etc.

### `ViewAreaMenu` (MUI Menu Component)

-   **Paste** - MUI `MenuItem` (disabled if clipboard is empty)
-   **Upload Files** - MUI `MenuItem` that calls `startUpload()` from `StorageUploadContext`
-   **New Folder** - MUI `MenuItem` that calls `createFolder()` from `StorageManagementCoreContext`
-   **Refresh** - MUI `MenuItem` that calls the context's `refresh()` function
-   **Select All** - MUI `MenuItem` for selecting all items

---

## 7. Views: Grid and List Rendering (Material-UI Components)

This section details the components responsible for rendering the file browser, now driven by the new `StorageUIManagerContext`. **All components will use Material-UI (MUI) components for consistent theming, accessibility, and design system integration.**

### Material-UI Component Usage Strategy

-   **Layout Components:** Use MUI `Box`, `Container`, `Grid`, `Stack` for layout and spacing
-   **Navigation:** Use MUI `Breadcrumbs`, `Chip`, `Button` for breadcrumb navigation
-   **Inputs & Controls:** Use MUI `TextField`, `Select`, `MenuItem`, `IconButton`, `Tooltip` for all user inputs
-   **Data Display:** Use MUI `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell` for list view
-   **Feedback:** Use MUI `CircularProgress`, `LinearProgress`, `Skeleton` for loading states
-   **Surfaces:** Use MUI `Card`, `Paper`, `Dialog` for containers and modals
-   **Typography:** Use MUI `Typography` component for all text content
-   **Icons:** Use Material-UI icons (`@mui/icons-material`) throughout

### `StorageBrowserView.tsx` (Material-UI Layout)

-   **Responsibilities:**
    -   Acts as the main container for the file browser UI using MUI `Box` component
    -   Will be wrapped by all necessary contexts (`StorageManagementProvider`, `StorageUIManagerProvider`, etc.)
    -   Uses the `SplitPaneViewController` component to create a two-pane layout:
        -   **First Pane:** Directory tree navigation (`StorageDirectoryTree`) 
        -   **Second Pane:** Main file browser view (`StorageMainView`)
        -   **Title:** The `StorageSearch` component is passed as the title prop to the split pane controller

### `StorageDirectoryTree.tsx` (Material-UI TreeView)

-   **Responsibilities:**
    -   Renders the folder tree navigation in the first pane using MUI components
    -   Uses the existing `TreeView` component from `nextjs/components/common/TreeView.tsx` with MUI styling
    -   Consumes `StorageManagementCoreContext` to get the directory structure
    -   Handles navigation by calling `navigateTo` from the context when folders are selected
    -   **Implements lazy loading strategy** with MUI loading indicators:
        -   Initially loads only top-level directories
        -   Loads subdirectories on-demand when parent nodes are expanded  
        -   Pre-fetches subdirectories on hover for improved UX performance
        -   Uses MUI `CircularProgress` for loading states
-   **TreeView Configuration:**
    -   `items`: Directory tree structure fetched from the backend (initially top-level only)
    -   `selectedItemId`: Current directory path from `StorageManagementCoreContext`
    -   `onSelectItem`: Calls `navigateTo` to navigate to the selected folder
    -   `onExpandItem`: Calls `expandDirectoryNode` to load children if not already loaded
    -   `onCollapseItem`: Calls `collapseDirectoryNode` to collapse node
    -   `onHoverItem`: Calls `prefetchDirectoryChildren` for performance optimization
    -   `expandedItems`: Set of expanded node paths from UI context
    -   `childrenKey`: "children" (for nested folder structure)
    -   `labelKey`: "name" (folder name display)
    -   `itemRenderer`: Custom renderer using MUI components to show folder icons, names, and loading states
    -   `searchText`: "Search folders..." with MUI `TextField`
    -   `noItemsMessage`: "No folders found" using MUI `Typography`
-   **Lazy Loading Behavior:**
    -   **Initial Load:** Fetch only root-level directories when component mounts (using `fetchDirectoryChildren()` with undefined path)
    -   **Expansion:** When user clicks to expand a folder:
        -   Check if children are already loaded in `expandedNodes`
        -   If not loaded, show loading indicator and fetch children using `fetchDirectoryChildren(path)`
        -   Update tree structure with new children and mark node as expanded
    -   **Hover Pre-fetching:** When user hovers over a folder (with debounce of ~300ms):
        -   Check if children are already prefetched in `prefetchedNodes`
        -   If not, silently fetch children in background using `fetchDirectoryChildren(path)`
        -   Store in cache for instant expansion when user actually clicks
        -   Don't show loading indicators for hover pre-fetching
    -   **Performance Optimizations:**
        -   Debounce hover events to avoid excessive API calls
        -   Cache fetched directory children to avoid re-fetching
        -   Use loading states only for explicit user actions (clicks), not hover pre-fetching

### `StorageMainView.tsx` (Material-UI Container)

-   **Responsibilities:**
    -   Acts as the container for the main file browser content using MUI `Box` component
    -   Renders the `StorageBreadcrumb` component at the top
    -   Renders the `StorageToolbar.tsx` component below the breadcrumb
    -   Renders the `StorageItemsView` component at the bottom
    -   Uses MUI `Stack` for vertical layout organization

### `StorageToolbar.tsx` (Material-UI Conditional Layout)

-   **Responsibilities:**
    -   Acts as a conditional container using MUI `Box` component that sits between the breadcrumb and the items view
    -   Consumes `StorageUIManagerContext` to check if any items are selected
    -   If `selectedItems` is empty, it renders the `StorageFilters` component
    -   If `selectedItems` has one or more items, it renders the `StorageSelectionActions` component
    -   Uses MUI `Fade` or `Collapse` for smooth transitions between states

### `StorageFilters.tsx` (Material-UI Form Controls)

-   **Responsibilities:**
    -   Displays filter controls using MUI `Select`, `MenuItem`, and `FormControl` components
    -   This component is only visible when no items are selected
    -   The filtering will be achieved by updating the URL query parameters, which will trigger a data re-fetch from the `StorageManagementCoreContext`
-   **Filters to Implement:**
    -   **Type Filter:** MUI `Select` dropdown with `MenuItem` options for file types (Folders, Documents, Spreadsheets, Presentations, Videos, Forms, Photos & images, PDFs, Archives, Audio, Drawings, Sites, Shortcuts)
    -   **Modified Filter:** MUI `Select` dropdown with `MenuItem` options for date ranges (Today, Last 7 days, Last 30 days, This year, Last year, Custom date range)
    -   Uses MUI `Chip` components to display active filters

### `StorageSelectionActions.tsx` (Material-UI Button Group)

-   **Responsibilities:**
    -   Displays a toolbar with actions using MUI `ButtonGroup`, `Button`, and `IconButton` components
    -   This component is only visible when one or more items are selected
    -   Consumes `StorageUIManagerContext` to get the list of `selectedItems`
    -   Uses MUI `Tooltip` for action descriptions
-   **Actions to Implement:**
    -   **Download:** MUI `Button` with download icon, available for any selection
    -   **Move To:** MUI `Button` with move icon, available for any selection. Will trigger a MUI dialog
    -   **Delete:** MUI `Button` with delete icon, available for any selection. Will trigger a MUI confirmation dialog
    -   **Rename:** MUI `Button` with edit icon, conditionally rendered only if `selectedItems.length === 1`

### `StorageSearch.tsx` (Material-UI Search Component)

-   **Props:** None (consumes context directly)
-   **State to Manage:**
    -   `searchQuery`: Current search input value
    -   `searchHistory`: Array of previous search queries (persisted in localStorage)
    -   `showHistory`: Boolean to control the visibility of the search history dropdown
    -   `isSearching`: Boolean to show loading state during search
-   **Logic:**
    -   Renders search input using MUI `TextField` with `InputAdornment` for search icon
    -   Maintains search history in localStorage (key: `storage-search-history`)
    -   Shows a MUI `Autocomplete` or `Popper` with search history when the input is focused and has history
    -   Uses MUI `List` and `ListItem` components for history display
    -   Clicking on a history item populates the search field and triggers the search
    -   On search submission (Enter key or search button):
        -   Calls `search()` from `StorageManagementCoreContext`
        -   Adds the query to search history (avoiding duplicates)
        -   Updates the UI to show search results instead of current directory listing
    -   Provides MUI `IconButton` with clear icon to exit search mode and return to directory browsing
    -   Search history management:
        -   Stores up to 10 recent searches
        -   Removes duplicates by moving existing queries to the top
        -   Provides option to clear individual history items or entire history using MUI `MenuItem` actions

### `StorageItemsView.tsx` (Material-UI Data Display)

-   **State to Manage:**
    -   `sortBy`: The field to sort by (e.g., 'name', 'size', 'lastModified')
    -   `sortDirection`: The sorting direction ('asc' or 'desc')
-   **Responsibilities:**
    -   Consumes `StorageManagementCoreContext` to get the list of items (either directory listing or search results)
    -   **Performs local (client-side) sorting** on the currently fetched list of files based on `sortBy` and `sortDirection`. This does not require a new API call
    -   Detects whether the current view is showing search results or directory contents
    -   Contains the logic for switching between grid and list views using MUI `ToggleButtonGroup`
    -   Displays a toolbar with view switching controls using MUI `AppBar` or `Toolbar`
    -   For search results: Shows the number of results found and the search query using MUI `Typography`
    -   Renders the appropriate container (MUI `Grid` for grid view, MUI `Table` for list view) and maps over the sorted items, rendering a `StorageItem` for each
-   **Sorting Logic:**
    -   **List View:** Renders MUI `Table` with `TableHead`. Each `TableCell` header (Name, Size, Last Modified) will be clickable using MUI `TableSortLabel` to update the `sortBy` and `sortDirection` state
    -   **Grid View:** Uses MUI `Menu` or `Select` component in the toolbar to allow the user to select the `sortBy` field and `sortDirection`

### `StorageBreadcrumb.tsx` (Material-UI Navigation)

-   **Props:** `path` (string), `onNavigateToPath` (function)
-   **Logic:**
    -   Renders breadcrumb navigation using MUI `Breadcrumbs` component
    -   Each part of the path uses MUI `Link` or `Button` component to navigate to that directory
    -   For paths that are too long, uses MUI `Typography` with text truncation and `Tooltip` to show full path
    -   Implements intelligent truncation showing beginning and end with MUI `Chip` for middle sections (e.g., `My Drive > ... > very > long > path`)

### `StorageItem.tsx` (Material-UI Item Router)

-   **Responsibilities:**
    -   Acts as a router for an individual item, deciding whether to render the grid or list version
    -   Consumes `StorageUIManagerContext` to determine if it is `isSelected` or `isCut` and applies MUI theme-based styles accordingly
    -   Its `onClick` handler will call the advanced selection logic from the UI context (handling ctrl/shift keys)
    -   Handles the double-click action to navigate into a folder
    -   It will be a **draggable source** for the drag-to-move functionality using HTML5 drag API with MUI visual feedback
    -   If the item is a folder, it will also be a **drop target** with MUI visual indicators
    -   Context menu integration using MUI `Menu` component triggered on right-click
    -   Decides whether to render a `StorageItemGrid` or `StorageItemListRow` component

### `StorageItemGrid.tsx` (Material-UI Card Component)

-   **Props:** `item`, `isSelected`
-   **Logic:**
    -   Renders a single "card" in the grid view using MUI `Card` and `CardContent` components
    -   If the item is a folder, it displays a large Material-UI icon using `@mui/icons-material`
    -   If the item is a file, it renders the `FilePreview` component within a MUI `CardMedia` area
    -   Displays the `item.name` using MUI `Typography` component with text truncation
    -   Uses MUI `Skeleton` for loading states
    -   Selection state indicated by MUI theme-based background color changes
    -   The `onClick` and drag/drop logic is handled by the parent `StorageItem`

### `StorageItemListRow.tsx` (Material-UI Table Row)

-   **Props:** `item`, `isSelected`
-   **Logic:**
    -   Renders a single row in the list view using MUI `TableRow` and `TableCell` components
    -   Uses MUI `TableCell` components for columns:
        -   The `FileTypeIcon` component using Material-UI icons
        -   The `item.name` using MUI `Typography`
        -   The formatted `item.size` using MUI `Typography`
        -   The formatted `item.lastModified` date using MUI `Typography`
    -   For folders, the size and date columns will display a dash (—) using MUI `Typography`
    -   Selection state indicated by MUI `TableRow` selected prop and theme styling
    -   Hover effects using MUI theme hover states

### `FilePreview.tsx` (Material-UI Media Component)

-   **Props:** `file` (FileInfo)
-   **Logic:**
    -   Renders the large preview area within the `StorageItemGrid` card using MUI `CardMedia` or `Box`
    -   Initially, it will use the `FileTypeIcon` component with Material-UI icons
    -   **Future Enhancement:** Can be enhanced to check `file.contentType`. If it's an image, render using MUI `CardMedia` with `<img>` tag. For other types, fall back to the icon
    -   Uses MUI `Skeleton` component for loading states

### `FileTypeIcon.tsx` (Material-UI Icon Component)

-   **Props:** `item` (StorageItem)
-   **Logic:** A small, reusable helper component using Material-UI icons (`@mui/icons-material`) to centralize the logic for choosing an icon. It inspects the item's type to return the appropriate Material-UI icon component (e.g., `FolderIcon`, `ImageIcon`, `ArticleIcon`). This ensures consistency between views and leverages MUI's icon system.

---

## 8. Dialogs and Modals (Material-UI Components)

This section outlines the design and functionality of modal dialogs used for specific file operations. All dialogs will use Material-UI components for consistent theming and accessibility.

### `MoveToDialog.tsx` (Material-UI Dialog)

This component will be a modal dialog using MUI `Dialog`, `DialogTitle`, `DialogContent`, and `DialogActions` components responsible for handling the moving of files and folders. It will be triggered by the "Move To" action in file/folder context menus.

-   **State to Manage:**
    -   `isOpen`: Boolean to control the visibility of the dialog
    -   `itemsToMove`: The items (files/folders) that are being moved
    -   `currentPathInDialog`: The path of the directory currently being viewed *inside the dialog*
    -   `itemsInView`: The list of files and folders for the `currentPathInDialog`
    -   `isLoading`: Boolean to indicate when the dialog is fetching directory contents
    -   `hoveredItemPath`: The path of the item currently being hovered over in the list

-   **UI Design & Behavior (Material-UI Implementation):**
    -   **Header:**
        -   Dynamic dialog title using MUI `DialogTitle` with MUI `Typography`, e.g., "Move 'Untitled folder'" or "Move 3 items"
        -   A "Current location" section using MUI `Chip` or `Button` showing a folder icon followed by the current directory name (clickable button to navigate to that path)
        -   **No tabs** - only show the current directory contents by default
    
    -   **Navigation:**
        -   When in a subdirectory, show a navigation header with:
            -   MUI `IconButton` with back arrow icon to go to parent directory
            -   Current directory name using MUI `Typography`
        -   The view lists items for the `currentPathInDialog` (not the entire directory tree)
    
    -   **Item Listing:**
        -   Display both files and folders using MUI `List`, `ListItem`, and `ListItemText` components
        -   Files are shown but non-interactive (for context) with disabled styling
        -   Folders are interactive and can be navigated into or used as move destinations
        -   **Visual fade/blur effect** at the bottom using MUI `Box` with gradient overlay to indicate more content
    
    -   **Item Interaction (on Hover):**
        -   When hovering over a directory, show two MUI `IconButton` actions at the end of the `ListItem`:
            1.  **Move Button:** MUI `IconButton` with move icon that executes the move operation to move selected items to this directory
            2.  **Navigate Into Button (`>`):** MUI `IconButton` with arrow icon that updates the dialog view to show contents of this directory
        -   Use MUI `Tooltip` components for button descriptions
    
    -   **Footer Actions:**
        -   MUI `DialogActions` containing:
            -   Primary MUI `Button` with "Move" text to move items to the `currentPathInDialog`
            -   MUI `Button` with "Cancel" text to close dialog without action
            -   Optional MUI `Button` with "New Folder" text to create a new folder in current directory
        -   Use MUI `CircularProgress` in buttons during operations

-   **Responsibilities:**
    -   Fetch directory contents when navigating between folders using MUI loading states
    -   Handle move operations by calling the Core context's move function
    -   Maintain navigation state within the dialog independently from the main file browser
    -   Validate move operations (prevent moving folders into themselves or their children) with MUI `Alert` components for error display

### `RenameDialog.tsx` (Material-UI Dialog)

This component will be a modal dialog using MUI `Dialog`, `DialogTitle`, `DialogContent`, and `DialogActions` components, responsible for handling the renaming of a single file or folder. It will be triggered by the "Rename" action in file/folder context menus.

-   **State to Manage:**
    -   `isOpen`: Boolean to control the visibility of the dialog.
    -   `itemToRename`: The item (file or folder) that is being renamed.
    -   `newName`: The new name entered by the user in the text field.
    -   `isLoading`: Boolean to indicate when the rename operation is in progress.

-   **UI Design & Behavior (Material-UI Implementation):**
    -   **Title:** An MUI `DialogTitle` with the text "Rename".
    -   **Content:** An MUI `DialogContent` containing a single MUI `TextField` for the new name.
        -   The text field should be pre-populated with the item's current name.
        -   The text of the current name (without the extension for files) should be selected by default for easy replacement.
        -   The text field should have `autoFocus` enabled and support Enter key to submit.
    -   **Footer Actions:**
        -   MUI `DialogActions` containing:
            -   A MUI `Button` with "Cancel" text to close the dialog.
            -   A primary MUI `Button` with "OK" text to submit the rename operation. The button should be disabled if the new name is empty or unchanged.
    -   **Logic:**
        -   On "OK" click or Enter key press, it calls the `renameItem()` function from the `StorageManagementUIContext`.
        -   Handle validation (e.g., empty name, invalid characters, duplicate names).
        -   Display validation errors using MUI `Alert` components or `TextField` error states.
        -   Close dialog automatically on successful rename operation.

---

## 9. Final File List

-   **Contexts:**
    -   `nextjs/contexts/storage/StorageManagementCoreContext.tsx` ✅ **COMPLETED**
    -   `nextjs/contexts/storage/StorageManagementUIContext.tsx` ✅ **COMPLETED**
    -   **Note:** `StorageUploadContext` and upload progress UI already exist in `nextjs/views/storage/uploading/`
-   **Components (Material-UI Based):**
    -   `nextjs/components/storage/dialogs/MoveToDialog.tsx` (New - MUI Dialog)
    -   `nextjs/components/storage/dialogs/RenameDialog.tsx` (New - MUI Dialog)
    -   `nextjs/components/storage/dropzone/...` (New - for drag-and-drop upload zones with MUI components)
    -   `nextjs/components/storage/menu/FileMenu.tsx` (New - MUI Menu for files)
    -   `nextjs/components/storage/menu/FolderMenu.tsx` (New - MUI Menu for folders)
    -   `nextjs/components/storage/menu/ViewAreaMenu.tsx` (New - MUI Menu for view area)
    -   **Note:** Upload progress components already exist in `nextjs/views/storage/uploading/`
-   **Views (Material-UI Based):**
    -   `nextjs/views/storage/browser/StorageBrowserView.tsx` (New - MUI Box container)
    -   `nextjs/views/storage/browser/StorageDirectoryTree.tsx` (New - MUI TreeView with loading)
    -   `nextjs/views/storage/browser/StorageMainView.tsx` (New - MUI Stack layout)
    -   `nextjs/views/storage/browser/StorageToolbar.tsx` (New - MUI conditional container)
    -   `nextjs/views/storage/browser/StorageFilters.tsx` (New - MUI Select and FormControl)
    -   `nextjs/views/storage/browser/StorageSelectionActions.tsx` (New - MUI ButtonGroup)
    -   `nextjs/views/storage/browser/StorageSearch.tsx` (New - MUI TextField and Autocomplete)
    -   `nextjs/views/storage/browser/StorageItemsView.tsx` (MUI Table/Grid with sorting)
    -   `nextjs/views/storage/browser/StorageBreadcrumb.tsx` (New - MUI Breadcrumbs)
    -   `nextjs/views/storage/browser/StorageItem.tsx` (MUI themed item router)
    -   `nextjs/views/storage/browser/StorageItemGrid.tsx` (MUI Card component)
    -   `nextjs/views/storage/browser/StorageItemListRow.tsx` (MUI TableRow)
    -   `nextjs/views/storage/browser/FilePreview.tsx` (MUI CardMedia)
    -   `nextjs/views/storage/browser/FileTypeIcon.tsx` (Material-UI icons)

---

## 10. ASCII Component Architecture Chart

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
│ UploadProgress.tsx (Floating Component - Already Implemented)                │
│  └─ StorageManagementCoreContext (Data Operations)                          │
│     └─ StorageUIManagerContext (UI State & Interactions)                    │
│        └─ StorageUploadContext (File Uploads - Already Implemented)         │
│           └─ [All Components Above] (Material-UI Themed)                    │
└─────────────────────────────────────────────────────────────────────────────┘

Legend:
┌─┐ = Container/Component
│ │ = Component boundary  
▼   = Data/Control flow
─   = Relationship/Connection
[X] = UI Element/Action
```
