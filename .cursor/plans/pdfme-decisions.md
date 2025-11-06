# PDFMe Integration - Key Decisions & Next Steps

## Key Architectural Decisions

### ✅ Decision 1: Shared State Architecture

**Decision**: Both editors will operate on the same `CertificateElementProvider` state, with separate "view adapters" (NodesStoreProvider for ReactFlow, PdfmeStoreProvider for PDFMe).

**Rationale**:

- Avoids data synchronization complexity
- Single source of truth
- No data loss between editor switches
- Simpler to maintain

**Implementation**:

```
CertificateElementProvider (Single Source of Truth)
    ├── NodesStoreProvider → ReactFlow Editor
    └── PdfmeStoreProvider → PDFMe Editor
```

### ✅ Decision 2: Non-Invasive Integration

**Decision**: Zero modifications to existing ReactFlow editor files. All changes isolated to:

- EditorTab.tsx (add toggle)
- New PDFMe-specific files

**Rationale**:

- Preserves ReactFlow as fallback
- Reduces risk of breaking existing functionality
- Easier to rollback if needed
- Clear separation of concerns

### ✅ Decision 3: Update Flow Strategy

**Decision**: Use update flags to prevent circular updates between editors.

**Rationale**:

- Prevents infinite loops
- Maintains data consistency
- Simple to implement and debug

**Implementation**:

```typescript
const [isUpdatingFromPdfme, setIsUpdatingFromPdfme] = useState(false);

// PDFMe changes
const handlePdfmeChange = newTemplate => {
  setIsUpdatingFromPdfme(true);
  updateElementStates(newTemplate);
  setIsUpdatingFromPdfme(false);
};

// State changes
useEffect(() => {
  if (!isUpdatingFromPdfme) {
    designerRef.current?.updateTemplate(newTemplate);
  }
}, [elementStates]);
```

### ✅ Decision 4: Lifecycle Management

**Decision**: Use `useEffect` with cleanup function for PDFMe Designer lifecycle.

**Rationale**:

- Prevents memory leaks
- Proper cleanup on unmount
- Follows React best practices
- Matches official PDFMe examples

**Implementation**:

```typescript
useEffect(() => {
  // Mount
  designerRef.current = new Designer({...});

  // Unmount
  return () => {
    designerRef.current?.destroy();
    designerRef.current = null;
  };
}, []);
```

### ✅ Decision 5: Conversion Service

**Decision**: Create standalone `TemplateConverter` service for data transformation.

**Rationale**:

- Isolates complex conversion logic
- Testable in isolation
- Reusable across components
- Clear responsibility

### ✅ Decision 6: Phased Implementation

**Decision**: Implement in 4 phases over 4 weeks.

**Rationale**:

- Reduces risk
- Allows for testing at each phase
- Easier to identify issues
- Manageable scope

## Critical Implementation Details

### 1. Position/Size Updates

**Challenge**: When user drags element in PDFMe, we need to update:

1. CertificateElementProvider state
2. NodesStoreProvider (for ReactFlow consistency)
3. GraphQL backend (via mutation)

**Solution**: Reuse existing `useBaseElementState` update flow:

```typescript
// In usePdfmeChange.ts
const handlePdfmePositionChange = (elementId: number, x: number, y: number) => {
  // This already updates both element state AND nodes store
  bases.updateBaseElementStateFn(elementId, {
    key: "positionX",
    value: x,
  });
  bases.updateBaseElementStateFn(elementId, {
    key: "positionY",
    value: y,
  });
};
```

### 2. Undo/Redo Integration

**Challenge**: PDFMe has its own undo/redo, but we need to integrate with existing `useEditorStore` history.

**Solution**: Disable PDFMe's built-in undo/redo, use our own:

```typescript
// In PdfmeEditorWrapper.tsx
const designer = new Designer({
  // ... other options
  // Check if PDFMe supports disabling undo/redo
});

// Use our undo/redo
const { undo, redo } = useNodeData();
```

### 3. Element Type Support

**Phase 1**: Text elements only
**Phase 2**: Add Image, QRCode
**Phase 3**: Add Date, Number, Country (as formatted text)

**Mapping**:

```typescript
const elementTypeToSchema = {
  [ElementType.Text]: "text",
  [ElementType.Image]: "image",
  [ElementType.QRCode]: "qrcode",
  [ElementType.Date]: "text", // with date formatting
  [ElementType.Number]: "text", // with number formatting
  [ElementType.Country]: "text", // with country name
};
```

