Certainly. Here is the complete architectural plan you requested, formatted as a single markdown block for your convenience.

# Architectural Blueprint: Parallel `pdfme` Editor Integration for the `cgvs` Repository

## I. Executive Summary & Strategic Architectural Pillars

### A. Statement of Objective

This document provides a comprehensive architectural blueprint and implementation plan for integrating the `pdfme` PDF editor into the `cgvs` application. The integration will be deployed _in parallel_ with the existing ReactFlow-based editor, which will be preserved as a fallback or alternative editing mechanism. The core architectural constraints mandate a non-invasive approach, wherein no modifications are made to the existing ReactFlow editor's source files. The new `pdfme` editor will be introduced via a toggle or tab system managed by the parent component, `EditorTab.tsx`, and will be fully integrated into the application's existing shared state, managed by `NodeDataProvider.ts`.

### B. The Core Technical Challenge: The React/VanillaJS "Impedance Mismatch"

A detailed analysis of the `pdfme` library confirms it is an imperative, vanilla JavaScript library, not a native React component.[1] The `pdfme` `Designer` class is instantiated by being passed a direct DOM element reference (a `domContainer`) [2, 3], which it then manipulates directly. This imperative model, where the library maintains its own internal state and controls a segment of the DOM, is in fundamental conflict with React's declarative, state-driven rendering paradigm.

This "impedance mismatch" is the central technical challenge. The user's requirement for a "toggle" to switch between editors exacerbates this problem. A toggle implies the mounting and unmounting of the editor components. If the `pdfme` `Designer` instance—which binds to the DOM and holds significant data in memory—is not explicitly and correctly destroyed when its React wrapper component unmounts, the application will suffer from _guaranteed_ memory leaks and orphaned event listeners.[2, 4] Fragmented code examples found in public forums often omit this critical cleanup step, demonstrating patterns that are unsuitable for a production, toggled environment.[3]

### C. The Two-Pillar Solution Architecture

To resolve this conflict and meet all project requirements, a two-pillar architecture is proposed:

1.  **Pillar 1: The `PdfmeEditorWrapper.tsx` Component**
    A new, purpose-built React component will be created to serve as an "adapter" or "bridge." This wrapper's sole responsibility is to encapsulate the `pdfme` `Designer` instance. It will use standard React hooks (`useRef`, `useEffect`) to declaratively manage the `Designer`'s imperative lifecycle (instantiation on mount, destruction on unmount). It will also serve as the communications conduit, translating React props and context state into imperative `pdfme` API calls (e.g., `updateTemplate` [2, 4]) and translating `pdfme` events (e.g., `onChangeTemplate` [4, 3]) into dispatched actions for the React context.

2.  **Pillar 2: The `TemplateConverter.ts` Service**
    A new, standalone utility service will be created to manage the complex data model transformation. The application's `NodeDataProvider` state is structured for ReactFlow (graphs of nodes and edges), which is structurally incompatible with the `pdfme` `Template` schema (a JSON object defining a printable document).[2] This service will provide static methods for bidirectional conversion (`fromReactFlow` and `toReactFlow`), isolating this complex, application-specific business logic from the view layer and enabling both editors to operate on the same shared state.

### D. Dependencies & Installation

Implementation of this plan requires the installation of three packages from the `pdfme` ecosystem:

1.  `@pdfme/ui`: Provides the core `Designer`, `Form`, and `Viewer` classes.[2, 5]
2.  `@pdfme/common`: Provides shared types and utilities, most importantly the `Template` type definition.[2]
3.  `@pdfme/schemas`: This package is critical for certificate generation. By default, `pdfme` only supports a `text` schema.[2] This package provides essential plugins for `image` and `barcodes` (including `qrcode`), which are necessary for rendering logos, signatures, and verification codes.[6, 7, 8]

The required command is:
`npm i @pdfme/ui @pdfme/common @pdfme/schemas` [2, 6, 7]

## II. Prerequisite "Deep Search": Canonical Implementation Analysis

### A. Objective

