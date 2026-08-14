# Bayu Career Portfolio: Proof-Driven Career Journey

## Goal

Create a portfolio that makes HRD and general visitors want to continue scrolling because every movement reveals a different kind of concrete proof. The page must stay fast, readable, truthful, bilingual, and useful for roles across operations, administration, retail, production, and entry-level technical support.

"Nagih" means curiosity plus payoff, never hidden information, excessive motion, or decorative noise.

## Guardrails

- Preserve the approved cream, coral, warm-black palette; light/dark mode; ID/ENG controls; SF-style small text; Manrope display type; icon-only contact row; and all verified work facts.
- Preserve a broad professional positioning. Do not claim IT Support as the only career direction or inflate PKL into full employment.
- Keep Restu Computer explicitly labeled as `PKL / Magang Dukungan IT` in Indonesian and `IT Support Intern` in English.
- Preserve the existing contact targets, CV download, accessibility labels, keyboard behavior, and reduced-motion path.
- All visible Indonesian and English content must be complete translations. No mixed UI copy.
- No scroll hijacking, autoplay audio, cursor effects, heavy 3D, bouncing, or infinite animation.

## Core narrative

The page must read as one discovery sequence:

`Hook → promise of evidence → career route → proof → lesson/payoff → derived capabilities → contact`

Each stage must answer a new question before it asks the visitor to continue:

| Stage | Visitor question | Answer / payoff |
| --- | --- | --- |
| Hero | Who is Bayu and why should I look further? | Real work created practical, reliable capabilities. |
| Bridge | What will I find below? | Four real work environments, each with a different proof. |
| Experience | What did Bayu actually do? | Each role has a scan-friendly proof cluster and a distinct lesson. |
| Skills | What capabilities remain after those jobs? | Skills are explicitly traced back to the work that formed them. |
| Education | Where did the technical foundation start? | School plus a truthful IT-support internship foundation. |
| Contact | What is the next action? | Contact and CV are immediate, compact actions. |

## Information architecture and section behavior

### 1. Hero: cold open

- Keep the `PORTOFOLIO` label, header identity, bilingual theme controls, palette, and large hero hierarchy.
- Replace the generic hero headline with a concise broad-positioning hook that does not lock the visitor into an IT-only title.
- Add a compact live-proof strip below the hero description: `4 lingkungan kerja · operasi · administrasi · retail · teknis` (fully translated in English). It is not a card row.
- Add a clear, lightweight scroll invitation that names the next reward: `Buka bukti kerja pertama` / `Open the first work proof`.
- The first scroll must transition into the bridge rather than abruptly dumping the visitor into a large paragraph.

### 2. Bridge: promise before evidence

- Insert a short bridge between hero and experience: `Empat tempat kerja. Empat cara kerja yang terbentuk.` / equivalent full English copy.
- Desktop: a compact horizontal route with four labeled stops: Retail, Administrasi, Produksi, Teknis.
- Mobile: four vertically staggered stops that take less than one viewport.
- Coral indicates the next proof to open; it must not pulse indefinitely.

### 3. Experience: four distinct proof chapters

The experience area remains warm black, but the old repeated structure of same-sized job cards and near-invisible fade is removed.

Shared requirements:

- Start in reverse chronological order: Indomaret, BMC Motor, Mitra Metal, Restu Computer.
- Retain all employer, location, period, role, and verified responsibility facts.
- Each chapter is readable without waiting for an animation.
- Inactive or exiting content may reduce opacity no lower than `0.62`; active content is always `1`.
- The chapter title panel stays anchored on desktop only. Mobile uses normal flow.
- The route changes state as each chapter enters; the active route stop becomes coral. It must work without JavaScript as static, readable content.
- Every chapter ends with a one-line `Dari pengalaman ini terbentuk` / `Built through this experience` payoff that tees up the next proof.

Chapter-specific composition:

1. **Indomaret — Operations in motion**
   - Dense but scan-friendly task tags: receiving goods, stock, product checks, cashier/POS, FIFO/FEFO, customer service.
   - Visual rhythm: short labeled metrics-style list, not a paragraph-only block.
   - Payoff: accuracy, priority management, and service under active conditions.

