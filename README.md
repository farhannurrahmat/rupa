# RUPA. — Art Showcase Platform

**RUPA.** adalah platform pameran karya seni digital multi-peran yang menghubungkan kreator, kurator, dan penikmat seni dalam satu ruang kuratorial. Dibangun dengan antarmuka *dark mode* (**Obsidian & Brass**), platform ini menyediakan etalase untuk karya fotografi, ilustrasi, UI/UX, dan eksplorasi visual hingga penyelenggaraan kompetisi (*challenge*) komunitas.

---

## Fitur Utama & Hak Akses Peran

Platform ini membagi akses ke dalam **4 peran pengguna**:

### 1. Public User (Guest)
- Menjelajahi beranda (etalase **Karya Populer** & **Karya Terbaru**), katalog galeri (`/artworks`), direktori & profil kreator (`/creators`, `/creators/[id]`), serta daftar dan detail challenge (`/challenges`, `/challenges/[id]`).
- Mencari karya berdasarkan judul atau nama kreator serta memfilter karya berdasarkan kategori.
- Akses bersifat baca saja (*read-only*); diarahkan untuk masuk/mendaftar saat ingin berinteraksi.

### 2. Member (Kreator)
- **Manajemen Karya (CRUD):** Mengunggah karya baru (judul, deskripsi, kategori, file media, dan minimal 1 tag), memperbarui metadata karya (tanpa mengganti file media), serta menghapus karya milik sendiri.
- **Interaksi Komunitas:** Memberi/membatalkan *like*, menyimpan karya ke daftar *favorites*, menambahkan dan menghapus komentar milik sendiri, serta melaporkan (*report*) karya yang melanggar aturan (maksimal 1 laporan per karya).
- **Partisipasi Challenge:** Mendaftarkan maksimal 1 karya ke challenge yang sedang berlangsung (*Submit Work*) dan menarik kembali submisi (*Withdraw*) sebelum batas waktu challenge berakhir.
- **Manajemen Profil & Akun:** Mengelola informasi publik (foto profil, nama tampilan, bio, tautan eksternal) serta informasi privat (email dan kata sandi).

### 3. Curator
- Mendaftar sebagai penyelenggara event/lomba dengan status awal **Pending** hingga disetujui oleh Admin (jika ditolak, Curator dapat menghapus akunnya melalui halaman *Pending Curator*).
- **Manajemen Challenge (CRUD):** Membuat, mengubah, dan menghapus challenge (judul, deskripsi, aturan, hadiah, tanggal mulai/selesai, dan banner).
- **Kurasi & Pemilihan Pemenang:** Meninjau seluruh karya yang masuk ke challenge miliknya dan menentukan maksimal **3 pemenang** (Juara 1, 2, dan 3) setelah tanggal selesai challenge terlewati.
- Menjelajahi galeri publik dalam mode baca saja (tidak dapat mengunggah karya maupun melakukan interaksi sosial).

### 4. Admin
- **Statistik Platform:** Melihat ringkasan agregasi total pengguna per peran, total karya, jumlah laporan tertunda, dan jumlah challenge aktif.
- **Verifikasi Curator:** Meninjau pendaftaran Curator baru dengan status *Pending* dan mengubahnya menjadi *Approved* atau *Rejected*.
- **Manajemen Pengguna:** Melihat seluruh akun dengan filter peran (`Admin`, `Member`, `Curator`) serta menghapus akun Member dan Curator.
- **Manajemen Kategori (CRUD):** Menambah, mengubah, dan menghapus kategori karya dengan validasi nama unik.
- **Moderasi Konten:** Meninjau antrian laporan karya dari Member beserta alasan dan jumlah laporan, lalu mengambil tindakan **Dismiss Report** atau **Take Down** (menghapus karya).

---

## Teknologi yang Digunakan

- **Framework:** Next.js (App Router & Server Actions)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Autentikasi:** Session-based Authentication & Role-Based Access Control (RBAC)

---

## Cara Menjalankan Proyek

### 1. Clone Repositori & Install Dependencies
```bash
git clone <url-repositori-github-kamu>
cd <nama-folder-proyek>
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`, lalu sesuaikan kredensial koneksi PostgreSQL kamu:
```bash
cp .env.example .env
```

### 3. Buat Database & Jalankan Skema + Data Awal (PostgreSQL / pgAdmin)
Repositori ini sudah menyertakan struktur tabel (`schema.sql`), data awal kategori beserta 24 karya demo (`seed.sql`), dan seluruh file gambarnya di folder `public/uploads/artworks/`.

**Cara A — Menggunakan pgAdmin (GUI):**
1. Buka **pgAdmin**, klik kanan pada **Databases** → **Create** → **Database...**, beri nama `rupa`, lalu klik **Save**.
2. Klik kanan pada database `rupa` → pilih **Query Tool**.
3. Klik ikon folder (**Open File**), pilih `schema.sql`, lalu tekan **Execute / F5** untuk membuat seluruh tabel.
4. Ulangi langkah yang sama: buka file `seed.sql`, lalu tekan **Execute / F5** untuk mengisi kategori, akun demo, dan 24 karya awal.

**Cara B — Menggunakan Terminal (`psql`):**
```bash
psql -U postgres -c "CREATE DATABASE rupa;"
psql -U postgres -d rupa -f schema.sql
psql -U postgres -d rupa -f seed.sql
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka **`http://localhost:3000`** di browser.

---

## Akun Demo

Gunakan akun berikut untuk menguji alur masing-masing peran (atau daftar akun **Member** / **Curator** baru melalui halaman `/register`):

| Peran | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rupa.com` | `Admin12345` | Akun pengelola utama & verifikasi Curator |
| **Member** | `mfarhannrt@gmail.com` | `<isi-password-member>` | Kreator (6 karya fotografi) |
| **Member** | `han@gmail.com` | `<isi-password-member>` | Kreator (6 karya fotografi) |
| **Member** | `member3@gmail.com` | `<isi-password-member>` | Kreator (5 karya fotografi) |
| **Member** | `member4@gmail.com` | `<isi-password-member>` | Kreator (7 karya ilustrasi) |

---

## Struktur Direktori Utama

```text
public/
└── uploads/artworks/ # Aset gambar karya demo yang terhubung dengan seed.sql
src/
├── actions/          # Server Actions & validasi backend (auth, artworks, challenges, admin)
├── app/
│   ├── (auth)/       # Halaman Login & Register
│   ├── (public)/     # Beranda, Katalog Karya, Detail Karya, Kreator, & Challenge
│   ├── admin/        # Dashboard Admin (Statistik, Verifikasi Curator, Pengguna, Kategori, Moderasi)
│   ├── curator/      # Dashboard Curator & halaman Pending/Rejected Curator
│   └── member/       # Dashboard Member (Karya Saya, Favorit, Submisi, Profil & Akun)
├── components/       # Komponen UI modular (artwork, challenge, admin, home, layout, ui)
└── lib/              # Koneksi PostgreSQL, autentikasi/sesi, dan query data
schema.sql            # Skema struktur tabel PostgreSQL
seed.sql              # Data awal kategori, akun demo, dan 24 karya
```