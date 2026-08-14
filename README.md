# Bayu Andika Career Portfolio

Portofolio karier bilingual untuk Bayu Andika, dibangun dengan React, Next.js, Vinext, dan Vite. Tampilan mendukung bahasa Indonesia/English, tema terang/gelap, pengalaman kerja interaktif, tautan kontak, dan unduhan CV.

## Fitur

- Pergantian seluruh halaman antara Indonesia dan English
- Mode terang dan gelap dengan preferensi tersimpan
- Riwayat kerja sticky dengan efek fade berbasis posisi scroll
- Empat penanda panah coral berkelok pada riwayat kerja
- Kontak ringkas berbentuk ikon yang langsung membuka tujuan
- Layout responsif untuk desktop dan mobile
- Dukungan `prefers-reduced-motion` dan navigasi keyboard

## Menjalankan secara lokal

Persyaratan: Node.js 22.13 atau lebih baru.

```bash
npm ci
npm run dev
```

Buka `http://localhost:3000`.

## Verifikasi

```bash
npm test
npm run lint
```

Perintah `npm test` menjalankan build produksi serta seluruh tes kontrak konten, tampilan, preferensi, dan aset.

## Struktur utama

- `app/page.tsx`: markup dan interaksi halaman
- `app/content.js`: sumber konten Indonesia dan English
- `app/globals.css`: sistem visual, tema, responsivitas, dan motion
- `app/preferences.js`: penyimpanan pilihan bahasa dan tema
- `public/Bayu-Andika-CV.pdf`: CV yang dapat diunduh
- `tests/`: tes kontrak dan hasil render

## Build produksi

```bash
npm run build
npm run start
```

Kontak dan informasi pribadi berada di `app/content.js` serta konstanta `LINKS` pada file yang sama.
