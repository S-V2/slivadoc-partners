# Slivadoc Partners

Portal akuisisi partner untuk seluruh ekosistem pet care Slivadoc selain Pet Owner. Pengajuan tervalidasi dikirim ke backend Slivadoc dan langsung tersedia dalam antrean review Operations.

## Fitur

- landing page sky-blue dengan 18 kategori partner
- formulir pendaftaran wajib lima tahap dengan validasi client dan server
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
