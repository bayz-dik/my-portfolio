# Claude Warm Max-Addiction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the portfolio into a fully theme-consistent Claude Warm experience with uninterrupted recruiter momentum and a theme-aware contact climax.

**Architecture:** Keep the existing one-page React narrative and replace hard-coded section palettes with semantic CSS tokens. Extend the existing proof-chapter component with a localized next-proof cue, preserve the current scroll-phase engine, and make the capability console and final verdict consume the same theme system. Verify palette contracts, content contracts, rendered HTML, accessibility, responsive behavior, and both visual modes.

**Tech Stack:** React, TypeScript, Vinext, CSS custom properties, Node test runner, ESLint, Sites agent preview and checkpoint hosting.

## Global Constraints

- Dark main canvas is exactly `#20201E`.
- Light main canvas is exactly `#F4EFE6`.
- Light mode contains no intentionally dark section; dark mode contains no intentionally light section.
- Coral is an accent and reward color, not a full-viewport background.
- Preserve four recruiter-question → context → actions → capability-unlock chapters.
- Preserve complete Indonesian and English content, keyboard tabs, reduced motion, touch targets, and 320 px support.
- Do not introduce photos, image placeholders, fake metrics, unverifiable claims, new routes, or changed employment facts.

---

### Task 1: Semantic Theme Contract

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/contrast.test.mjs`
- Modify: `tests/source-contracts.test.mjs`

**Interfaces:**
- Produces CSS tokens `--canvas`, `--canvas-alt`, `--surface`, `--surface-active`, `--ink`, `--body`, `--muted`, `--line`, `--coral`, `--accent-text`, `--on-coral`, `--header-bg`, and `--shadow-accent` for both themes.
- All later tasks consume these tokens; no component receives a theme prop.

- [ ] **Step 1: Write failing token tests**

Add source assertions requiring the exact dark/light canvas values, all semantic tokens under both `:root` and `html[data-theme="dark"]`, and rejection of `background:#151412` on major sections.

```js
assert.match(css, /:root\s*\{[\s\S]*--canvas:\s*#f4efe6/i);
assert.match(css, /html\[data-theme="dark"\]\s*\{[\s\S]*--canvas:\s*#20201e/i);
for (const name of ["canvas-alt", "surface", "surface-active", "ink", "body", "muted", "line", "coral", "accent-text", "on-coral", "header-bg", "shadow-accent"]) {
  assert.match(css, new RegExp(`--${name}:`));
}
assert.doesNotMatch(css, /\.(?:hero-stage|experience|capability-console|verdict-section|education-strip|proof-chapter)[^{]*\{[^}]*background:\s*#151412/i);
```

- [ ] **Step 2: Run the focused tests and observe failure**

Run: `node --test tests/contrast.test.mjs tests/source-contracts.test.mjs`

Expected: FAIL because the new semantic tokens and `#20201E` canvas are missing.

- [ ] **Step 3: Implement the semantic palette**

Define the exact approved tokens in `:root` and override the same names under `html[data-theme="dark"]`. Retain contrast-safe text values and set `color-scheme` correctly.

```css
:root {
  --canvas:#f4efe6; --canvas-alt:#e9e0d4; --surface:#fff9f0;
  --surface-active:#e1d6c9; --ink:#20201e; --body:#514b43;
  --muted:#695f55; --line:#cfc2b3; --coral:#d9553b;
  --accent-text:#9b321f; --on-coral:#20201e;
  --header-bg:rgba(244,239,230,.9); --shadow-accent:#d9553b;
}
html[data-theme="dark"] {
  --canvas:#20201e; --canvas-alt:#252522; --surface:#2b2b27;
  --surface-active:#32322d; --ink:#f4f0e8; --body:#b8b4ac;
  --muted:#97938b; --line:#464640; --coral:#ee7455;
  --accent-text:#ff9a7e; --on-coral:#20201e;
  --header-bg:rgba(32,32,30,.9); --shadow-accent:#ee7455;
}
```

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/contrast.test.mjs tests/source-contracts.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tests/contrast.test.mjs tests/source-contracts.test.mjs
git commit -m "feat: add Claude Warm semantic theme"
```

### Task 2: Theme Every Narrative Surface

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/source-contracts.test.mjs`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes the semantic tokens from Task 1.
- Produces theme-consistent hero, scan, experience, proof chapters, console, education, verdict, contact card, header, and footer.

