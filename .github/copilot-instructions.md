**System Name:** Certificate Generation and Verification System (CGVS)

**1. System Overview & Purpose**

The primary goal is to develop a web-based system enabling authorized administrators to design certificate templates, bulk-generate personalized PDF certificates using these templates and uploaded recipient data, and provide a public-facing web page for anyone (including students) to verify the authenticity of issued certificates using a unique verification code (textual or via QR code). The system must specifically cater to requirements like Arabic language support (including RTL), Hijri/Gregorian dates, and gender-specific text variations.

**2. User Roles & Access Control**

*   **Administrator / Official:**
    *   **Access:** Requires secure authentication (login) to access system functionalities. This role is restricted to designated officials or managers.
    *   **Permissions:** Create, edit, view, preview, and manage certificate templates; upload recipient data lists; initiate bulk certificate generation; download generated certificates; potentially configure system settings (like PDF storage).
*   **Public User (including Students & Verifiers):**
    *   **Access:** Does *not* require any login or registration. Access is limited to the public verification page.
    *   **Permissions:** Access the verification web page; input a verification code (manually or via QR scan); view the verification result (validity status, certificate details, rendered certificate image); download the verified certificate PDF if available.

**3. Core Functional Modules & Detailed Requirements**

**3.1. Template Management Module**

*   **3.1.1. Template Creation & Editing:**
    *   Administrators must be able to create new certificate templates and edit existing ones.
    *   Templates serve as the foundational design structure.
*   **3.1.2. Template Composition:** Each template must consist of the following configurable elements:
    *   **Background Image:** Ability to define or upload a background image for the certificate.
    *   **Static Text Elements:** Fixed text content (e.g., titles, standard clauses).
    *   **Dynamic Placeholder Elements (Variables):** Designated areas where recipient-specific data will be inserted during generation.
    *   **QR Code Placeholder:** A designated area specifically for placing the generated verification QR code.
*   **3.1.3. Element Positioning:**
    *   The system must provide a mechanism for administrators to precisely define the position of *every* element (background, static text, variables, QR code) on the template canvas.
    *   Positioning must be defined using X and Y coordinates.
*   **3.1.4. Variable Definition:**
    *   Templates must explicitly define the set of dynamic variables they expect as input (e.g., 'student_name', 'issue_date', 'gender', 'country_code'). This definition is used for data mapping and validation during generation.
*   **3.1.5. Template Preview Functionality:**
    *   Administrators must be able to preview a selected template in a read-only mode (distinct from the editing interface).
    *   The preview must populate the template's variables with sample/dummy data to visualize the final appearance.
    *   Dummy data examples mentioned: name, date, QR code, country.
    *   The purpose of the preview is to allow administrators to verify the layout and element configuration before initiating bulk generation.
*   **3.1.6. Preview Download:**
    *   Administrators must have the option to download the generated preview as a PDF file.
    *   Rationale: To accurately check the final PDF rendering, as browser display might differ from the PDF generation engine's output.

**3.2. Certificate Generation Module**

*   **3.2.1. Initiation:**
    *   Administrators select a pre-defined, existing template.
    *   Administrators upload a list containing recipient data (e.g., student list). *(Format implied to be structured like CSV/Excel)*.
*   **3.2.2. Data Validation (Pre-Generation Check):**
    *   This step is mandatory before generation begins.
    *   The system must validate the uploaded data against the requirements of the selected template's variables.
    *   **Specific Validation Checks Required:**
        *   **Missing Data:** Check if any fields required by the template are missing in the uploaded data rows.
        *   **Format Validation:** Check if data conforms to expected formats:
            *   Valid email address structure.
            *   Language Character Check: Ensure fields designated for a specific language (e.g., Arabic) do not contain characters from other languages (e.g., English letters).
            *   Country Code Format: Validate format (e.g., "EG", "US").
            *   Other data type/format checks as implicitly needed by variable types (e.g., valid date format if not using specific date variable type, numeric formats if applicable).
    *   **Error Reporting:** If validation fails, the system must provide clear, user-friendly error messages to the administrator. Messages must indicate the specific row number and the column/field containing the error.
*   **3.2.3. Generation Process (Per Recipient):**
    *   Occurs only after successful data validation.
    *   The system iterates through each valid row in the uploaded recipient list.
    *   For each recipient:
        *   Generate a unique, cryptographically secure Verification Code.
        *   Generate a QR Code image. This QR code must encode a URL pointing to the public verification web page, with the unique Verification Code embedded as a parameter (e.g., `https://[yourdomain]/verify?code=[UNIQUE_CODE]`).
        *   Populate the selected template's placeholders (variables) with the corresponding data from the current recipient's row.
        *   Render the fully populated certificate as a PDF file.
*   **3.2.4. Output:** A collection of individual PDF certificate files.
*   **3.2.5. Certificate Download:**
    *   The system must provide a mechanism for the administrator to download the generated PDF certificates (likely as a bulk download, potentially packaged in a ZIP file).