### 4. Container Handling

**Challenge**: ReactFlow has a "container" node for the certificate background. PDFMe doesn't have this concept.

**Solution**: Use PDFMe's `basePdf` option to set background:

```typescript
const template: Template = {
  basePdf: {
    width: config.width,
    height: config.height,
    // Optional: background color or image
  },
  schemas: [
    // Element schemas here
  ],
};
```

## Files to Create

### Core Files (Phase 1)

1. **`client/views/template/manage/editor/services/templateConverter.ts`**
   - Convert elements to PDFMe template
   - Convert PDFMe changes to element updates
   - ~300 lines

2. **`client/views/template/manage/editor/PdfmeStoreProvider.tsx`**
   - Provide PDFMe template from element states
   - Handle template updates
   - ~200 lines

3. **`client/views/template/manage/editor/PdfmeEditorWrapper.tsx`**
   - Wrap PDFMe Designer
   - Lifecycle management
   - Bidirectional sync
   - ~250 lines

4. **`client/views/template/manage/editor/usePdfmeChange.ts`**
   - Handle PDFMe changes
   - Convert to element updates
   - ~150 lines

5. **`client/views/template/manage/editor/components/EditorToggle.tsx`**
   - Toggle UI component
   - ~50 lines

6. **`client/views/template/manage/editor/types/pdfme.ts`**
   - TypeScript types for PDFMe integration
   - ~100 lines

### Modified Files (Phase 1)

1. **`client/views/template/manage/editor/EditorTab.tsx`**
   - Add editor toggle state
   - Add toggle UI
   - Conditional rendering
   - Wrap in PdfmeStoreProvider
   - ~50 lines added

## Dependencies to Install

```bash
bun add @pdfme/ui @pdfme/common @pdfme/schemas
```

**Package Sizes**:

- @pdfme/ui: ~150KB
- @pdfme/common: ~20KB
- @pdfme/schemas: ~50KB
- **Total**: ~220KB (acceptable)

## Testing Checklist

### Unit Tests

- [ ] TemplateConverter.toPdfmeTemplate()
- [ ] TemplateConverter.fromPdfmeTemplate()
- [ ] TemplateConverter.elementToSchema()
- [ ] TemplateConverter.schemaToElementUpdate()
- [ ] PdfmeStoreProvider state management
- [ ] usePdfmeChange update logic

### Integration Tests

- [ ] PDFMe → State synchronization
- [ ] State → PDFMe synchronization
- [ ] Circular update prevention
- [ ] Editor toggle functionality
- [ ] Memory cleanup on unmount

### E2E Tests

- [ ] Create text element in ReactFlow, view in PDFMe
- [ ] Create text element in PDFMe, view in ReactFlow
- [ ] Edit position in PDFMe, verify in ReactFlow
- [ ] Edit size in PDFMe, verify in ReactFlow
- [ ] Undo/redo across editors
- [ ] Switch editors multiple times

### Performance Tests

- [ ] No memory leaks on editor toggle
- [ ] Conversion performance (<100ms)
- [ ] Update performance (<50ms)
- [ ] Bundle size impact (<300KB)

## Questions for Discussion

### 1. Font Handling

**Question**: How should we map custom fonts between ReactFlow and PDFMe?

**Options**:

- A) Use font family name directly (may not work if font not loaded in PDFMe)
- B) Create font mapping service
- C) Load all fonts in PDFMe upfront

**Recommendation**: Option B - Create font mapping service

### 2. Image Upload

**Question**: How should image upload work in PDFMe editor?

**Options**:

- A) Disable image upload in PDFMe (use ReactFlow only)
- B) Implement custom image upload handler
- C) Use PDFMe's built-in image upload

**Recommendation**: Option A for Phase 1, Option B for Phase 3

### 3. Validation

**Question**: Should validation rules apply in PDFMe editor?

**Options**:

- A) Yes, validate on every change
- B) Yes, validate on save only
- C) No, trust PDFMe's validation

**Recommendation**: Option B - Validate on save

### 4. Default Editor

**Question**: Which editor should be the default?

**Options**:

- A) ReactFlow (current)
- B) PDFMe (new)
- C) User preference (saved in localStorage)

**Recommendation**: Option A for Phase 1-3, Option C for Phase 4

### 5. Feature Parity

**Question**: Should PDFMe editor support all ReactFlow features?

**Features to consider**:

- Helper lines (snapping)
- Undo/redo
- Copy/paste
- Keyboard shortcuts
- Multi-select
- Alignment tools

