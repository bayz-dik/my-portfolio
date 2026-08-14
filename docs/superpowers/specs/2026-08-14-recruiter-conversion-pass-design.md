# Recruiter Conversion Pass

## Evidence

Audit desktop 1363×936 menemukan tiga hambatan yang dapat diukur:

- halaman mencapai 13 viewport dan CTA kontak baru muncul sekitar 11,5 viewport dari atas;
- header hanya memiliki satu link kembali ke atas, sehingga tidak ada jalur kontak cepat selama recruiter melakukan scan;
- decision route menunjukkan progres, tetapi empat labelnya belum dapat dipakai untuk langsung membuka bukti yang relevan.

Tidak ditemukan horizontal overflow. Dark/light mode, empat status keputusan, dan final verdict sudah bekerja.

## Pendekatan

1. Menambah animasi baru: ditolak karena tidak memperbaiki jarak menuju keputusan.
2. Memotong copy pengalaman: ditolak karena mengurangi bukti dan mengubah isi yang sudah disetujui.
3. Mempercepat navigasi, ritme, dan akses kontak: dipilih karena menyelesaikan hambatan tanpa menambah section atau mengubah fakta.

## Perubahan yang dikunci

- Ubah empat item decision route menjadi anchor menuju chapter terkait.
- Tambahkan CTA kontak ringkas pada header menggunakan copy `verdict.action` yang sudah ada; tampil setelah header compact.
- Kurangi tinggi desktop setiap proof chapter dari `175svh` menjadi `150svh`, sehingga keseluruhan alur menghemat sekitar satu viewport pada layar audit.
- Tambahkan `scroll-margin-top` pada chapter agar tujuan anchor tidak tertutup header.
- Pertahankan mobile dalam normal document flow, seluruh copy utama, palet, CTA lama, section, dan motion yang sudah ada.

## Accessibility dan QA

- Decision route menjadi `nav` berlabel dan setiap target chapter memiliki `id` stabil.
- Header CTA memiliki target minimal 44 px dan focus style yang sudah ada.
- Anchor navigation, light/dark, ID/EN, scroll state, mobile overflow, keyboard, tes, dan lint harus lulus sebelum publish.
