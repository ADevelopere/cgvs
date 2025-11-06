# PDFMe Editor Integration Plan

## Executive Summary

This document outlines the architectural plan for integrating a new PDFMe-based editor alongside the existing ReactFlow editor in the CGVS application. The integration will be non-invasive, maintaining the current ReactFlow editor as a fallback while introducing PDFMe as an alternative editing mechanism.

## Current State Analysis

### Existing Architecture

The current ReactFlow editor uses a multi-layered state management architecture:

1. **NodesStoreProvider** (`NodesStateProvider.tsx`)
   - Manages ReactFlow nodes array
   - Fetches elements and config from GraphQL
   - Provides CRUD operations for nodes
   - Converts GraphQL elements to ReactFlow nodes

2. **CertificateElementProvider** (`CertificateElementContext.tsx`)
   - Manages element-specific states (text props, image props, etc.)
   - Provides hooks for different element types
   - Manages template config state
   - Manages template variables

3. **useNodeData Hook** (`NodeDataProvider.tsx`)
   - Combines NodesStoreProvider and CertificateElementProvider
   - Provides unified interface for position/size updates
   - Manages undo/redo history
   - Handles helper lines for snapping

4. **useEditorStore** (`useEditorStore.ts`)
   - Zustand store for editor UI state
   - Manages undo/redo history
   - Manages current selected element
   - Manages miscellaneous panel tab state

5. **useBaseElementState** (`form/hooks/useBaseElementState.ts`)
   - Manages base element properties (position, size, alignment)
   - Syncs with both GraphQL backend and NodesStore
   - Provides validation and error handling

### Data Flow

```
GraphQL Backend
    ↓ (fetch)
CertificateElementProvider (element states)
    ↓
NodesStoreProvider (ReactFlow nodes)
    ↓
useNodeData (unified interface)
    ↓
ReactFlow Editor (visual representation)
    ↓ (user interaction)
useApplyNodeChange (position/size changes)
    ↓
useBaseElementState (update element states)
    ↓ (mutation)
GraphQL Backend
```

### Key Observations

1. **Dual State Management**: Element data exists in two forms:
   - GraphQL element objects (in CertificateElementProvider)
   - ReactFlow nodes (in NodesStoreProvider)

2. **Synchronization Points**:
   - `useBaseElementState` updates both element states and nodes
   - Position/size changes flow through multiple layers
   - Undo/redo managed separately in useEditorStore

3. **Element Types**: Currently supports:
   - Text elements
   - Container (certificate background)
   - (More types to be added: Image, QRCode, Date, Number, Country)

## PDFMe Integration Architecture

### Core Principles

1. **Non-Invasive**: Zero modifications to existing ReactFlow editor files
2. **Shared State**: Both editors operate on the same underlying data
3. **Single Source of Truth**: CertificateElementProvider remains the canonical state
4. **No Data Syncing**: PDFMe editor directly updates the same state as ReactFlow

### Proposed Architecture

```
                    GraphQL Backend
                           ↓
              CertificateElementProvider
                    (Single Source of Truth)
                    /                    \
                   /                      \
    NodesStoreProvider              PdfmeStoreProvider
    (ReactFlow nodes)               (PDFMe template)
           ↓                                ↓
    ReactFlow Editor                 PDFMe Editor
           ↓                                ↓
    useApplyNodeChange              usePdfmeChange
           ↓                                ↓
         useBaseElementState (shared update layer)
                           ↓
                    GraphQL Backend
```

### Key Components

#### 1. PdfmeStoreProvider (NEW)

**Location**: `client/views/template/manage/editor/PdfmeStoreProvider.tsx`

**Responsibilities**:
- Convert CertificateElementProvider state to PDFMe Template format
- Provide PDFMe template object
- Provide update functions for PDFMe changes
- Handle PDFMe-specific state (selected schema, etc.)

**Interface**:
```typescript
interface UsePdfmeStoreReturn {
  // PDFMe template object
  template: Template;
  
  // Loading state
  loading: boolean;
  
  // Error state
  error: Error | null;
  
  // Template ID
  templateId: number;
  
  // Update template (called by PDFMe editor)
  updateTemplate: (newTemplate: Template) => void;
  
  // Initialized flag
  pdfmeInitialized: boolean;
}
```

#### 2. PdfmeEditorWrapper (NEW)

**Location**: `client/views/template/manage/editor/PdfmeEditorWrapper.tsx`

