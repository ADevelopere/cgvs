<!-- da56c59e-b300-41a6-90d8-5c1e4147d62b 3e014497-ef93-439d-b65d-f4857ac85ba8 -->
# Update DownloadPdf Component

## Overview

Refactor `DownloadPdf` to match `DownloadImage` pattern: fetch certificate elements and config via GraphQL, render text elements with proper font embedding, and use pdf-lib for PDF generation.

## Changes

### 1. Update DownloadPdf.tsx Structure

- Remove ReactFlow dependencies (`useReactFlow`, `getNodes`, `getEdges`)
- Use `useNodeData()` to get `templateId` (similar to `DownloadImage`)
- Add GraphQL queries for `elementsByTemplateId` and `templateConfigByTemplateId`
- Add loading state management with `CircularProgress` (like `DownloadImage`)
- Remove `imageUrl` prop dependency

### 2. Font Handling

- Create `collectFontFamilies()` function (similar to `ClientCanvasGenerator`) to extract unique Google font families from text elements
- Fetch TTF font files from Google Fonts URLs using `getFontByFamily()` from `@/lib/font/google`
- Embed fonts in PDF using `pdfDoc.embedFont()` with font bytes (Uint8Array)
- Create font map: `Map<FontFamily, PDFFont>` for efficient font lookup during rendering

### 3. Text Element Rendering

- Filter elements to only `TextElement` type
- Sort by `base.renderOrder`
- Use `resolveTextContent()` from `@/client/views/template/manage/editor/imageRenderer/textResolvers` to resolve text content
- Map font families from `textProps.fontRef` to embedded PDF fonts
- Convert hex colors to RGB using existing logic
- Handle PDF coordinate system: Y position = `config.height - base.positionY` (PDF origin is bottom-left)

### 4. PDF Generation

- Use `config.width` and `config.height` for page dimensions (convert pixels to points: multiply by 0.75)
- Remove node-based rendering logic
- Keep password protection prompt (user can remove later if needed)
- Generate filename from template ID or use "certificate.pdf"

### 5. Files to Modify

- `client/views/template/manage/editor/download/DownloadPdf.tsx` - Complete rewrite following `DownloadImage.tsx` pattern

## Implementation Details

### Font Embedding Function

```typescript
async function embedFontsForPdf(
  pdfDoc: PDFDocument,
  fontFamilies: FontFamily[]
): Promise<Map<FontFamily, PDFFont>> {
  // Fetch font URLs, download TTF files, embed in PDF
}
```

### Text Rendering

- For each text element: resolve content, get font, convert color, calculate Y position, draw text
- Handle basic text overflow (truncate for now, can enhance later)
- Support text alignment from `base.alignment`