import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const root = css.match(/:root\s*\{([^}]*)\}/s)?.[1] ?? "";
const dark = css.match(/html\[data-theme="dark"\]\s*\{([^}]*)\}/s)?.[1] ?? "";

function token(block, name) {
  return block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
}

function hasToken(block, name) {
  return new RegExp(`--${name}:`, "i").test(block);
}

function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const [r, g, b] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

test("small light-surface text tokens meet WCAG AA contrast", () => {
  const canvas = token(root, "canvas");
  const accent = token(root, "accent-text");
  const muted = token(root, "muted");
  assert.ok(canvas && accent && muted, "light-theme contrast tokens are required");
  assert.ok(contrast(accent, canvas) >= 4.5, "accent text must reach 4.5:1 on the light canvas");
  assert.ok(contrast(muted, canvas) >= 4.5, "muted text must reach 4.5:1 on the light canvas");
  assert.match(css, /\.label\s*\{[^}]*color:\s*var\(--accent-text\)/s);
});

test("small dark-surface accent text meets WCAG AA contrast", () => {
  const canvas = token(dark, "canvas");
  const accent = token(dark, "accent-text");
  const canvasSoft = token(dark, "canvas-soft");
  const coralDark = token(dark, "coral-dark");
  const muted = token(dark, "muted");
  assert.ok(canvas && canvasSoft && accent && coralDark && muted, "dark-theme contrast tokens are required");
  assert.ok(contrast(accent, canvas) >= 4.5, "accent text must reach 4.5:1 on the dark canvas");
  assert.ok(contrast(coralDark, canvas) >= 4.5, "coral-dark text must reach 4.5:1 on the dark canvas");
  assert.ok(contrast(coralDark, canvasSoft) >= 4.5, "coral-dark text must reach 4.5:1 on the dark soft canvas");
  assert.ok(contrast(muted, canvas) >= 4.5, "inactive text must reach 4.5:1 on the dark canvas");
});

test("both themes expose the complete semantic surface contract", () => {
  assert.equal(token(root, "canvas"), "#f4efe6");
  assert.equal(token(dark, "canvas"), "#20201e");
  for (const name of ["canvas-alt", "surface", "surface-active", "ink", "body", "muted", "line", "coral", "accent-text", "on-coral", "header-bg", "shadow-accent"]) {
    assert.ok(hasToken(root, name), `light theme is missing --${name}`);
    assert.ok(hasToken(dark, name), `dark theme is missing --${name}`);
  }
  assert.ok(contrast(token(root, "ink"), token(root, "canvas")) >= 4.5);
  assert.ok(contrast(token(dark, "ink"), token(dark, "canvas")) >= 4.5);
  assert.ok(contrast(token(root, "on-coral"), token(root, "coral")) >= 4.5);
  assert.ok(contrast(token(dark, "on-coral"), token(dark, "coral")) >= 4.5);
});

test("small accent labels remain AA-readable on every themed surface", () => {
  for (const block of [root, dark]) {
    const accent = token(block, "accent-text");
    for (const surface of ["canvas", "canvas-alt", "surface"]) {
      assert.ok(contrast(accent, token(block, surface)) >= 4.5, `--accent-text must reach 4.5:1 on --${surface}`);
    }
  }
  for (const selector of ["hero-scan span", "experience \\.label", "career-route li span", "capability-tabs button span", "panel-title p", "capability-panel li span", "proof-format-retail span"]) {
    assert.match(css, new RegExp(`\\.${selector}\\s*\\{[^}]*color:\\s*var\\(--accent-text\\)`, "s"), `${selector} must use --accent-text`);
  }
});