Before any integration code is written, the development team must conduct a focused code review of the _official_ `pdfme` playground source code. The objective is to internalize the library creator's own "blessed" patterns for React integration, which will de-risk the project by providing a canonical reference for lifecycle management and state synchronization.

### B. Location of Source Code

Initial investigation reveals that the `pdfme-playground` repository is archived and deprecated.[9, 10, 11] The playground's source code has been merged into the main `pdfme` monorepo.[10]

**Action Item:** The team must perform a code review of the following directory:
`https://github.com/pdfme/pdfme/tree/main/playground` [12, 10]

### C. Key Areas for Investigation

The review should focus on answering three specific questions:

1.  **Lifecycle Management:** How does the playground's React application instantiate the `Designer`? Is it within a `useEffect` hook? More importantly, how does it handle component unmounting or switching views? The team must locate the code responsible for calling `designer.destroy()` [2, 4] to understand the correct cleanup pattern.
2.  **State Management:** How do the playground's React UI elements (e.g., input forms, "Save" buttons) communicate with the `Designer` instance? This will reveal the intended use of the `designer.updateTemplate(newTemplate)` method [2, 4] for downstream data flow.
3.  **Plugin Registration:** The team must verify the exact import and registration syntax for passing the required schemas from `@pdfme/schemas` (e.g., `text`, `image`, `barcodes.qrcode`) into the `Designer` constructor's `plugins` option.[2, 6]

### D. De-risking Implementation by Avoiding Flawed Examples

Relying on fragmented code examples from public GitHub issues is a high-risk strategy. The provided examples demonstrate syntactically simple integrations but are architecturally flawed for this project's use case.[3] Specifically, they often instantiate the `Designer` in a way that provides no clean path for destruction, such as within a `useState` hook [3] or via a simple button click handler.[3]

These patterns are acceptable for simple, "build-once" demos, but they are catastrophic in a production application featuring a toggle-based, mount/unmount lifecycle. The analysis of the playground code [12, 10] is therefore the single most important "search" in this plan. It will provide the authoritative, production-safe patterns for `useEffect`-based lifecycle management that are absent from the incomplete examples, saving significant debugging time related to memory leaks and state-desynchronization bugs.

## III. Parent Component Refactoring: `src/tabs/EditorTab.tsx`

### A. Objective

To implement the editor-switching logic within the parent component, `EditorTab.tsx`. This approach fulfills the "non-invasive" constraint by "quarantining" the logic to the parent, requiring zero modifications to any files related to the existing ReactFlow editor.

### B. State Implementation

A new React state will be introduced in `EditorTab.tsx` to manage which editor is currently active. This state will default to `'reactflow'` to ensure existing application behavior is preserved on initial load.tsx
// In src/tabs/EditorTab.tsx
import { useState } from 'react';
//... other imports

type ActiveEditor = 'reactflow' | 'pdfme';

//... inside the EditorTab component
const [activeEditor, setActiveEditor] = useState\<ActiveEditor\>('reactflow');

````

### C. UI Implementation (The Toggle)

A UI element, such as a tab group, segmented control, or simple button, must be added to `EditorTab.tsx`. This element will be responsible for updating the `activeEditor` state.

```tsx
// Example using a simple toggle button group
// This UI component would be placed within EditorTab.tsx's render method
<div className="editor-toggle-controls">
  <button
    onClick={() => setActiveEditor('reactflow')}
    disabled={activeEditor === 'reactflow'}
  >
    ReactFlow Editor
  </button>
  <button
    onClick={() => setActiveEditor('pdfme')}
    disabled={activeEditor === 'pdfme'}
  >
    pdfme Editor
  </button>
</div>
````

### D. Conditional Rendering Logic

The core of the non-invasive strategy is conditional rendering. The render method of `EditorTab.tsx` will use the `activeEditor` state to determine which of the two editor components to mount.

**Speculative Code Example:**

```tsx
// Inside EditorTab.tsx's render method

