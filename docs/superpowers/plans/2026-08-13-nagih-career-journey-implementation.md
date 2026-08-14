# Nagih Career Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Bayu's portfolio into a scroll-driven, proof-first career journey whose work chapters are distinct, factual, and compelling without hiding information.

**Architecture:** Restore the newest approved source baseline from the uploaded ZIP into the Sites lifecycle checkout, then evolve the existing content-driven React page. `content.js` remains the bilingual source of truth; `page.tsx` renders declarative proof chapters and progress state; `globals.css` owns responsive visual rhythm and bounded motion.

**Tech Stack:** React 19, TypeScript/TSX, CSS, Vinext/Vite, Node test runner, Sites checkpoint deployment.

## Global Constraints

- Preserve cream `#FAF9F5`, coral `#CC785C`, warm black `#181715`, light/dark mode, ID/ENG mode, system/SF small type, Manrope display type, contact icon row, CV action, and verified facts.
- Position Bayu broadly across operations, administration, retail, production, and entry-level technical support; never present PKL as full-time employment.
- Label Restu Computer as `PKL / Magang Dukungan IT` in Indonesian and `IT Support Intern` in English.
- No work content opacity below `0.62`; no scroll hijacking, looped motion, bounce, autoplay, or inaccessible content.
- Every user-visible string has a full Indonesian and English equivalent.

---

### Task 1: Restore the latest approved portfolio baseline into the Sites checkout

