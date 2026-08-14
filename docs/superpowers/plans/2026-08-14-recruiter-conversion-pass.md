# Recruiter Conversion Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mempercepat recruiter membuka bukti relevan dan menghubungi Bayu tanpa mengubah konten atau visual utama.

**Architecture:** Gunakan anchor HTML pada decision route dan CTA header yang mengarah ke section yang sudah ada. Percepat pacing hanya melalui CSS desktop; mobile tetap normal flow.

**Tech Stack:** React 19, TypeScript, CSS, Node test runner, Vinext.

## Global Constraints

- Palet, copy utama, urutan section, fakta, link kontak, dan motion yang ada tidak berubah.
- Tidak ada dependensi atau state baru.
- Decision route tetap satu komponen dan empat item.
- Mobile tidak menggunakan sticky proof chapter.

---

### Task 1: Kontrak conversion path

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `tests/source-contracts.test.mjs`

**Interfaces:**
- Consumes: empat `WorkKey`, `LINKS.email`, dan section `#contact`.
- Produces: empat target `#proof-*`, empat anchor route, dan `.header-contact`.

- [ ] Tambahkan assertion rendered HTML untuk empat `id="proof-*"`, empat `href="#proof-*"`, serta satu `.header-contact[href="#contact"]`.
- [ ] Tambahkan assertion CSS bahwa proof chapter memakai `min-height:150svh`, target memiliki `scroll-margin-top`, CTA minimal 44 px, dan mobile mengembalikan `min-height:0`.
- [ ] Jalankan `node --test tests/rendered-html.test.mjs tests/source-contracts.test.mjs`; pastikan gagal karena fitur belum ada.

### Task 2: Implementasi jalur cepat recruiter

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `job.key`, `t(\`decision.${job.key}\`)`, dan `t("verdict.action")`.
- Produces: anchor navigation, contact shortcut, dan pacing 150svh.

- [ ] Tambahkan `id={\`proof-${job.key}\`}` pada `ProofChapter`.
- [ ] Bungkus isi setiap decision item dengan `<a href={\`#proof-${job.key}\`}>` tanpa menambah item visual.
- [ ] Tambahkan `<a className="header-contact" href="#contact">{t("verdict.action")} →</a>` pada header.
- [ ] Ubah grid header, state compact, target 44 px, `scroll-margin-top:104px`, dan desktop chapter `150svh` memakai token yang ada.
- [ ] Pastikan mobile menyembunyikan label panjang secara aman dan mempertahankan normal flow.

### Task 3: Verifikasi dan publish

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/globals.css`

**Interfaces:**
- Consumes: perubahan Tasks 1–2.
- Produces: checkpoint live terverifikasi.

- [ ] Jalankan `npm test`, `npm run lint`, dan `git diff --check`.
- [ ] QA preview: anchor menuju chapter benar, CTA header menuju contact, tidak ada overflow, dark/light dan ID/EN konsisten.
- [ ] Checkpoint dengan approval live yang sudah diberikan, pantau sampai terminal, lalu verifikasi status langsung dan bagikan URL sukses.