//... other imports
import { YourExistingReactFlowEditorComponent } from ".../YourExistingReactFlowEditorComponent";
import { PdfmeEditorWrapper } from ".../components/PdfmeEditorWrapper";

//... inside the component
const [activeEditor, setActiveEditor] = useState<ActiveEditor>("reactflow");

return (
  <div className="editor-tab-container">
    {/* The new editor toggle UI from Section III-C */}
    <EditorToggle activeEditor={activeEditor} onToggle={setActiveEditor} />

    <div className="editor-content-area">
      {/* 
        This conditional rendering logic ensures that only one editor
        is mounted at any given time.
      */}
      {activeEditor === "reactflow" && (
        // This is your EXISTING component. Its files are unmodified.
        <YourExistingReactFlowEditorComponent />
      )}

      {activeEditor === "pdfme" && (
        // This is the NEW wrapper component (Section IV)
        <PdfmeEditorWrapper />
      )}
    </div>
  </div>
);
```

### E. The "Quarantine" Strategy and Lifecycle Implications

This conditional rendering pattern effectively "quarantines" the two editors from one another. By implementing the switch in the parent, the `YourExistingReactFlowEditorComponent` is left completely untouched.

A critical and highly beneficial side-effect of this pattern is that React will _unmount_ the inactive editor component entirely. When `activeEditor` is set to `'pdfme'`, the `YourExistingReactFlowEditorComponent` is removed from the DOM, and vice-versa. This prevents complex CSS conflicts and performance degradation that would arise from having two heavy, interactive editors present in the DOM simultaneously.

This unmounting behavior, however, is precisely what makes the lifecycle management in `PdfmeEditorWrapper.tsx` (detailed in Section IV) so essential. The wrapper _must_ correctly clean up its `Designer` instance when React unmounts it, or memory leaks will occur with every toggle.

## IV. Core Component Architecture: `src/components/PdfmeEditorWrapper.tsx`

### A. Objective

To create the `PdfmeEditorWrapper.tsx` React component. This component serves as the "bridge" that encapsulates the imperative `pdfme` `Designer` instance, manages its lifecycle, and facilitates bidirectional data synchronization with the `NodeDataProvider` context.

### B. Component Skeleton & Ref Setup

This component will be built around two `useRef` hooks and consumption of the `NodeDataContext`.

1.  `domContainerRef`: A `useRef<HTMLDivElement | null>` that will be attached to a `div` element. This ref provides the `domContainer` required by the `Designer` constructor.[2]
2.  `designerRef`: A `useRef<Designer | null>` that will hold the `Designer` instance _itself_. Using `useRef` (instead of `useState`) is critical to persist the instance across re-renders without triggering them.

<!-- end list -->

```tsx
// In src/components/PdfmeEditorWrapper.tsx

import React, { useContext, useEffect, useRef } from "react";
import { Designer } from "@pdfme/ui";
import type { Template } from "@pdfme/common";
import { text, image, barcodes } from "@pdfme/schemas"; // Import required plugins [2, 6]
import { NodeDataContext } from ".../data/NodeDataProvider";
import { TemplateConverter } from ".../services/templateConverter"; // (See Section VI)

// Don't forget to import the CSS!
// The path must be confirmed from the playground repo (Section II)
// e.g., import '@pdfme/ui/dist/index.css';

export const PdfmeEditorWrapper = () => {
  const domContainerRef = useRef<HTMLDivElement | null>(null);
  const designerRef = useRef<Designer | null>(null);

  // Access the shared application state and dispatcher
  const { state, dispatch } = useContext(NodeDataContext);

  //... Lifecycle and Synchronization logic will be added here...

  // Render the container div for pdfme to attach to
  return <div ref={domContainerRef} style={{ width: "100%", height: "100%" /* Or other required dimensions */ }} />;
};
```

### C. Critical Lifecycle Management (`useEffect`)

A single, primary `useEffect` hook will be used to manage the `Designer`'s entire lifecycle. It will be configured to run _only on component mount_ by providing an empty dependency array (\`\`). This hook _must_ return a cleanup function to handle unmounting.

```tsx
// Inside PdfmeEditorWrapper.tsx

