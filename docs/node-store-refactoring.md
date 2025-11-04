# Node Store Refactoring

## Overview

This document describes the refactoring of the node state management system in the template editor. The goal was to eliminate complex, redundant node state management and centralize it in a Zustand store.

## Changes Made

### 1. Created `useNodesStore.ts` - Centralized Node Store

**Location:** `client/views/template/manage/editor/useNodesStore.ts`

**Purpose:** A Zustand store that manages all ReactFlow nodes for all templates.

**Key Features:**
- **Template-scoped state:** Nodes are stored per `templateId` for proper lifecycle management
- **Type-safe operations:** Full TypeScript support with proper node types
- **Efficient updates:** Direct node updates without iterating through all elements
- **Multiple update strategies:**
  - `updateBaseNodeData`: Update position (x, y) and size (width, height)
  - `updateTextNodeData`: Update text-specific node data
  - `updateContainerNode`: Update container dimensions
  - `updateNode`: Generic node update
  - `batchUpdateNodes`: Batch multiple node updates

**API:**
```typescript
interface NodesStoreActions {
  initializeNodes: (templateId, elements, containerConfig) => void;
  getNodes: (templateId) => Node[];
  setNodes: (templateId, nodes) => void;
  clearNodes: (templateId) => void;
  addNode: (templateId, node) => void;
  deleteNode: (templateId, nodeId) => void;
  updateBaseNodeData: (templateId, elementId, updates) => void;
  updateTextNodeData: (templateId, elementId, updates) => void;
  updateContainerNode: (templateId, updates) => void;
  updateNode: (templateId, nodeId, updates) => void;
  batchUpdateNodes: (templateId, updates) => void;
}
```

### 2. Updated `useBaseElementState.ts`

**Changes:**
- Imported `useNodesStore`
- Enhanced `updateBaseElementStateFn` to automatically update the nodes store when base properties change
- When `positionX`, `positionY`, `width`, or `height` are updated, the corresponding node is updated in the store

**Benefits:**
- Single source of truth for base element state
- Automatic synchronization between form state and visual nodes
- No manual node manipulation required

### 3. Updated `useTemplateConfigState.ts`

**Changes:**
- Imported `useNodesStore`
- Enhanced `updateFn` to update the container node when `width` or `height` changes

**Benefits:**
- Container dimensions stay in sync with config state
- Immediate visual feedback when changing template size

### 4. Simplified `NodeDataProvider.tsx`

**Major Simplification:**
- **Before:** Complex state management with `useNodesState`, manual node creation, syncing with base states
- **After:** Simple wrapper that:
  - Gets nodes from the store
  - Initializes nodes once on mount
  - Provides context for helper lines and interaction states

**Removed Complexity:**
- ❌ No more `useNodesState` hook
- ❌ No more manual container node creation
- ❌ No more element node creation from bases
- ❌ No more syncing effects between base states and nodes
- ❌ No more checking `isDragging`/`isResizing` to prevent updates

**Added:**
- ✅ `templateId` prop and context
- ✅ Single initialization call
- ✅ Direct store access for nodes

### 5. Updated `ReactFlowEditor.tsx`

**Changes:**
- Updated `setNodes` type from `Dispatch<SetStateAction<Node[]>>` to `(nodes: Node[]) => void`
- Changed `onNodesChange` to call `applyNodeChanges` and then `setNodes` with the result

### 6. Updated `CertificateElementContext.tsx`

**Changes:**
- Added `templateId` extraction with fallback
- Passed `templateId` to `NodeDataProvider`

## Benefits

### 1. **Eliminated Redundant State Management**
- Before: Nodes were managed in multiple places (NodeDataProvider, base states, ReactFlow)
- After: Single source of truth in `useNodesStore`

### 2. **Improved Performance**
- No more iterating through all elements to update a single node
- Direct node access by ID
- Batch updates supported

### 3. **Better Separation of Concerns**
- `NodeDataProvider`: Only manages UI state (helper lines, drag/resize flags)
- `useNodesStore`: Manages all node data
- `useBaseElementState`: Manages form state and syncs to store
- `useTemplateConfigState`: Manages config state and syncs to store

### 4. **Type Safety**
- Full TypeScript support
- Proper node type discrimination
- Type-safe update functions

### 5. **Easier to Extend**
- Add new node types by adding creation functions
- Add new update patterns as needed
- Store is isolated and testable

## Data Flow

### Before (Complex):
```
User Input → Base State → NodeDataProvider Effect → Node Recreation → ReactFlow
                      ↓
                  Check isDragging/isResizing → Skip or Update
```

### After (Simple):
```
User Input → Base State → Store Update → ReactFlow
         ↓
    Config State → Store Update → ReactFlow
```

## Migration Notes

### For Adding New Element Types:

1. Create node creation function in `useNodesStore.ts`:
```typescript
function createMyElementNode(element: GQL.CertificateElementUnion): Node<MyNodeData> | null {
  if (element.base.type !== GQL.ElementType.MyType) return null;
  
  return {
    id: element.base.id.toString(),
    type: "myType",
    position: { x: element.base.positionX, y: element.base.positionY },
    width: element.base.width,
    height: element.base.height,
    data: { elementId: element.base.id, /* other data */ },
    connectable: false,
    resizing: true,
  };
}
```

2. Add to `initializeNodes`:
```typescript
if (element.base.type === GQL.ElementType.MyType) {
  return createMyElementNode(element);
}
```

3. Optionally add update function:
```typescript
updateMyElementNodeData: (templateId, elementId, updates) => {
  // Similar to updateTextNodeData
}
```

### For Updating Node Properties:

**From form state:**
```typescript
// In your element state hook
const updateMyElementState = useCallback((action) => {
  updateFn(elementId, action);
  
  // Update node if needed
  if (templateId && action.key === "someProperty") {
    updateMyElementNodeData(templateId, elementId, {
      [action.key]: action.value
    });
  }
}, [updateFn, templateId, elementId]);
```

**Directly:**
```typescript
const updateNode = useNodesStore(state => state.updateNode);
updateNode(templateId, nodeId, { width: 200, height: 100 });
```

## Testing Recommendations

1. **Test node initialization:**
   - Verify nodes are created correctly on first load
   - Check container node is present
   - Verify all element nodes are created

2. **Test node updates:**
   - Position updates during drag
   - Size updates during resize
   - Config updates (container size)
   - Base property updates

3. **Test undo/redo:**
   - Verify history is maintained
   - Check nodes update correctly on undo/redo

4. **Test template switching:**
   - Nodes are isolated per template
   - Switching templates loads correct nodes
   - No node leakage between templates

## Performance Considerations

- **Store updates are batched** by Zustand automatically
- **No unnecessary re-renders** - components only re-render when their specific nodes change
- **Efficient lookups** - nodes are accessed by ID, not by iteration
- **Memory management** - use `clearNodes(templateId)` when unmounting templates

## Future Improvements

1. **Persistence:** Consider persisting node positions to localStorage/DB
2. **Optimistic updates:** Show updates immediately before server confirmation
3. **Conflict resolution:** Handle concurrent edits from multiple users
4. **History management:** Move undo/redo to the nodes store
5. **Snapshots:** Add ability to save/restore node states
