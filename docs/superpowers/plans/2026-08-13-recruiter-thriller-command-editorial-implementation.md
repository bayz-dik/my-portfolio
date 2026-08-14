# Recruiter Thriller Command Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the photo-led portfolio with a recruiter-first, photo-free scroll narrative combining suspense, capability-console proof, and controlled kinetic typography.

**Architecture:** Keep the existing single-route Vinext application and bilingual content store. Recompose `app/page.tsx` into focused presentation components, drive global/chapter scroll state through one effect, and let CSS own visual/motion behavior through custom properties and data attributes.

**Tech Stack:** React 19, TypeScript, Vinext/Vite, CSS, Node test runner, OpenAI Sites.

## Global Constraints

- Render no photographs, `<img>` elements, `/work/` asset URLs, galleries, or image placeholders.
- Preserve all factual employment data, contact links, CV, ID/ENG support, and light/dark preferences.
- Present IT Support as an internship.
- Use no fake percentages, scores, or unsupported performance claims.
- Keep all interactive targets at least 44×44px and support `prefers-reduced-motion`.
- Work from 320px upward without horizontal page overflow.

---

### Task 1: Lock photo-free render and content contracts

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/source-contracts.test.mjs`
- Modify: `tests/contracts.test.mjs`

**Interfaces:**
- Consumes: rendered homepage HTML and the bilingual `CONTENT` object.
- Produces: failing contracts for four questions, four unlocks, one console, no image markup, and matching copy keys.

- [ ] **Step 1: Replace photo assertions with the new render contract**

Assert `data-proof-chapter` occurs four times, `data-recruiter-question` occurs four times, `data-capability-unlock` occurs four times, `data-capability-console` occurs once, and the HTML contains neither `<img` nor `/work/`.

- [ ] **Step 2: Add source contracts for progress and reduced motion**

Assert source contains `--page-progress`, `--chapter-progress`, `data-phase`, capability controls, and a reduced-motion rule that disables kinetic transforms.

- [ ] **Step 3: Add bilingual keys**

Require matching `hero.signal`, `scan.*`, `experience.*.question`, `experience.*.unlock`, `capability.*`, and `verdict.*` keys.

- [ ] **Step 4: Run tests and verify RED**

Run: `npm run build && node --test tests/*.test.mjs`

Expected: failures reference missing recruiter questions/console and retained photo markup.

### Task 2: Build the recruiter-thriller page structure

**Files:**
- Modify: `app/content.js`
- Modify: `app/page.tsx`
- Delete: `app/work-visuals.js`
- Delete: `public/work/bmc-counter.webp`
- Delete: `public/work/indomaret-merchandising.webp`
- Delete: `public/work/indomaret-team.webp`
- Delete: `public/work/mitra-briefing.webp`
- Delete: `public/work/mitra-team.webp`
- Delete: `public/work/restu-service.webp`

**Interfaces:**
- Consumes: `CONTENT`, `LINKS`, preference helpers, and four factual job records.
- Produces: `HeroStage`, `RecruiterScan`, `ProofChapter`, `CapabilityConsole`, `EducationStrip`, `FinalVerdict`, and contact controls.

- [ ] **Step 1: Add matching bilingual narrative keys**

Add exact recruiter questions, scan statements, unlock labels, console labels, and final verdict copy in Indonesian and English.

- [ ] **Step 2: Remove photo dependencies and markup**

Remove `WORK_VISUALS`, `LivingProofFrame`, and `<img>` use. Delete the six work assets and visual data module.

- [ ] **Step 3: Implement the approved sections**

Render the kinetic hero, concise recruiter scan, four proof chapters with distinct evidence formats, one interactive capability console, compact education strip, and final verdict/contact.

- [ ] **Step 4: Implement scroll and phase state**

Set global `--page-progress`; set each chapter's `--chapter-progress`, `data-phase`, and active route. Preserve reduced-motion content visibility.

- [ ] **Step 5: Run render tests and verify GREEN**

Run: `npm run build && node --test tests/rendered-html.test.mjs tests/contracts.test.mjs`

Expected: all assertions pass.

### Task 3: Create the combined visual and motion system

**Files:**
- Modify: `app/globals.css`
- Test: `tests/source-contracts.test.mjs`

**Interfaces:**
- Consumes: section class names, CSS custom properties, and `data-phase`/`data-active` attributes from Task 2.
- Produces: responsive styling for the hero, chapters, evidence formats, console, verdict, and reduced-motion mode.

- [ ] **Step 1: Replace photo styling with the approved palette and hierarchy**

Create the warm-black/cream/coral design, fixed progress header, oversized typography, scan grid, full-width rules, and command labels.

- [ ] **Step 2: Style the four distinct proof formats**

Keep retail tokens, administration flow, production checklist, and technical sequence visually distinct without repeating cards.

- [ ] **Step 3: Add controlled kinetic motion**

Add hero line reveal, marquee, chapter phase transitions, progress lines, capability-panel transitions, and focus/hover movement no greater than 6px.

- [ ] **Step 4: Add responsive and reduced-motion behavior**

Remove sticky chapters below 768px, make selector tabs horizontally scrollable, prevent page overflow, and expose all content with motion disabled.

- [ ] **Step 5: Run source tests and verify GREEN**

Run: `node --test tests/source-contracts.test.mjs`

Expected: all assertions pass.

### Task 4: Verify and publish

**Files:**
- Verify: entire checkout

**Interfaces:**
- Consumes: completed source and test suite.
- Produces: a verified agent preview and successful production checkpoint.

- [ ] **Step 1: Run final automated verification**

Run: `npm test && npm run lint && git diff --check`

Expected: zero failures and zero lint errors.

- [ ] **Step 2: Run agent-preview QA**

Inspect desktop and mobile layouts, all four scroll phases, capability switching, language/theme preferences, keyboard focus, and page console logs.

- [ ] **Step 3: Checkpoint and monitor deployment**

Create one final checkpoint with message `feat: launch photo-free recruiter thriller portfolio`, monitor the exact deployment to a terminal state, then perform the required direct main-agent status verification.

- [ ] **Step 4: Report the verified live URL**

Return the production URL and summarize the photo-free recruiter, command-center, and kinetic changes.