*   **3.2.6. Optional PDF Storage:**
    *   The system must offer a configurable option for administrators to decide whether the generated PDF files are saved persistently on the server's storage or only made available for immediate download after generation without being stored long-term.

**3.3. Public Certificate Verification Module**

*   **3.3.1. Access Point:** A publicly accessible web page that does *not* require any user login or authentication.
*   **3.3.2. Verification Methods:**
    *   **Manual Code Entry:** Provide an input field on the page where users can manually type the Verification Code found on a certificate.
    *   **QR Code Scan:** Scanning the QR code on a certificate using a mobile device should navigate the user's browser directly to the verification page, automatically populating the Verification Code field via the URL parameter.
*   **3.3.3. Verification Logic:**
    *   Upon receiving a Verification Code (either manually entered or from URL parameter), the system must query its database/records to find a match for that unique code.
*   **3.3.4. Verification Results Display:**
    *   **If Code is Found (Valid Certificate):**
        *   Display a clear success message indicating the certificate is authentic/valid ("Certificate is right", "actually exists").
        *   Display key identifying details from the certificate record (e.g., Recipient Name) to help the user confirm it's the correct certificate.
        *   Display a visual representation (render/image) of the actual certificate on the web page.
        *   Provide a clearly labeled option/button for the user to download the original PDF file of the verified certificate.
    *   **If Code is Not Found (Invalid/Non-existent):**
        *   Display a clear error message indicating the code is invalid or the certificate was not found.
*   **3.3.5. Continuous Verification:** The verification page should allow the user to easily enter a new verification code to check another certificate without needing to fully reload the page (e.g., clear the previous result and allow new input).

**4. Data Element & Variable Types & Properties**

*   **4.1. Base Template Element**
    *   **Purpose:** Abstract base class for any item placed on the template.
    *   **Common Properties (for all elements):**
        *   **Element ID:** Unique identifier for this specific element instance within a template.
        *   **Element Type:** String identifier ('text', 'image', 'date', 'qr_code', 'conditional_text', etc.).
        *   **X-Coordinate:** Horizontal position on the template canvas.
        *   **Y-Coordinate:** Vertical position on the template canvas.

*   **4.2. Text-Based Element (Inherits from Base Template Element)**
    *   **Purpose:** Abstract base class for elements that render text.
    *   **Additional Properties:**
        *   **Font Size:** Numerical value defining the text size.
        *   **Color:** Definition of the text color (e.g., Hex code).
        *   **Alignment:** Text alignment within its bounding box (Options: Left, Center, Right).
        *   **Font Family:** Must support embedding fonts appropriate for required languages (especially Arabic).
        *   **Language Constraint (Optional):** Enforce input data language (e.g., Arabic only).

*   **4.3. Concrete Element Types**
    *   **4.3.1. Text Element (Inherits from Text-Based Element)**
        *   **Purpose:** Displays simple text from a recipient data field.
        *   **Additional Properties:**
            *   **Source Data Field:** Name of the key in recipient data holding the text value.

    *   **4.3.2. Date Element (Inherits from Text-Based Element)**
        *   **Purpose:** Displays a formatted date value.
        *   **Additional Properties:**
            *   **Source Data Field:** Key in recipient data holding the date value.
            *   **Calendar System:** Hijri or Gregorian calendar.
            *   **Display Format:** Pattern for date display (e.g., "DD MMMM YYYY").

    *   **4.3.3. Gender-Specific Text (Inherits from Text-Based Element)**
        *   **Purpose:** Displays gender-dependent text.
        *   **Additional Properties:**
            *   **Gender Source Field:** Field in recipient data for gender value.
            *   **Male Text:** Text to display for male recipients.
            *   **Female Text:** Text to display for female recipients.

    *   **4.3.4. Conditional Text (Inherits from Text-Based Element)**
        *   **Purpose:** Displays text based on a variable's value.
        *   **Additional Properties:**
            *   **Input Variable Field:** Name of the controlling field.
            *   **Conditions Map:** Maps input values to display text.
                *   Example boolean: `true` → "Approved", `false` → "Pending"
                *   Example set: `'active'` → "Active", `'lapsed'` → "Expired"
                *   Must include `default` value for fallback.

    *   **4.3.5. Image Element (Inherits from Base Template Element)**
        *   **Purpose:** Displays recipient-specific images.
        *   **Additional Properties:**
            *   **Source Data Field:** Path/identifier for the image.
            *   **Width:** Image display width.
            *   **Height:** Image display height.
            *   **Aspect Ratio Handling:** 'stretch', 'fit', or 'fill'.

    *   **4.3.6. QR Code Element (Inherits from Base Template Element)**
        *   **Purpose:** Displays verification QR code.
        *   **Additional Properties:**
            *   **Size:** Width/height of the square QR code image.

**5. Non-Functional Requirements**

*   **5.1. Security:**
    *   Mandatory secure authentication (username/password) for Administrator access.
    *   No authentication required for public verification page access.
    *   Verification codes must be unique and sufficiently complex/random to prevent guessing.
