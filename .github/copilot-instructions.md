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
│   ├── Console/
│   ├── Exceptions/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/              # Controllers for Login, Logout etc.
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── TemplateController.php
│   │   │   │   ├── CertificateGenerationController.php
│   │   │   │   └── UserController.php # Optional for multi-admin
│   │   │   └── VerificationController.php
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php   # Ensure user is logged in
│   │   │   └── RedirectIfAuthenticated.php
│   │   └── Requests/              # Form validation requests
│   ├── Models/
│   │   ├── User.php
│   │   ├── Template.php
│   │   ├── TemplateElement.php
│   │   └── Certificate.php
│   ├── Providers/
│   └── Services/                  # Business logic services
│       ├── CertificateGeneratorService.php
│       ├── QrCodeService.php
│       └── DataValidationService.php
├── bootstrap/
├── config/                      # Config files (database, app, etc.)
├── database/
│   ├── factories/
│   ├── migrations/              # Database schema definitions
│   │   ├── xxxx_xx_xx_xxxxxx_create_users_table.php
│   │   ├── xxxx_xx_xx_xxxxxx_create_password_resets_table.php # Optional
│   │   ├── xxxx_xx_xx_xxxxxx_create_templates_table.php
│   │   ├── xxxx_xx_xx_xxxxxx_create_template_elements_table.php
│   │   └── xxxx_xx_xx_xxxxxx_create_certificates_table.php
│   └── seeders/                 # Database seeders (e.g., default admin user)
├── public/                      # WEB SERVER DOCUMENT ROOT
│   ├── build/                  # Vite build output directory
│   ├── hot                     # Vite hot module replacement file
│   ├── images/                 # General site images
│   ├── storage/                # Symlink to storage/app/public
│   ├── .htaccess              # Apache rewrite rules
│   └── index.php              # Application entry point
├── resources/
│   ├── css/                   # Raw CSS for Vite processing
│   │   └── app.css           # Main CSS file
│   ├── js/                    # JavaScript & React components
│   │   ├── app.jsx           # Main React entry point
│   │   ├── bootstrap.js      # Bootstrap JavaScript
│   │   ├── routes/           # React Router configuration
│   │   │   └── index.jsx     # Route definitions
│   │   ├── store/            # Redux/RTK store modules
│   │   │   └── index.js      # Store configuration
│   │   ├── components/       # React components
│   │   │   ├── layouts/      # Layout components
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   └── GuestLayout.jsx
│   │   │   ├── auth/         # Authentication components
│   │   │   │   └── LoginForm.jsx
│   │   │   ├── admin/        # Admin components
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── templates/
│   │   │   │   │   ├── TemplateList.jsx
│   │   │   │   │   ├── TemplateEditor.jsx
│   │   │   │   │   └── TemplatePreview.jsx
│   │   │   │   └── generation/
│   │   │   │       ├── UploadForm.jsx
│   │   │   │       └── ValidationResults.jsx
│   │   │   └── public/       # Public components
│   │   │       └── VerificationForm.jsx
│   │   └── pages/            # React page components
│   │       ├── auth/         # Auth pages
│   │       │   └── Login.jsx
│   │       ├── admin/        # Admin pages
│   │       │   ├── Dashboard.jsx
│   │       │   ├── templates/
│   │       │   │   ├── Index.jsx
│   │       │   │   ├── Create.jsx
│   │       │   │   └── Edit.jsx
│   │       │   └── generation/
│   │       │       └── Upload.jsx
│   │       └── Verify.jsx    # Public verification page
│   ├── lang/                 # Language files (for localization)
│   └── views/                # Blade templates (minimal)
│       └── app.blade.php     # Main app template for Vue
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

*   **Stage 0: Project Setup & Environment (done)** 
    *   Install PHP, Composer, Git, Node.js, and Bun on your local machine (if developing locally).
    *   Set up a new project using your chosen framework (e.g., `composer create-project laravel/laravel cgvs`).
    *   Initialize Git repository (`git init`, initial commit).
    *   Install Node.js dependencies (`bun install`).
    *   Configure your `.env` file (App URL, Database connection details for local dev).
    *   Create the database locally.
    *   Run initial framework migrations (`php artisan migrate`).
    *   Start Vite development server (`bun run dev`).
    *   **Result:** Basic framework running locally with Vite for asset compilation, database connected.

*   **Stage 1: Basic Authentication (done)**
    *   Install React and dependencies:
        ```
        bun add react react-dom react-router-dom @reduxjs/toolkit axios @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
        ```
    *   Create React authentication components with MUI:
        *   `resources/js/components/auth/LoginForm.jsx` using MUI components (Card, TextField, Button)
        *   Set up MUI theme provider with custom theme in `resources/js/theme/index.js`
    *   Set up React Router and authentication store with Redux Toolkit.
    *   Create API routes and controllers for login/logout.
    *   Implement login/logout logic with Laravel Sanctum.
    *   **Result:** SPA-based authentication system with Material-UI components.

