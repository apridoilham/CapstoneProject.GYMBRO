# Health & Food Analysis Website (Next.js)

## Project Description
A Next.js-based website with health and food analysis features including:
- **Pages:** Home, About, Inside, Login, Register, Profile
- **Tools:** 
  - BMI Calculator (ML-validated algorithm)
  - Calorie Calculator
- **Food Analyzer:** Using Hugging Face API
- **Chatbot:** Integrated with `tinyllama-1.1b` model
- **Tech Stack:** Next.js (Fullstack), MongoDB, Cloudinary
- **Deployment:** Vercel

---

## Setup Guide

### 1. Prerequisites
- Node.js ≥ v18
- npm ≥ v9 or yarn
- Git
- MongoDB Atlas account
- Cloudinary account
- Hugging Face account (for API access)

### 2. Clone Repository
```bash
git clone https://github.com/username/repo.git
cd project-directory
```

### 3. Siapkan 1 MongoDB Cloud, lalu set up ke file `.env`-nya seperti link akses
- MONGODB_URI = your_link

### 4. Siapkan akun pada library Cloudinary, lalu set up kembali file `.env`
- CLOUDINARY_NAME=your_cloud_name
- CLOUDINARY_KEY=123456789012345
- CLOUDINARY_SECRET=your_api_secret

### 5. Untuk menjalankan bisa ketik `npm run dev`

### 6. Akses API bisa mengakses `baseurl/api`