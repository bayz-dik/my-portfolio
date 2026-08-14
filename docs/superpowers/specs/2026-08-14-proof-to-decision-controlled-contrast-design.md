# Proof-to-Decision Loop + Controlled Contrast

## Tujuan

Meningkatkan momentum portofolio Bayu Andika tanpa mengubah identitas visual atau isi yang sudah disetujui. Pengunjung harus merasakan satu alur yang jelas:

1. muncul pertanyaan tentang kemampuan Bayu;
2. pekerjaan nyata memberi bukti;
3. satu kompetensi terbuka;
4. empat kompetensi menyatu menjadi keputusan perekrut.

Desain ini ditujukan terutama untuk HRD dan user interviewer yang melakukan pemindaian cepat, dengan khalayak umum sebagai audiens kedua. Efek “nagih” dibangun lewat rasa ingin tahu dan penyelesaian informasi, bukan lewat animasi ramai.

## Keputusan desain yang dikunci

- Menggunakan **Proof-to-Decision Loop** sebagai alur utama.
- Menggunakan **Controlled Contrast** untuk memberi ritme gerak yang berbeda pada empat pengalaman.
- Memanfaatkan komponen yang sudah ada: pertanyaan chapter, format bukti, `career-route`, capability unlock, dan final verdict.
- Tidak menambah galeri, foto, video, WebGL, efek 3D, skor, persentase, atau pencapaian yang tidak memiliki bukti.
- Tidak mengubah teks pengalaman, judul, periode, lokasi, link, CTA, palet warna, mode terang/gelap, atau susunan section.
- Tidak menambah kartu teaser antarchapter atau elemen berulang yang memenuhi halaman.

## Hasil yang diharapkan

- Dalam lima detik, pengunjung memahami bahwa Bayu memiliki pengalaman lintas lingkungan kerja dan pola kerja yang konsisten.
- Setiap chapter terasa berbeda, tetapi tetap berasal dari satu sistem desain.
- Pengunjung selalu mengetahui bukti mana yang sedang dibaca dan kompetensi apa yang sudah terbentuk.
- Setelah chapter keempat, final verdict terasa sebagai jawaban yang pantas, bukan sekadar slogan penutup.
- Halaman tetap ringan, mudah dibaca, dan tidak mengganggu pemindaian cepat HRD.

## Batas perubahan

### Yang berubah

1. `career-route` menjadi indikator keputusan yang ringkas dan scroll-linked.
2. Setiap chapter mendapat pola animasi bukti yang sesuai dengan jenis pekerjaannya.
3. Status kompetensi pada `career-route` berubah dari belum terbuka, aktif, menjadi terbukti.
4. Final verdict menampilkan ringkasan empat kompetensi yang telah dibuktikan sebelum kesimpulan yang sudah ada.
5. Atribut data dan kontrak pengujian ditambah untuk memastikan perilaku konsisten.

### Yang tidak berubah

- Hero, recruiter scan, capability console, education, contact, dan footer tetap dalam struktur sekarang.
- Semua copy bilingual tetap sama, kecuali empat label kompetensi singkat yang diperlukan oleh indikator keputusan.
- Palet terang dan gelap tetap sama, termasuk kanvas gelap `#20201e` dan kanvas terang `#f4efe6`.
- Tidak ada perubahan CV, kontak, tautan peta, urutan pekerjaan, atau status PKL IT Support.
- Tidak ada gambar baru.

## Arsitektur pengalaman

### 1. Sinyal awal

Hero dan recruiter scan yang sudah ada tetap menjadi pembuka. Tidak ada headline atau CTA baru. Janji “empat lingkungan kerja, satu standar kerja” menjadi pertanyaan implisit yang akan dijawab oleh empat chapter.

### 2. Decision route

`career-route` yang sudah ada ditingkatkan menjadi satu indikator keputusan bersama, sehingga halaman tidak memperoleh komponen navigasi baru yang berulang.

Setiap item memiliki tiga keadaan deterministik berdasarkan posisi scroll:

- **Belum terbuka**: chapter belum dicapai; nomor dan label tampil redup.
- **Aktif**: chapter terdekat dengan pusat viewport; titik, garis, dan label mendapat fokus.
- **Terbukti**: chapter sebelumnya sudah melewati fase capability, atau chapter aktif telah memasuki fase capability.

Pemetaan satu kompetensi utama per pengalaman:

| Pengalaman | Format bukti | Kompetensi keputusan |
|---|---|---|
| Indomaret | Aktivitas ritel cepat | Adaptasi |
| BMC Motor | Alur data dan dokumen | Ketelitian |
| PT Mitrametal Perkasa | Checklist SOP dan kualitas | Disiplin |
| Restu Computer | Urutan diagnosis teknis | Problem Solving |

Tidak ada persentase. Progress dinyatakan melalui empat status faktual tersebut.