*   **Stage 2: Basic Admin Area & React Router Setup (done)**
    *   Create React layout components with MUI:
        *   `resources/js/components/layouts/AdminLayout.jsx` - Using MUI AppBar, Box, Container
            *   Top navbar with logo on the left
            *   Navigation links in the center
            *   Right section with theme switcher and user avatar:
                *   Theme switcher toggle (light/dark/system)
                *   User avatar with dropdown menu (profile, preferences, logout)
        *   `resources/js/components/layouts/GuestLayout.jsx` - Using MUI Container, Paper
    *   Set up theme handling:
        *   Create theme slice in Redux for theme state management
        *   Implement theme persistence in localStorage
        *   Support light/dark/system theme modes
    *   Create admin dashboard component (`resources/js/pages/admin/Dashboard.jsx`) with MUI:
        *   Use MUI Grid for responsive layout
        *   Add summary cards with MUI Card components
        *   Include basic stats with MUI Paper and Typography
    *   Set up React Router with authentication protection:
        *   Configure admin routes in `resources/js/routes/index.jsx`
        *   Add protected route components
        *   Use MUI CircularProgress for loading states
        *   Implement SPA navigation (no page reloads)
    *   Create API endpoints for dashboard data
    *   Implement admin API middleware in Laravel
    *   **Result:** Modern SPA-based admin area with responsive top navbar, theme switching, and user menu

*   **Stage 3: Template Data Structure**
    *   Create database migrations for templates and elements.
    *   Create Eloquent models with proper relationships and attribute handling.
    *   Implement model factories for testing.
    *   Run migrations.
    *   **Result:** Database schema and models ready for template management.

*   **Stage 4: Template Management React Components**
    *   Create React components for template management with MUI:
        *   `resources/js/pages/admin/templates/Index.jsx` - Using MUI DataGrid for template listing
        *   `resources/js/pages/admin/templates/Create.jsx` - Using MUI Stepper for creation flow
        *   `resources/js/components/admin/templates/TemplateList.jsx` - Using MUI Card and ImageList
        *   Add MUI dialogs for confirmations and forms
        *   Implement MUI Snackbars for notifications
    *   Set up template Redux slice for state management
    *   Create API endpoints in `TemplateController.php` (`index`, `store` methods)
    *   Implement template API routes with auth middleware
    *   Add file upload handling with React-Dropzone and MUI styling
    *   **Result:** SPA-based template management with Material-UI components and modern UX

*   **Stage 5: Save Basic Template & Background Upload**
    *   Implement the `store` method in `TemplateController`.
    *   Add basic validation for name/description.
    *   Handle background image upload: validate file type/size, move it to `storage/app/public/template_backgrounds/`, save the path in the database.
    *   Ensure `php artisan storage:link` is run (creates `public/storage` symlink).
    *   Redirect back to the template index page with a success message.
    *   Update the `index` view to display the list of created templates (name, description, maybe thumbnail).
    *   **Result:** Admin can create a template record, upload a background, and see it listed.

*   **Stage 6: React Template Editor Component**
    *   Create React template editor components with MUI:
        *   `resources/js/components/admin/templates/TemplateEditor.jsx` - Main editor using MUI Paper as canvas
        *   `resources/js/components/admin/templates/elements/` - Element components with MUI styling:
            *   `TextElement.jsx` - Using MUI Typography
            *   `DateElement.jsx` - Using MUI DatePicker
            *   `QRElement.jsx` - Custom styled with MUI theme
            *   `ImageElement.jsx` - Using MUI Card for container
        *   Add MUI SpeedDial for quick actions
        *   Implement MUI Drawer for element properties panel
    *   Implement drag-and-drop using react-beautiful-dnd with MUI styling
    *   Create element property forms using MUI components:
        *   Color pickers with MUI
        *   Font selectors with MUI Select
        *   Position inputs with MUI TextField
    *   Set up Redux slice for editor state management:
        *   Track selected element
        *   Manage element positions
        *   Handle undo/redo with Redux history
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
        *   `resources/js/pages/Verify.jsx` - Main verification page with MUI Container
        *   `resources/js/components/public/VerificationForm.jsx` - Using MUI TextField and Button
        *   `resources/js/components/public/VerificationResult.jsx` - Using MUI Alert and Card
    *   Set up Redux slice for verification state
    *   Implement API endpoint in `VerificationController`
    *   Add real-time verification with useDebounce hook
    *   Handle URL parameters with React Router useParams
    *   Add loading states with MUI Skeleton and CircularProgress
    *   Implement error states with MUI Alert
    *   Add responsive design with MUI Grid system
    *   **Result:** Modern, responsive verification page with Material-UI components

*   **Stage 10: Certificate Generation React Components**
    *   Create React components for certificate generation with MUI:
        *   `resources/js/pages/admin/generation/Upload.jsx` - Main page with MUI Container and Grid
        *   `resources/js/components/admin/generation/UploadForm.jsx` - Using MUI Paper and LinearProgress
        *   `resources/js/components/admin/generation/TemplateSelect.jsx` - Using MUI Select and ImageList
        *   Add MUI Stepper for multi-step generation process
        *   Implement MUI Dialog for preview and confirmation
    *   Implement file upload with react-dropzone and MUI styled drop zone
    *   Add template selection with React Query and MUI components
    *   Create API endpoints in `CertificateGenerationController.php`
    *   Set up Redux slice for generation state management
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
