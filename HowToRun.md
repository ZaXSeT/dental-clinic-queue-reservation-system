# AntriReservasi - Dental Clinic Booking System

Aplikasi pemesanan klinik gigi ini terdiri dari gabungan (monorepo logic) tiga buah sistem yang terpisah:
1. **Public Portal (Main/client)**: Halaman utama pasien untuk melakukan booking jadwal online.
2. **Admin/Staff Portal (Second/client)**: Dashboard khusus bagi staf klinik untuk mengantur antrean (queue), melihat pasien walk-in, tagihan kasir, dll.
3. **Backend Server (Second/server)**: NestJS server & Prisma DB yang menjadi pusat seluruh data.

Semuanya telah dikonfigurasi untuk berjalan secara bersamaan dengan sekali perintah menggunakan `concurrently`.

## 🚀 Cara Menjalankan Website (via CMD / Terminal)

Untuk menyalakan semua bagian aplikasi secara otomatis, cukup copy-paste 1 baris perintah (command) di bawah ini ke dalam Command Prompt (CMD) Anda dan tekan **Enter**:

```cmd
cd /d "c:\Antigravity Projects\AntriReservasiKlinikGigi\Second" && npm run dev
```

**Penjelasan proses:**
1. Anda masuk ke CMD (Pencarian Windows -> ketik `cmd` -> Enter).
2. Copy baris kode di atas lalu Paste ke CMD.
3. Tunggu beberapa saat sampai muncul log berwarna. Jika muncul tulisan `Application is running on: http://[::1]:3003` dan hijau `Ready in...`, berarti server sukses menyala.

## 🚀 Cara Menjalankan Website Secara Terpisah (Individual)

Jika Anda sedang memperbaiki satu bagian tertentu dan hanya ingin menyalakan bagian tersebut secara manual, Anda perlu membuka terminal (CMD) baru untuk masing-masing bagian:

### 1. Menjalankan Backend Server Saja
Server NestJS ini Wajib dijalankan lebih dulu karena menyimpan koneksi Database (Prisma).
```cmd
cd /d "c:\Antigravity Projects\AntriReservasiKlinikGigi\Second\server" && npm run start:dev
```
*(Server berjalan di port 3003)*

### 2. Menjalankan Public Portal (Halaman Pasien) Saja
Aplikasi web untuk halaman depan utama.
```cmd
cd /d "c:\Antigravity Projects\AntriReservasiKlinikGigi\Main\client" && npm run dev
```
*(Aplikasi berjalan di port 3000)*

### 3. Menjalankan Admin/Staff Portal Saja
Aplikasi Dashboard staf klinik.
```cmd
cd /d "c:\Antigravity Projects\AntriReservasiKlinikGigi\Second\client" && npm run dev
```
*(Dashboard berjalan di port 3001)*

---

## 🌐 Alamat Akses Website (Port)

Website berjalan pada masing-masing alamat dan *port* lokal yang berbeda:

*   **Public Portal (Pasien)**: [http://localhost:3000](http://localhost:3000)
    Gunakan alamat ini untuk mengetes UI Utama, Registrasi, Login Pasien, dan Booking Jadwal Dokter.

*   **Staff/Admin Portal**: [http://localhost:3001/staff/login](http://localhost:3001/staff/login)
    Gunakan alamat ini untuk mengakses menu manajemen Queue, Doctors, Dashboard, dan Settings Kasir.

*   **Backend Server Log**: `http://localhost:3003` (Hanya berjalan di latar belakang untuk API).

## Menghentikan Server
Jika Anda ingin mematikan semua website, cukup klik `Ctrl + C` (atau `Cmd + C` di Mac) pada terminal yang sedang berjalan. Masing-masing public portal, admin portal, dan backend API akan langsung otomatis berhenti secara serentak.

## Troubleshooting
Bila Anda menemukan error seperti *EADDRINUSE (Port sudah terpakai)*:
Pastikan tidak ada aplikasi NextJS atau node lain yang berjalan secara diam-diam. Anda dapat menghentikannya dari Task Manager atau mematikan terminal bawaan pada VSCode lalu mengulang kembali perintah `npm run dev`.