2. **BMC Motor — Order from information**
   - Visual rhythm: a document-flow sequence with service documents, invoices, transactions, customer clarification, and spare-part information.
   - It must feel more structured and calmer than Indomaret.
   - Payoff: organized data, clear communication, and controlled administrative flow.

3. **Mitra Metal — Process under standards**
   - Visual rhythm: a concise SOP/quality checklist, not an editorial paragraph.
   - Include verified focus areas: briefings, SOP, quality requirements, clean work area, accurate reports, and safety.
   - Payoff: precision, consistency, quality awareness, and operational discipline.

4. **Restu Computer — Technical foundation reveal**
   - Visual rhythm: a technical sequence: inspect → disassemble/assemble → upgrade → install OS/software → basic troubleshooting.
   - Clearly present it as a school internship, never a long-term full-time role.
   - Payoff: a technical foundation and structured problem solving.

### 4. Career route

- Replace four identical snake-arrow SVGs with one responsive career-route component that changes progress as the active chapter changes.
- Use the existing coral color and organic curved language, but make it functional: it connects the four chapter labels and indicates current position.
- Desktop: a low-contrast fixed route beside the experience content; no extra horizontal line above or below the full set.
- Mobile: compact vertical route; do not occupy the whole screen.

### 5. Skills: proof becomes capability

- Replace the generic 2x2 card reveal with a capability map.
- The four capability groups remain true to existing content: Technical Support, Operations & Quality, Administration & Service, Retail & Inventory.
- Each group shows a compact `formed through` source tag that links visually to its experience chapter.
- Alternate its layout rhythm from experience: cream background, offset grid, short bullets, and a short connective introduction.
- Do not make every card identical in height or animation timing.

### 6. Education and contact

- Education remains a quiet evidence section after the high-energy experience/skills journey, with the internship context reinforcing technical foundation.
- Contact retains coral background, icon row, tooltips on desktop, 44px targets on mobile, email/CV actions, and compact preferences controls.
- The contact title and CTA must feel like a conclusion: invite the visitor to turn the evidence they just saw into a conversation.

## Motion system

| Moment | Behavior | Duration / bounds |
| --- | --- | --- |
| Hero entry | Existing type reveal, then proof strip | One-time, 500–700ms total after initial headline |
| Hero exit | Subtle opacity/translate transition into bridge | Minimum text opacity 0.78 |
| Route | Progress moves to active stop with scroll | 180–240ms; no loop |
| Chapter entry | Reveal a unique proof format, not a fade-only card | 280–420ms |
| Chapter exit | Calm de-emphasis, still readable | Opacity never lower than 0.62 |
| Skills | Staggered map reveal in two groups | 180–320ms; no bounce |
| Reduced motion | All content immediately visible, no sticky/fade/path movement | Required |

## Implementation boundaries

- Keep content data centralized in `app/content.js` and preserve ID/EN key parity.
- Split reusable route and proof chapter rendering into small React components only if this makes `app/page.tsx` clearer.
- Use `IntersectionObserver` and requestAnimationFrame only for progressive enhancement; initial content remains semantic and visible.
- Update source-contract and rendered-output tests to cover the bridge, four unique proof formats, payoff lines, active route behavior hooks, minimum fade token, full bilingual parity, and reduced-motion behavior.
- Preserve existing theme/language preference tests and icon-only contact tests.

## Acceptance criteria

1. A recruiter can identify the broad career profile and access the newest concrete work proof in under ten seconds.
2. The experience area contains four distinct proof layouts, not four repeated job cards.
3. No work text fades below 62% opacity during normal motion.
4. Every work chapter has a factual role, employer, period, proof cluster, and a derived capability/payoff.
5. The career route visibly changes with chapter progress on desktop and remains compact on mobile.
6. Skills visibly state which work environment formed them.
7. The existing color system, modes, bilingual behavior, contacts, CV action, and verified facts remain intact.
8. Build, lint, content parity, source contracts, rendered output, responsive QA, and reduced-motion QA pass before publishing.