useEffect(() => {
  // --- 1. MOUNT LOGIC ---
  if (domContainerRef.current) {
    // 1a. Get initial data from context and convert it
    // Note: This assumes state.pdfmeTemplate exists (See Section V)
    // If not, a conversion must happen first:
    const initialTemplate: Template = TemplateConverter.fromReactFlow(state.reactFlowData);

    // 1b. Instantiate the Designer
    designerRef.current = new Designer({
      domContainer: domContainerRef.current,
      template: initialTemplate,
      plugins: {
        text,
        image,
        qrcode: barcodes.qrcode,
      },
    });

    // 1c. Register the *upstream* data sync callback (See Section IV-E)
    designerRef.current.onChangeTemplate(newTemplate => {
      // This function is called *by pdfme* whenever the user makes an edit [4, 3]

      // Convert data back to ReactFlow model
      const reactFlowData = TemplateConverter.toReactFlow(newTemplate);

      // Dispatch an action to update the shared state
      dispatch({
        type: "SYNC_FROM_PDFME",
        payload: {
          pdfmeTemplate: newTemplate,
          reactFlowData: reactFlowData,
        },
      });
    });
  }

  // --- 2. UNMOUNT (CLEANUP) LOGIC ---
  // This cleanup function is the most critical part for stability
  return () => {
    if (designerRef.current) {
      // Call the destroy method from the pdfme API [2, 4]
      designerRef.current.destroy();
      designerRef.current = null;
    }
  };
}); // Empty dependency array ensures this runs only on mount/unmount
```

### D. The 'Mount/Unmount' Lifecycle vs. Flawed Examples

The code pattern in Section IV-C is the only robust solution for this project's requirements. It correctly pairs instantiation in a `useEffect` hook with destruction in that same hook's cleanup function.

This stands in stark contrast to incomplete patterns seen elsewhere. For example, placing `new Designer(...)` inside a `useState` call [3] is an anti-pattern; it provides no idiomatic way to call the `destroy()` method when the component unmounts and improperly mixes an imperative instance with declarative state. Similarly, instantiating the designer via a button click [3] is not suitable for an application where the editor must be ready immediately upon being toggled (mounted).

The "toggle" mechanism in `EditorTab.tsx` _will_ unmount this component. Omitting the `useEffect` cleanup function is not an option; it will directly cause application-wide memory leaks as `Designer` instances are orphaned with every toggle.

### E. Bidirectional State Synchronization (The "Two-Way Bridge")

The code in Section IV-C already implemented the **Upstream Sync** (`pdfme` -\> Context) via the `onChangeTemplate` callback.[4, 3] A second mechanism is required for **Downstream Sync** (Context -\> `pdfme`).

This is necessary for cases where the shared state is modified by _another part of the application_ (e.g., the user toggles back to the ReactFlow editor, makes a change, and then toggles back to `pdfme`). The `pdfme` instance must be updated to reflect that change.

This is achieved with a _second_ `useEffect` hook that subscribes to the state.

```tsx
// Inside PdfmeEditorWrapper.tsx, *after* the main mount/unmount useEffect

