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

**Incremental Implementation Steps (Focus on Seeing Results)**
*   **Stage 5.3: Template Recipients Management**
    *   Create React components for recipients management with MUI:
        *   `resources/ts/components/admin/templates/management/recipients/RecipientsTab.tsx` - Main recipients view, will be a tab under `Management.tsx`
        *   `resources/ts/components/admin/templates/management/recipients/` - Components:
            *   `RecipientList.tsx` - Using MUI DataGrid for data display
            *   `ImportExport.tsx` - Handling Excel operations with client-side processing:
                *   Excel template generation in browser using xlsx library
                *   Client-side file preview before upload
                *   Toggle switch for client/server-side processing
            *   `ValidationResults.tsx` - Displaying import validation results
            *   `ValidationToggle.tsx` - MUI Switch component to toggle client/server validation
        *   Create comprehensive context for recipients management:
            *   `TemplateRecipientsContext.tsx` - State management for recipients
            *   State variables:
                *   List of recipients
                *   Loading states
                *   Error handling
                *   Client-side validation flag
                *   Client-side preview generation flag
            *   CRUD operations for recipients
            *   Client-side Excel operations:
                *   Generate template Excel file in browser
                *   Validate Excel files client-side
                *   Parse and process Excel data
                *   Preview generation in browser
            *   Server fallback operations:
                *   API integration for template download
                *   Server-side validation when client validation is disabled
                *   Server-side preview generation when disabled in UI
    *   Add feature flags in context:
        *   `useClientValidation` - Default true, toggleable
        *   `useClientPreview` - Default true, toggleable
    *   Add database migration for template recipients:
        *   Create `template_recipients` table with columns:
            *   `id`, `template_id`, `data` (JSON), timestamps
    *   Create Excel management service with hybrid processing:
        *   Client-side methods (default):
            *   Generate template Excel file using xlsx-js library
            *   Validate and import Excel files in browser
            *   Real-time row-by-row validation
            *   Generate preview in browser
        *   Server-side fallback methods:
            *   Template file generation endpoint
            *   File validation endpoint
            *   Import processing endpoint
            *   Preview generation endpoint
    *   Create API endpoints in `TemplateRecipientsController.php`:
        *   Add endpoint for downloading Excel template (server fallback)
        *   Add endpoint for importing filled Excel (server fallback)
        *   Add endpoint for managing individual recipients
        *   Add endpoint for server-side preview generation
    *   Implement hybrid validation mechanism:
        *   Client-side validation (default):
            *   Real-time validation using xlsx-js
            *   Immediate feedback for invalid rows
            *   Browser-based preview generation
        *   Server-side validation (optional):
            *   Traditional file upload and validation
            *   Server-generated validation results
            *   Server-generated preview
    *   Add comprehensive UI controls:
        *   Toggle switches for client/server processing
        *   Progress indicators for both modes
        *   Clear error messaging
        *   Preview toggle and display
    *   **Result:** Complete interface for managing template recipients with hybrid client/server processing capabilities, featuring toggleable client-side validation and preview generation

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
