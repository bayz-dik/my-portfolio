# Claude Warm Max-Addiction Design

## Goal

Raise Bayu Andika's portfolio from a strong recruiter experience into a maximally compelling, theme-consistent journey. The page must help recruiters understand Bayu's value quickly while sustaining curiosity for general visitors. "Maximally compelling" means every viewport has a clear question, proof, reward, or forward cue; it does not mean adding visual noise.

## Audience outcomes

### Recruiter

- Understand Bayu's transferable work standard within the first 20 seconds.
- See each role as verified evidence rather than an unrelated job history.
- Reach the final contact decision without searching for key facts.
- Trust the portfolio because it avoids invented metrics and inflated claims.

### General visitor

- Feel a clear visual rhythm and continuing narrative.
- Encounter meaningful variation between chapters without repeated layouts.
- Receive small interactive rewards while scrolling.
- Never face a dead stretch, dense wall of text, or decorative interruption.

## Theme system

The reference screenshot is a single exact color: `#20201E` (RGB 32, 32, 30). This replaces the harsher `#151412` as the principal dark background.

### Dark mode

- Main canvas: `#20201E`
- Alternate section: `#252522`
- Card and panel: `#2B2B27`
- Active and hover surface: `#32322D`
- Border: `#464640`
- Primary text: `#F4F0E8`
- Secondary text: `#B8B4AC`
- Muted text: `#97938B`
- Coral accent: `#EE7455`
- Small coral text: `#FF9A7E`

### Light mode

- Main canvas: `#F4EFE6`
- Alternate section: `#E9E0D4`
- Card and panel: `#FFF9F0`
- Active and hover surface: `#E1D6C9`
- Border: `#CFC2B3`
- Primary text: `#20201E`
- Secondary text: `#695F55`
- Muted text: `#766D63`
- Coral accent: `#D9553B`
- Small coral text: `#9B321F`

Every section, chapter, console, card, header, footer, and contact panel must consume semantic theme tokens. Light mode may not contain an intentionally dark section. Dark mode may not contain an intentionally light section. Coral is an accent and reward color, not a full-screen background.

## Experience architecture

### 1. First viewport: immediate promise

Keep the large four-line headline, but support it with one short recruiter-oriented promise and a compact four-role scan. The first viewport must communicate adaptability, evidence, and a reason to continue. Kinetic movement stays restrained to headline entry, fine background lines, and the scroll cue.

### 2. Twenty-second recruiter scan

Present Bayu's transferable work standard in three concise points. Replace continuous visual pressure with a controlled coral pulse or marquee that functions as a transition, not a permanent spectacle.

### 3. Four proof chapters

Each chapter retains the recruiter question, then moves through:

1. Context: where and what Bayu handled.
2. Actions: concrete work tasks in a chapter-specific interface.
3. Capability unlock: the transferable ability created by that work.

All four chapters share semantic theme tokens but retain personality through layout logic, numbering, borders, spatial rhythm, and interaction. Their backgrounds may alternate only between the theme's main and alternate surfaces.

### 4. Momentum safeguards

- A persistent page-progress line and active chapter indicator show forward movement.
- Each chapter previews the next proof near its exit.
- Long paragraphs are limited to a readable measure and revealed only when relevant.
- Repeated proof frames are prevented by four distinct task formats.
- Desktop sticky storytelling becomes normal document order on mobile.
- Reduced-motion mode exposes all information without relying on animation.

### 5. Capability command center

Keep one interactive console as the post-story reward. Its selected state, panel, keyboard navigation, and source attribution remain intact. The console is themed as a premium surface rather than a permanently black box. Each tab gives immediate visual feedback and updates one stable panel.

### 6. Education and final verdict

Education remains compact. The final recruiter verdict becomes the climax: a theme-consistent background with a large coral CTA panel, clear contact actions, and no full-screen coral field. The visitor should feel that contacting Bayu is the natural conclusion of the evidence trail.

## Motion principles

- Motion explains state or progression; it never exists only to decorate.
- One dominant movement per viewport.
- Scroll-driven phase transitions must be smooth and reversible.
- Hover and focus feedback completes within 180–250 ms.
- Reveal durations remain under 800 ms.
- No parallax on essential text.
- `prefers-reduced-motion` removes marquee, translation, and sticky phase choreography while preserving the complete reading order.

## Accessibility and resilience

- All small text/background combinations meet WCAG AA contrast.
- Theme selection updates the entire visual system atomically.
- Tabs retain roving `tabIndex`, arrow, Home, and End navigation.
- Touch targets remain at least 44 px.
- Both Indonesian and English copy remain complete.
- The hero fits from 320 px upward without clipping long words.
- No photos, image placeholders, fake statistics, or unverifiable claims are introduced.

## Acceptance criteria

- The reference charcoal `#20201E` is the dark main canvas.
- No hard-coded section color breaks theme consistency.
- Coral never occupies a full viewport.
- Four proof chapters remain visually distinct without theme violations.
- The story always exposes a next cue, active progress, or reward.
- Light and dark modes are verified across hero, scan, all chapters, console, education, verdict, and footer.
- Keyboard, mobile, reduced-motion, bilingual, build, lint, and automated tests pass.
- Browser QA confirms the primary narrative, every chapter phase, console interaction, theme switching, and contact climax.

## Out of scope

- Adding photographs, 3D objects, or generated imagery.
- Inventing performance percentages or work metrics.
- Changing employment facts, contact information, or the overall four-role positioning.
- Adding extra pages or navigation complexity.
