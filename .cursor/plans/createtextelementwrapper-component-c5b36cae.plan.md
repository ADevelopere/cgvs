<!-- c5b36cae-5840-424e-966d-9094439ed420 c9387910-38c3-4834-b40d-a4686e1b76cd -->
# Create CreateTextElementWrapper Component

## Overview

Create a wrapper component that manages form state, validation, and submission for creating new text elements. The component supports pre-configured data sources and can render in a dialog (compact mode) or inline.

## File to Create

- `client/views/template/manage/editor/addNewNode/wrappers/CreateTextElementWrapper.tsx`

## Component Structure

### Props Interface

```typescript
interface CreateTextElementWrapperProps {
  // Pre-configured data source (mutually exclusive)
  initialStudentField?: StudentTextField;
  initialCertificateField?: CertificateTextField;
  initialTemplateTextVariable?: { variableId: number };
  initialTemplateSelectVariable?: { variableId: number };
  
  // Dialog mode (for compact layout)
  open?: boolean;
  onClose?: () => void;
}
```

### State Management

- Use `useState` for `TextElementFormState` (from `client/views/template/manage/editor/form/element/text/types.ts`)
- Initialize with default values and apply pre-configured data source props
- Use `useState` for `TextElementFormErrors` (from same types file)
- Use `useState` for `isSubmitting: boolean`

### Data Sources

- Get `templateId` from `useCertificateElementContext()`
- Get `textVariables`, `selectVariables` from context
- Get `language` from `context.config.state.language`
- Query fonts using `fontsQueryDocument` from `client/views/font/hooks/font.documents.ts`
- Filter self-hosted fonts from query result

### Mutations

- Use `useElementCreateMutations()` hook
- Call `createTextElementMutation` with `{ variables: { input: state } }`
- On success: close dialog (if open) and trigger elements list refresh (via cache update)

### Validation

- Validate base element using validators from `client/views/template/manage/editor/form/element/base`
- Validate text props using `validateTextPropsField` from `client/views/template/manage/editor/form/element/textProps/textPropsValidator.ts`
- Validate data source using `validateTextDataSource` from `client/views/template/manage/editor/form/element/text/textValidators.ts`
- Run validation before submission
- Display errors in form

### Default State Initialization

- Base element: default name, position (100, 100), dimensions (200, 50), alignment Center, renderOrder 1, templateId from context
- Text props: default font (Roboto), fontSize 16, color #000000, overflow Wrap
- Data source: apply pre-configured prop (studentField, certificateField, templateTextVariable, or templateSelectVariable), or default to static value

### Form Component

- Wrap `TextElementForm` from `client/views/template/manage/editor/form/element/text/TextElementForm.tsx`
- Pass all required props: state, errors, update functions, language, variables, fonts, callbacks

### Dialog Support

- If `open` prop provided, render MUI Dialog
- Dialog contains the form
- Dialog closes on successful creation or cancel
- If no `open` prop, render form directly

### Update Functions

- `updateBaseElement`: Update base state using action pattern
- `updateTextProps`: Update textProps state using action pattern  
- `updateDataSource`: Set dataSource directly

### Submission Flow

1. Validate all fields
2. Set `isSubmitting` to true
3. Call `createTextElementMutation` with state
4. On success: close dialog (if open), reset state, clear errors
5. On error: display error, set `isSubmitting` to false

## Key Files to Reference

- `client/views/template/manage/editor/form/element/text/TextElementForm.tsx` - Form component to wrap
- `client/views/template/manage/editor/form/element/text/types.ts` - State and error types
- `client/views/template/manage/editor/form/element/text/textValidators.ts` - Data source validation
- `client/views/template/manage/editor/form/hooks/useElementCreateMutations.ts` - Mutation hook
- `client/views/template/manage/editor/CertificateElementContext.tsx` - Context for templateId, variables, language
- `client/views/font/hooks/font.documents.ts` - Fonts query document
- `client/views/template/manage/editor/miscellaneousPanel/currentElement/CurrentTextElement.tsx` - Example of font query usage

## Implementation Details

- Use MUI Dialog component when `open` prop is provided
- Use `useQuery` from Apollo Client for fonts query
- Use logger from `client/lib/logger` for error logging
- Follow existing patterns from `CurrentTextElement` for context usage
- Default state structure from `TextElementForm.stories.tsx` and test page examples

### To-dos

- [ ] Create CreateTextElementWrapper.tsx with props interface, state management, and basic structure
- [ ] Implement default state initialization with pre-configured data source support
- [ ] Get templateId, variables, language from CertificateElementContext and query fonts
- [ ] Implement validation for base element, text props, and data source before submission
- [ ] Implement createTextElementMutation with success/error handling
- [ ] Add MUI Dialog support for compact mode with open/onClose props
- [ ] Integrate TextElementForm component with all required props and update handlers