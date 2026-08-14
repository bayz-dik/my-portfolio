# Proof-to-Decision + Controlled Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat empat bukti kerja terasa berbeda dan saling menyelesaikan menjadi satu keputusan perekrut, tanpa mengubah palet, copy utama, urutan section, CTA, atau fakta pengalaman.

**Architecture:** Pertahankan satu loop scroll di `app/page.tsx` sebagai sumber status chapter dan decision route. Render empat label keputusan lewat komponen yang sudah ada, lalu gunakan CSS berbasis `data-phase`, `data-proof`, `data-decision-state`, dan `--item-index` untuk motion yang ringan dan berbeda.

**Tech Stack:** Next.js/Vinext, React 19, TypeScript, CSS, Node test runner.

## Global Constraints

- Jangan mengubah warna; dark canvas tetap `#20201e`, light canvas tetap `#f4efe6`.
- Jangan mengubah copy pengalaman, periode, lokasi, CTA, link, urutan section, CV, atau status PKL IT Support.
- Jangan menambah gambar, galeri, video, WebGL, library animasi, skor, atau persentase.
- Gunakan event listener scroll dan `requestAnimationFrame` yang sudah ada; jangan membuat listener kedua.
- Motion memakai `transform`, `opacity`, warna, dan garis; maksimal 700 ms per rangkaian.
- Reduced-motion harus langsung menampilkan state final tanpa stagger.
- Mobile tidak memakai sticky decision route.

---

### Task 1: Kunci kontrak decision route dan decision summary