Markup `CareerRoute` yang sekarang berada di kolom kanan intro dipindahkan—bukan diduplikasi—ke satu `decision-route-shell` di antara intro dan `proof-track`. Pada desktop, shell tersebut menjadi ringkas dan sticky selama rangkaian chapter berlangsung. Pada mobile, route tetap berada di posisi yang sama dalam document flow dan tidak menggunakan sticky positioning yang menutup konten.

Aturan statusnya eksplisit:

- item sebelum chapter aktif berstatus `proven`;
- item chapter aktif berstatus `active` pada fase context/actions dan `proven` pada fase capability;
- item setelah chapter aktif berstatus `pending`;
- setelah chapter keempat selesai, keempat item berstatus `proven`.

### 3. Proof loop per chapter

Semua chapter tetap menggunakan urutan yang sudah ada:

1. **Context** menjawab situasi dan tanggung jawab.
2. **Actions** memperlihatkan tindakan nyata.
3. **Capability** menyelesaikan pertanyaan dengan kemampuan yang terbentuk.

Status chapter tetap diturunkan dari `--chapter-progress` dan `data-phase`. Tidak ada timer bebas atau state permainan. Ketika pengguna menggulir mundur, status kembali mengikuti posisi scroll agar perilaku dapat diprediksi.

### 4. Final decision

Final verdict tidak menjadi section baru. Tepat di atas judul verdict yang sudah ada, satu baris ringkas menampilkan empat label yang telah diselesaikan:

Indonesia: `Adaptasi · Ketelitian · Disiplin · Problem Solving`

Inggris: `Adaptability · Accuracy · Discipline · Problem Solving`

Saat verdict masuk viewport, keempat label menyatu secara visual menuju kalimat yang sudah ada:

“Cepat memahami. Tertib menjalankan. Bertanggung jawab menyelesaikan.”

Ini menjadi payoff dari seluruh alur tanpa menambah paragraf penjelasan baru.

## Controlled Contrast: ritme per pekerjaan

Semua gerakan hanya memakai `transform`, `opacity`, warna, dan garis. Teks isi tidak bergerak selama dibaca.

### Indomaret — priority switch

- Aktivitas muncul cepat dari kiri ke kanan dalam urutan kerja.
- Jeda antarelemen: 55–70 ms.
- Elemen aktif bergeser maksimal 6 px dan kembali diam.
- Ritmenya terasa responsif, mencerminkan perpindahan prioritas di toko.

### BMC Motor — document organize

- Lima item masuk seperti dokumen yang disejajarkan ke satu sistem.
- Jeda antarelemen: 80–100 ms.
- Posisi awal maksimal 10 px dari bawah; item berhenti pada grid yang rapi.
- Garis grid menguat setelah seluruh item tersusun.

### PT Mitrametal Perkasa — standards lock

- Checklist aktif satu per satu dari atas ke bawah.
- Jeda antarelemen: 95–120 ms.
- Tanda centang dan garis item menguat bersamaan; tanpa efek memantul.
- Item terakhir mengunci status capability untuk memberi rasa proses selesai.

### Restu Computer — diagnostic path

- Nomor langkah aktif berurutan dari inspect ke action lalu retest.
- Jeda antarelemen: 110–140 ms.
- Garis penghubung mengisi satu arah dan berhenti setelah langkah terakhir.
- Tidak ada loop menyala terus-menerus.

### Batas motion global

- Transisi mikro: 180–320 ms.
- Penyelesaian satu rangkaian: maksimal 700 ms.
- Tidak ada animasi tak berujung selain perilaku lama yang memang sudah ada dan tetap dinonaktifkan pada reduced motion.
- Tidak ada zoom besar, rotasi konten, layout shift, scroll hijacking, atau audio.
- Hover/focus tidak menggeser elemen lebih dari 6 px.

## Implementasi teknis

### State dan data flow

- Array `jobs` memperoleh nilai `decision` yang menunjuk ke empat label kompetensi.
- Loop scroll yang sudah ada tetap menjadi satu-satunya sumber progress.
- Loop yang sama mengambil item `[data-decision-item]` dan menulis `data-decision-state="pending|active|proven"` berdasarkan indeks chapter dan fase aktif. Dengan demikian, perubahan status tidak membutuhkan state React atau listener tambahan.
- Untuk setiap chapter, loop menentukan `data-phase` seperti sekarang dan status keputusan berdasarkan indeks serta fase aktif.
- `activeWork` tetap menentukan chapter terdekat dengan pusat viewport.
- `CareerRoute` merender label, atribut `data-decision-item`, dan keadaan awal yang aman; loop scroll memperbarui `data-decision-state` langsung pada elemen tersebut.
- Tidak ada dependensi animasi baru dan tidak ada penyimpanan localStorage tambahan.

### Komponen