*   **5.2. Usability:**
    *   Administrator interface should be intuitive for template design and generation workflow.
    *   Public verification page must be simple and straightforward to use.
    *   Error messages (especially during data validation) must be clear and informative, pinpointing issues accurately.
*   **5.3. Localization & Globalization:**
    *   Full support for Right-to-Left (RTL) text display and rendering, specifically for Arabic, in both the web interface *and* within the generated PDF certificates.
    *   Support for both Hijri and Gregorian calendar systems for date variables and display.
    *   Support for UTF-8 encoding throughout the system and in PDF generation.
*   **5.4. Platform:**
    *   Must be a web-based application accessible via standard web browsers.

**6. Technical Considerations (Implied)**

*   **PDF Generation Library:** A robust library capable of handling absolute positioning (X/Y), embedding images, embedding custom fonts (especially TTF for Arabic), and rendering UTF-8 text correctly is required.
*   **QR Code Generation Library:** A standard library to generate QR code images encoding the specific verification URL structure.
*   **Database:** Required to store template definitions, element properties, generated certificate metadata (including the unique verification code), recipient data used (potentially), optional PDF file paths, and administrator credentials.
*   **Web Server & Backend Language:** Standard web hosting environment with a backend language capable of handling file uploads, data processing, database interaction, and library integrations.
*   **File Storage:** Server-side storage needed for template assets (background images), uploaded recipient lists (temporary), and potentially the generated PDF certificates (if configured).

```
cgvs/
├── app/
│   ├── Exceptions/
│   │   ├── TabAccessDeniedException.php
│   │   └── TemplateStorageException.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ConfirmPasswordController.php
│   │   │   │   ├── ForgotPasswordController.php
│   │   │   │   ├── LoginController.php
│   │   │   │   ├── RegisterController.php
│   │   │   │   ├── ResetPasswordController.php
│   │   │   │   └── VerificationController.php
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── TemplateController.php
│   │   │   │   └── TemplateVariableController.php
│   │   │   ├── Controller.php
│   │   │   └── HomeController.php
│   │   └── Middleware/
│   │       └── TemplateTabPermissionMiddleware.php
│   ├── Models/
│   │   ├── Template.php
│   │   ├── TemplateElement.php
│   │   ├── TemplateVariable.php
│   │   └── User.php
│   ├── Policies/
│   │   └── TemplatePolicy.php
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── AuthServiceProvider.php
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── sass/
│   │   ├── _variables.scss
│   │   └── app.scss
│   ├── ts/
│   │   ├── app.tsx
│   │   ├── bootstrap.ts
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── templates/
│   │   │   │       ├── CreateTemplateForm.tsx
│   │   │   │       ├── list/
│   │   │   │       │   ├── TemplateCard.tsx
│   │   │   │       │   ├── TemplateGrid.tsx
│   │   │   │       │   ├── TemplateList.tsx
│   │   │   │       │   └── views/
│   │   │   │       │       ├── CardView.tsx
│   │   │   │       │       ├── GridView.tsx
│   │   │   │       │       └── ListView.tsx
│   │   │   │       └── management/
│   │   │   │           ├── BasicInfoTab.tsx
│   │   │   │           ├── Management.tsx
│   │   │   │           ├── common/
│   │   │   │           │   ├── HeaderActions.tsx
│   │   │   │           │   └── SaveButton.tsx
│   │   │   │           ├── tabs/
│   │   │   │           │   ├── EditorTab.tsx
│   │   │   │           │   ├── PreviewTab.tsx
│   │   │   │           │   └── RecipientsTab.tsx
│   │   │   │           └── variables/
│   │   │   │               ├── VariableForm.tsx
│   │   │   │               ├── VariableList.tsx
│   │   │   │               └── VariablesTab.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── common/
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── RouteError.tsx
│   │   │   │   ├── ThemeSwitcher.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   └── layouts/
│   │   │       ├── AdminLayout.tsx
│   │   │       ├── GuestLayout.tsx
│   │   │       └── TemplateLayout.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── template/
│   │   │       ├── TemplateManagementContext.tsx
│   │   │       ├── TemplateVariablesContext.tsx
│   │   │       ├── TemplatesContext.tsx
│   │   │       └── template.types.ts
│   │   ├── pages/
│   │   │   ├── Verify.tsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── templates/
│   │   │   │       ├── CreateTemplate.tsx
│   │   │   │       ├── Index.tsx
│   │   │   │       └── TemplateManagementPage.tsx
│   │   │   └── auth/
│   │   │       └── Login.tsx
│   │   ├── routes/
│   │   │   └── index.tsx
│   │   ├── theme/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── axios.ts
│   │       ├── dateUtils.ts
│   │       └── email.ts
│   └── views/
│       ├── app.blade.php
│       ├── auth/
│       │   ├── login.blade.php
│       │   ├── passwords/
│       │   │   ├── confirm.blade.php
│       │   │   ├── email.blade.php
│       │   │   └── reset.blade.php
│       │   ├── register.blade.php
│       │   └── verify.blade.php
│       ├── home.blade.php
│       ├── layouts/
│       │   └── app.blade.php
│       └── welcome.blade.php
├── routes/
│   ├── web.php                  # Web routes (browser accessible)
│   └── api.php                  # Optional API routes
├── storage/
│   ├── app/
│   │   ├── public/              # Files meant to be publicly accessible via symlink
│   │   │   └── template_backgrounds/ # Uploaded backgrounds
│   │   ├── uploads/             # Temporary storage for uploaded lists
│   │   └── certificates/        # Optional storage for generated PDFs
│   ├── framework/               # Cache, sessions, views cache
│   └── logs/                    # Application logs
├── tests/
├── vendor/                      # Composer dependencies (mPDF, QR Code lib, etc.)
├── .env                         # Environment configuration (DB creds, App URL)
├── .env.example
├── artisan                      # Laravel command-line tool
├── composer.json              # PHP dependencies
├── composer.lock             # PHP dependencies lock file
├── package.json              # Node.js dependencies
├── bun.lock                  # Bun lock file for Node.js dependencies
└── vite.config.js           # Vite configuration
```

