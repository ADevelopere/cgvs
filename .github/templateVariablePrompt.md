# Variable Management Component Design

## Layout Structure
1. Header Row
   - Contains a "Create Variable" button that opens a popover
   - Popover shows options for variable types (Text/Number/Date/Select)
   - Selecting a type triggers context change to show variable form

2. Main Content (Split Pane)
   - Left Pane: Variables List
   - Right Pane: Variable Form Component
   
## Left Pane: Variables List
- Displays variables by name
- Each item has:
  - Variable name
  - Delete action
  - Click handler for selection
  - Badge indicating unsaved changes (if present in temporary values map)
- Selection handling:
  - If no unsaved changes: directly switches to edit form
  - If unsaved changes present: shows confirmation dialog before switching

## Right Pane: Variable Form Component
1. Variable Form
   - Common fields:
     - Name
     - Description
   - Dynamic sub-component based on type
     - Each type has specific configuration
     - Sub-components receive:
       - Common fields (name, description)
       - Type-specific parameters
       - Current values (from context's temporary values map)
       - onChange callback (updates temporary values)
       - onSave callback
   - Form state management:
     - Values stored in context's temporary values map
     - Changes trigger unsaved changes flag
     - Save button enabled only when changes exist
     - Navigation protection active when has changes
   - Navigation handling:
     - Integrated with react-router-dom
     - Blocks navigation when has unsaved changes
     - Shows confirmation dialog for all navigation attempts
     - Preserves form state until explicitly discarded
   - Mode (create/edit) determined by context

## State Management (Context)
1. Temporary State Storage
   - Temporary values map: Map<variableId, VariableTypeInput>
     - Stores unsaved changes for each variable
     - Key is variable ID (null for new variables)
     - Value is the corresponding type-specific input object
   - Current editing state:
     - Current variable ID (null when creating)
     - Selected type (when creating)
     - Has unsaved changes flag
   - Navigation Protection:
     - useBlocker hook from react-router-dom
     - Tracks unsaved changes state
     - Handles all navigation attempts (browser back/forward, URL changes)
   - UI State:
     - Current mode (create/edit)
     - Show confirmation dialog flag
     - Dialog message and actions
     - Navigation blocker state

2. Context Actions
   - Open create popover
   - Select variable type
   - Set form mode
   - Set current variable
   - Update temporary values
   - Save variable (create/update)
   - Delete variable
   - Reset form
   - Handle navigation attempts:
     - Show confirmation dialog
     - Discard changes and allow navigation
     - Cancel navigation and stay on page
   - Navigation protection:
     - Setup router blocker when has changes
     - Handle browser navigation events
     - Handle external navigation attempts
     - Prompt user before leaving page

3. Navigation Integration
   - Uses react-router-dom hooks:
     - useBlocker: Prevent unwanted navigation
     - useNavigate: Programmatic navigation
     - useLocation: Track URL changes
   - Blocking behavior:
     - Blocks all navigation when has unsaved changes
     - Shows confirmation dialog on navigation attempt
     - Allows navigation after user confirms
     - Preserves changes if user cancels
   - Browser integration:
     - Handles browser back/forward buttons
     - Handles manual URL changes
     - Handles external navigation attempts
     - Uses browser's native "Leave Site?" dialog as fallback

## Type-specific Form Components
- Each variable type (Text/Number/Date/Select) has:
  - Single form component used for both create/edit
  - Type-specific configuration fields
  - Type-specific validation
  - Handles both fresh and pre-populated states
- # Template Variable Creation Components Design

## Common Features (Based on GraphQL Schema)
All variable types share these fields from GraphQL inputs:
- name: String (required)
- description: String (optional)
- required: Boolean (required)
- preview_value: String (optional)
- template_id: ID (required)

## Text Variable Form Component
Based on `TextTemplateVariableInput`:
1. Required Fields:
   - Name (text input)
   - Required (checkbox)
2. Optional Fields:
   - Description (textarea)
   - Min Length (number input)
   - Max Length (number input)
   - Preview Value (text input)
   - Pattern (text input with regex validation)

3. Validation:
   - Name: Required, string
   - Min/Max Length: Integer, min < max
   - Pattern: Valid regex syntax

## Number Variable Form Component
Based on `TemplateNumberVariable`:
1. Required Fields:
   - Name (text input)
   - Required (checkbox)

2. Optional Fields:
   - Description (textarea)
   - Minimum Value (number input)
   - Maximum Value (number input)
   - Decimal Places (number input, 0-10)
   - Preview Value (number input)

3. Validation:
   - Name: Required, string
   - Min Value < Max Value
   - Decimal Places: Integer between 0-10

## Date Variable Form Component
Based on `DateTemplateVariableInput`:
1. Required Fields:
   - Name (text input)
   - Required (checkbox)

2. Optional Fields:
   - Description (textarea)
   - Format (text input with helper)
   - Min Date (date picker)
   - Max Date (date picker)
   - Preview Value (date input)

3. Validation:
   - Name: Required, string
   - Order: Required, integer
   - Min Date < Max Date
   - Format: Valid date format string

## Select Variable Form Component
Based on `SelectTemplateVariableInput`:
1. Required Fields:
   - Name (text input)
   - Required (checkbox)
   - Multiple Selection (checkbox)
   - Options (array of strings)

2. Optional Fields:
   - Description (textarea)
   - Preview Value (select input)

3. Options Management:
   - Dynamic list of option inputs
   - Add/Remove option buttons
   - Drag-and-drop reordering
   - Duplicate check

4. Validation:
   - Name: Required, string
   - Options: At least one option required
   - Preview Value: Must be one of the options
