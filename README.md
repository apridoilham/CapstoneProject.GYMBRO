### README.md

# Health & Food Analysis Website (Next.js)

## Deskripsi Proyek

Situs web berbasis Next.js dengan fitur analisis kesehatan dan makanan.

-   **Halaman**: Home, About, Blog, Login, Register, Profile, dan halaman Fitur.
-   **Fitur Utama**:
    -   AI Food Analyzer
    -   AI Chatbot
    -   Rekomendasi Latihan & Peralatan
-   **Fitur Tambahan**:
    -   BMI & TDEE Calculator

-   **Tumpukan Teknologi**: Next.js (Fullstack), MongoDB, Cloudinary, Tailwind CSS.
-   **Deployment**: Vercel.

---

## Panduan Setup

### 1. Prasyarat
- Node.js (v18 atau lebih baru)
- npm atau yarn
- Git

### 2. Clone Repositori
```bash
git clone https://github.com/apridoilham/CapstoneProject.GYMBRO.git
cd CapstoneProject.GYMBRO
```

### 3. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan.
```bash
npm install
```

### 4. Konfigurasi Variabel Lingkungan
Buat file bernama `.env` di direktori root dan isi dengan format berikut:
```env
# .env

# Koneksi ke MongoDB Atlas
MONGO_DB_CONNECTION="your_mongodb_connection_string"

# Kunci rahasia untuk otentikasi JWT
JWT_SECRET="your_strong_and_secret_jwt_key"

# Kredensial dari akun Cloudinary Anda
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_API="your_cloudinary_api_key"
CLOUDINARY_KEY="your_cloudinary_api_secret"

# URL dasar aplikasi (untuk development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Jalankan Aplikasi
Gunakan perintah berikut untuk memulai server development.
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

### 6. Akses API
Endpoint API internal dapat diakses melalui `http://localhost:3000/api`. Untuk detail lengkap, lihat file `endpoint.md`.