**Incremental Implementation Steps (Focus on Seeing Results)**

*   **✅ Stage 0: Project Setup & Environment (done)** 
    *   ✅ Development Environment Setup:
        *   Installed and configured PHP 8.2+ with required extensions
        *   Installed Composer for PHP package management
        *   Installed Git for version control
        *   Installed Node.js and Bun for frontend tooling
        *   Configured PHP development settings in `php.ini`
    *   ✅ Project Initialization:
        *   Created new Laravel project using Composer
        *   Initialized Git repository with initial commit
        *   Set up `.gitignore` for project-specific exclusions
    *   ✅ Frontend Development Setup:
        *   Configured Vite as the build tool with `vite.config.ts`
        *   Set up TypeScript configuration with `tsconfig.json`
        *   Installed frontend dependencies using Bun
    *   ✅ Development Tools Configuration:
        *   Set up development environment variables in `.env`
        *   Configured IDE helper for better development experience
        *   Set up Docker configuration with `docker-compose.yml`
    *   ✅ Project Structure:
        *   Organized base Laravel directory structure
        *   Set up public assets directory
        *   Configured resource compilation paths
    *   ✅ Development Workflow:
        *   Created development server script (`dev.sh`)
        *   Configured Vite development server task
        *   Set up hot module replacement for development
    *   **Result:** Complete development environment with Laravel framework, TypeScript support, Vite for asset compilation, and Docker configuration for containerization

*   **✅ Stage 1: Basic Authentication (done)**
    *   ✅ Implemented Authentication Components:
        *   Created `resources/ts/components/auth/LoginForm.tsx`:
            *   Built with Material-UI components (Card, TextField, Button)
            *   Implemented form validation with proper error handling
            *   Added responsive design and loading states
    *   ✅ Authentication Context & State Management:
        *   Set up `AuthContext` for global auth state:
            *   User state management
            *   Token handling
            *   Loading states
            *   Error handling
        *   Implemented protected route wrapper
    *   ✅ Laravel Authentication Setup:
        *   Added Laravel Sanctum configuration
        *   Set up authentication middleware
        *   Configured CSRF protection
        *   Set up session handling
    *   ✅ API Integration:
        *   Created `AuthController` with login/logout endpoints
        *   Implemented secure token-based authentication
        *   Added user information endpoint
        *   Set up proper API route protection
    *   ✅ Frontend-Backend Integration:
        *   Configured Axios for API communication
        *   Added token management in requests
        *   Implemented proper error handling
        *   Set up authentication persistence
    *   **Result:** Complete SPA authentication system with secure token-based auth, protected routes, and modern UI components.

*   **✅ Stage 2: Basic Admin Area & React Router Setup (done)**
    *   ✅ Created React layout components with MUI:
        *   `resources/ts/components/layouts/AdminLayout.tsx`:
            *   Implemented responsive top navbar with MUI AppBar and Toolbar
            *   Added CGVS logo on the left with link to dashboard
            *   Created center navigation with MUI Buttons and icons (Dashboard, Templates, Certificates)
            *   Added right section with theme switcher and user menu
            *   Implemented ErrorBoundary wrapper for content
            *   Added responsive container with maxWidth="xl"
        *   `resources/ts/components/layouts/GuestLayout.tsx`:
            *   Created centered layout for authentication pages
            *   Used MUI Container with proper spacing and alignment
            *   Added full viewport height support
    *   ✅ Created user interface components:
        *   `UserMenu.tsx`:
            *   Implemented dropdown menu with MUI Menu component
            *   Added user avatar display
            *   Added profile, preferences, and logout options
            *   Integrated with auth context for user data
        *   `ThemeSwitcher.tsx`:
            *   Added theme toggle functionality
            *   Implemented theme persistence in localStorage
            *   Added support for light/dark/system modes
    *   ✅ Created admin dashboard components:
        *   `Dashboard.tsx` with responsive MUI Grid:
            *   Welcome section with title and description
            *   Stats cards showing template and certificate counts
            *   Quick actions section with MUI Paper
            *   Used MUI Card components with proper styling
    *   ✅ Set up comprehensive routing:
        *   Configured React Router with proper route structure:
            *   Root redirect to admin dashboard
            *   Public routes for login and verification
            *   Protected admin routes with nested structure
            *   Template management routes with layout wrapper
        *   Added authentication protection:
            *   Created `WithAuth` component for route protection
            *   Implemented loading states with MUI CircularProgress
            *   Added redirect to login for unauthenticated users
    *   ✅ Implemented API integration:
        *   Added dashboard API endpoint in `DashboardController.php`
        *   Set up protected routes with Laravel Sanctum
        *   Implemented proper API middleware configuration
        *   Added error handling for API responses
    *   ✅ Added extra features:
        *   Implemented proper state management for authentication
        *   Added loading states and error boundaries
        *   Created responsive design for mobile and desktop
        *   Added smooth navigation transitions
    *   **Result:** Fully functional, modern SPA admin area with responsive design, protected routes, theme support, and proper API integration.

