# Font Refactor TypeScript Fixes Plan

## Overview

After running `bun tsc`, there are **20 TypeScript errors** remaining that need to be fixed. All errors are server-side and fall into 3 main categories:

1. **Pothos GraphQL Schema Mismatches** (10 errors)
2. **Server Utility Type Incompatibilities** (8 errors)
3. **Common Element Utils Property Access** (2 errors)

## Current Error Analysis

### 1. Pothos Schema Definition Errors (10 errors)

**Files with errors:**

- `server/graphql/pothos/element/date.element.pothos.ts` (2 errors)
- `server/graphql/pothos/element/gender.element.pothos.ts` (2 errors)
- `server/graphql/pothos/element/number.element.pothos.ts` (2 errors)
- `server/graphql/pothos/element/text.element.pothos.ts` (2 errors)
- `server/graphql/pothos/element/textProps.pothos.ts` (2 errors)

**Root Cause:** Pothos schema definitions still expect old font reference structure:

- Google fonts: `{ identifier: string }` → should be `{ family: FontFamily, variant: string }`
- Self-hosted fonts: `{ fontId: number }` → should be `{ fontVariantId: number }`

### 2. Server Element Utils Type Incompatibility (8 errors)

**Files with errors:**

- `server/utils/element/date.element.utils.ts` (2 errors)
- `server/utils/element/gender.element.utils.ts` (2 errors)
- `server/utils/element/number.element.utils.ts` (2 errors)
- `server/utils/element/text.element.utils.ts` (2 errors)

**Root Cause:** Type mismatch between different GraphQL input type definitions. The element utils are importing `TextPropsInputGraphql` from `config.element.inputGql` but the functions expect it from `textProps.inputGql`.

### 3. Common Element Utils Property Access (2 errors)

**File:** `server/utils/element/common.element.utils.ts`

**Root Cause:** Code is trying to access old properties:

- `fontRef.google.family` and `fontRef.google.variant` don't exist (should be accessing new structure)
- `fontRef.selfHosted.fontVariantId` doesn't exist (type still expects `fontId`)

## Detailed Fix Plan

### Priority 1: Fix Pothos Schema Definitions (Critical)

**Impact:** 10 compilation errors

**Files to fix:**

1. `server/graphql/pothos/element/textProps.pothos.ts`
   - Update `GoogleFontReferenceInput` to use `family` and `variant` instead of `identifier`
   - Update `SelfHostedFontReferenceInput` to use `fontVariantId` instead of `fontId`

2. Element Pothos files (will auto-resolve after textProps fix):
   - `server/graphql/pothos/element/date.element.pothos.ts`
   - `server/graphql/pothos/element/gender.element.pothos.ts`
   - `server/graphql/pothos/element/number.element.pothos.ts`
   - `server/graphql/pothos/element/text.element.pothos.ts`

### Priority 2: Fix Common Element Utils (Critical)

**Impact:** 2 compilation errors

**File:** `server/utils/element/common.element.utils.ts`

- Update property access to match new GraphQL input types
- Fix `fontRef.google.family` and `fontRef.google.variant` access
- Fix `fontRef.selfHosted.fontVariantId` access

### Priority 3: Fix Element Utils Type Imports (Critical)

**Impact:** 8 compilation errors

**Files:** All element utils files

- The type incompatibility will resolve automatically once the Pothos schemas are fixed
- No direct code changes needed in these files

## Implementation Strategy

### Step 1: Update textProps.pothos.ts

This is the root cause - fixing this will resolve most other errors.

### Step 2: Update common.element.utils.ts

Fix property access to match the new structure.

### Step 3: Verify Resolution

Run `bun tsc` to confirm all errors are resolved.

## Expected Outcome

After fixing the 2 root cause files:

- **10 Pothos errors** → Resolved (schema alignment)
- **8 Element utils errors** → Resolved (type compatibility)
- **2 Common utils errors** → Resolved (property access)

**Total: 20 errors → 0 errors**

## Success Criteria

- `bun tsc --noEmit` passes without errors
- GraphQL schema generation works
- Server starts without type errors
