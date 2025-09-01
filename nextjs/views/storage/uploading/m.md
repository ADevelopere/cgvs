(all the app is under mui theme context, we will use mui theme, and the app provide theme colors, so no hardcoded colors at all)

### **Analysis of the Upload Progress UI Component**

This component is a self-contained, floating notification card designed to provide users with real-time feedback on an ongoing file upload process.

#### **1. Main Container (The Card)**
This is the root element that holds all other components.
*   **Shape and Style:** It is a rectangle with rounded corners, giving it a modern, soft appearance.
*   **Background:** It uses a dark, solid color, which helps it stand out against a lighter background and is consistent with a dark-theme UI.
*   **Elevation:** Although not explicitly visible, such components typically have a subtle drop shadow to create a sense of depth and visually separate them from the content underneath.

#### **2. Header Section**
This top section provides a summary of the operation and primary controls for the card itself.
*   **Title Text ("Uploading 1 item"):**
    *   **Function:** This is a dynamic title that informs the user about the overall status of the upload queue. The number "1" would change based on how many files are being uploaded.

*   **Collapse/Minimize Icon (Chevron Down):**
    *   **Function:** This is an interactive icon button. Its purpose is to collapse the body of the card, hiding the detailed list of individual file uploads. This is useful for minimizing the component's screen real estate while keeping the overall progress visible.
    *   **State:** This icon would likely toggle to a "chevron up" when the card is collapsed.
*   **Close Icon ("X"):**
    *   **Function:** This is an interactive icon button used to dismiss the entire upload notification card

#### **3. Overall Progress Section**
This section is located just below the header and provides a summary of the time remaining and a global action.
*   **Time Remaining Text ("5 min left..."):**
    *   **Function:** This is a dynamic text element that provides a human-readable estimate of the time remaining for the entire upload batch to complete. The "..." suggests the text updates periodically.
    *   **Style:** It uses a smaller font size than the title to create a clear visual hierarchy.
*   **Cancel Button:**
    *   **Function:** This is a primary call-to-action button for the user to abort the entire upload process.
    *   **Style:** It is styled as a text link rather than a contained button. The distinct blue color makes it stand out as a clickable element against the dark background.

#### **4. Individual File Item Row**
This section lists each file being uploaded and shows its specific progress.
*   **File Item Container:** A horizontal row dedicated to a single file. There is a clear visual separation (a horizontal line) between the header section and this file list.
*   **File Type Icon:**
    *   **Function:** A small, specific icon that provides a quick visual cue about the type of file being uploaded (in this case, it appears to be a generic document or code file icon).
*   **File Name Text ("code-insiders_1.104.0-1756099480_a..."):**
    *   **Function:** Displays the name of the file.
    *   **Behavior:** The text is truncated with an ellipsis (...) at the end. This is a crucial behavior to ensure the component maintains its fixed width and does not break the layout when dealing with very long filenames.
*   **Circular Progress Indicator:**
    *   **Function:** This is a graphical indicator that provides a precise visualization of the upload progress for the *individual file* in that row.
    *   **Visual Breakdown:**
        *   **Track:** A static, circular track (the faint grey circle).
        *   **Progress Fill:** A colored arc (light blue) that animates by filling the track, likely in a clockwise direction, as the upload progresses.
        *   **Center:** x icon to dismiss this file upload


all upload cancelling (single or all) will require a confirm dialog 
(are u sure to cancel all uploads, or are u sure to cancel uploading ...... file name, progres...)

each section cant be on same file (component) of another section, (and cant be its child)

the parent will sturcture all of these components (one level child for each section which are 4 sections here, )
the parent will use the upload context

now give me the parent component text tree sturcture (no mermaid) (no code at all)

now under "nextjs/views/storage/uploading" create these componets, (using mui theme, no hardcoded colors) 