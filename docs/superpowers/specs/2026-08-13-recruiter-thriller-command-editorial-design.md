# Recruiter Thriller × Command Center × Kinetic Editorial

## Goal

Redesign Bayu Andika's portfolio into a photo-free, high-momentum career story that makes an HR reviewer understand the candidate quickly while giving general visitors a strong reason to keep scrolling.

The experience must feel intentional, not like three visual styles stacked together. Recruiter Thriller owns the information order, Command Center owns proof and capability states, and Kinetic Editorial appears only at high-impact transitions.

## Audience and success criteria

Primary audience: HR recruiters and hiring users evaluating operational, administration, retail, production, or entry-level technical support roles.

Secondary audience: general visitors viewing the portfolio on mobile.

Success means:

- the first viewport establishes Bayu's differentiator within five seconds;
- a recruiter can identify four real work environments and the resulting capabilities within 20–30 seconds;
- every viewport introduces a new question, proof, capability, or decision;
- the page contains no photographs, galleries, image placeholders, or decorative raster assets;
- the narrative presents varied experience as adaptability, not lack of direction;
- animation supports reading and stops under `prefers-reduced-motion`;
- the experience remains fully bilingual and usable from 320px upward.

## Creative hierarchy

### 1. Recruiter Thriller — the narrative backbone

The page asks one hiring question at a time and delays the answer just enough to create curiosity. Each work chapter follows this sequence:

1. A practical recruiter question.
2. Company, role, place, and period.
3. Real actions performed in the role.
4. A concise capability unlock that explains what became reusable.

This structure prevents long biographies. The content must answer “what did Bayu do?” before claiming “what can Bayu do?”.

### 2. Command Center — the proof language

Work evidence uses status labels, numbered steps, a live progress rail, and `PROVEN` capability states. No fake percentages, performance scores, or fabricated results may appear.

The capability section is one interactive console, not four repeated cards. Four keyboard-accessible controls switch a single detail panel between Technical Support, Operations & Quality, Administration & Service, and Retail & Inventory.

### 3. Kinetic Editorial — controlled impact moments

Oversized typography appears in the hero, chapter numbers, the transition marquee, and final verdict. Movement is limited to line reveals, subtle horizontal shifts, and progress-linked transforms. Body copy never moves while being read.

## Page architecture

### Header

A fixed compact header contains Bayu's name, the active chapter label, and a thin page-progress bar. Preference controls remain in the footer/contact area to avoid cluttering the first viewport.

### Hero: the hook

The hero uses a dark stage with large bilingual lines:

- Indonesian: “BUKAN CUMA / PERNAH KERJA. / TERBUKTI BISA / BERADAPTASI.”
- English: “NOT JUST / WORK EXPERIENCE. / PROVEN / ADAPTABILITY.”

A small signal communicates “4 work environments · 1 work standard”. A recruiter-scan panel lists the four domains without visual cards. The primary action opens the first proof and the secondary action downloads the CV.

### Recruiter scan

A compact light section reframes the candidate in one sentence: different environments, consistent work standards. Three evidence statements explain fast understanding, orderly execution, and accountable completion. A kinetic text strip bridges into the experience section.

### Four proof chapters

The experience area uses four tall chapters. Each chapter has a sticky oversized index and question on the left, with the evidence interface on the right.

The proof formats remain intentionally different:

- Retail: compact activity tokens.
- Administration: a five-step information flow.
- Production: a standards checklist.
- Technical support internship: a numbered work sequence.

Scroll progress activates one of three states: `CONTEXT`, `ACTIONS`, and `CAPABILITY`. The bottom of every chapter resolves with `CAPABILITY UNLOCKED · PROVEN THROUGH WORK`.

### Capability console

One dark console contains the four capability selectors, source workplace, short definition, and real task list. Selecting a capability updates one detail panel. The interface works with pointer, keyboard, and touch, and carries an accessible live region.

### Education

Education becomes a concise technical-foundation strip between capability and verdict. It must not interrupt the career momentum with a full editorial chapter.

### Final verdict and contact

The final section combines the four environments into one hiring conclusion: Bayu understands tasks quickly, follows the process, and finishes responsibly. The call to action is direct: “LET'S TALK →”, accompanied by CV download and compact contact icons.

## Visual system

- Core palette: warm black `#151412`, cream `#f4efe6`, coral `#ee7455`, muted sand `#b8aa98`, and warm gray lines.
- Typography: existing Manrope/SF system stack; oversized display weights with compact body text.
- Geometry: full-width rules, corners used sparingly, no card grid as the default pattern.
- Density: one dominant message per viewport; secondary information stays under 65 characters per line.
- Photo removal: delete all `public/work/*.webp`, remove `app/work-visuals.js`, and render no `<img>` elements.

## Interaction and motion

- Global scroll updates page progress and subtle hero text shift.
- Each proof chapter exposes a normalized progress value and phase.
- Active career route follows the chapter nearest the viewport center.
- Reveal motion uses opacity and transforms only.
- Hover/focus increases contrast and moves arrows no more than 6px.
- `prefers-reduced-motion` disables marquee, parallax, and staged transforms while keeping all content visible.

## Responsive behavior

- Desktop: two-column sticky question/evidence chapters.
- Tablet: reduced type scale and narrower command console.
- Mobile: question precedes evidence; sticky behavior is removed; each chapter remains readable in normal document order.
- Capability selectors become horizontally scrollable without page overflow.
- All interactive targets remain at least 44×44px.

## Accessibility and truthfulness

- Preserve semantic headings, articles, ordered/unordered lists, focus styles, skip link, and language/theme announcements.
- No capability claim may exceed the factual work history in the existing bilingual content.
- IT Support remains explicitly an internship.
- Do not add percentages, awards, clients, targets achieved, or metrics without source evidence.

## Testing

- Render contract: no `<img>`, no `/work/`, four proof chapters, four recruiter questions, four capability unlocks, and one capability console.
- Source contract: no work-visual import/module, progress/phase logic exists, reduced-motion fallback exists, and 44px controls remain.
- Content contract: matching factual keys in Indonesian and English.
- Manual agent-preview QA: desktop and mobile layout, scroll phases, language/theme controls, capability selection, keyboard focus, and console errors.
