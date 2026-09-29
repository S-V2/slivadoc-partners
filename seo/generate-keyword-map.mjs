import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Editorial ideas only. No search-volume claims and no mass publication of pages.
const terms = {
  "klinik-hewan": ["klinik hewan", "rumah sakit hewan", "pet clinic", "klinik veteriner", "layanan klinis hewan"],
  "dokter-hewan": ["dokter hewan independen", "praktik dokter hewan", "dokter hewan mandiri", "dokter hewan online", "dokter hewan home visit"],
  petshop: ["petshop", "pet shop", "toko hewan", "toko perlengkapan hewan", "toko makanan hewan"],
  "grooming-hewan": ["grooming hewan", "salon hewan", "pet grooming", "salon anjing kucing", "jasa grooming pet"],
  "pet-hotel-daycare": ["pet hotel", "hotel hewan", "daycare hewan", "penitipan anjing kucing", "penitipan pet"],
  "home-service-hewan": ["home service hewan", "pet care ke rumah", "layanan hewan ke rumah", "perawatan pet di rumah", "jasa kunjungan pet"],
  "pet-academy": ["pet academy", "sekolah anjing", "akademi pelatihan hewan", "kelas edukasi pet", "lembaga training hewan"],
  "apotek-hewan": ["apotek hewan", "pet pharmacy", "toko obat hewan", "apotek pet", "penyedia produk kesehatan hewan"],
  "laboratorium-hewan": ["laboratorium hewan", "lab veteriner", "laboratorium diagnostik hewan", "lab pemeriksaan pet", "layanan uji kesehatan hewan"],
  "shelter-rescue": ["shelter hewan", "rescue hewan", "organisasi penyelamatan hewan", "yayasan adopsi hewan", "rumah singgah hewan"],
  "komunitas-pet": ["komunitas pet", "komunitas pecinta hewan", "perkumpulan pemilik hewan", "komunitas anjing kucing", "organisasi komunitas hewan"],
  "event-pet": ["event pet", "acara hewan peliharaan", "penyelenggara event hewan", "pet expo", "festival hewan"],
  "tempat-pet-friendly": ["tempat pet friendly", "kafe pet friendly", "restoran ramah hewan", "venue ramah pet", "penginapan pet friendly"],
  "asuransi-hewan": ["asuransi hewan", "asuransi pet", "perlindungan hewan peliharaan", "penyedia asuransi pet", "produk asuransi hewan"],
  "brand-produk-hewan": ["brand produk hewan", "merek makanan hewan", "produsen produk pet", "pabrikan perlengkapan hewan", "brand pet care"],
  "distributor-supplier": ["distributor produk hewan", "supplier petshop", "pemasok produk pet", "distributor makanan hewan", "grosir perlengkapan hewan"],
  "logistik-pet": ["logistik pet", "pengiriman produk hewan", "transportasi hewan", "pet travel", "kurir produk pet"],
  "instansi-asosiasi": ["asosiasi hewan", "instansi kesejahteraan hewan", "organisasi profesi veteriner", "lembaga edukasi pet", "asosiasi pet care"],
};

const patterns = [
  ["daftar mitra %s Slivadoc", "daftar"],
  ["pendaftaran kemitraan %s", "daftar"],
  ["gabung partner %s", "daftar"],
  ["cara daftar partner %s", "panduan"],
  ["kerja sama %s dengan Slivadoc", "kolaborasi"],
  ["program mitra %s Indonesia", "kolaborasi"],
  ["menjadi mitra %s Slivadoc", "daftar"],
  ["formulir pendaftaran %s", "daftar"],
  ["syarat kemitraan %s", "panduan"],
  ["pengajuan partner %s", "daftar"],
  ["kolaborasi %s Slivadoc", "kolaborasi"],
];

const general = [
  "daftar kemitraan Slivadoc", "gabung partner Slivadoc", "pendaftaran mitra Slivadoc",
  "cara menjadi partner Slivadoc", "formulir partnership Slivadoc", "syarat kemitraan Slivadoc",
  "kemitraan bisnis hewan Indonesia", "kerja sama ekosistem pet care",
  "daftar partner pet care gratis", "pendaftaran partnership pet care",
];

const rows = [["keyword", "category", "intent", "target_url", "status"]];
for (const keyword of general) rows.push([keyword, "umum", "daftar", "https://partners.slivadoc.com/", "ide editorial"]);
for (const [slug, aliases] of Object.entries(terms)) {
  for (const alias of aliases) {
    for (const [pattern, intent] of patterns) {
      rows.push([pattern.replace("%s", alias), slug, intent, `https://partners.slivadoc.com/kemitraan/${slug}`, "ide editorial"]);
    }
  }
}

const keywords = rows.slice(1).map(([keyword]) => keyword.toLowerCase());
if (rows.length !== 1001 || new Set(keywords).size !== 1000) throw new Error("Peta keyword harus berisi tepat 1.000 frasa unik.");
const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n") + "\n";
const directory = fileURLToPath(new URL(".", import.meta.url));
await mkdir(directory, { recursive: true });
await writeFile(fileURLToPath(new URL("partnership-keywords.csv", import.meta.url)), csv);
