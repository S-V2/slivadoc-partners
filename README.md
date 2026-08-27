# Slivadoc Partners

Portal akuisisi partner untuk seluruh ekosistem pet care Slivadoc selain Pet Owner. Pengajuan tervalidasi dikirim ke backend Slivadoc dan langsung tersedia dalam antrean review Operations.

## Fitur

- landing page sky-blue dengan 18 kategori partner
- formulir pendaftaran wajib lima tahap dengan validasi client dan server
- penyimpanan pengajuan melalui API backend Slivadoc
- nomor aplikasi dan penanganan duplikasi pengajuan
- responsive desktop dan mobile

## Menjalankan aplikasi

```bash
npm ci
npm run dev
```

Salin `.env.example` menjadi `.env.local`, lalu arahkan `SLIVADOC_API_URL` ke backend Slivadoc. Variabel ini hanya dibaca server oleh route proxy; browser tidak mengakses URL backend secara langsung.

## Quality gate

```bash
npm run lint
npm test
```