**Responsibilities**:
- Wrap PDFMe Designer component
- Manage Designer lifecycle (mount/unmount)
- Handle bidirectional sync between PDFMe and state
- Register PDFMe plugins (text, image, qrcode)

**Key Features**:
- Uses `useRef` for Designer instance
- Uses `useEffect` for lifecycle management
- Calls `designer.destroy()` on unmount
- Registers `onChangeTemplate` callback for upstream sync
- Subscribes to state changes for downstream sync

#### 3. TemplateConverter Service (NEW)

**Location**: `client/views/template/manage/editor/services/templateConverter.ts`

**Responsibilities**:
- Convert CertificateElementProvider state to PDFMe Template
- Convert PDFMe Template changes back to element updates
- Handle schema mapping (text, image, qrcode, etc.)
- Handle coordinate system differences (if any)

**Interface**:
```typescript
class TemplateConverter {
  // Convert element states to PDFMe template
  static toPdfmeTemplate(
    elements: CertificateElementUnion[],
    config: TemplateConfig
  ): Template;
  
  // Convert PDFMe template changes to element updates
  static fromPdfmeTemplate(
    template: Template,
    currentElements: CertificateElementUnion[]
  ): ElementUpdate[];
  
  // Convert single element to PDFMe schema
  static elementToSchema(
    element: CertificateElementUnion
  ): Schema;
  
  // Convert PDFMe schema to element update
  static schemaToElementUpdate(
    schema: Schema,
    elementId: number
  ): ElementUpdate;
}
```

#### 4. usePdfmeChange Hook (NEW)

**Location**: `client/views/template/manage/editor/usePdfmeChange.ts`

**Responsibilities**:
- Handle PDFMe template changes
- Convert changes to element updates
- Call useBaseElementState to update shared state
- Manage undo/redo integration

**Similar to**: `useApplyNodeChange.ts` (but for PDFMe)

#### 5. EditorTab Modifications

**Location**: `client/views/template/manage/editor/EditorTab.tsx`

**Changes**:
- Add editor toggle state (`'reactflow' | 'pdfme'`)
- Add toggle UI (tabs or buttons)
- Conditionally render ReactFlow or PDFMe editor
- Wrap PDFMe editor in PdfmeStoreProvider

**Example**:
```tsx
const [activeEditor, setActiveEditor] = useState<'reactflow' | 'pdfme'>('reactflow');

return (
  <NodesStoreProvider templateId={template.id}>
    <CertificateElementProvider templateId={template.id}>
      <PdfmeStoreProvider templateId={template.id}>
        {/* Toggle UI */}
        <EditorToggle 
          activeEditor={activeEditor} 
          onToggle={setActiveEditor} 
        />
        
        {/* Conditional rendering */}
        {activeEditor === 'reactflow' && (
          <CertificateReactFlowEditor />
        )}
        
        {activeEditor === 'pdfme' && (
          <PdfmeEditorWrapper />
        )}
      </PdfmeStoreProvider>
    </CertificateElementProvider>
  </NodesStoreProvider>
);
```

## State Synchronization Strategy

### Challenge: Avoiding Circular Updates

When PDFMe editor updates position, we need to:
1. Update CertificateElementProvider state
2. Update NodesStoreProvider (for ReactFlow)
3. NOT trigger PDFMe update (would cause infinite loop)

### Solution: Update Flags

```typescript
// In PdfmeStoreProvider
const [isUpdatingFromPdfme, setIsUpdatingFromPdfme] = useState(false);

// When PDFMe changes
const handlePdfmeChange = (newTemplate: Template) => {
  setIsUpdatingFromPdfme(true);
  // Update element states
  updateElementStates(newTemplate);
  setIsUpdatingFromPdfme(false);
};

// When element states change
useEffect(() => {
  if (!isUpdatingFromPdfme && designerRef.current) {
    // Update PDFMe only if change came from elsewhere
    designerRef.current.updateTemplate(newTemplate);
  }
}, [elementStates, isUpdatingFromPdfme]);
```

### Alternative: Debouncing

Use debouncing to prevent rapid updates:
```typescript
const debouncedUpdatePdfme = useMemo(
  () => debounce((template: Template) => {
    designerRef.current?.updateTemplate(template);
  }, 100),
  []
);
```

## PDFMe Schema Mapping

### Element Type to PDFMe Schema

