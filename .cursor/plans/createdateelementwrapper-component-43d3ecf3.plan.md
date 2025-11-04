<!-- 43d3ecf3-8c90-42c2-9998-d8b7cccc4b8f 2d235a09-a5df-4393-9020-6a6c4fc3ce80 -->
# Create CreateDateElementWrapper Component

## Overview

Create a wrapper component that manages form state for creating date elements. The component wraps `DateElementForm`, handles validation, mutations, and supports both inline and dialog modes (for compact mode).

## File Location

- `client/views/template/manage/editor/addNewNode/wrappers/CreateDateElementWrapper.tsx`

## Component Structure

### Props Interface

```typescript
interface CreateDateElementWrapperProps {
  // Optional pre-configured data source props
  initialStudentField?: StudentDateField;
  initialTransformation?: DateTransformationType;
  templateVariable?: TemplateDateVariable; // or variableId
  
  // Dialog mode support
  inDialog?: boolean;
  onClose?: () => void;
}
```

### Component Responsibilities

1. **State Management**

   - Manage `DateElementFormState` using React state
   - Initialize state with default values
   - Apply pre-configured props (initialStudentField, initialTransformation, templateVariable) to initial state

2. **Context Access**

   - Get `templateId` from `CertificateElementContext` (via `useCertificateElementContext`)
   - Get `dateVariables` from context
   - Get `language` from `config.state.language` in context

3. **Font Querying**

   - Use `useQuery(fontsQueryDocument)` from `@/client/views/font/hooks`
   - Extract `selfHostedFonts` from query result (similar to `CurrentTextElement`)

4. **Mutations**

   - Use `useElementCreateMutations` hook to get `createDateElementMutation`
   - Handle mutation on form submission

5. **Validation**

   - Import validators from `client/views/template/manage/editor/form/element/date/dateValidators.ts`
   - Validate form state before submission
   - Track validation errors

6. **Form Integration**

   - Wrap `DateElementForm` component
   - Pass all required props to `DateElementForm`:
     - `state`: current form state
     - `errors`: validation errors
     - `updateBaseElement`: handler for base element updates
     - `updateTextProps`: handler for text props updates
     - `updateDateProps`: handler for date props updates
     - `updateDataSource`: handler for data source updates
     - `language`: from context
     - `dateVariables`: from context
     - `selfHostedFonts`: from font query
     - `onSubmit`: handle form submission
     - `onCancel`: handle form cancellation
     - `isSubmitting`: loading state during mutation
     - `submitLabel`: submit button label

7. **Dialog Support**

   - When `inDialog={true}`, wrap form in MUI `Dialog` component
   - Handle dialog open/close state
   - Close dialog on successful creation or cancel

8. **Initial State Setup**

   - Create default `DateElementInput` structure:
     - Base element: default position, size, alignment, etc.
     - Text props: default font, size, color
     - Date props: default format, calendar type
     - Data source: apply pre-configured props or default to static
   - If `initialStudentField` provided: set `dataSource.studentField.field`
   - If `initialTransformation` provided: set `dateProps.transformation`
   - If `templateVariable` provided: set `dataSource.templateVariable.variableId`

9. **Submission Handler**

   - Validate form state
   - If valid, call `createDateElementMutation` with:
     - `input`: complete `DateElementInput` including `templateId`
   - On success: close dialog (if in dialog mode) and call `onClose` callback
   - On error: show error notification

10. **Update Handlers**

    - Create handlers that update specific parts of state:
      - `updateBaseElement`: update base element properties
      - `updateTextProps`: update text properties
      - `updateDateProps`: update date-specific properties
      - `updateDataSource`: update data source

## Key Implementation Details

### State Initialization

```typescript
const [state, setState] = useState<DateElementFormState>(() => {
  const defaultState: DateElementFormState = {
    base: {
      name: "",
      description: "",
      positionX: 0,
      positionY: 0,
      width: 200,
      height: 50,
      alignment: ElementAlignment.Center,
      renderOrder: 0,
      templateId: templateId!,
    },
    textProps: {
      fontRef: { google: { identifier: "Roboto" } },
      fontSize: 16,
      color: "#000000",
      overflow: ElementOverflow.Wrap,
    },
    dateProps: {
      format: "YYYY-MM-DD",
      calendarType: CalendarType.Gregorian,
      offsetDays: 0,
      ...(initialTransformation && { transformation: initialTransformation }),
    },
    dataSource: (() => {
      if (initialStudentField) {
        return { studentField: { field: initialStudentField } };
      }
      if (templateVariable) {
        return { templateVariable: { variableId: templateVariable.id } };
      }
      return { static: { value: "" } };
    })(),
  };
  return defaultState;
});
```

### Validation

- Import validation functions from `dateValidators.ts`
- Validate before submission
- Track errors per field/section

### Error Handling

- Use notification system (from `useNotifications` hook)
- Show error messages on validation failure or mutation error
- Use translations for error messages (via `useAppTranslation`)

### Dialog Implementation

- When `inDialog={true}`:
  - Wrap content in `Dialog` component
  - Use `DialogTitle`, `DialogContent`, `DialogActions`
  - Handle `open` state (controlled by parent or internal state)
  - Call `onClose` on successful creation or cancel

## Dependencies

- `@mui/material` for Dialog and other components
- `@apollo/client` for GraphQL queries
- `client/views/template/manage/editor/form/element/date/DateElementForm`
- `client/views/template/manage/editor/form/element/date/types`
- `client/views/template/manage/editor/form/element/date/dateValidators`
- `client/views/template/manage/editor/form/hooks/useElementCreateMutations`
- `client/views/template/manage/editor/CertificateElementContext`
- `client/views/font/hooks` for `fontsQueryDocument`
- `client/lib/logger` for logging (not console.*)
- Translation hooks for error messages

## Files to Reference

- `client/views/template/manage/editor/miscellaneousPanel/currentElement/CurrentTextElement.tsx` - Pattern for fonts/language
- `client/views/template/manage/editor/form/element/date/DateElementForm.tsx` - Form component to wrap
- `client/views/template/manage/editor/form/element/date/types.ts` - Type definitions
- `client/views/template/manage/editor/form/element/date/DateElementForm.stories.tsx` - Example usage patterns

### To-dos

- [ ] Create CreateDateElementWrapper.tsx with props interface and component structure
- [ ] Implement state management for DateElementFormState with initial state setup
- [ ] Access CertificateElementContext to get templateId, dateVariables, and language
- [ ] Query fonts using fontsQueryDocument and extract selfHostedFonts
- [ ] Use useElementCreateMutations hook and implement createDateElementMutation call
- [ ] Import and use validators from dateValidators.ts to validate form before submission
- [ ] Create update handlers for baseElement, textProps, dateProps, and dataSource
- [ ] Wrap DateElementForm component and pass all required props
- [ ] Add Dialog wrapper when inDialog prop is true, handle open/close state
- [ ] Implement form submission handler with validation and mutation call
- [ ] Add error handling with notifications and translations
- [ ] Apply initialStudentField, initialTransformation, and templateVariable to initial state