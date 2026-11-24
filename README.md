# Rupa — Art Showcase Platform

Platform pameran karya seni digital dan kompetisi kurasi (*art challenge*), dibangun menggunakan Next.js (App Router), Tailwind CSS v4, dan PostgreSQL dengan Raw SQL (`pg`).

## Fitur Utama

- **Guest:** Menjelajahi galeri karya (pencarian berdasarkan judul/kreator/tag & filter kategori), melihat detail karya, portofolio kreator, serta daftar dan detail challenge.
- **Member (Kreator):** Unggah, edit metadata (file bersifat tetap), dan hapus karya; kelola profil publik & akun; like, favorit, komentar, dan laporkan karya (1 kali per karya); submit dan tarik (*withdraw*) 1 karya ke challenge yang sedang berlangsung.
- **Curator:** Mendaftar dengan status `pending` (menunggu persetujuan Admin); membuat, mengubah, dan menghapus challenge; melihat seluruh karya peserta; memilih maksimal 3 pemenang (Juara 1–3) setelah challenge berakhir.
- **Admin:** Melihat statistik agregasi platform; menyetujui atau menolak pendaftaran Curator; mengelola pengguna (hapus Member/Curator); CRUD kategori unik; moderasi laporan karya (*Dismiss* atau *Take Down*).

## Prasyarat

- Node.js 20+
- PostgreSQL 15+

## Cara Menjalankan Proyek

1. **Instal dependensi:**
   ```bash
   npm install