*   **✅ Stage 3: Template Data Structure (done)**
    *   ✅ Created database migrations:
        *   `create_templates_table.php` with columns:
            *   `id`, `name`, `description`, `background_path`
            *   `required_variables` (JSON), `is_active` (boolean)
            *   Timestamps and soft deletes support
        *   `create_template_elements_table.php` with columns:
            *   `id`, `template_id` (foreign key)
            *   `element_type` (text, date, gender_text, etc.)
            *   `x_coordinate`, `y_coordinate`, `properties` (JSON)
            *   Text properties: font_size, color, alignment, font_family
            *   `language_constraint`, `source_field`
        *   `create_template_variables_table.php` with columns:
            *   `id`, `template_id`, `name`, `type`
            *   `validation_rules` (JSON), `preview_value`
    *   ✅ Created Eloquent models with relationships:
        *   `Template.php`:
            *   HasMany relationships with elements and variables
            *   SoftDeletes trait implementation
            *   Background path accessor method
        *   `TemplateElement.php`:
            *   Element type constants and helper methods
            *   Properties for positioning and styling
            *   BelongsTo relationship with template
        *   `TemplateVariable.php`:
            *   Variable type validation
            *   Preview value handling
            *   BelongsTo relationship with template
    *   ✅ Implemented comprehensive model factories:
        *   `TemplateFactory.php` with default attributes
        *   `TemplateElementFactory.php` with specialized states:
            *   Text elements with realistic properties
            *   Date elements with format options
            *   QR code elements with size settings
    *   ✅ Created feature tests for models:
        *   `TemplateTest.php`: Creation, relationships, soft deletes
        *   `TemplateElementTest.php`: Element types, properties
        *   `FactoryTest.php`: Factory states and relationships
    *   **Result:** Complete database structure with models, factories, and tests for template management system.

*   **✅ Stage 4: Template Listing and Creation (done)**
    *   ✅ Created React components for template listing with MUI:
        *   `resources/ts/pages/admin/templates/Index.tsx`:
            *   Container layout with TemplateList component
        *   `resources/ts/components/admin/templates/list/` Components:
            *   `TemplateList.tsx` - Main list component with:
                *   Search functionality
                *   View mode switching (Card/Grid/List)
                *   Create template button
            *   Views Implementation:
                *   `CardView.tsx` - Card-based layout
                *   `GridView.tsx` - Image grid layout
                *   `ListView.tsx` - Table-based layout
    *   ✅ Implemented template creation:
        *   `resources/ts/pages/admin/templates/Create.tsx`
        *   `resources/ts/components/admin/templates/CreateTemplateForm.tsx`:
            *   Name and description fields
            *   Background image upload with drag-and-drop
            *   File size validation
            *   Form validation and error handling
    *   ✅ Set up template contexts:
        *   `resources/ts/contexts/template/TemplatesContext.tsx`:
            *   Template list state management
            *   Template creation handling
            *   Loading and error states
            *   API integration for templates
        *   `resources/ts/contexts/template/template.types.ts`:
            *   Type definitions for templates
            *   Configuration interfaces
    *   ✅ Implemented API endpoints in `TemplateController.php`:
        *   `index` method with background URL generation
        *   `store` method with file upload handling
        *   Configuration endpoint for file size limits
    *   ✅ Added enhanced features:
        *   Responsive layouts for all view modes
        *   Image preview for uploaded backgrounds
        *   Proper error handling and user feedback
        *   Search filtering by name and description
    *   **Result:** A polished template management interface with multiple view options, robust creation form, and proper state management.

