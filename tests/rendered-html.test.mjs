import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

async function renderHome() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the approved recruiter portfolio", async () => {
  const response = await renderHome();
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<html[^>]*lang="id"/i);
  assert.match(html, /Bayu Andika \| Portofolio Karier/);
  assert.match(html, /BUKAN CUMA/);
  assert.match(html, /4 LINGKUNGAN KERJA/);
  for (const id of ["scan", "experience", "capabilities", "education", "contact"]) assert.match(html, new RegExp(`id="${id}"`));
  for (const proof of ["BUKTI 01", "BUKTI 02", "BUKTI 03", "BUKTI 04"]) assert.match(html, new RegExp(proof));
  for (const target of ["mailto:bayuandk4@gmail.com", "tel:+6287881820662", "https://github.com/bayz-dik/V-Forge", "/Bayu-Andika-CV.pdf"]) assert.ok(html.includes(target));
  assert.equal((html.match(/class="contact-icon"/g) ?? []).length, 6);
  assert.equal((html.match(/data-contact-icon=/g) ?? []).length, 7);
  assert.doesNotMatch(html, />linkedin\.com\/in\/bayu-andika2003\//);
  assert.doesNotMatch(html, />github\.com\/bayz-dik\/V-Forge/);
  assert.match(html, /class="[^"]*theme-switch/);
  assert.match(html, /class="[^"]*language-switch/);
  assert.match(html, /data-icon="sun"/);
  assert.match(html, /data-icon="moon"/);
  assert.match(html, />ID<\/button>/);
  assert.match(html, />ENG<\/button>/);
  assert.match(html, /data-active="light"/);
  assert.match(html, /data-active="id"/);
  assert.match(html, /aria-live="polite"/);
  assert.equal(html.toLowerCase().includes("career system"), false);
  assert.equal(html.toLowerCase().includes("universitas"), false);
});

test("renders a photo-free recruiter thriller with four proof chapters and one capability console", async () => {
  const response = await renderHome();
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.equal((html.match(/data-proof-chapter=/g) ?? []).length, 4);
  assert.equal((html.match(/data-recruiter-question=/g) ?? []).length, 4);
  assert.equal((html.match(/data-capability-unlock=/g) ?? []).length, 4);
  assert.equal((html.match(/data-next-proof=/g) ?? []).length, 0, "color-only changes must not add new narrative UI");
  assert.equal((html.match(/data-phase="context"/g) ?? []).length, 4);
  assert.equal((html.match(/data-capability-console=/g) ?? []).length, 1);
  assert.equal((html.match(/data-decision-route=/g) ?? []).length, 1);
  assert.equal((html.match(/data-decision-item=/g) ?? []).length, 4);
  assert.equal((html.match(/data-decision-summary=/g) ?? []).length, 1);
  assert.equal((html.match(/data-decision-state=/g) ?? []).length, 0, "React must not overwrite scroll-owned decision state");
  for (const key of ["indomaret", "bmc", "mitra", "restu"]) {
    assert.match(html, new RegExp(`id="proof-${key}"`), `missing proof target for ${key}`);
    assert.match(html, new RegExp(`href="#proof-${key}"`), `missing proof shortcut for ${key}`);
  }
  assert.match(html, /class="header-contact"[^>]*href="#contact"/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 4);
  assert.match(html, /BUKTI KERJA(?:<!-- -->)? \/ 0(?:<!-- -->)?1/);
  assert.match(html, /SISTEM_KEMAMPUAN/);
  assert.match(html, /AKTIF<\/span>/);
  assert.match(html, /id="tab-technical"[^>]*tabindex="0"/);
  for (const id of ["operations", "admin", "retail"]) assert.match(html, new RegExp(`id="tab-${id}"[^>]*tabindex="-1"`));
  assert.doesNotMatch(html, /<img\b|\/work\/|living-proof|gallery|slider|carousel/i);
  for (const proof of ["retail", "admin", "production", "technical"]) assert.match(html, new RegExp(`data-proof="${proof}"`));
  for (const decision of ["Adaptasi", "Ketelitian", "Disiplin", "Problem Solving"]) assert.match(html, new RegExp(decision));
});

test("keeps the compact approved switch and typography contracts", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /--switch-width:\s*56px/);
  assert.match(css, /--switch-width:\s*76px/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /font-family:\s*-apple-system/);
  assert.match(css, /SF Pro Text/);
  assert.match(css, /transition:[^;]*250ms/);
});