// --- 3. DOWNSTREAM DATA SYNC (Context -> pdfme) ---
useEffect(() => {
  // This effect runs whenever the canonical template in the
  // shared state *changes*.

  if (designerRef.current) {
    // Use the updateTemplate API [2, 4] to imperatively
    // update the designer instance with the new state.

    // Assumes state.pdfmeTemplate is the source of truth (See Section V)
    designerRef.current.updateTemplate(state.pdfmeTemplate);
  }
}); // Dependency: The template object from context
```

## V. State Management Analysis: `src/data/NodeDataProvider.ts`

### A. Objective

To analyze the existing `NodeDataProvider.ts` and define the optimal strategy for integrating the `pdfme` `Template` data structure without breaking the existing ReactFlow state model.

### B. "Deep Search" of Existing State

The implementation team's first task is to analyze `NodeDataProvider.ts` to identify the _canonical_ state. It is assumed this state is currently comprised of `state.nodes` and `state.edges` (or a combined `state.reactFlowData` object) designed for ReactFlow.

### C. Architectural Decision: Single vs. Dual State Models

A critical architectural decision must be made regarding the source of truth.

1.  **Model 1: Single Source of Truth (ReactFlow-centric)**
    - **Strategy:** The `NodeDataProvider` _only_ stores `state.nodes` and `state.edges`. The `pdfme` `Template` object is treated as _derived data_, generated on-the-fly by `TemplateConverter.fromReactFlow(...)` every time the `PdfmeEditorWrapper` needs it.
    - **High-Risk Flaw (Data Loss):** This model is rejected. The `pdfme` `Template` schema supports a rich set of properties (e.g., `dynamic-table` features, `lineHeight`, `characterSpacing`, `verticalAlign` [2]) that likely have _no equivalent_ in the existing ReactFlow node data structure. If a user edits these properties in `pdfme`, that data is converted "upstream" (`pdfme` -\> `ReactFlow`) and is _lost_ because the ReactFlow model cannot store it. The next "downstream" conversion (`ReactFlow` -\> `pdfme`) would be lossy, reverting all their work.

2.  **Model 2: Dual, Synchronized State (Recommended)**
    - **Strategy:** Modify `NodeDataProvider` to store _both_ representations of the certificate data.
    - **New State Shape (Example):**
      ```typescript
      type AppState = {
        reactFlowData: { nodes: Node; edges: Edge };
        pdfmeTemplate: Template;
        //... other existing state
      };
      ```
    - **Pro:** This model is _lossless_. The `pdfme` editor operates on its native, high-fidelity `pdfmeTemplate` object. The ReactFlow editor operates on its `reactFlowData` object.
    - **Con:** Requires robust synchronization logic within the provider's reducer to keep the two models in sync.

### D. Recommended Implementation (Model 2)

The `NodeDataProvider`'s reducer must be modified to handle actions from _both_ editors and perform the necessary conversions.

- **When an action comes from ReactFlow (e.g., `NODE_DRAG`):**
  1.  The reducer updates `state.reactFlowData` as it normally does.
  2.  The reducer _also_ calls `const newTemplate = TemplateConverter.fromReactFlow(state.reactFlowData);`
  3.  It then updates `state.pdfmeTemplate = newTemplate;`

- **When the new action `SYNC_FROM_PDFME` (from Section IV-C) arrives:**
  1.  The reducer takes the `pdfmeTemplate` from the action payload and updates `state.pdfmeTemplate`.
  2.  The reducer _also_ takes the `reactFlowData` from the payload (which was already converted in the wrapper) and updates `state.reactFlowData`.

This approach ensures that regardless of where an edit originates, both state representations are updated in lockstep, ensuring the "other" editor will be correct when toggled.

## VI. The Lyncpin Service: `src/services/templateConverter.ts`

### A. Objective

To define the interface and implementation skeleton for the `TemplateConverter.ts` service. This service is the critical lynchpin that makes the dual-editor, shared-state architecture possible.

### B. The "Data Model Chasm"

The user's request is architecturally impossible without a dedicated data transformation layer. The ReactFlow data model (a graph of nodes and edges) and the `pdfme` data model (a JSON representation of a printable document) [2] are fundamentally different. This "data model chasm" must be bridged.

This conversion logic is application-specific (e.g., "what `pdfme` schema corresponds to my `textNode`?") and complex. It _must_ be isolated in a standalone, testable service and kept out of React components. This service must be bidirectional to allow edits to flow from ReactFlow-to-`pdfme` and from `pdfme`-to-ReactFlow.

### C. Service Definition (`templateConverter.ts`)

The following code provides a skeleton for the `TemplateConverter` class. The `cgvs` development team must complete the "deep search" of their _own_ data model to fill in the mapping logic.

```typescript
// In src/services/templateConverter.ts

import type { Template } from '@pdfme/common';
import type { Node, Edge } from 'reactflow';