*   **✅ Stage 5.0: Template Management Interface (done)**
    *   ✅ Created React components for tabbed template management with MUI:
        *   `Management.tsx` - Main management page with:
            *   MUI Tabs for navigation
            *   Tab context and state management
            *   Shared header with template title
        *   Tab components implemented:
            *   `BasicInfoTab.tsx` - Template settings:
                *   Name and description fields
                *   Background image upload/preview
                *   Template status management (draft/active/archived)
                *   Save functionality with proper validation
            *   `VariablesTab.tsx` - Variable definition:
                *   MUI DataGrid for variables list
                *   Variable type selection (text, date, number, gender)
                *   Add/Edit/Delete operations with validation
            *   Placeholder components with "coming soon" messages:
                *   `EditorTab.tsx`
                *   `RecipientsTab.tsx`
                *   `PreviewTab.tsx`
    *   ✅ Implemented TemplateManagementContext with:
        *   Active tab state management
        *   Form states handling
        *   Loading and error states
        *   Unsaved changes tracking
    *   ✅ Enhanced TemplateController.php with:
        *   Tab-specific endpoints and validation
        *   Background image handling with storage
        *   Error handling and logging
    *   ✅ Added middleware for tab permissions:
        *   `TemplateTabPermissionMiddleware.php` for controlling tab access
        *   Integration with Laravel Gates and Policies
    *   ✅ Implemented comprehensive validation:
        *   Template settings validation (name, description, file types)
        *   Variable validation based on type
    *   **Result:** Functional template management interface with working Basic Info and Variables tabs, and placeholder components for Editor, Recipients, and Preview functionality

*   **✅ Stage 5.1: Template Tab Navigation and State Management (done)**
    *   ✅ Enhanced template management interface with tab navigation:
        *   Implemented URL-based tab navigation with query parameters (`?tab=basic|variables|editor|recipients|preview`)
        *   Created TabContext with MUI Lab's TabContext/TabList/TabPanel components
        *   Added tab state persistence through URL parameters
        *   Implemented keepMounted for better tab performance
    *   ✅ Implemented comprehensive TemplateManagementContext:
        *   Active tab state management
        *   Unsaved changes tracking
        *   Loaded tabs state tracking
        *   Tab-specific error handling
        *   Template and configuration data management
        *   Loading states with MUI CircularProgress
        *   Error states with custom error UI
    *   ✅ Tab-specific features:
        *   Error boundary handling for each tab
        *   Tab permission middleware integration
        *   Loading and error state handling per tab
        *   Automatic tab data fetching
    *   ✅ User Experience improvements:
        *   Smooth tab transitions
        *   Error feedback with retry capabilities
        *   Visual loading indicators
        *   Clear error messages with recovery options
    *   **Result:** A robust tab navigation system with proper state management, error handling, and user feedback mechanisms, fully integrated with the backend permission system

*   **✅ Stage 5.2: Template Variables Management (done)**
    *   ✅ Created React components for variables management with Material-UI:
        *   `resources/ts/components/admin/templates/management/variables/` - Components directory:
            *   `VariablesTab.tsx` - Main variables tab component with state management
            *   `VariableList.tsx` - Using MUI DataGrid with advanced features:
                *   Sortable and filterable columns
                *   Pagination support (5, 10, 25 items per page)
                *   Preview value column with type-specific display
                *   Inline edit and delete actions
            *   `VariableForm.tsx` - MUI Dialog form with dynamic fields:
                *   Type-specific input fields (text, date, number, gender)
                *   Form validation using React Hook Form
                *   DatePicker for date type with proper formatting
                *   Gender select with male/female options
    *   ✅ Implemented comprehensive TemplateVariablesContext (`contexts/template/TemplateVariablesContext.tsx`):
        *   State management for variables list
        *   CRUD operations with error handling
        *   Loading states and notifications
        *   Type-safe interfaces for variables and operations
    *   ✅ Added type-specific preview value handling:
        *   Text: Standard text input
        *   Date: MUI DatePicker with date formatting
        *   Number: Numeric input with validation
        *   Gender: Select input with male/female options
    *   ✅ User Experience enhancements:
        *   Delete confirmation dialog
        *   Success/Error notifications using MUI Snackbar
        *   Loading states during CRUD operations
        *   Optimistic updates for better responsiveness
    *   **Result:** A polished and type-safe interface for managing template variables with Material-UI components and proper state management

*   **Stage 5.3: Template Recipients Management**
    *   Create React components for recipients management with MUI:
        *   `resources/ts/pages/admin/templates/Recipients.tsx` - Main recipients page
        *   `resources/ts/components/admin/templates/recipients/` - Components:
            *   `RecipientList.tsx` - Using MUI DataGrid for data display
            *   `ImportExport.tsx` - Handling Excel operations
            *   `ValidationResults.tsx` - Displaying import validation results
    *   Add database migration for template recipients:
        *   Create `template_recipients` table with columns:
            *   `id`, `template_id`, `data` (JSON), timestamps
    *   Create Excel management service:
        *   Add method to generate template Excel file with variable columns
        *   Add method to validate and import filled Excel files
        *   Implement row-by-row validation against variable rules
    *   Create API endpoints in `TemplateController.php`:
        *   Add endpoint for downloading Excel template
        *   Add endpoint for importing filled Excel
        *   Add endpoint for managing individual recipients
    *   Implement Excel handling with PHP Excel library:
        *   Generate downloadable template Excel files
        *   Parse and validate uploaded Excel files
        *   Handle batch imports with progress tracking
    *   Add validation feedback mechanism:
        *   Show detailed error messages for invalid rows
        *   Allow partial imports of valid rows
        *   Provide summary of import results
    *   **Result:** Complete interface for managing template recipients with Excel import/export capabilities