**Files:**
- Modify: `app/content.js`, `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `tests/*.test.mjs`, `README.md`
- Source of truth: `/workspace/scratch/66559c79a24b/audit/bayu-career-portfolio/`

**Interfaces:**
- Consumes: the uploaded version that already contains compact sun/moon and ID/ENG switches, icon-only contacts, Manrope/SF typography, and initial snake arrows.
- Produces: the actual deployable checkout matching the uploaded latest baseline before the new redesign.

- [ ] **Step 1: Add a failing source contract that expects the latest baseline identifiers.**

```js
test("checkout contains the latest approved compact controls", () => {
  assert.ok(page.includes("theme-switch"));
  assert.ok(page.includes("language-switch"));
  assert.ok(page.includes("contact-icon"));
});
```

- [ ] **Step 2: Run the source-contract test and verify it fails because the checkout is older.**

Run: `node --test tests/source-contracts.test.mjs`

- [ ] **Step 3: Copy only the approved source, test, public, and configuration files from the extracted latest baseline into the lifecycle checkout; preserve `.openai/hosting.json`.**

```sh
rsync -a --delete --exclude .openai \
  /workspace/scratch/66559c79a24b/audit/bayu-career-portfolio/ \
  /workspace/sites/bayu-career-portfolio/
```

- [ ] **Step 4: Run the same contract test and verify it passes.**

Run: `node --test tests/source-contracts.test.mjs`

### Task 2: Add content contracts for the proof-first narrative

**Files:**
- Modify: `app/content.js`, `tests/contracts.test.mjs`

**Interfaces:**
- Consumes: `CONTENT.id`, `CONTENT.en`.
- Produces: parallel content keys for hero proof strip, bridge, four proof clusters, four payoff lines, source tags, and contact conclusion.

- [ ] **Step 1: Write failing parity tests for every new key.**

```js
for (const key of [
  "hero.proofStrip", "hero.scrollPrompt", "bridge.title",
  "experience.indomaret.proof", "experience.indomaret.payoff",
  "experience.bmc.proof", "experience.bmc.payoff",
  "experience.mitra.proof", "experience.mitra.payoff",
  "experience.restu.proof", "experience.restu.payoff",
  "skills.technical.source", "skills.operations.source",
  "skills.admin.source", "skills.retail.source",
]) assert.ok(CONTENT.id[key] && CONTENT.en[key], key);
```

- [ ] **Step 2: Run the content contract test and verify it fails for missing keys.**

Run: `node --test tests/contracts.test.mjs`

- [ ] **Step 3: Add exact Indonesian and English strings, retaining all verified employer, role, period, and responsibility data.**

```js
"experience.restu.role": "PKL / Magang Dukungan IT",
"experience.restu.payoff": "Fondasi teknis dan pemecahan masalah yang runtut.",
"experience.restu.proof": "Periksa perangkat|Bongkar dan pasang|Tingkatkan komponen|Pasang sistem|Tangani masalah dasar",
```

- [ ] **Step 4: Run the content contract test and verify it passes.**

Run: `node --test tests/contracts.test.mjs`

### Task 3: Replace repeated job cards with distinct proof chapters and career route

**Files:**
- Modify: `app/page.tsx`, `tests/source-contracts.test.mjs`, `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `jobs`, `CONTENT`, and `t(key)`.
- Produces: `CareerRoute`, `ProofChapter`, and chapter-specific layouts selected by job key.

- [ ] **Step 1: Write failing source contracts for four unique proof layouts and active-route state.**

```js
for (const token of [
  "className=\"career-route\"", "data-proof=\"retail\"",
  "data-proof=\"admin\"", "data-proof=\"production\"",
  "data-proof=\"technical\"", "data-active-work",
  "experience.${key}.payoff",
]) assert.ok(page.includes(token), token);
```

- [ ] **Step 2: Run source/render tests and verify the new contracts fail.**

Run: `node --test tests/source-contracts.test.mjs tests/rendered-html.test.mjs`

- [ ] **Step 3: Implement semantic chapter markup.**

```tsx
<article className="proof-chapter" data-proof="retail" data-work="indomaret">
  <p className="proof-kicker">{t("experience.indomaret.kicker")}</p>
  <ul className="proof-tags">{proof.map((item) => <li key={item}>{item}</li>)}</ul>
  <p className="proof-payoff">{t("experience.indomaret.payoff")}</p>
</article>
```

- [ ] **Step 4: Add bridge and hero proof strip, then implement active chapter detection with IntersectionObserver.**

```tsx
<section className="career-bridge" aria-label={t("bridge.title")}>
  <p className="label">{t("bridge.label")}</p><h2>{t("bridge.title")}</h2>
  <CareerRoute activeWork={activeWork} />
</section>
```

- [ ] **Step 5: Run source/render tests and verify them pass.**

Run: `node --test tests/source-contracts.test.mjs tests/rendered-html.test.mjs`

### Task 4: Build the non-repeating visual rhythm and bounded motion

**Files:**
- Modify: `app/globals.css`, `tests/source-contracts.test.mjs`

**Interfaces:**
- Consumes: chapter data attributes (`retail`, `admin`, `production`, `technical`) and `data-active-work` on the experience section.
- Produces: responsive career route, four chapter layouts, capability map, opacity floor, and reduced-motion fallback.

- [ ] **Step 1: Write failing CSS contracts for the opacity floor, route, chapter layouts, and compact mobile path.**

```js
assert.match(css, /--work-opacity-floor:\s*\.62/);
assert.match(css, /\.career-route/);
assert.match(css, /\.proof-chapter\[data-proof="retail"\]/);
assert.match(css, /\.proof-chapter\[data-proof="admin"\]/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
```

- [ ] **Step 2: Run the source contract test and verify it fails.**

Run: `node --test tests/source-contracts.test.mjs`

- [ ] **Step 3: Implement CSS that uses `max(var(--work-opacity-floor), var(--work-opacity))`, uses no animation loops, and makes every proof layout visibly distinct.**

```css
.experience { --work-opacity-floor: .62; }
.proof-chapter { opacity: max(var(--work-opacity-floor), var(--work-opacity, 1)); }
.proof-chapter[data-proof="production"] .proof-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
```

- [ ] **Step 4: Replace the uniform skill grid with an offset capability map and source tags.**

```css
.capability-map > :nth-child(even) { margin-top:clamp(18px,4vw,64px); }
.skill-source { color:var(--coral); font-size:.74rem; letter-spacing:.12em; }
```

- [ ] **Step 5: Run the source contract test and verify it passes.**

Run: `node --test tests/source-contracts.test.mjs`

### Task 5: Validate interactions, responsive layout, and production preview

**Files:**
- Modify: `README.md`, tests only if a failure exposes a missing contract.

**Interfaces:**
- Consumes: full page, language/theme controls, active route observer, reduced-motion CSS.
- Produces: verified responsive live preview and deployable checkpoint.

- [ ] **Step 1: Run the full test suite, which includes production build.**

Run: `npm test`

- [ ] **Step 2: Run lint.**

Run: `npm run lint`

- [ ] **Step 3: Start the Sites agent preview, inspect desktop and mobile, then test ID/ENG, light/dark, hero CTA, four proof chapters, contacts, and reduced motion.**

Run: `sites-preview start "$PWD"`

- [ ] **Step 4: Fix any discovered source issue and repeat build/test/lint.**

Run: `npm test && npm run lint`

- [ ] **Step 5: Checkpoint the complete interactive preview into the existing private Site.**

Run: `python3 "/root/.codex/plugins/cache/openai-curated-remote/sites/0.1.16/skills/sites-hosting/scripts/sites.py" checkpoint --path "/workspace/sites/bayu-career-portfolio" --message "feat: build proof-driven career journey"`
