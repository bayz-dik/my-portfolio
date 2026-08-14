# Living Proof Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add compact, scroll-driven authentic work-photo frames to all four career chapters, using Bayu's personal Indomaret and Mitrametal documentation and official BMC/Restu imagery.

**Architecture:** A static `WORK_VISUALS` data module supplies bilingual alt text, captions, source links, focal positions, and one or two layers per work chapter. `LivingProofFrame` renders one fixed viewport per chapter; page-level scroll synchronization writes a normalized progress custom property and a second-frame state without adding a motion dependency. Assets are local metadata-free WebP files.

**Tech Stack:** Vinext/React, TypeScript, CSS custom properties and clip-path, Node test runner, Sharp asset processing, built-in image editing for local watermark cleanup.

## Global Constraints

- Keep the existing cream `#FAF9F5`, coral `#CC785C`, and warm black `#181715` identity.
- Never show more than one photo at once inside a chapter.
- Use authentic personal or official-source images only; do not generate replacement work scenes.
- Watermark cleanup may change only the lower-left watermark region of the two selected Mitrametal photos.
- Strip all EXIF/GPS metadata from deployed assets.
- Keep chapter opacity at or above `0.62`.
- Respect `prefers-reduced-motion: reduce` and avoid new runtime dependencies.
- Keep all work-photo assets together under 1.2 MB.

---

### Task 1: Prepare authentic production assets

**Files:**
- Create: `public/work/indomaret-merchandising.webp`
- Create: `public/work/indomaret-team.webp`
- Create: `public/work/bmc-counter.webp`
- Create: `public/work/mitra-briefing.webp`
- Create: `public/work/mitra-team.webp`
- Create: `public/work/restu-service.webp`

**Interfaces:**
- Consumes: user uploads under `/workspace/scratch/66559c79a24b/upload/` and verified official BMC/Restu URLs from the design spec.
- Produces: six local WebP assets with stable paths and no metadata.

- [ ] **Step 1: Edit the two selected Mitrametal targets in parallel**

Use one image-editing worker per target with the precise-object-edit prompt:

```text
Remove only the white “Samsung Triple Camera / Day_Art” watermark and three-circle camera mark in the lower-left corner. Reconstruct the covered factory floor/crate/ambient background naturally. Keep every person, face, body, uniform, machine, floor marking, object, crop, resolution, lighting, color, and all content outside that small watermark region pixel-faithful. Do not retouch people, do not add or remove objects, do not stylize, and do not add text or another watermark.
```

- [ ] **Step 2: Inspect edited outputs**

Visually compare each edit against its original. Reject any output that changes people, machinery, geometry, lighting, or composition outside the lower-left watermark area.

- [ ] **Step 3: Convert and sanitize all selected assets**

Use Sharp to rotate the Indomaret team photo `-90` degrees, convert the two HEIF/JPEG personal sources and four selected sources to WebP, resize long edges to at most 1600 px, set quality 78–84, and omit `.withMetadata()` so EXIF/GPS is stripped.

- [ ] **Step 4: Verify asset constraints**

Run:

```bash
file public/work/*.webp
du -cb public/work/*.webp
```

Expected: six WebP files and a final total no greater than 1,200,000 bytes.

### Task 2: Define and prove the visual data contract

**Files:**
- Create: `app/work-visuals.js`
- Modify: `tests/source-contracts.test.mjs`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: six stable asset paths from Task 1.
- Produces: `WORK_VISUALS` indexed by `indomaret`, `bmc`, `mitra`, and `restu`.

- [ ] **Step 1: Write failing data-contract tests**

Add assertions that require four work keys, six total layers, exactly two layers for Indomaret and Mitra, personal/official caption types, bilingual alt text, and only local `/work/*.webp` paths.

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
node --test tests/source-contracts.test.mjs tests/rendered-html.test.mjs
```

Expected: failure because `app/work-visuals.js` and Living Proof markup do not exist.

- [ ] **Step 3: Implement `WORK_VISUALS`**

Export frozen records shaped as:

```js
{
  indomaret: {
    ratio: "portrait",
    layers: [
      { src: "/work/indomaret-merchandising.webp", alt: { id: "Bayu menata produk...", en: "Bayu arranging products..." }, kind: "personal", position: "center" },
      { src: "/work/indomaret-team.webp", alt: { id: "Bayu bersama tim...", en: "Bayu with the store team..." }, kind: "personal", position: "center 58%" }
    ]
  }
}
```

Official layers additionally provide `sourceUrl`; personal layers never link to local originals.

- [ ] **Step 4: Run the data-contract test and verify GREEN**

Run the same focused test command and expect the source contract to pass while rendered markup may still fail until Task 3.

### Task 3: Build the Living Proof frame and motion

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `WORK_VISUALS` and current `Language`, `WorkKey`, and `data-work` chapters.
- Produces: `LivingProofFrame({ workKey, language })` with a stable viewport, lazy images, caption/source treatment, and scroll progress.

- [ ] **Step 1: Extend the failing rendered behavior test**

Require four `data-living-proof` figures, six lazy-decoded images, official links with `noopener noreferrer`, personal captions without file links, and no carousel/list role.

- [ ] **Step 2: Verify RED**

Run:

```bash
node --test tests/rendered-html.test.mjs
```

Expected: failure because the current `ProofChapter` has no `LivingProofFrame`.

- [ ] **Step 3: Implement frame markup and progress synchronization**

Import `WORK_VISUALS`, render `LivingProofFrame` between `.proof-summary` and `ProofFormat`, and extend the existing scroll frame to compute normalized progress for each `[data-work]`. Set `--chapter-progress` and `data-frame="secondary"` when progress is at least `0.52` and a second layer exists.

- [ ] **Step 4: Implement responsive styling**

Add one clipped viewport per chapter, theme overlay, procedural grain, warm filter, focal positioning, shutter entry, secondary vertical wipe, subtle maximum 18 px parallax, coral progress rail, hover/focus color reward, mobile height cap, and reduced-motion overrides.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
node --test tests/rendered-html.test.mjs tests/source-contracts.test.mjs
```

Expected: all focused tests pass.

### Task 4: Validate interaction and publish

**Files:**
- Modify only if QA reveals a source defect: `app/page.tsx`, `app/globals.css`, or tests.

**Interfaces:**
- Consumes: complete implementation.
- Produces: verified private checkpoint URL.

- [ ] **Step 1: Run the full automated gate**

Run:

```bash
npm test && npm run lint
```

Expected: build succeeds, all tests pass, lint exits zero.

- [ ] **Step 2: Run agent preview QA**

Inspect desktop and mobile widths; scroll through all chapters; verify secondary wipe at Indomaret and Mitra; switch ID/ENG and light/dark; confirm source links, keyboard focus, alt text, no overlapping photos, and readable reduced-motion state.

- [ ] **Step 3: Fix defects test-first**

For any observable source bug, add or adjust the focused test, watch it fail, make the smallest source correction, and rerun the focused and full gates.

- [ ] **Step 4: Create a checkpoint deployment**

Run the Sites checkpoint command with message `feat: add authentic living proof frames`, follow its immutable deployment IDs, and verify terminal status directly before sharing the URL.