- `CareerRoute`: dipindahkan satu kali ke `decision-route-shell`, lalu ditingkatkan dari route aktif menjadi decision route dengan status belum terbuka/aktif/terbukti.
- `ProofChapter`: mempertahankan markup semantik dan menambahkan atribut motion yang stabil berdasarkan `proof`.
- `ProofFormat`: mempertahankan empat struktur list yang berbeda; CSS memberi ritme spesifik pada masing-masing format.
- `DecisionSummary`: komponen presentasional kecil di dalam final verdict untuk empat kompetensi. Komponen ini tidak interaktif dan tidak menduplikasi isi pengalaman.

### Styling

- Token warna yang ada menjadi satu-satunya sumber warna; tidak ada hex baru untuk UI.
- `transition-delay` dihitung melalui custom property `--item-index` pada item bukti.
- Status route memakai bentuk, teks, dan kontras; tidak hanya mengandalkan warna.
- Sticky route tidak boleh menutupi header, judul, atau controls.

## Responsif

### Desktop, minimal 768 px

- Decision route menggunakan posisi sticky yang ringkas di area pengalaman.
- Pertanyaan dan proof interface tetap mengikuti layout dua kolom sekarang.
- Controlled Contrast berjalan penuh sesuai pola tiap pekerjaan.

### Mobile, maksimal 767 px

- Tidak ada sticky route yang mengambil tinggi viewport.
- Route menjadi empat titik/label ringkas dalam document flow.
- Semua phase tetap terlihat dalam urutan normal seperti sekarang.
- Stagger dipersingkat dan perpindahan dikurangi agar membaca tetap utama.
- Tidak ada horizontal overflow; label panjang dapat membungkus maksimal dua baris.

## Aksesibilitas

- `career-route` tetap berupa ordered list dan memiliki label yang dapat dibaca screen reader.
- Status aktif dan terbukti tidak disampaikan melalui warna saja; teks status dapat disediakan secara visual atau melalui `sr-only`.
- `DecisionSummary` dibaca sebagai daftar empat kompetensi, bukan dekorasi.
- Ketika `prefers-reduced-motion: reduce` aktif, seluruh item langsung tampil pada posisi final, garis langsung terisi, dan tidak ada stagger.
- Struktur heading, daftar, fokus keyboard, skip link, serta pengumuman bahasa/tema tidak berubah.
- Tidak ada perubahan tab order atau target klik baru.

## Performa

- Menggunakan loop `requestAnimationFrame` yang sudah ada; tidak menambah event listener scroll kedua.
- Animasi memakai composited properties (`transform` dan `opacity`) serta perubahan garis/warna yang terbatas.
- Tidak memasang library animasi, canvas, video, WebGL, atau asset tambahan.
- Setiap chapter hanya memiliki satu rangkaian transisi yang berhenti setelah fase aktif.

## Pengujian

### Automated contracts

- Empat proof chapter tetap dirender tepat satu kali.
- Empat label keputusan tersedia dalam bahasa Indonesia dan Inggris.
- Setiap route item memiliki status keputusan yang valid.
- Empat format bukti mempertahankan kontrak unik: retail, admin, production, technical.
- `data-phase` dan `--chapter-progress` tetap berfungsi.
- Reduced-motion menampilkan seluruh bukti tanpa transform atau stagger.
- Tidak ada gambar, library animasi baru, CTA tambahan, atau perubahan palet.
- Mode terang dan gelap tetap menguasai seluruh section secara konsisten.

### Agent-preview QA

- Desktop dan mobile: scroll dari hero sampai verdict tanpa momentum visual terputus.
- Masing-masing chapter mudah dibedakan melalui ritme, bukan warna baru.
- Decision route memperlihatkan urutan belum terbuka, aktif, lalu terbukti.
- Scroll balik menghasilkan status yang konsisten dengan posisi halaman.
- Bahasa ID/EN tidak menyebabkan overflow.
- Mode terang/gelap tidak menimbulkan section dengan tema yang salah.
- Keyboard, focus ring, download CV, link kontak, dan capability tabs tetap bekerja.
- Tidak ada console error dan tidak ada layout shift yang terlihat.

## Kriteria penerimaan

Implementasi diterima jika:

1. tidak ada perubahan di luar batas yang dikunci;
2. empat chapter memiliki ritme motion berbeda yang dapat dikenali;
3. route yang sama menunjukkan progres empat kompetensi tanpa persentase;
4. final verdict terasa sebagai penyelesaian empat bukti;
5. mode terang/gelap, ID/EN, mobile, reduced-motion, dan keyboard tetap aman;
6. build dan seluruh tes proyek lulus;
7. hasil agent preview tidak memiliki overflow, console error, atau gangguan membaca.

## Non-goals

- Menjamin semua orang akan terus menggulir atau memberi angka “100% nagih”.
- Mengubah strategi konten, menambahkan pengalaman baru, atau membuat klaim pencapaian.
- Meniru Behance, Awwwards, Mobbin, atau Dribbble secara literal.
- Menambah elemen hanya untuk terlihat ramai.
- Mengubah warna lagi dalam tahap ini.
