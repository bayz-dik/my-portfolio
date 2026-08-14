# Work Proof Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen Bayu Andika's four work-experience explanations into concise situation, action, and result narratives without changing the approved interface.

**Architecture:** Keep the existing bilingual content map and component structure unchanged. Update only the `body` and `payoff` values for Indomaret, BMC Motor, PT Mitrametal Perkasa, and Restu Computer in Indonesian and English.

**Tech Stack:** JavaScript content module, React/Vinext rendering, Node test runner.

## Global Constraints

- Do not change UI, layout, colors, motion, interactions, buttons, links, dates, roles, companies, or section structure.
- Do not invent metrics, awards, performance claims, or responsibilities.
- Preserve matching Indonesian and English content keys.
- Keep every explanation concise enough for recruiter scanning.

---

### Task 1: Strengthen recruiter-facing work evidence

**Files:**
- Modify: `app/content.js`
- Test: `tests/contracts.test.mjs`

**Interfaces:**
- Consumes: Existing `CONTENT.id` and `CONTENT.en` maps.
- Produces: The same content keys consumed by `app/page.tsx`.

- [ ] **Step 1: Confirm the existing bilingual content contract passes**

Run: `node --test tests/contracts.test.mjs`

Expected: all content, link, and preference contracts pass before the copy change.

- [ ] **Step 2: Rewrite eight approved narrative values**

Update `experience.<job>.body` and `experience.<job>.payoff` for `indomaret`, `bmc`, `mitra`, and `restu` in both languages. Each body must communicate the workplace situation, Bayu's direct actions, and the practical outcome without numerical claims.

- [ ] **Step 3: Verify the bilingual content contract**

Run: `node --test tests/contracts.test.mjs`

Expected: all tests pass and Indonesian/English keys remain aligned.

- [ ] **Step 4: Verify scope and the complete site**

Run: `git diff --name-only`

Expected production change: only `app/content.js`. Then run `npm test` and `npm run lint`.

- [ ] **Step 5: Preview and publish**

Inspect both languages in the agent preview, confirm the text remains readable at desktop and mobile widths, then create one checkpoint deployment.