| Element Type | PDFMe Schema | Plugin Required |
|--------------|--------------|-----------------|
| Text         | text         | @pdfme/schemas  |
| Image        | image        | @pdfme/schemas  |
| QRCode       | qrcode       | @pdfme/schemas (barcodes) |
| Date         | text         | @pdfme/schemas (formatted) |
| Number       | text         | @pdfme/schemas (formatted) |
| Country      | text         | @pdfme/schemas (formatted) |
| Container    | N/A          | (background only) |

### Property Mapping

| Element Property | PDFMe Property | Notes |
|------------------|----------------|-------|
| positionX        | position.x     | Direct mapping |
| positionY        | position.y     | Direct mapping |
| width            | width          | Direct mapping |
| height           | height         | Direct mapping |
| alignment        | alignment      | May need conversion |
| hidden           | N/A            | Handle in converter |
| renderOrder      | N/A            | Handle via schema order |

### Text-Specific Properties

| Element Property | PDFMe Property | Notes |
|------------------|----------------|-------|
| content          | text           | Direct mapping |
| fontSize         | fontSize       | Direct mapping |
| fontFamily       | fontName       | May need font mapping |
| fontColor        | fontColor      | Direct mapping |
| fontWeight       | N/A            | Handle via font variant |
| textAlign        | alignment      | Direct mapping |
| lineHeight       | lineHeight     | Direct mapping |

## Implementation Phases

### Phase 1: Foundation (Week 1)

1. **Install PDFMe packages**
   ```bash
   bun add @pdfme/ui @pdfme/common @pdfme/schemas
   ```

2. **Create TemplateConverter service**
   - Implement basic conversion logic
   - Handle text elements only
   - Unit tests for conversion

3. **Create PdfmeStoreProvider**
   - Basic template generation
   - No updates yet (read-only)
   - Integration with CertificateElementProvider

4. **Create PdfmeEditorWrapper**
   - Basic Designer instantiation
   - Lifecycle management
   - Read-only mode

### Phase 2: Basic Integration (Week 2)

1. **Implement editor toggle in EditorTab**
   - Add toggle UI
   - Conditional rendering
   - State management

2. **Implement upstream sync (PDFMe → State)**
   - Handle onChangeTemplate callback
   - Convert template changes to element updates
   - Update CertificateElementProvider

3. **Implement downstream sync (State → PDFMe)**
   - Subscribe to element state changes
   - Update PDFMe template
   - Prevent circular updates

4. **Testing**
   - Manual testing of both editors
   - Verify state synchronization
   - Check for memory leaks

### Phase 3: Advanced Features (Week 3)

1. **Add support for more element types**
   - Image elements
   - QRCode elements
   - Date/Number/Country (as formatted text)

2. **Implement undo/redo integration**
   - Sync with useEditorStore
   - Handle PDFMe-specific history

3. **Add PDFMe-specific features**
   - Schema selection
   - Advanced text formatting
   - Image upload/management

4. **Performance optimization**
   - Debouncing
   - Memoization
   - Lazy loading

### Phase 4: Polish & Migration (Week 4)

1. **UI/UX improvements**
   - Better toggle UI
   - Loading states
   - Error handling

2. **Documentation**
   - User guide
   - Developer documentation
   - Migration guide

3. **Testing & QA**
   - Comprehensive testing
   - Performance testing
   - User acceptance testing

4. **Migration strategy**
   - Feature flag for PDFMe editor
   - Gradual rollout
   - Fallback to ReactFlow if needed

## Technical Considerations

### Memory Management

**Critical**: PDFMe Designer must be properly destroyed on unmount to prevent memory leaks.

```typescript
useEffect(() => {
  // Mount
  if (domContainerRef.current) {
    designerRef.current = new Designer({
      domContainer: domContainerRef.current,
      template: initialTemplate,
      plugins: { text, image, qrcode: barcodes.qrcode }
    });
  }
  
  // Unmount
  return () => {
    if (designerRef.current) {
      designerRef.current.destroy();
      designerRef.current = null;
    }
  };
}, []); // Empty deps - only run on mount/unmount
```

### Performance Considerations

1. **Conversion Performance**: Template conversion should be memoized
2. **Update Frequency**: Debounce rapid updates
3. **Render Performance**: Use React.memo for expensive components
4. **Bundle Size**: PDFMe adds ~200KB to bundle (acceptable)

### Error Handling

