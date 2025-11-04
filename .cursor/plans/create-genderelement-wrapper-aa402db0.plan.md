<!-- aa402db0-b767-4c1c-8c82-ab6a48fcdf5d 15e5c6e6-8c3b-4c3d-a04d-dd1b752677c5 -->
# Create CreateGenderElementWrapper Component

## Overview

Create a wrapper component that manages form state for creating gender elements. The component wraps `GenderElementForm`, handles validation, mutations, and supports both inline and dialog modes (for compact mode).

## File Location

- `client/views/template/manage/editor/addNewNode/wrappers/CreateGenderElementWrapper.tsx`

## Component Structure

### Props Interface

```typescript
interface CreateGenderElementWrapperProps {
  // Dialog mode support (for compact layout)
  open?: boolean;
  onClose?: () => void;
}
```

### Component Responsibilities

1. **State Management**

   - Manage `GenderElementFormState` using React state (from `client/views/template/manage/editor/form/element/gender/types.ts`)
   - Initialize state with default values using enums from `client/graphql/generated/gql/graphql.ts`
   - Use `useState` for `GenderElementFormErrors` (from same types file)
   - Use `useState` for `isSubmitting: boolean`

2. **Context Access**

   - Get `templateId` from `CertificateElementContext` (via `useCertificateElementContext`)
   - Get `language` from `config.state.language` in context

3. **Font Querying**

   - Use `useQuery(fontsQueryDocument)` from `@/client/views/font/hooks/font.documents.ts`
   - Extract `selfHostedFonts` from query result (similar to `CurrentTextElement`)
   - Filter to get only `Font` objects where `type === FontSource.SelfHosted`

4. **Mutations**

   - Use `useElementCreateMutations` hook to get `createGenderElementMutation`
   - Handle mutation on form submission

5. **Validation**

   - Import `validateBaseElementField` from `client/views/template/manage/editor/form/element/base/cretElementBaseValidator.ts`
   - Import `validateTextPropsField` from `client/views/template/manage/editor/form/element/textProps/textPropsValidator.ts`
   - Validate form state before submission
   - Track validation errors for both base and textProps

6. **Form Integration**

   - Wrap `GenderElementForm` component from `client/views/template/manage/editor/form/element/gender/GenderElementForm.tsx`
   - Pass all required props to `GenderElementForm`:
     - `state`: current form state
     - `errors`: validation errors
     - `selfHostedFonts`: from font query
     - `locale`: from context (language)
     - `updateBase`: handler for base element updates
     - `updateTextProps`: handler for text props updates
     - `onSubmit`: handle form submission
     - `onCancel`: handle form cancellation
     - `isSubmitting`: loading state during mutation
     - `submitLabel`: submit button label

7. **Dialog Support**

   - When `open` prop provided, wrap form in MUI `Dialog` component
   - Dialog contains the form
   - Dialog closes on successful creation or cancel
   - If no `open` prop, render form directly

8. **Initial State Setup**

   - Create default `GenderElementFormState` structure:
     - Base element:
       - `name`: "Gender" (default)
       - `description`: "" (empty string)
       - `positionX`: 100 (default)
       - `positionY`: 100 (default)
       - `width`: 200 (default)
       - `height`: 50 (default)
       - `alignment`: `ElementAlignment.Center` (from GraphQL enum)
       - `renderOrder`: 1 (default)
       - `templateId`: from context
     - Text props:
       - `fontRef`: `{ google: { identifier: "Roboto" } }` (default Google font)
       - `fontSize`: 16 (default)
       - `color`: "#000000" (default black)
       - `overflow`: `ElementOverflow.Wrap` (from GraphQL enum)

9. **Submission Handler**

   - Validate form state using validators
   - If valid, call `createGenderElementMutation` with:
     - `variables.input`: complete `GenderElementInput` including `templateId` in base
   - On success: close dialog (if open), call `onClose` callback
   - On error: show error notification using `useNotifications` hook

10. **Update Handlers**

    - `updateBaseElement`: Update base element properties using action pattern `{ key, value }`
    - `updateTextProps`: Update text properties using action pattern `{ key, value }`

11. **Enum Usage**

    - Use `ElementAlignment` enum from `@/client/graphql/generated/gql/graphql` (e.g., `ElementAlignment.Center`)
    - Use `ElementOverflow` enum from GraphQL file (e.g., `ElementOverflow.Wrap`)
    - Use `FontSource` enum from GraphQL file when filtering fonts (e.g., `FontSource.SelfHosted`)
    - Use `ElementType` enum if needed (e.g., `ElementType.Gender`)

## Key Implementation Details

### Default State

Use GraphQL enums for all enum values:

- `ElementAlignment.Center` for default alignment
- `ElementOverflow.Wrap` for default overflow
- `FontSource.SelfHosted` when filtering fonts

### Validation Flow

1. Before submission, validate all fields:

   - Validate base element fields using `validateBaseElementField()`
   - Validate text props fields using `validateTextPropsField()`

2. Collect all errors into `GenderElementFormErrors` structure
3. Only submit if no errors exist

### Mutation Input

The mutation expects `GenderElementInput` which matches the form state structure:

```typescript
{
  base: CertificateElementBaseInput, // includes templateId
  textProps: TextPropsInput
}
```

### Error Handling

- Use `useNotifications` hook for error notifications
- Display validation errors in the form
- Handle mutation errors gracefully

## Key Files to Reference

- `client/views/template/manage/editor/form/element/gender/GenderElementForm.tsx` - Form component to wrap
- `client/views/template/manage/editor/form/element/gender/types.ts` - State and error types
- `client/views/template/manage/editor/form/element/base/cretElementBaseValidator.ts` - Base element validation
- `client/views/template/manage/editor/form/element/textProps/textPropsValidator.ts` - Text props validation
- `client/views/template/manage/editor/form/hooks/useElementCreateMutations.ts` - Mutation hook
- `client/views/template/manage/editor/CertificateElementContext.tsx` - Context for templateId, language
- `client/views/font/hooks/font.documents.ts` - Font query document
- `client/graphql/generated/gql/graphql.ts` - GraphQL types and enums (ElementAlignment, ElementOverflow, FontSource, etc.)
- `client/views/template/manage/editor/miscellaneousPanel/currentElement/CurrentTextElement.tsx` - Reference for font querying pattern

### To-dos

- [ ] Create CreateGenderElementWrapper.tsx file with component structure and props interface
- [ ] Implement state management for GenderElementFormState, errors, and isSubmitting
- [ ] Get templateId and language from CertificateElementContext
- [ ] Query fonts using fontsQueryDocument and filter self-hosted fonts
- [ ] Use useElementCreateMutations hook and implement createGenderElementMutation call
- [ ] Implement validation using validateBaseElementField and validateTextPropsField
- [ ] Create updateBaseElement and updateTextProps handlers
- [ ] Initialize default state with GraphQL enum values (ElementAlignment, ElementOverflow)
- [ ] Wrap GenderElementForm component and pass all required props
- [ ] Add MUI Dialog support for compact mode with open/onClose props
- [ ] Implement form submission with validation and mutation call
- [ ] Add error handling with useNotifications hook