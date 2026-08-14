import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CONTENT, LINKS } from "../app/content.js";
import { normalizeLanguage, normalizeTheme, readPreferences, writePreference } from "../app/preferences.js";

test("both languages have matching factual content", () => {
  assert.deepEqual(Object.keys(CONTENT.id).sort(), Object.keys(CONTENT.en).sort());
  const requiredKeys = [
    "meta.title", "meta.description", "a11y.skip", "a11y.backTop",
    "hero.role", "hero.title", "hero.lines", "hero.description", "hero.signal", "hero.scan",
    "scan.label", "scan.title", "scan.description", "scan.points", "scan.marquee",
    "proof.label", "proof.unlocked", "proof.proven", "capability.system", "capability.online",
    "decision.indomaret", "decision.bmc", "decision.mitra", "decision.restu",
    "capability.label", "capability.title", "capability.intro", "capability.status", "capability.announcement",
    "verdict.label", "verdict.title", "verdict.description", "verdict.action",
    "education.institution", "education.official",
    "contact.linkedinLabel", "contact.githubLabel", "contact.instagramLabel", "contact.facebookLabel",
    "preferences.id", "preferences.eng", "announce.id", "announce.en", "announce.light", "announce.dark",
  ];
  for (const locale of ["id", "en"]) {
    for (const key of requiredKeys) assert.ok(CONTENT[locale][key], `${locale}.${key} is required`);
  }
  assert.equal(CONTENT.id["hero.role"], "PORTOFOLIO");
  assert.equal(CONTENT.en["hero.role"], "PORTFOLIO");
  assert.equal(CONTENT.id["hero.title"], "Bukan cuma pernah kerja. Terbukti bisa beradaptasi.");
  assert.equal(CONTENT.id["capability.label"], "PUSAT KENDALI KEMAMPUAN");
  assert.equal(CONTENT.id["experience.indomaret.role"], "Pramuniaga");
  assert.equal(CONTENT.en["education.institution"], "Muhammadiyah 1 Vocational High School, Muntilan");
  assert.equal(CONTENT.id["contact.label"], "SIAP BERKONTRIBUSI");
  assert.equal(CONTENT.en["contact.title"], "Let’s Discuss the Next Opportunity.");
  const copy = JSON.stringify(CONTENT).toLowerCase();
  for (const rejected of ["\u2014", "career system", "universitas", "99.9%", "10k+", "source sans"]) assert.equal(copy.includes(rejected), false);
});

test("proof-first journey has complete bilingual questions, evidence, and unlock copy", () => {
  const required = [
    "hero.proofStrip", "hero.scrollPrompt",
    "experience.indomaret.kicker", "experience.indomaret.question", "experience.indomaret.proof", "experience.indomaret.unlock",
    "experience.bmc.kicker", "experience.bmc.question", "experience.bmc.proof", "experience.bmc.unlock",
    "experience.mitra.kicker", "experience.mitra.question", "experience.mitra.proof", "experience.mitra.unlock",
    "experience.restu.kicker", "experience.restu.question", "experience.restu.proof", "experience.restu.unlock",
    "skills.technical.source", "skills.operations.source", "skills.admin.source", "skills.retail.source",
  ];
  for (const key of required) {
    assert.ok(CONTENT.id[key], `missing Indonesian ${key}`);
    assert.ok(CONTENT.en[key], `missing English ${key}`);
  }
  assert.equal(CONTENT.id["experience.restu.role"], "PKL / Magang Dukungan IT");
  assert.equal(CONTENT.en["experience.restu.role"], "IT Support Intern");
});

test("Indonesian interface copy does not retain rejected English labels", () => {
  const copy = Object.values(CONTENT.id).join(" ");
  for (const rejected of [
    "Built Across Real Operations.", "Technical awareness.", "Experience shaped by real work.",
    "Technical Support", "Process & Quality", "Service & Data", "Store Crew", "IT Support Intern",
    "Skills built through practice.", "Ready to contribute.", "CAPABILITY COMMAND CENTER", "Light", "Dark", "English",
  ]) assert.equal(copy.includes(rejected), false, `Indonesian copy contains: ${rejected}`);
});

test("preferences default safely and persist valid choices", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
  assert.deepEqual(readPreferences(storage), { language: "id", theme: "light" });
  assert.equal(normalizeLanguage("fr"), "id");
  assert.equal(normalizeTheme("system"), "light");
  writePreference(storage, "language", "en");
  writePreference(storage, "theme", "dark");
  assert.equal(values.get("bayu-portfolio-language"), "en");
  assert.equal(values.get("bayu-portfolio-theme"), "dark");
});

test("all real contact links and the CV asset are present", () => {
  assert.equal(LINKS.github, "https://github.com/bayz-dik/V-Forge");
  assert.equal(LINKS.instagram, "https://www.instagram.com/bayydka?igsh=eGtocG5pbTJjNGcz");
  assert.equal(LINKS.facebook, "https://www.facebook.com/share/1dEpojdwUy/");
  assert.equal(LINKS.maps, "https://maps.app.goo.gl/4G2zN1NASnfHMoBH9");
  const cv = readFileSync(new URL("../public/Bayu-Andika-CV.pdf", import.meta.url));
  assert.equal(cv.subarray(0, 4).toString(), "%PDF");
});