**Files:**
- Modify: `tests/source-contracts.test.mjs`
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/contracts.test.mjs`

**Interfaces:**
- Consumes: struktur `jobs`, `CareerRoute`, `ProofFormat`, dan bilingual `CONTENT` yang sudah ada.
- Produces: kontrak `decision.*`, `[data-decision-route]`, empat `[data-decision-item]`, `[data-decision-summary]`, serta `--item-index`.

- [ ] **Step 1: Tambahkan failing source contract**

Tambahkan test berikut ke `tests/source-contracts.test.mjs`:

```js
test("proof-to-decision loop reuses one route and four controlled motion formats", () => {
  for (const token of [
    "data-decision-route", "data-decision-item", "data-decision-state",
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
```

- [ ] **Step 2: Tambahkan failing rendered contract**

Tambahkan assertions berikut ke test recruiter thriller di `tests/rendered-html.test.mjs`:

```js
assert.equal((html.match(/data-decision-route=/g) ?? []).length, 1);
assert.equal((html.match(/data-decision-item=/g) ?? []).length, 4);
assert.equal((html.match(/data-decision-summary=/g) ?? []).length, 1);
for (const decision of ["Adaptasi", "Ketelitian", "Disiplin", "Problem Solving"]) {
  assert.match(html, new RegExp(decision));
}
```

- [ ] **Step 3: Tambahkan key bilingual ke content contract**

Tambahkan empat key berikut ke daftar required key di `tests/contracts.test.mjs`:

```js
"decision.indomaret",
"decision.bmc",
"decision.mitra",
"decision.restu",
```

- [ ] **Step 4: Jalankan test untuk memastikan gagal**

Run: `node --test tests/source-contracts.test.mjs tests/contracts.test.mjs`

Expected: FAIL karena decision attributes dan empat content key belum ada.

- [ ] **Step 5: Commit failing contracts**

```bash
git add tests/source-contracts.test.mjs tests/rendered-html.test.mjs tests/contracts.test.mjs
git commit -m "test: define proof-to-decision contracts"
```

---

### Task 2: Render decision data tanpa mengubah copy utama

**Files:**
- Modify: `app/content.js`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `decision.${job.key}` dari `CONTENT` dan `WorkKey` pada array `jobs`.
- Produces: `CareerRoute` dengan `data-decision-route`; `DecisionSummary`; item bukti dengan custom property `--item-index`.

- [ ] **Step 1: Tambahkan empat label bilingual**

Tambahkan key berikut ke object `id` dan `en` di `app/content.js` tanpa menyentuh key lain:

```js
// id
"decision.indomaret": "Adaptasi",
"decision.bmc": "Ketelitian",
"decision.mitra": "Disiplin",
"decision.restu": "Problem Solving",

// en
"decision.indomaret": "Adaptability",
"decision.bmc": "Accuracy",
"decision.mitra": "Discipline",
"decision.restu": "Problem Solving",
```

- [ ] **Step 2: Pindahkan route tanpa menduplikasi**

Ubah markup experience di `app/page.tsx` menjadi pola berikut: hapus `<CareerRoute ... />` dari kolom intro dan render tepat satu kali di antara intro dan `proof-track`.

```tsx
<div className="decision-route-shell">
  <CareerRoute activeWork={activeWork} t={t} />
</div>
<div className="proof-track">...</div>
```

- [ ] **Step 3: Tambahkan atribut decision route**

Ubah `CareerRoute` agar setiap item memiliki keadaan awal deterministik:

```tsx
function CareerRoute({ activeWork, t }: { activeWork: WorkKey; t: (key: string) => string }) {
  return <ol className="career-route" data-decision-route aria-label={t("experience.title")}>
    {jobs.map((job, index) => <li
      key={job.key}
      data-decision-item={job.key}
      data-decision-state={activeWork === job.key ? "active" : "pending"}
    >
      <span>0{index + 1}</span>
      <b>{t(`decision.${job.key}`)}</b>
      <em className="sr-only">{t(`bridge.${job.proof}`)}</em>
    </li>)}
  </ol>;
}
```

- [ ] **Step 4: Beri indeks CSS pada setiap item bukti**

Pada seluruh cabang `ProofFormat`, tambahkan style yang sama pada `<li>`:

```tsx
style={{ "--item-index": index } as CSSProperties}
```

Ubah import type di bagian atas menjadi `import type { CSSProperties, KeyboardEvent } from "react";` dan pastikan callback production juga menerima `index`.

- [ ] **Step 5: Tambahkan DecisionSummary di verdict**

Render komponen ini tepat setelah `verdict.label` dan sebelum `verdict.title`:

```tsx
function DecisionSummary({ t }: { t: (key: string) => string }) {
  return <ol className="decision-summary" data-decision-summary>
    {jobs.map((job, index) => <li key={job.key} style={{ "--item-index": index } as CSSProperties}>
      <span aria-hidden="true">0{index + 1}</span>
      <b>{t(`decision.${job.key}`)}</b>
    </li>)}
  </ol>;
}
```

- [ ] **Step 6: Jalankan contract tests**

Run: `node --test tests/source-contracts.test.mjs tests/contracts.test.mjs`

Expected: source/content contracts PASS; rendered test masih menunggu build terbaru.

- [ ] **Step 7: Commit render layer**

```bash
git add app/content.js app/page.tsx
git commit -m "feat: connect work proof to recruiter decision"
```

---

### Task 3: Hubungkan scroll state dan empat motion rhythm

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `data-phase`, `--chapter-progress`, `[data-decision-item]`, `--item-index` dari Task 2.
- Produces: `pending|active|proven` pada decision route dan controlled motion yang selesai satu kali per phase.

- [ ] **Step 1: Sinkronkan status decision di loop scroll yang ada**

Di effect scroll, query item route sekali di dekat query chapters:

```ts
const decisionItems = Array.from(document.querySelectorAll<HTMLElement>("[data-decision-item]"));
```

Di dalam callback RAF, simpan `nearestIndex`, `nearestPhase`, dan `lastChapterProgress`. Setelah loop chapters, update item:

```ts
decisionItems.forEach((item, index) => {
  const allComplete = lastChapterProgress >= 1;
  const state = allComplete || index < nearestIndex || (index === nearestIndex && nearestPhase === "capability")
    ? "proven"
    : index === nearestIndex ? "active" : "pending";
  item.dataset.decisionState = state;
});
```

Set `lastChapterProgress = progress` hanya saat memproses chapter terakhir. Jangan membuat listener baru.

- [ ] **Step 2: Tambahkan layout decision route**

Di `app/globals.css`, buat `.decision-route-shell` sticky pada desktop dengan `top` di bawah header, background token tema, border token `--line`, dan z-index di bawah header. Reset menjadi `position: static` di media query `max-width: 767px`.

State visual wajib memakai tiga sinyal:

```css
.career-route li[data-decision-state="pending"] { opacity: .48; }
.career-route li[data-decision-state="active"] { opacity: 1; }
.career-route li[data-decision-state="proven"] { opacity: 1; }
.career-route li[data-decision-state="proven"]::after { content: "✓"; }
```

Gunakan token yang sudah ada; jangan menambah nilai hex.

- [ ] **Step 3: Tambahkan retail priority switch**

```css
.proof-chapter[data-proof="retail"][data-phase="actions"] .proof-format li {
  opacity: 1;
  transform: none;
  transition-delay: calc(var(--item-index) * 60ms);
}
.proof-format-retail li { opacity: 0; transform: translateX(-6px); transition: opacity 220ms ease, transform 220ms ease; }
```

- [ ] **Step 4: Tambahkan admin document organize**

```css
.proof-format-admin li { opacity: 0; transform: translateY(10px); transition: opacity 260ms ease, transform 260ms cubic-bezier(.22,1,.36,1); }
.proof-chapter[data-proof="admin"][data-phase="actions"] .proof-format li {
  opacity: 1; transform: none; transition-delay: calc(var(--item-index) * 90ms);
}
```

- [ ] **Step 5: Tambahkan production standards lock**

```css
.proof-format-production li { opacity: .38; transform: translateX(-4px); transition: opacity 240ms ease, transform 240ms ease, border-color 240ms ease; }
.proof-chapter[data-proof="production"][data-phase="actions"] .proof-format li {
  opacity: 1; transform: none; transition-delay: calc(var(--item-index) * 105ms);
}
```

- [ ] **Step 6: Tambahkan technical diagnostic path**

```css
.proof-format-technical li { opacity: .35; transform: translateX(-6px); transition: opacity 260ms ease, transform 260ms ease; }
.proof-chapter[data-proof="technical"][data-phase="actions"] .proof-format li {
  opacity: 1; transform: none; transition-delay: calc(var(--item-index) * 120ms);
}
```

Gunakan pseudo-element pada `.proof-format-technical` untuk garis satu arah; transisinya maksimal 680 ms dan berhenti pada state final.

- [ ] **Step 7: Tambahkan final decision payoff**

Style `.decision-summary` sebagai satu baris/list ringkas di atas verdict. Item masuk berurutan saat elemen memperoleh class `.visible` dari reveal observer yang sudah ada; jangan menambah observer. Tambahkan `data-reveal` pada komponen summary.

- [ ] **Step 8: Tambahkan mobile dan reduced-motion contract**

```css
@media (max-width:767px) {
  .decision-route-shell { position:static; }
  .career-route { grid-template-columns:repeat(2,1fr); }
  .decision-summary { grid-template-columns:repeat(2,1fr); }
}

@media (prefers-reduced-motion:reduce) {
  .proof-format li,
  .decision-summary li { opacity:1; transform:none; transition:none; }
  .proof-format-technical::after { transform:none; transition:none; }
}
```

- [ ] **Step 9: Jalankan seluruh test**

Run: `npm test`

Expected: seluruh test PASS, termasuk empat chapters, satu route, empat decision items, satu decision summary, dan palette contracts.

- [ ] **Step 10: Commit interaction dan motion**

```bash
git add app/page.tsx app/globals.css tests/source-contracts.test.mjs tests/rendered-html.test.mjs tests/contracts.test.mjs
git commit -m "feat: add controlled proof motion and decision progress"
```

---

### Task 4: QA visual, aksesibilitas, dan checkpoint live

**Files:**
- Verify only: `app/page.tsx`
- Verify only: `app/globals.css`
- Verify only: `.openai/hosting.json`

**Interfaces:**
- Consumes: implementasi lengkap Tasks 1–3.
- Produces: situs terverifikasi dan checkpoint deployment final.

- [ ] **Step 1: Jalankan lint**

Run: `npm run lint`

Expected: exit 0 tanpa ESLint error.

- [ ] **Step 2: Jalankan agent preview**

Run dari root site: `sites-preview start "$PWD"`

Periksa desktop dan mobile untuk: route sticky tidak menutup header, tidak ada horizontal overflow, empat motion dapat dibedakan, scroll balik konsisten, dan final summary tidak memenuhi halaman.

- [ ] **Step 3: Periksa interaction dan accessibility**

Uji ID/EN, terang/gelap, capability tabs dengan mouse dan keyboard, download CV, link kontak, focus ring, dan reduced-motion. Pastikan tidak ada console error.

- [ ] **Step 4: Buat checkpoint deployment**

Run:

```bash
python3 /root/.codex/plugins/cache/openai-curated-remote/sites/0.1.16/skills/sites-hosting/scripts/sites.py checkpoint \
  --path /workspace/sites/bayu-portfolio-live-preview \
  --message "Add proof-to-decision motion" \
  --user-approval-provided
```

Expected: build dan artifact validation lulus, source tersimpan, deployment dimulai.

- [ ] **Step 5: Verifikasi deployment terminal**

Pantau deployment yang dikembalikan checkpoint sampai `succeeded` atau `failed`, lalu lakukan verifikasi status langsung memakai tiga ID yang persis sama. Bagikan hanya URL produksi yang sudah berstatus `succeeded`.

## Completion checklist

- [ ] Tidak ada perubahan warna atau copy utama.
- [ ] Tidak ada gambar atau dependensi baru.
- [ ] Empat chapter memiliki ritme berbeda.
- [ ] Satu decision route menampilkan empat status faktual tanpa persentase.
- [ ] Final verdict menyelesaikan empat kompetensi.
- [ ] Desktop, mobile, ID/EN, terang/gelap, keyboard, dan reduced-motion aman.
- [ ] Seluruh test dan lint lulus.
- [ ] Deployment live terverifikasi.