// Define the application's ReactFlow state representation
type ReactFlowData = {
  nodes: Node;
  edges: Edge;
};

export class TemplateConverter {
  /**
   * Converts the application's ReactFlow graph data into a
   * pdfme Template object.
   *
   * This is where the team must map each proprietary ReactFlow node type
   * ('textNode', 'imageNode', 'qrNode', etc.) to a corresponding
   * pdfme schema type ('text', 'image', 'qrcode'). [2, 6, 8]
   */
  public static fromReactFlow(data: ReactFlowData): Template {
    const schemas: any =; // pdfme schemas are an array of "page" objects
    const pageSchema: any = {};

    data.nodes.forEach(node => {
      const commonProps = {
        position: { x: node.position.x, y: node.position.y },
        width: node.width!,
        height: node.height!,
      };

      if (node.type === 'textNode') {
        pageSchema[node.id] = {
          type: 'text', // [2]
         ...commonProps,
          //... map other data props (node.data.text, node.data.fontSize, etc.)
          alignment: node.data.align |

| 'left',
          fontSize: node.data.fontSize |

| 10,
          lineHeight: node.data.lineHeight |

| 1,
          //... see [2] for more style props
        };
      } else if (node.type === 'imageNode') {
        pageSchema[node.id] = {
          type: 'image', // [2, 6]
         ...commonProps,
          data: node.data.imageUrl |

| '', // Map node.data.imageUrl to schema 'data'
        };
      } else if (node.type === 'qrNode') {
        pageSchema[node.id] = {
          type: 'qrcode', // [2, 6, 8]
         ...commonProps,
          data: node.data.qrValue |

| '', // Map node.data.qrValue to schema 'data'
        };
      }
      //... add other node types
    });

    schemas.push(pageSchema);

    return {
      // Define a base PDF size, e.g., A4 [2]
      basePdf: { width: 210, height: 297, padding: [10, 10, 10, 10] },
      schemas: schemas
    };
  }

