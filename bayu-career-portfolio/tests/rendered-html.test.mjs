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
  assert.match(html, /Dibentuk oleh/);
  for (const id of ["profile", "experience", "skills", "education", "contact"]) assert.match(html, new RegExp(`id="${id}"`));
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

test("keeps the compact approved switch and typography contracts", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /--switch-width:\s*56px/);
  assert.match(css, /--switch-width:\s*76px/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /font-family:\s*-apple-system/);
  assert.match(css, /SF Pro Text/);
  assert.match(css, /transition:[^;]*250ms/);
});
