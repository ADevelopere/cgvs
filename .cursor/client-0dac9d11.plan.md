<!-- 0dac9d11-19b7-4f93-8562-2ee19795971e 041ba20c-a398-424c-9d0a-617ff8c0899f -->
# ClientCanvasGenerator (Text-only) under client/views/template/manage/preview

## Files to Add

- `client/views/template/manage/preview/FontContext.tsx`
  - Minimal provider using `webfontloader` to load Google font families detected from elements/config, exposing `{ fontsLoaded, families }`.
  - Use `client/lib/logger` for logs; no console.*

- `client/views/template/manage/preview/textLayout.ts`
  - Export algorithms: `layoutWrap`, `layoutTruncate`, `layoutResizeDown`, `getTrueFontMetrics`, `drawLayout`.
  - Use `ctx.measureText()` for widths, opentype metrics for verticals with fallback to Canvas if missing.

- `client/views/template/manage/preview/useOpentypeMetrics.ts`
  - Hook + cache: fetch Google font files (same family/variants loaded by webfontloader), parse with `opentype.js`, cache in a `Map<string, OpentypeFont>`.
  - Provide `getFont(fontKey)` and `ensureFonts(families: string[]): Promise<void>`.
  - Use `embedGoogleFonts`/`getFontByFamily` from `@/lib/font/google` when possible to map to identifiers; fallback to common woff2 endpoints.

- `client/views/template/manage/preview/ClientCanvasGenerator.tsx`
  - Props: `{ templateId: number }`.
  - Queries: import `elementsByTemplateIdQueryDocument` and `templateConfigByTemplateIdQueryDocument` from `../editor/glqDocuments`.
  - Fetch `config` (width, height, language) and `elements` (`GQL.CertificateElementUnion[]`).
  - Filter to text elements only and resolve content with existing helper: import `resolveTextContent` from `../editor/renderer/textResolvers`.
  - Determine unique Google font families from elements; pass to `FontContext` loader and `useOpentypeMetrics.ensureFonts`.
  - Render a `<canvas>` sized 1:1 via attributes and matching CSS size; draw pipeline in `useEffect` gated by `fontsLoaded && metricsReady`.
  - Draw algorithm per element:
    - Set `ctx.font = "${fontSize}px ${fontFamily}"`, `ctx.textBaseline = 'alphabetic'`.
    - Run selected layout: WRAP/TRUNCATE/RESIZE_DOWN using `textLayout.ts` APIs.
    - Align via `drawLayout` to honor `ElementAlignment` (center/start/end + top/center/bottom + baseline variants).

- `client/views/template/manage/preview/index.ts`
  - Re-export `ClientCanvasGenerator` and `FontContext` provider.

## Integration Notes

- Data: Component self-loads via GraphQL by `templateId` (as per `EditorTab.tsx`).
- Fonts: Only Google font refs initially; default to `Roboto` when missing.
- Logging: Use `client/lib/logger` for all logs/errors.
- Export: Expose an optional `onExport(dataUrl)` prop and an internal `download()` helper callable via an optional `forwardRef` method; image export via `canvas.toDataURL('image/png')`.

## Key Implementation Details

- Alignment mapping: Reuse `getFlexAlignment` semantics; implement Canvas equivalents for horizontal/vertical placement; set `ctx.textAlign = 'left'|'center'|'right'`.
- Metrics: `getTrueFontMetrics(font, size)` computes `lineHeight` and `baselineOffset`; fallback if opentype font missing: approximate via `measured.actualBoundingBoxAscent/Descent` when available.
- Performance: Precompute layouts per element after data load and when any of `[elements, width, height, fontsLoaded]` changes; avoid layout per draw where possible.
- Types: Strongly type against `GQL.TextElement` and `GQL.TemplateConfig`.

## External Dependencies

- Add: `opentype.js` (via Bun): `~/.bun/bin/bun add opentype.js`
- Already present: `webfontloader`

## Example Snippets

- Canvas sizing (1:1):
```tsx
<canvas ref={ref} width={config.width} height={config.height} style={{ width: `${config.width}px`, height: `${config.height}px` }} />
```

- Draw gate:
```ts
if (!fontsLoaded || !metricsReady || !ctx) return;
ctx.clearRect(0, 0, config.width, config.height);
```

- Layout wrap usage:
```ts
const font = metrics.get(elementFontKey);
ctx.font = `${el.textProps.fontSize}px ${family}`;
const layout = layoutWrap(ctx, text, el.base.width, font, el.textProps.fontSize);
```

### To-dos

- [ ] Create preview directory and barrel export file
- [ ] Implement FontContext provider using webfontloader
- [ ] Implement opentype metrics hook and cache
- [ ] Add text layout and alignment utilities
- [ ] Implement ClientCanvasGenerator fetching data and drawing text
- [ ] Detect fonts from elements and ensure metrics readiness
- [ ] Expose optional onExport and ref method for PNG export
- [ ] Install opentype.js via Bun and verify typings