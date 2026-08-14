import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

test("page contains the approved compact preference controls", () => {
  for (const token of [
    "theme-switch", "language-switch", "data-icon=\"sun\"", "data-icon=\"moon\"",
    "data-active={theme}", "data-active={language}", ">ID</button>", ">ENG</button>",
  ]) assert.ok(page.includes(token), `missing ${token}`);
  assert.equal(page.includes('className="preferences"'), false);
});

test("contact methods render as one compact icon row without visible URLs", () => {
  assert.ok(page.includes('className="contact-links"'));
  assert.ok(page.includes('className="contact-icon"'));
  for (const icon of ["email", "phone", "linkedin", "github", "instagram", "facebook", "location"]) {
    assert.ok(page.includes(`data-contact-icon={${icon === "location" ? '"location"' : "icon"}}`) || page.includes(`case "${icon}"`), `missing ${icon} icon`);
  }
  for (const visibleUrl of [
    ">bayuandk4@gmail.com<", ">+62 878 8182 0662<", ">linkedin.com/", ">github.com/", ">instagram.com/", ">facebook.com/",
  ]) assert.equal(page.includes(visibleUrl), false, `visible contact text remains: ${visibleUrl}`);
  assert.equal(page.includes("function Contact("), false);
});

test("complete bilingual narrative controls visible and accessibility copy", () => {
  for (const token of [
    't("a11y.skip")', 't("a11y.backTop")', 't("hero.lines")', 't("scan.title")', 't("scan.marquee")',
    't("proof.label")', 't("proof.unlocked")', 't("proof.proven")', 't("capability.system")', 't("capability.online")',
    't("education.institution")', 't("education.official")', 't("contact.linkedinLabel")',
    't("contact.githubLabel")', 't("contact.instagramLabel")', 't("contact.facebookLabel")',
    't(`announce.${next}`)', 'document.title = t("meta.title")',
  ]) assert.ok(page.includes(token), `missing ${token}`);
  assert.ok(page.includes("PT Mitrametal Perkasa"));
  assert.ok(page.includes('href={LINKS.maps}'));
});

test("journey uses recruiter questions, distinct proof formats, and live phases", () => {
  for (const token of [
    'data-proof-chapter={job.key}', 'data-recruiter-question', 'data-capability-unlock',
    'proof: "retail"', 'proof: "admin"',
    'proof: "production"', 'proof: "technical"',
    'data-active-work={activeWork}', 'experience.${job.key}.unlock', 'data-phase="context"',
  ]) assert.ok(page.includes(token), `missing ${token}`);
  assert.ok(page.includes('setActiveWork'));
  assert.ok(page.includes('style.setProperty("--page-progress"'));
  assert.ok(page.includes('style.setProperty("--chapter-progress"'));
  assert.ok(page.includes("rect.height - innerHeight + stickyTop"));
  assert.ok(page.includes("stickyTop - rect.top"));
  assert.match(css, /\.career-route/);
  assert.match(css, /\.proof-format-retail/);
  assert.match(css, /\.proof-format-admin/);
  assert.match(css, /\.proof-format-production/);
  assert.match(css, /\.proof-format-technical/);
});

test("proof-to-decision loop reuses one route and four controlled motion formats", () => {
  for (const token of [
    "data-decision-route", "data-decision-item", "decisionState",
    "data-decision-summary", "decision.${job.key}", "--item-index",
    'querySelectorAll<HTMLElement>("[data-decision-item]")',
  ]) assert.ok(page.includes(token), `missing ${token}`);

  for (const selector of [
    "decision-route-shell", "decision-summary", "proof-format-retail",
    "proof-format-admin", "proof-format-production", "proof-format-technical",
  ]) assert.match(css, new RegExp(`\\.${selector}`), `missing .${selector}`);

  assert.match(css, /data-decision-state="proven"/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.proof-format\s+li[\s\S]*transform:\s*none/s);
});

test("technical proof uses isolated step badges instead of a continuous signal rail", () => {
  assert.doesNotMatch(css, /\.proof-format-technical::after/);
  assert.match(css, /\.proof-format-technical\s*\{[^}]*display:\s*grid[^}]*gap:\s*8px/s);
  assert.match(css, /\.proof-format-technical\s+b\s*\{[^}]*width:\s*28px[^}]*height:\s*28px[^}]*border-radius:\s*50%/s);
  assert.match(css, /\.proof-format-technical\s+li\s*\{[^}]*grid-template-columns:\s*44px\s+minmax\(0,1fr\)/s);
  assert.match(css, /\.proof-format-technical\s+span\s*\{[^}]*min-width:\s*0[^}]*padding-left:\s*0/s);
});