*   **Stage 5.5: React Template Editor Component**
    *   Create React template editor components with MUI:
        *   `resources/ts/components/admin/templates/TemplateEditor.tsx` - Main editor using MUI Paper as canvas
        *   `resources/ts/components/admin/templates/elements/` - Element components with MUI styling:
            *   `TextElement.tsx` - Using MUI Typography
            *   `DateElement.tsx` - Using MUI DatePicker
            *   `QRElement.tsx` - Custom styled with MUI theme
            *   `ImageElement.tsx` - Using MUI Card for container
        *   Add MUI SpeedDial for quick actions
        *   Implement MUI Drawer for element properties panel
    *   Implement drag-and-drop using react-beautiful-dnd with MUI styling
    *   Create element property forms using MUI components:
        *   Color pickers with MUI
        *   Font selectors with MUI Select
        *   Position inputs with MUI TextField
    *   Set up EditorContext for editor state management:
        *   Track selected element
        *   Manage element positions
        *   Handle undo/redo with history state
    *   Add preview mode toggle using MUI Switch and React context
    *   Configure Vite for React hot module replacement
    *   *(Focus on the UI interaction first, not saving)*
    *   **Result:** Interactive Material-UI based template editor with modern UI/UX

*   **Stage 7: Save Template Elements**
    *   Modify the `store` (and add `update`) method in `TemplateController`.
    *   Process the element data submitted from the form (likely as an array or JSON).
    *   Save each element's details (type, properties JSON) into the `template_elements` table, associated with the `template_id`.
    *   **Result:** A complete template definition, including its elements and their properties, can be saved to the database.

*   **Stage 8: Certificate & Verification Structure**
    *   Create Model: `Certificate.php`.
    *   Create Migration: `create_certificates_table.php` (define columns: `template_id`, `recipient_data` (JSON/TEXT), `verification_code` (UNIQUE INDEXED), `pdf_file_path` (nullable), `issued_date`, timestamps).
    *   Run migration.
    *   Create `VerificationController.php` (`show` method).
    *   Create route `/verify` (GET, maybe also takes query param `?code=`).
    *   Create basic `verify.blade.php` view with an input field for the code.
    *   **Result:** Database table for certificates exists, basic public verification page is visible.

*   **Stage 9: React Verification Component**
    *   Create React verification components with MUI:
        *   `resources/ts/pages/Verify.tsx` - Main verification page with MUI Container
        *   `resources/ts/components/public/VerificationForm.tsx` - Using MUI TextField and Button
        *   `resources/ts/components/public/VerificationResult.tsx` - Using MUI Alert and Card
    *   Set up VerificationContext for verification state
    *   Implement API endpoint in `VerificationController`
    *   Add real-time verification with useDebounce hook
    *   Handle URL parameters with React Router useParams
    *   Add loading states with MUI Skeleton and CircularProgress
    *   Implement error states with MUI Alert
    *   Add responsive design with MUI Grid system
    *   **Result:** Modern, responsive verification page with Material-UI components

*   **Stage 10: Certificate Generation React Components**
    *   Create React components for certificate generation with MUI:
        *   `resources/ts/pages/admin/generation/Upload.tsx` - Main page with MUI Container and Grid
        *   `resources/ts/components/admin/generation/UploadForm.tsx` - Using MUI Paper and LinearProgress
        *   `resources/ts/components/admin/generation/TemplateSelect.tsx` - Using MUI Select and ImageList
        *   Add MUI Stepper for multi-step generation process
        *   Implement MUI Dialog for preview and confirmation
    *   Implement file upload with react-dropzone and MUI styled drop zone
    *   Add template selection with React Query and MUI components
    *   Create API endpoints in `CertificateGenerationController.php`
    *   Set up GenerationContext for generation state management
    *   Add upload progress tracking with MUI LinearProgress
    *   Use MUI Snackbar for status notifications
    *   **Result:** Polished certificate generation interface with Material-UI components

*   **Stage 11: Data Upload & Validation Service**
    *   Implement `processUpload` in the controller.
    *   Handle CSV file upload.
    *   Create `DataValidationService.php`.
    *   Implement logic in the service to parse the CSV and validate each row against the selected template's required variables (check for missing fields, basic format - e.g., is email plausible? *Skip complex validation for now*).
    *   The controller calls the service. If errors, display them clearly (e.g., on a `validation_results.blade.php` view or back on the form).
    *   **Result:** Admin uploads a CSV, receives feedback if rows are missing required data based on the template chosen.

