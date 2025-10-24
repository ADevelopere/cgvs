# Deprecation Comment Template

Add this comment at the top of each deprecated file:

```typescript
/**
 * @deprecated This file is no longer used after the Table refactor to renderer-based architecture.
 * It will be removed during manual cleanup. Do not use in new code.
 * See client/components/Table/renderers/ for replacement components.
 */
```