test("recruiters can jump to proof and contact without traversing the full narrative", () => {
  assert.ok(page.includes('id={`proof-${job.key}`}'));
  assert.ok(page.includes('href={`#proof-${job.key}`}'));
  assert.ok(page.includes('className="header-contact" href="#contact"'));
  assert.match(css, /\.proof-chapter\s*\{[^}]*min-height:\s*150svh[^}]*scroll-margin-top:\s*104px/s);
  assert.match(css, /html\s*\{[^}]*scroll-padding-top:\s*104px/s);
  assert.match(css, /\.header-contact\s*\{[^}]*min-height:\s*44px/s);
  assert.match(css, /\.header\.compact\s+\.header-contact\s*\{[^}]*opacity:\s*1/s);
  assert.match(css, /@media\s*\(max-width:\s*767px\)[\s\S]*\.proof-chapter\s*\{[^}]*min-height:\s*0/s);
});

test("source and tracked assets are completely photo-free", () => {
  const moduleUrl = new URL("../app/work-visuals.js", import.meta.url);
  const workDirUrl = new URL("../public/work/", import.meta.url);
  assert.equal(existsSync(moduleUrl), false, "work visual data module must be removed");
  assert.equal(existsSync(workDirUrl) ? readdirSync(workDirUrl).length : 0, 0, "work photo assets must be removed");
  assert.doesNotMatch(page, /WORK_VISUALS|LivingProofFrame|<img\b|\/work\//);
});

test("capability console is accessible and motion has a safe fallback", () => {
  for (const token of ['data-capability-console', 'role="tablist"', 'role="tab"', 'aria-selected', 'aria-live="polite"', 'tabIndex={activeSkill === skill ? 0 : -1}', 'onKeyDown={(event) => moveSkillFocus(event, index)}']) {
    assert.ok(page.includes(token), `missing ${token}`);
  }
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.kinetic-marquee\s*\{[^}]*animation:\s*none/s);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.phase-block\s*\{[^}]*opacity:\s*1/s);
});

test("CSS preserves the approved compact sizes and dark palette", () => {
  for (const pattern of [
    /--switch-width:\s*56px/,
    /--switch-width:\s*76px/,
    /min-height:\s*44px/,
    /#151412/i,
    /#f4efe6/i,
    /#ee7455/i,
    /transition:[^;]*250ms/,
    /\.contact-links\s*\{[^}]*display:\s*flex/s,
    /\.contact-icon\s*\{[^}]*min-width:\s*44px/s,
    /\.contact-icon\s*\{[^}]*min-height:\s*44px/s,
    /\.contact-location\s*\{[^}]*color:\s*var\(--on-coral\)[^}]*text-decoration:\s*none/s,
    /\.hero-stage\s+h1\s*\{[^}]*font-size:\s*clamp/s,
    /\.hero-stage\s+h1\s+\.outline-line\s+i/s,
    /\.capability-console\s*\{/,
    /@media\s*\(max-width:\s*767px\)[\s\S]*\.proof-chapter\s*\{[^}]*min-height:\s*0/s,
    /@media\s*\(max-width:\s*767px\)[\s\S]*\.hero-stage\s+h1\s+span:nth-child\(4\)\s+i\s*\{[^}]*font-size:\s*clamp\(2\.2rem,12vw,5\.3rem\)/s,
  ]) assert.match(css, pattern);
  assert.match(layout, /\bManrope\b/);
  assert.doesNotMatch(layout, /Cormorant_Garamond|\bInter\b|Source_Sans_3/);
  assert.match(css, /-apple-system/);
  assert.match(css, /SF Pro Text/);
});

test("CSS exposes the Claude Warm semantic theme without legacy hard-coded section backgrounds", () => {
  assert.match(css, /:root\s*\{[\s\S]*--canvas:\s*#f4efe6/i);
  assert.match(css, /html\[data-theme="dark"\]\s*\{[\s\S]*--canvas:\s*#20201e/i);
  for (const name of ["canvas-alt", "surface", "surface-active", "ink", "body", "muted", "line", "coral", "accent-text", "on-coral", "header-bg", "shadow-accent"]) {
    assert.match(css, new RegExp(`--${name}:`, "i"), `missing --${name}`);
  }
  assert.doesNotMatch(css, /\.(?:hero-stage|experience|capability-console|verdict-section|education-strip|proof-chapter)[^{]*\{[^}]*background:\s*#151412/i);
});

test("every narrative surface follows the active theme while proof types vary by accent", () => {
  for (const selector of ["hero-stage", "recruiter-scan", "experience", "capability-section", "education-strip", "verdict-section"]) {
    assert.match(css, new RegExp(`\\.${selector}\\s*\\{[^}]*background:\\s*var\\(--`, "s"), `${selector} is not theme-driven`);
  }
  assert.match(css, /\.proof-chapter\s*\{[^}]*background:\s*var\(--chapter-bg\)/s);
  for (const proof of ["admin", "production", "technical"]) {
    assert.match(css, new RegExp(`\\.proof-chapter\\[data-proof="${proof}"\\]\\s*\\{[^}]*--chapter-bg:`, "s"));
  }
  assert.match(css, /\.capability-console\s*\{[^}]*background:\s*var\(--surface\)/s);
});
