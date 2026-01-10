# 🚀 Tutorial Deploy ke Cloudflare Pages (Bahasa Indonesia)

## ⚠️ PENTING: Pilih PAGES, Bukan Workers!

Dari screenshot kamu, kamu masuk ke **Workers**. Ini salah!
Kamu harus pilih **Pages** karena ini website static + functions.

---

## Langkah 1: Masuk ke Cloudflare
1. Buka https://dash.cloudflare.com
2. Login dengan akun kamu

---

## Langkah 2: Buat Project Pages (BUKAN Workers!)

1. Di sidebar kiri, klik **"Workers & Pages"**
2. Klik tombol **"Create"** (biru)
3. **PILIH TAB "Pages"** ← PENTING!
4. Klik **"Connect to Git"**

---

## Langkah 3: Connect GitHub

1. Pilih **GitHub**
2. Authorize Cloudflare access ke GitHub kamu
3. Pilih repository **rezamubarock/rezamubarok**
4. Klik **"Begin setup"**

---

## Langkah 4: Configure Build Settings

Di halaman "Set up builds and deployments", isi:

| Field | Isi dengan |
|-------|------------|
| **Project name** | `rezamubarok` |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | **KOSONGKAN** (hapus semua) |
| **Build output directory** | `public` |

> ⚠️ **Build command HARUS KOSONG!** Jangan isi apapun.

Klik **"Save and Deploy"**

---

## Langkah 5: Tunggu Deploy Selesai

Cloudflare akan:
1. Clone repository
2. Detect folder `functions/`
3. Deploy static files dari `public/`
4. Deploy Functions API

Tunggu sampai status **"Success"** ✅

---

## Langkah 6: Setup KV Namespace (Untuk Fitur Admin Edit)

### 6a. Buat KV Namespace
1. Sidebar → **Workers & Pages** → **KV**
2. Klik **"Create a namespace"**
3. Nama: `REZAMUBAROK_KV`
4. Klik **"Add"**
5. **Salin Namespace ID** (akan dipakai nanti)

### 6b. Isi Data Awal ke KV
1. Klik namespace yang baru dibuat
2. Klik **"Add entry"**
3. Tambahkan 3 entry:

| Key | Value |
|-----|-------|
| `links` | (copy isi dari file `links.json`) |
| `settings` | (copy isi dari file `settings.json`) |
| `private-links` | (copy isi dari file `private-links.json`) |

---

## Langkah 7: Bind KV ke Project

1. Kembali ke **Workers & Pages**
2. Klik project **rezamubarok**
3. Tab **"Settings"**
4. Scroll ke **"Functions"** → **"KV namespace bindings"**
5. Klik **"Add binding"**
6. Isi:
   - Variable name: `SITE_KV`
   - KV namespace: pilih `REZAMUBAROK_KV`
7. Klik **"Save"**

---

## Langkah 8: Set Environment Variables (Password)

1. Masih di **Settings** → **"Environment variables"**
2. Klik **"Add variable"** untuk tiap item:

| Variable name | Value |
|---------------|-------|
| `JWT_SECRET` | (buat random string panjang, misal: `r4nd0mS3cr3tK3y123!@#`) |
| `MAIN_PASSWORD` | Password login utama kamu |
| `ADMIN_PASSWORD` | Password untuk admin panel |
| `PRIVATE_PASSWORD` | Password folder private |

3. Klik **"Save"**

---

## Langkah 9: Re-deploy

1. Tab **"Deployments"**
2. Klik **"Retry deployment"** pada deployment terakhir
3. Tunggu sampai selesai

---

## ✅ Selesai!

Website kamu sekarang live di:
- **Main site**: `https://rezamubarok.pages.dev`
- **Admin panel**: `https://rezamubarok.pages.dev/admin.html`
- **Game**: `https://rezamubarok.pages.dev/game/`

Kalau domain custom mau di-setup, bisa di **Settings → Custom domains**.

---

## 🆘 Troubleshooting

### Error: "It looks like you've run a Workers-specific command"
**Solusi**: Kamu salah pilih Workers. Hapus project, buat lagi dengan **Pages**.

### Build command required
**Solusi**: Hapus field deploy command, kosongkan. Atau pilih **Pages** bukan Workers.

### Functions tidak jalan
**Solusi**: Pastikan folder `functions/` ada di repository.