1. **Conversion Errors**: Gracefully handle unsupported element types
2. **PDFMe Errors**: Catch and log Designer errors
3. **State Sync Errors**: Prevent state corruption
4. **Fallback**: Always allow switching back to ReactFlow

### Browser Compatibility

PDFMe requires:
- Modern browsers (ES6+)
- Canvas API support
- No IE11 support (acceptable for this project)

## Dependencies

### Required Packages

```json
{
  "@pdfme/ui": "^4.0.0",
  "@pdfme/common": "^4.0.0",
  "@pdfme/schemas": "^4.0.0"
}
```

### Existing Dependencies (Already Available)

- React 19.2.0
- TypeScript 5.9.3
- Zustand 5.0.8
- @apollo/client 4.0.9

## File Structure

```
client/views/template/manage/editor/
├── EditorTab.tsx (MODIFIED)
├── ReactFlowEditor.tsx (UNCHANGED)
├── PdfmeEditorWrapper.tsx (NEW)
├── PdfmeStoreProvider.tsx (NEW)
├── usePdfmeChange.ts (NEW)
├── services/
│   └── templateConverter.ts (NEW)
├── components/
│   └── EditorToggle.tsx (NEW)
└── types/
    └── pdfme.ts (NEW)
```

## Testing Strategy

### Unit Tests

1. **TemplateConverter**
   - Test element to schema conversion
   - Test schema to element conversion
   - Test edge cases (missing properties, invalid data)

2. **PdfmeStoreProvider**
   - Test template generation
   - Test state updates
   - Test error handling

### Integration Tests

1. **State Synchronization**
   - Test PDFMe → State updates
   - Test State → PDFMe updates
   - Test circular update prevention

2. **Editor Switching**
   - Test toggle functionality
   - Test state preservation
   - Test memory cleanup

### E2E Tests

1. **User Workflows**
   - Create element in ReactFlow, view in PDFMe
   - Create element in PDFMe, view in ReactFlow
   - Edit element in both editors
   - Undo/redo across editors

## Migration Strategy

### Phase 1: Internal Testing (Week 1-2)
- PDFMe editor available via feature flag
- Internal team testing only
- Gather feedback and fix issues

### Phase 2: Beta Testing (Week 3)
- Enable for select users
- Monitor for issues
- Collect user feedback

### Phase 3: Gradual Rollout (Week 4)
- Enable for all users
- ReactFlow remains default
- Users can opt-in to PDFMe

### Phase 4: Full Migration (Future)
- PDFMe becomes default
- ReactFlow available as fallback
- Deprecation plan for ReactFlow (if desired)

## Risk Mitigation

### Risk 1: State Synchronization Issues
**Mitigation**: Comprehensive testing, update flags, debouncing

### Risk 2: Performance Degradation
**Mitigation**: Memoization, lazy loading, performance monitoring

### Risk 3: Memory Leaks
**Mitigation**: Proper lifecycle management, memory profiling

### Risk 4: User Confusion
**Mitigation**: Clear UI, documentation, gradual rollout

### Risk 5: Data Loss
**Mitigation**: Validation, error handling, backup strategy

## Success Criteria

1. **Functional**: Both editors work independently and in tandem
2. **Performance**: No noticeable performance degradation
3. **Stability**: No memory leaks or crashes
4. **UX**: Smooth editor switching, clear UI
5. **Data Integrity**: No data loss or corruption
6. **Maintainability**: Clean code, good documentation

## Next Steps

1. **Review this plan** with the team
2. **Validate assumptions** about PDFMe capabilities
3. **Review official PDFMe playground** code for best practices
4. **Create detailed technical specifications** for each component
5. **Set up development environment** with PDFMe packages
6. **Begin Phase 1 implementation**

## Questions to Resolve

1. **Font Handling**: How to map custom fonts between systems?
2. **Image Storage**: How to handle image uploads in PDFMe?
3. **Validation**: What validation rules apply to PDFMe elements?
4. **Permissions**: Do element permissions apply in PDFMe?
5. **Variables**: How to handle template variables in PDFMe?
6. **Localization**: Does PDFMe support RTL languages?

## References

- PDFMe Documentation: https://pdfme.com/docs
- PDFMe Playground: https://github.com/pdfme/pdfme/tree/main/playground
- ReactFlow Documentation: https://reactflow.dev/
- Current codebase: `.cursor/reactflow.md`
- Research notes: `.cursor/plans/Gemini.md`
