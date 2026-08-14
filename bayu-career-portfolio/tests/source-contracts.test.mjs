import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("complete bilingual content controls visible and accessibility copy", () => {
  for (const token of [
    't("a11y.skip")', 't("a11y.backTop")', 't("hero.lines")', 't("profile.bridge")',
    't("education.institution")', 't("education.official")', 't("contact.linkedinLabel")',
    't("contact.githubLabel")', 't("contact.instagramLabel")', 't("contact.facebookLabel")',
    't(`announce.${next}`)', 'document.title = t("meta.title")',
  ]) assert.ok(page.includes(token), `missing ${token}`);
});

test("work history uses sticky fading cards and four coral snake arrows", () => {
  assert.ok(page.includes('className="jobs-track"'));
  assert.ok(page.includes('className="job-card"'));
  assert.ok(page.includes('className="job-arrow"'));
  assert.ok(page.includes('style.setProperty("--work-opacity"'));
  assert.ok(page.includes('requestAnimationFrame'));
  assert.equal((page.match(/<SnakeArrow \/>/g) ?? []).length, 1, "one reusable arrow in the mapped job template");
  assert.match(css, /\.job:first-child\s*\{[^}]*border-top:\s*0/s);
  assert.match(css, /\.job:last-child\s*\{[^}]*border-bottom:\s*0/s);
  assert.match(css, /\.job-card\s*\{[^}]*position:\s*sticky/s);
  assert.match(css, /opacity:\s*var\(--work-opacity/s);
});

test("CSS preserves the approved compact sizes and dark palette", () => {
  for (const pattern of [
    /--switch-width:\s*56px/,
    /--switch-width:\s*76px/,
    /min-height:\s*44px/,
    /#353534/i,
    /#403f3d/i,
    /#464541/i,
    /transition:[^;]*250ms/,
    /\.contact-links\s*\{[^}]*display:\s*flex/s,
    /\.contact-icon\s*\{[^}]*min-width:\s*44px/s,
    /\.contact-icon\s*\{[^}]*min-height:\s*44px/s,
    /html\[lang="id"\]\s+h1/,
    /h1\s+i\s*\{[^}]*white-space:\s*nowrap/s,
    /@media\s*\(max-width:\s*767px\)[\s\S]*h1\s+i\s*\{[^}]*white-space:\s*normal/s,
  ]) assert.match(css, pattern);
  assert.match(layout, /\bManrope\b/);
  assert.doesNotMatch(layout, /Cormorant_Garamond|\bInter\b|Source_Sans_3/);
  assert.match(css, /-apple-system/);
  assert.match(css, /SF Pro Text/);
});
