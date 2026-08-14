# Authentic Work Visuals — Design Specification

## Goal

Meningkatkan daya tarik scroll portofolio Bayu Andika dengan dokumentasi lingkungan kerja yang autentik, ringkas, dan bergerak secara terarah tanpa membuat halaman terasa penuh atau menyesatkan HRD.

## Audience and success criteria

- HRD memahami konteks empat pengalaman kerja dalam sekali scroll.
- Khalayak umum mendapat variasi visual dan momentum baru di setiap bab.
- Hanya satu visual yang dominan pada satu waktu; tidak ada galeri, carousel bertumpuk, atau deretan kartu foto.
- Semua visual berasal dari dokumentasi pribadi Bayu atau kanal resmi tempat kerja, bukan gambar generatif.
- Foto dokumentasi pribadi boleh menyebut Bayu sedang bekerja; foto kanal resmi hanya menjelaskan lingkungan kerja.

## Visual sources

| Bab | Visual terpilih | Sumber dan alasan |
| --- | --- | --- |
| Indomaret | Bayu menata produk di chiller, kemudian foto tim di depan toko | Dokumentasi pribadi Bayu: `IMG_1499.heif` dan `quality_restoration_20251115185527295.jpg`. Memperlihatkan kerja langsung, merchandising, dan konteks tim toko. Foto tim diputar 90° berlawanan arah jarum jam agar orientasinya benar. |
| BMC Motor | Counter pelanggan dan suku cadang | Situs resmi jaringan Bengkel Motor Center: `https://bengkelmotorcenter.com/`. Lokasi yang diberikan Bayu mengarah ke Berkah Jaya Motor, Jl. Arimbi, dan sumber resmi BMC mencantumkan Berkah Jaya Motor sebagai cabang/jaringan. Visual relevan dengan administrasi, pelanggan, dan informasi suku cadang. |
| PT Mitrametal Perkasa | Briefing produksi, kemudian foto tim di depan mesin stamping | Dokumentasi pribadi Bayu: `IMG-20240406-WA0014.jpg` dan `IMG-20240406-WA0010.jpg`. Watermark kamera Samsung di sudut kiri bawah dibersihkan secara lokal tanpa mengubah orang, seragam, mesin, pencahayaan, atau komposisi lain. |
| Restu Computer | Laptop yang sedang dibongkar untuk servis | Reel resmi Restu Computer: `https://www.instagram.com/reel/DF7pGPuvdhF/`. Memperlihatkan pekerjaan teknis perangkat secara langsung. |

Dokumentasi pribadi memakai caption Indonesia “Dokumentasi pribadi · Saat bekerja” dan Inggris “Personal documentation · At work”. Foto kanal resmi memakai caption Indonesia “Dokumentasi lingkungan kerja · Sumber resmi” dan Inggris “Work-environment documentation · Official source”. Foto santai `IMG_2520.heif` dan duplikat pose tim `IMG-20240406-WA0007.jpg` tidak digunakan karena tidak menambah bukti kompetensi atau momentum baru.

## Composition

Bagian pengalaman tetap menggunakan alur vertikal yang sudah ada. Di desktop, kolom kiri tetap sticky untuk judul dan jalur karier. Pada kolom kanan, setiap `ProofChapter` mendapatkan satu viewport `LivingProofFrame` setelah ringkasan dan sebelum format bukti. Indomaret dan Mitrametal memiliki dua lapisan foto di viewport yang sama: foto aksi/briefing tampil lebih dulu, lalu foto tim menggantikannya melalui vertical wipe setelah progres bab melewati 52%. BMC dan Restu memiliki satu lapisan. Tidak ada dua foto yang terlihat sekaligus. Visual berukuran maksimal sekitar 420–520 px tinggi dan tidak menambah panjang halaman ketika frame berganti.

Pada ponsel, visual tidak menjadi full-screen. Tinggi dibatasi sekitar 240–320 px dan tetap berada di dalam bab terkait. Tidak ada scroll horizontal wajib.

## Art direction and filtering

Semua file foto disimpan lokal agar tidak bergantung pada tautan sementara. Pembersihan watermark dibatasi pada area sudut kiri bawah dua foto Mitrametal. Hasil edit harus dibandingkan dengan sumber dan ditolak bila wajah, tubuh, seragam, mesin, lantai, pencahayaan, atau komposisi di luar area watermark berubah. Seluruh aset produksi dikonversi ke WebP tanpa metadata EXIF/GPS. Penyatuan tema dilakukan lewat CSS:

- `filter: saturate(.58) contrast(1.08) sepia(.08)` sebagai basis;
- lapisan cream transparan pada mode terang;
- lapisan warm-black transparan pada mode gelap;
- aksen coral tipis pada border, nomor, dan progress line;
- grain procedural berbasis CSS dengan opacity sangat rendah;
- `object-position` ditentukan per foto untuk menjaga fokus utama.

Hover atau fokus mengurangi filter sedikit sehingga warna asli foto muncul sebagai reward kecil. Foto tetap terbaca dan tidak berubah menjadi monokrom penuh.

## Motion and momentum

- Saat bab memasuki area aktif, visual melakukan reveal seperti shutter dengan kombinasi clip-path vertikal, scale `1.035 → 1`, dan opacity `0 → 1` selama 600–760 ms.
- Pada Indomaret dan Mitrametal, foto kedua melakukan vertical wipe di viewport yang sama ketika progres bab melewati 52%. Progress kembali ke foto pertama ketika pengguna scroll ke atas.
- Saat pengguna terus scroll di dalam bab, gambar bergerak maksimal 18 px secara vertikal untuk parallax ringan.
- Nomor bab dan caption masuk 80–120 ms setelah gambar untuk menciptakan urutan perhatian.
- Bab nonaktif tidak menghilang; opacity minimum tetap 0.62 sesuai kontrak saat ini.
- `prefers-reduced-motion: reduce` mematikan clip, parallax, dan transition; foto langsung tampil penuh.
- Tidak ada autoplay video, WebGL, smooth-scroll library, atau dependency animasi baru.

## Component boundaries

- `app/work-visuals.js`: data visual, sumber, alt text bilingual, object position, rasio, dan tipe dokumentasi.
- `app/page.tsx`: komponen `LivingProofFrame` serta sinkronisasi progress aktif dan pergantian frame dengan bab.
- `app/globals.css`: layout, filter, overlay, grain, reveal, parallax, responsive, dan reduced motion.
- `public/work/`: enam aset WebP tanpa metadata; dua Indomaret, satu BMC, dua Mitrametal, dan satu Restu.
- `tests/source-contracts.test.mjs`: kontrak sumber, jumlah visual, local asset paths, dan caption.
- `tests/rendered-html.test.mjs`: empat visual, alt text, tautan sumber, dan tidak adanya galeri/carousel.

## Accessibility and performance

- Foto pribadi memakai alt text faktual yang menyebut Bayu hanya ketika keberadaannya diketahui. Foto kanal resmi menjelaskan lingkungan tanpa mengklaim identitas orang.
- Kredit kanal resmi merupakan link keyboard-focusable dan membuka tab baru dengan `noopener noreferrer`; dokumentasi pribadi memakai label teks dan tidak menautkan file sumber.
- Aset dikompresi ke WebP/AVIF bila tooling yang sudah ada mendukung, dengan JPEG/PNG terpilih sebagai fallback yang dapat dibangun oleh Sites.
- `loading="lazy"` dan `decoding="async"` digunakan untuk semua visual pengalaman.
- Layout memiliki aspect ratio tetap agar tidak terjadi cumulative layout shift.
- Total aset target maksimum 1.2 MB; tidak ada video yang diunduh atau diputar.

## Non-goals

- Tidak menambahkan foto profil Bayu.
- Tidak membuat proyek, pencapaian, angka, atau testimoni palsu.
- Tidak memakai foto stok generik sebagai pengganti sumber pekerjaan.
- Tidak menampilkan lebih dari satu foto secara bersamaan dalam satu pengalaman.
- Tidak mengubah identitas cream, coral, warm black, tipografi, bahasa, atau tema terang/gelap yang sudah disetujui.

## Verification

- Test kontrak harus gagal sebelum data visual dan komponen dibuat, lalu lulus setelah implementasi.
- Build, seluruh test, dan lint harus lulus.
- Agent preview diuji pada desktop dan mobile: scroll aktif, filter terang/gelap, pergantian ID/ENG, keyboard focus, dan reduced motion.
- Checkpoint deployment harus berstatus `succeeded` sebelum URL live dibagikan.
