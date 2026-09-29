# Slivadoc Partners

Portal akuisisi partner untuk seluruh ekosistem pet care Slivadoc selain Pet Owner. Pengajuan tervalidasi dikirim ke backend Slivadoc dan langsung tersedia dalam antrean review Operations.

## Fitur

- landing page sky-blue dengan 18 kategori partner
- 18 halaman kemitraan `/kemitraan/<kategori>` dengan formulir lima tahap yang sudah terikat pada kategori masing-masing; kartu pada landing page langsung membuka halaman yang sesuai
- halaman khusus `/pet-trainer` untuk trainer individu: keahlian, pengalaman, metode, jadwal, dan portofolio
- penyimpanan pengajuan melalui API backend Slivadoc
- nomor aplikasi dan penanganan duplikasi pengajuan
- Google Analytics 4 untuk page view, funnel formulir, dan konversi partner
- Consent Mode dengan analytics opt-in serta penyimpanan iklan selalu dinonaktifkan
- responsive desktop dan mobile

## Menjalankan aplikasi

```bash
npm ci
npm run dev
```

Salin `.env.example` menjadi `.env.local`, lalu arahkan `SLIVADOC_API_URL` ke backend Slivadoc. Variabel ini hanya dibaca server oleh route proxy; browser tidak mengakses URL backend secara langsung.

Pendaftaran trainer dikirim melalui `/api/pet-trainer-applications` ke backend `POST /api/v1/public/pet-trainer-applications`. Jalankan migrasi backend terbaru terlebih dahulu agar tabel `pet_trainer_applications` tersedia. Setelah terkirim, data berstatus `submitted` dan dapat dibaca serta direview oleh Operations melalui endpoint internal `/api/v1/internal/operations/pet-trainer-applications`. Persetujuan pengajuan belum otomatis membuat akun trainer; aktivasi dilakukan pada onboarding.

Form kemitraan kategori mengirim `partner_type` sesuai URL serta jawaban khusus kategori sebagai `category_details` melalui `/api/partner-applications`. Pertanyaan dan label disesuaikan dengan jenis mitra; tautan dokumen pendukung, profil publik, kontak alternatif, dan software saat ini opsional. Jawaban tersimpan dalam kolom JSONB dan tersedia untuk Operations melalui API serta ringkasan email. Pet Trainer individu muncul langsung pada daftar kategori dan tetap memakai formulir khusus `/pet-trainer` melalui endpoint pendaftaran trainer.
URL lama `/pet-trainer/<jenis-pet>` dialihkan permanen ke `/pet-trainer` agar tautan yang sempat dibagikan tidak berakhir 404.

## SEO kemitraan

- Delapan belas halaman kategori dirender sebagai HTML statis, memiliki judul, deskripsi, canonical, Open Graph, konten yang spesifik, breadcrumb terstruktur, dan tautan dari daftar kategori pada beranda.
- `sitemap.xml` memuat semua halaman kategori dan halaman trainer. URL kategori yang tidak dikenal menghasilkan 404.
- `seo/partnership-keywords.csv` berisi **1.000 ide frasa unik** yang dipetakan ke target URL dan intent. Jalankan `node seo/generate-keyword-map.mjs` untuk regenerasi. Daftar ini adalah rencana editorial, tanpa klaim volume pencarian atau jaminan peringkat.
- Frasa tersebut tidak dimasukkan massal ke `meta keywords` karena Google Search mengabaikan tag tersebut. Tambahkan konten baru hanya jika benar-benar membantu calon partner; hindari membuat halaman duplikat per variasi kata kunci atau kota.

`NEXT_PUBLIC_GA_MEASUREMENT_ID` menggunakan Web Stream resmi Slivadoc (`G-1HBZTWHBPN`). Nilai ini dapat diganti per environment bila Slivadoc membuat stream terpisah di kemudian hari. Event analitik tidak memuat nama, email, nomor WhatsApp, dokumen, alamat, atau isi formulir partner.

## Deployment — self-hosted di VM Slivadoc

Aplikasi ini dilayani dari VM Slivadoc di belakang Caddy, bukan dari Vercel.
`partners.slivadoc.com` adalah A record ke `43.156.238.31` (DNS-only) dan Caddy
meneruskan seluruh host ke container `slivadoc-partners:3000`.

1. Merge ke `main`. `.github/workflows/publish.yml` menjalankan lint dan test,
   membangun image sekali, membootnya, lalu mem-push **byte yang sama** ke
   `ghcr.io/s-v2/slivadoc-partners` dengan dua tag: `latest` dan commit sha
   40 karakter.
2. Ambil digest dari ringkasan workflow, lalu pin di `.env` VM:
   `PARTNERS_REF=@sha256:...`. Stack menolak tag `latest` secara sengaja —
   lihat `slivadoc-infrastructure` README §11.
3. `docker compose pull slivadoc-partners && docker compose up -d slivadoc-partners`.

`SLIVADOC_API_URL` **tidak** perlu diisi manual: `compose.yaml` menurunkannya
dari `${DOMAIN_API}`, sehingga hostname API tidak pernah menjadi literal dan
perpindahan domain berikutnya cukup satu edit `.env`. Bila variabel ini kosong,
`app/partner-application-proxy.mjs` jatuh ke default produksinya — dan default
yang menunjuk host mati membuat setiap pengajuan partner 502 sementara formulir
tetap terlihat sehat. Itu yang terjadi pada 2026-09-03.

Runtime Node.js dikunci ke versi 22 (`engines.node`) agar deployment tidak
otomatis berpindah ke major version berikutnya. `Dockerfile` mengikuti pin itu;
jangan naikkan salah satunya tanpa yang lain.

### Catatan riwayat

Commit `f249a39` ("Make partners app Vercel-native") menghapus `Dockerfile`,
`.dockerignore`, dan workflow publish pada 2026-08-30. DNS tetap mengarah ke VM,
sehingga situs publik membeku di image 2026-08-30 selama 15 commit — termasuk
perbaikan crash formulir, dukungan multibahasa, perluasan SEO, aset brand, dan
default proxy `api.slivadoc.com` — tanpa satu pun kegagalan yang terlihat.
Build container dipulihkan pada 2026-09-03.

## Quality gate

```bash
npm run lint
npm test
npm run build
```
