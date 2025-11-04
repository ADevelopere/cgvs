<!-- 04a95e68-ccb8-4a93-8bc2-635db0897125 f563bb9a-f9a4-43e5-b8dc-705e3a73be9b -->
# Create AddNodePanel Component

## Overview

Create a two-column AddNodePanel component that allows users to add certificate elements. The first column contains items (student, certificate, variable, image) with icons and labels. The second column shows options for each item. In compact mode, clicking items opens dialogs instead.

## File Structure

### Main Component

- `client/views/template/manage/editor/addNewNode/AddNodePanel.tsx` - Main component with two-column layout

### Second Column Components (Options Panels)

- `client/views/template/manage/editor/addNewNode/StudentOptionsPanel.tsx` - Student field options
- `client/views/template/manage/editor/addNewNode/CertificateOptionsPanel.tsx` - Certificate field options  
- `client/views/template/manage/editor/addNewNode/VariableOptionsPanel.tsx` - Variable type options

### Wrapper Components (Create Forms)

- `client/views/template/manage/editor/addNewNode/wrappers/CreateTextElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNode/wrappers/CreateDateElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNode/wrappers/CreateGenderElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNode/wrappers/CreateCountryElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNode/wrappers/CreateImageElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNode/wrappers/CreateNumberElementWrapper.tsx`
- `client/views/template/manage/editor/addNewNode/wrappers/CreateQRCodeElementWrapper.tsx`

## Implementation Details

### AddNodePanel Component

- Props: `compact: boolean`
- First column: Grid/list of items (student, certificate, variable, image)
- Each item: Icon + Label (label hidden if `compact=true`)
- Icons: People (student), Assignment (certificate), Variables (variable), Image (image)
- When `compact=true`: Clicking icon opens dialog
- When `compact=false`: Clicking item shows options in second column
- Second column: Only visible when `compact=false`
- Renders appropriate options panel based on selected item
- State management: Track selected item from first column

### StudentOptionsPanel

- Fields:
- Student name → CreateTextElementWrapper with `studentField: StudentTextField.Name`
- Student email → CreateTextElementWrapper with `studentField: StudentTextField.Email`
- Date of birth → CreateDateElementWrapper with `studentField: StudentDateField.DateOfBirth`
- Age → CreateDateElementWrapper with `studentField: StudentDateField.DateOfBirth`, `transformation: DateTransformationType.AgeCalculation`
- Gender → CreateGenderElementWrapper
- Nationality → CreateCountryElementWrapper with `studentField: StudentTextField.Country`, `representation: CountryRepresentation.Nationality`
- Country → CreateCountryElementWrapper with `studentField: StudentTextField.Country`, `representation: CountryRepresentation.Country`

### CertificateOptionsPanel

- Fields:
- Verification code → CreateTextElementWrapper with `certificateField: CertificateTextField.VerificationCode`
- QR code → CreateQRCodeElementWrapper

### VariableOptionsPanel

- Fields:
- Text variable → CreateTextElementWrapper with `templateTextVariable` or `templateSelectVariable`
- Date variable → CreateDateElementWrapper with `templateVariable`
- Number variable → CreateNumberElementWrapper with `numberVariable`

### Wrapper Components

Each wrapper component:

- Manages form state using element types from `client/views/template/manage/editor/form/element/*/types.ts`
- Uses `useElementCreateMutations` hook for mutations
- Validates using validators from `client/views/template/manage/editor/form/element/*/*Validators.ts`
- Wraps the corresponding `*ElementForm` component
- Handles dialog state (when called from compact mode)
- Accepts pre-configured data source props (e.g., `initialStudentField`, `initialTransformation`)
- Gets `templateId` from CertificateElementContext
- Gets `textVariables`, `selectVariables`, `dateVariables`, `numberVariables` from context
- Queries fonts using `fontsQueryDocument` (similar to CurrentTextElement)
- Gets language from template config in context

### Dialog Implementation

- When `compact=true`, clicking first column items opens MUI Dialog
- Dialog contains the appropriate wrapper component
- Dialog closes on successful creation or cancel

### Data Requirements

- Access `templateId` from CertificateElementContext
- Access variables from CertificateElementContext
- Query fonts using `fontsQueryDocument` 
- Access language from template config in context
- Use `useElementCreateMutations` for all element creation mutations

## Key Considerations

- All components must use MUI components
- Follow existing patterns from `CurrentTextElement` for fonts/language
- Use existing form components from `client/views/template/manage/editor/form/element/*`
- Wrapper components handle state initialization based on pre-configured props
- Each wrapper validates before submission using existing validators
- On successful creation, close dialog/clear selection and refresh elements list

### To-dos

- [ ] Create AddNodePanel main component with two-column layout, first column items, and state management
- [ ] Create StudentOptionsPanel component with all student field options
- [ ] Create CertificateOptionsPanel component with verification code and QR code options
- [ ] Create VariableOptionsPanel component with text, date, and number variable options
- [ ] Create CreateTextElementWrapper component that manages state and wraps TextElementForm
- [ ] Create CreateDateElementWrapper component that manages state and wraps DateElementForm
- [ ] Create CreateGenderElementWrapper component that manages state and wraps GenderElementForm
- [ ] Create CreateCountryElementWrapper component that manages state and wraps CountryElementForm
- [ ] Create CreateImageElementWrapper component that manages state and wraps ImageElementForm
- [ ] Create CreateNumberElementWrapper component that manages state and wraps NumberElementForm
- [ ] Create CreateQRCodeElementWrapper component that manages state and wraps QrCodeElementForm
- [ ] Add dialog support for compact mode - clicking items opens dialogs with wrapper components