  /**
   * Converts a pdfme Template object back into the ReactFlow
   * graph data structure for updating the shared state.
   */
  public static toReactFlow(template: Template): ReactFlowData {
    const nodes: Node =;

    // Iterate over each page's schema object
    template.schemas.forEach(schemaPage => {
      Object.keys(schemaPage).forEach(key => {
        const schema = schemaPage[key];

        // Default ReactFlow node properties
        const node: Node = {
          id: key,
          type: '', // To be determined by schema.type
          position: { x: schema.position.x, y: schema.position.y },
          data: {
            //... map schema props back to node data...
          },
          // ReactFlow requires width/height on the node object itself
          width: schema.width,
          height: schema.height,
        };

        // Reverse-map the type
        if (schema.type === 'text') {
          node.type = 'textNode';
          node.data.text = (schema as any).data |

| ''; // Re-map properties
          node.data.fontSize = (schema as any).fontSize;
        } else if (schema.type === 'image') {
          node.type = 'imageNode';
          node.data.imageUrl = (schema as any).data |

| '';
        } else if (schema.type === 'qrcode') {
          node.type = 'qrNode';
          node.data.qrValue = (schema as any).data |

| '';
        }

        if (node.type) {
          nodes.push(node);
        }
      });
    });

    // Edges are likely not represented in pdfme, return empty array
    return { nodes, edges: };
  }
}
```

## VII. Key Implementation Task: State Synchronization Interface

This table synthesizes the entire plan into an actionable technical reference, mapping the data flow between the three core components of the system: the `NodeDataProvider` (State), the `PdfmeEditorWrapper` (Wrapper), and the `Designer` instance (Library). This directly addresses the requirement to plan the "hook-in" strategy.

**Table 1: Bidirectional State Synchronization Contract**

| **Direction**      | **Trigger Event**                  | **Source of Truth**                     | **Synchronization Mechanism**                      | **API / Method Call**                                              | **Source(s)** |
| :----------------- | :--------------------------------- | :-------------------------------------- | :------------------------------------------------- | :----------------------------------------------------------------- | :------------ |
| **Initialization** | Component Mount                    | `NodeDataProvider`                      | `useEffect(() => {... },)` in `PdfmeEditorWrapper` | `new Designer({..., template: initialTemplate, plugins: {... } })` | [2, 6]        |
| **Downstream**     | State changed (e.g., by ReactFlow) | `NodeDataProvider`                      | `useEffect(...,)` in `PdfmeEditorWrapper`          | `designerRef.current.updateTemplate(state.pdfmeTemplate)`          | [2, 4]        |
| **Upstream**       | User edit _in_ `pdfme`             | `pdfme` `Designer`                      | Callback registered during initialization.         | `designerRef.current.onChangeTemplate((newTemplate) => {... })`    | [4, 3]        |
| **Upstream**       | `pdfme` callback fires             | `PdfmeEditorWrapper` (Callback Handler) | Context dispatcher.                                | `dispatch({ type: 'SYNC_FROM_PDFME', payload: {... } })`           |               |
| **Destruction**    | Component Unmount (Toggle)         | `PdfmeEditorWrapper`                    | `useEffect` cleanup function.                      | `designerRef.current.destroy()`                                    | [2, 4]        |

## VIII. Implementation Roadmap & Verification

1.  **Step 1: Dependency Installation**
    - Execute `npm install @pdfme/ui @pdfme/common @pdfme/schemas`.[2, 6, 7]

2.  **Step 2: Canonical Analysis (Mandatory)**
    - Perform the code review of the official playground: `github.com/pdfme/pdfme/tree/main/playground` [12, 10] to confirm the `useEffect` lifecycle and plugin registration patterns.
    - Crucially, identify the CSS import path (e.g., `@pdfme/ui/dist/index.css`) from the playground, as it is missing from the official documentation.[2]

3.  **Step 3: State Provider Modification**
    - Modify `NodeDataProvider.ts` to implement the "Dual, Synchronized State" model (Section V-D). Add `state.pdfmeTemplate` and update the reducer to handle `SYNC_FROM_PDFME` and perform conversions on existing actions.

4.  **Step 4: Converter Service Creation**
    - Create `src/services/templateConverter.ts` (Section VI).
    - Implement the `fromReactFlow` and `toReactFlow` static methods. This step requires the most domain-specific knowledge of the `cgvs` data models.

5.  **Step 5: Wrapper Component Creation**
    - Create `src/components/PdfmeEditorWrapper.tsx` (Section IV).
    - Implement the full lifecycle (`useEffect` with mount/unmount) and both synchronization hooks: `onChangeTemplate` (upstream) and `updateTemplate` (downstream).

6.  **Step 6: Parent Component Integration**
    - Modify `src/tabs/EditorTab.tsx` (Section III).
    - Add the `activeEditor` state, the UI toggle, and the conditional rendering logic to switch between the existing ReactFlow component and the new `PdfmeEditorWrapper`.

7.  **Step 7: Verification and Testing**
    - **Test 1 (Load & Toggle):** Load a certificate. Toggle from ReactFlow to `pdfme`. **Verify:** `pdfme` editor loads and displays the converted template correctly.
    - **Test 2 (Upstream Sync):** In the `pdfme` editor, move a text field 50px to the right. Toggle back to the ReactFlow editor. **Verify:** The corresponding ReactFlow node has updated its position correctly.
    - **Test 3 (Downstream Sync):** In the ReactFlow editor, move an image node 50px down. Toggle to the `pdfme` editor. **Verify:** The corresponding `pdfme` image schema has updated its position correctly.
    - **Test 4 (Memory Leak - Critical):** Open the browser's developer tools and go to the "Performance" or "Memory" tab. Take a heap snapshot. Toggle between the ReactFlow and `pdfme` editors 50 times. Take another heap snapshot. **Verify:** Memory usage remains stable and does _not_ continuously increase. A stable memory profile confirms that `designer.destroy()` is being called correctly and no instances are being orphaned.

<!-- end list -->

```

This plan is fully contained in the block above. Let me know if you need any adjustments.
```