- [ ] **Step 1: Write failing surface tests**

Require each major surface to use semantic tokens and require proof variants to vary through layout/accent variables instead of independent full-section backgrounds.

```js
for (const selector of ["hero-stage", "recruiter-scan", "experience", "capability-section", "education-strip", "verdict-section"]) {
  assert.match(css, new RegExp(`\\.${selector}\\s*\\{[^}]*background:\\s*var\\(--`, "s"));
}
assert.match(css, /\.proof-chapter\s*\{[^}]*background:\s*var\(--chapter-bg\)/s);
assert.match(css, /\.proof-chapter\[data-proof="admin"\]\s*\{[^}]*--chapter-accent:/s);
```

- [ ] **Step 2: Run the focused test and observe failure**

Run: `node --test tests/source-contracts.test.mjs tests/rendered-html.test.mjs`

Expected: FAIL while the hero, experience, console, verdict, and proof variants still contain hard-coded dark/light/coral backgrounds.

- [ ] **Step 3: Replace hard-coded surface colors**

Use the semantic palette throughout. Set proof chapters to `--chapter-bg:var(--canvas)` or `var(--canvas-alt)`, `--chapter-fg:var(--ink)`, `--chapter-muted:var(--muted)`, and `--chapter-line:var(--line)`. Give each proof kind its own `--chapter-accent`, border rhythm, and task format without a theme-breaking full background. Make the console use `--surface`, the verdict use `--canvas-alt`, and the CTA card use `--coral` with `--on-coral` text.

- [ ] **Step 4: Add atomic theme transitions**

Apply 250 ms transitions to color, background-color, border-color, and box-shadow on major surfaces while excluding scroll-transform properties.

- [ ] **Step 5: Run focused tests**

Run: `node --test tests/source-contracts.test.mjs tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css tests/source-contracts.test.mjs tests/rendered-html.test.mjs
git commit -m "feat: unify portfolio surfaces across themes"
```

### Task 3: Next-Proof Momentum Cues

**Files:**
- Modify: `app/content.js`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/contracts.test.mjs`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/source-contracts.test.mjs`

**Interfaces:**
- Produces bilingual keys `proof.nextLabel` and `proof.completeLabel`.
- `ProofChapter` consumes the next job from `jobs[(index + 1) % jobs.length]` and renders one `.next-proof-cue` outside the phase overlay.

- [ ] **Step 1: Write failing content and render tests**

```js
for (const locale of ["id", "en"]) {
  assert.ok(CONTENT[locale]["proof.nextLabel"]);
  assert.ok(CONTENT[locale]["proof.completeLabel"]);
}
assert.equal((html.match(/data-next-proof=/g) ?? []).length, 4);
```

Require the source to localize the label and use the next proof's bridge title without introducing another interactive control.

- [ ] **Step 2: Run the focused tests and observe failure**

Run: `node --test tests/contracts.test.mjs tests/rendered-html.test.mjs tests/source-contracts.test.mjs`

Expected: FAIL because next-proof keys and cues do not exist.

- [ ] **Step 3: Add localized momentum content**

```js
// Indonesian
"proof.nextLabel": "BUKTI BERIKUTNYA",
"proof.completeLabel": "SEMUA BUKTI TERBUKA",
// English
"proof.nextLabel": "NEXT PROOF",
"proof.completeLabel": "ALL PROOF UNLOCKED",
```

- [ ] **Step 4: Render the next-proof cue**

Pass `nextJob` and `isLast` into `ProofChapter`. Render `data-next-proof={nextJob.key}` with the localized label, `0N`, and `t(\`bridge.${nextJob.proof}\`)`. On the last chapter, render the complete label and point forward to the capability console conceptually, without changing URLs or adding a click trap.

- [ ] **Step 5: Style cue as a restrained exit reward**

Position the cue near the bottom edge on desktop and in normal flow on mobile/reduced motion. Use `--chapter-accent`, a short line extension, and opacity driven by `--chapter-progress`; keep the text readable without covering the phase content.

- [ ] **Step 6: Run focused tests**

Run: `node --test tests/contracts.test.mjs tests/rendered-html.test.mjs tests/source-contracts.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/content.js app/page.tsx app/globals.css tests/contracts.test.mjs tests/rendered-html.test.mjs tests/source-contracts.test.mjs
git commit -m "feat: sustain momentum between work proofs"
```

### Task 4: Contact Climax and Motion Discipline

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/source-contracts.test.mjs`

**Interfaces:**
- Consumes existing verdict/contact markup.
- Produces a theme-consistent recruiter climax with coral confined to `.contact-command` and interactive accents.

- [ ] **Step 1: Write failing climax tests**

```js
assert.match(css, /\.verdict-section\s*\{[^}]*background:\s*var\(--canvas-alt\)/s);
assert.match(css, /\.contact-command\s*\{[^}]*background:\s*var\(--coral\)/s);
assert.doesNotMatch(css, /\.verdict-section\s*\{[^}]*background:\s*var\(--coral\)/s);
assert.match(css, /@media\s*\(prefers-reduced-motion:reduce\)[\s\S]*\.next-proof-cue/s);
```

- [ ] **Step 2: Run the focused test and observe failure**

Run: `node --test tests/source-contracts.test.mjs`

Expected: FAIL until the full-screen coral verdict is removed and the reduced-motion cue fallback exists.

- [ ] **Step 3: Implement the contact climax**

Use `var(--canvas-alt)` for the verdict section, `var(--ink)` for its narrative, and coral for the contact card. Preserve all contact links, CV download, Maps link, theme switch, and language switch. Give the CTA one arrow motion and one card shadow shift; do not animate contact text.

- [ ] **Step 4: Complete reduced-motion and mobile rules**

Remove marquee, orbit translation, cue translation, sticky proof phases, and decorative arrow movement under reduced motion. Ensure the contact card and cue stack naturally at 320 px.

- [ ] **Step 5: Run focused tests**

Run: `node --test tests/source-contracts.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css tests/source-contracts.test.mjs
git commit -m "feat: create theme-aware recruiter climax"
```

### Task 5: Full Verification, Preview QA, and Hosting Checkpoint

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/content.js`
- Verify: `app/globals.css`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes all previous tasks.
- Produces one verified Sites checkpoint at the existing live URL.

- [ ] **Step 1: Run the full automated gate**

Run: `npm test && npm run lint && npm run build && git diff --check`

Expected: all tests pass, lint exits 0, build emits a valid Worker artifact, and diff-check produces no output.

- [ ] **Step 2: Start the agent preview**

Run: `sites-preview start "$PWD"`

Expected: preview is reachable at the prescribed internal agent-preview address.

- [ ] **Step 3: Inspect light mode in the cloud browser**

Verify hero, recruiter scan, four chapter contexts/actions/unlocks, next-proof cues, capability console, education, verdict, contact actions, footer, and absence of dark section backgrounds.

- [ ] **Step 4: Inspect dark mode in the cloud browser**

Switch to dark mode and verify the exact `#20201E` main canvas, theme-consistent surfaces, readable text, coral accent restraint, and absence of light section backgrounds.

- [ ] **Step 5: Exercise interactions**

Verify scroll progress, chapter phases, capability clicks and arrow/Home/End navigation, bilingual chrome, theme persistence, CV link, and contact links. Inspect application console logs for site errors.

- [ ] **Step 6: Checkpoint and monitor deployment**

Run the Sites checkpoint flow with message `feat: launch Claude Warm max-addiction theme`, monitor its exact immutable deployment IDs, then make the required direct main-agent status call.

Expected: terminal `succeeded` with the literal existing production URL.