*   **Stage 12: Core Generation Logic (No PDF/QR)**
    *   If validation passes (Stage 11), modify `processUpload` (or a new method/service).
    *   Loop through valid data rows.
    *   For each row: Generate a unique verification code (e.g., using `Str::uuid()` or similar).
    *   Save a record in the `certificates` table: `template_id`, recipient data (as JSON), the generated `verification_code`.
    *   Redirect with a success message indicating how many certificates were processed.
    *   **Result:** Uploading a valid CSV populates the `certificates` table. Verification page (Stage 9) will now find these codes.

*   **Stage 13: Integrate QR Code Service**
    *   Add QR Code library (`composer require endroid/qr-code`).
    *   Create `QrCodeService.php`. Implement a method that takes the verification code, constructs the verification URL (`config('app.url') . '/verify?code=' . $code`), and generates the QR code image data (e.g., as base64 string or save temporarily).
    *   *(Decide later if QR is embedded in PDF or generated on the fly for verification page)*.
    *   **Result:** QR codes can be generated programmatically.

*   **Stage 14: Integrate PDF Service (Basic Text)**
    *   Add PDF library (`composer require mpdf/mpdf`).
    *   Create `CertificateGeneratorService.php`.
    *   Implement a basic method `generatePdf(Template $template, array $recipientData, string $verificationCode)` that:
        *   Initializes mPDF.
        *   Loads template background (if exists).
        *   Iterates through `template->elements`.
        *   For *basic text elements* (static or variable), write the text at the specified X/Y coordinates using mPDF functions. Use recipient data for variables.
        *   Outputs a raw PDF string or saves to a temporary file.
    *   Test this service independently (e.g., via a test route or `php artisan tinker`).
    *   **Result:** A basic PDF with text placed at coordinates can be generated for one certificate.

*   **Stage 15: Full PDF Generation Logic**
    *   Enhance `CertificateGeneratorService.php`:
        *   Add support for *all* element types: Dates (Hijri/Gregorian formatting), Gender-specific text, QR Codes (embed generated image), Images.
        *   Apply *all* properties: Font family (embedding fonts if needed!), size, color, alignment. This is the most complex rendering part.
    *   Refine error handling within PDF generation.
    *   **Result:** A complete, styled PDF matching the template design can be generated for one certificate.

*   **Stage 16: Bulk Generation & ZIP Download**
    *   Modify the generation controller logic (`processUpload` or subsequent step).
    *   After validation (Stage 11) and saving basic certificate records (Stage 12):
        *   Loop through the successfully processed recipient data/certificate records.
        *   For each record, call the `CertificateGeneratorService::generatePdf`.
        *   Use PHP's `ZipArchive` to create a ZIP file in memory or temporarily on disk.
        *   Add each generated PDF to the ZIP archive (using recipient name or code as filename).
        *   *(Optional)* If storing PDFs, save each PDF to `storage/app/certificates/` and update the `pdf_file_path` in the `certificates` table.
        *   Stream the generated ZIP file for download.
    *   **Result:** Admin uploads valid CSV, triggers generation, and downloads a ZIP file containing all individual PDF certificates.

*   **Stage 17: Enhance Verification Page (Display & Download)**
    *   Modify `VerificationController` and `verify.blade.php`.
    *   When a code is valid (Stage 9):
        *   Fetch the full `Certificate` record, including related `Template`.
        *   Retrieve the `recipient_data`.
        *   Display key recipient details (Name, Issue Date, etc.) on the page.
        *   Provide a link/button to download the PDF. This link might point to:
            *   A route that streams the stored PDF file (if Stage 16 saved them).
            *   A route that *re-generates* the PDF on demand using the stored data and template (less efficient but avoids storage).
        *   *(Optional but good UX)*: Display an image preview of the certificate on the page (requires either generating a preview image or embedding the PDF).
    *   **Result:** Public verification page shows details, allows download, and potentially shows a preview of the valid certificate.

*   **Stage 18: Template Preview Implementation**
    *   Add a `preview` method to `TemplateController` and a corresponding route (e.g., `/admin/templates/{template}/preview`).
    *   Implement the method:
        *   Fetch the specific `Template` and its `elements`.
        *   Generate realistic *dummy* data for all variables defined in the template.
        *   Generate a dummy verification code and QR code using the services.
        *   Call the `CertificateGeneratorService::generatePdf` with the template and dummy data.
        *   Return the generated PDF directly to the browser (inline display or download).
    *   **Result:** Admin can click a "Preview" button on the template list/edit page and see an accurately rendered PDF based on the saved template definition using dummy data.

*   **Stage 19: Refinements & Final Testing**
    *   Add database indexes (especially `verification_code`).
    *   Implement detailed data validation (Stage 11 - emails, languages, country codes).
    *   Refine UI/UX based on testing.
    *   Add comprehensive error handling (file uploads, PDF generation, database errors).
    *   Thoroughly test RTL/Arabic text rendering in generated PDFs across different PDF viewers.
    *   Test Hijri/Gregorian date formatting.
    *   Test QR code scanning and verification flow.
    *   Test performance of bulk generation.
    *   Secure file storage directories.