**Recommendation**: Start with basic features, add advanced features in Phase 3

## Next Steps

### Immediate (This Week)

1. **Review this plan** with team
   - Discuss architectural decisions
   - Answer open questions
   - Get buy-in from stakeholders

2. **Research PDFMe playground**
   - Review official implementation
   - Identify best practices
   - Validate our assumptions

3. **Set up development environment**
   - Install PDFMe packages
   - Create feature branch
   - Set up testing framework

### Week 1 (Phase 1)

1. **Day 1-2**: Create TemplateConverter service
   - Implement basic conversion logic
   - Write unit tests
   - Handle text elements only

2. **Day 3-4**: Create PdfmeStoreProvider
   - Implement template generation
   - Integrate with CertificateElementProvider
   - Write unit tests

3. **Day 5**: Create PdfmeEditorWrapper
   - Basic Designer instantiation
   - Lifecycle management
   - Read-only mode

### Week 2 (Phase 2)

1. **Day 1**: Implement editor toggle
   - Modify EditorTab.tsx
   - Create EditorToggle component
   - Test switching

2. **Day 2-3**: Implement upstream sync
   - Handle onChangeTemplate
   - Convert changes to updates
   - Update element states

3. **Day 4-5**: Implement downstream sync
   - Subscribe to state changes
   - Update PDFMe template
   - Prevent circular updates

### Week 3 (Phase 3)

1. **Day 1-2**: Add image support
   - Extend TemplateConverter
   - Test image elements

2. **Day 3**: Add QRCode support
   - Extend TemplateConverter
   - Test QRCode elements

3. **Day 4-5**: Add formatted text support
   - Date formatting
   - Number formatting
   - Country names

### Week 4 (Phase 4)

1. **Day 1-2**: UI/UX improvements
   - Better toggle UI
   - Loading states
   - Error handling

2. **Day 3**: Documentation
   - User guide
   - Developer docs
   - Migration guide

3. **Day 4-5**: Testing & QA
   - Comprehensive testing
   - Performance testing
   - Bug fixes

## Success Metrics

### Functional Metrics

- [ ] Both editors work independently
- [ ] State synchronization works correctly
- [ ] No data loss on editor switch
- [ ] All element types supported

### Performance Metrics

- [ ] No memory leaks (verified with Chrome DevTools)
- [ ] Conversion time < 100ms
- [ ] Update time < 50ms
- [ ] Bundle size increase < 300KB

### Quality Metrics

- [ ] 80%+ test coverage
- [ ] Zero critical bugs
- [ ] Zero data corruption issues
- [ ] Positive user feedback

## Risk Register

| Risk                    | Probability | Impact   | Mitigation                                 |
| ----------------------- | ----------- | -------- | ------------------------------------------ |
| State sync issues       | Medium      | High     | Comprehensive testing, update flags        |
| Memory leaks            | Low         | High     | Proper lifecycle management, profiling     |
| Performance degradation | Low         | Medium   | Memoization, lazy loading, monitoring      |
| User confusion          | Medium      | Low      | Clear UI, documentation, training          |
| Data loss               | Low         | Critical | Validation, error handling, backups        |
| PDFMe limitations       | Medium      | Medium   | Research playground, fallback to ReactFlow |

## Rollback Plan

If critical issues arise:

1. **Immediate**: Disable PDFMe editor via feature flag
2. **Short-term**: Fix issues, re-enable for testing
3. **Long-term**: If unfixable, remove PDFMe integration

**Rollback triggers**:

- Critical data loss bug
- Severe performance degradation
- Memory leaks causing crashes
- Negative user feedback (>50%)

## Communication Plan

### Stakeholders

- Development team
- QA team
- Product manager
- End users

### Updates

- **Weekly**: Progress updates to team
- **Bi-weekly**: Demo to stakeholders
- **Monthly**: User feedback review

### Documentation

- Technical documentation (for developers)
- User guide (for end users)
- Migration guide (for existing users)
- Troubleshooting guide (for support)

## Conclusion

This plan provides a comprehensive roadmap for integrating PDFMe editor alongside the existing ReactFlow editor. The key principles are:

1. **Non-invasive**: Preserve existing functionality
2. **Shared state**: Single source of truth
3. **Phased approach**: Reduce risk, allow testing
4. **Quality focus**: Comprehensive testing, documentation

By following this plan, we can successfully integrate PDFMe while maintaining the stability and reliability of the existing system.
