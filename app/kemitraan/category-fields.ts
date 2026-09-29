import type { PartnershipCategory } from "../partnership-categories";

export type CategoryField = {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "number" | "textarea";
  hint?: string;
};

// Every question here is shown only on its own category page. The API stores
// answers in category_details so Operations receives the actual answers.
export const categoryFields: Record<PartnershipCategory["value"], readonly CategoryField[]> = {
  veterinary_clinic: [
    { key: "clinical_services", label: "Layanan klinis utama", placeholder: "Konsultasi, vaksinasi, bedah, rawat inap" },
    { key: "veterinarians_count", label: "Jumlah dokter hewan yang praktik", placeholder: "3", type: "number" },
    { key: "facility_capacity", label: "Fasilitas dan kapasitas klinik", placeholder: "Ruang periksa, ruang operasi, kandang rawat inap", type: "textarea" },
  ],
  independent_veterinarian: [
    { key: "qualification", label: "Pendidikan dan pengalaman klinis", placeholder: "Gelar, bidang praktik, dan lama pengalaman" },
    { key: "consultation_modes", label: "Metode konsultasi yang tersedia", placeholder: "Online, praktik, home visit" },
    { key: "species_handled", label: "Jenis hewan yang ditangani", placeholder: "Anjing, kucing, kelinci" },
  ],
  pet_shop: [
    { key: "product_categories", label: "Kategori produk utama", placeholder: "Makanan, aksesori, mainan, perawatan" },
    { key: "sales_channels", label: "Kanal penjualan saat ini", placeholder: "Toko fisik, marketplace, WhatsApp" },
    { key: "inventory_size", label: "Perkiraan jumlah produk/SKU", placeholder: "250", type: "number" },
  ],
  pet_grooming: [
    { key: "grooming_packages", label: "Paket grooming yang ditawarkan", placeholder: "Basic bath, full grooming, potong kuku" },
    { key: "groomers_count", label: "Jumlah groomer aktif", placeholder: "2", type: "number" },
    { key: "daily_capacity", label: "Kapasitas pet per hari", placeholder: "10", type: "number" },
  ],
  pet_hotel_daycare: [
    { key: "room_capacity", label: "Kapasitas penitipan inap", placeholder: "20 pet", type: "text" },
    { key: "daycare_capacity", label: "Kapasitas daycare per hari", placeholder: "12 pet", type: "text" },
    { key: "care_requirements", label: "Syarat kesehatan dan perawatan pet", placeholder: "Vaksin, obat rutin, makanan khusus, pemeriksaan sebelum check-in", type: "textarea" },
  ],
  home_service: [
    { key: "visit_services", label: "Jenis layanan kunjungan", placeholder: "Grooming rumah, perawatan, konsultasi" },
    { key: "operating_radius_km", label: "Radius layanan dari lokasi utama (km)", placeholder: "15", type: "number" },
    { key: "field_team_size", label: "Jumlah petugas lapangan", placeholder: "4", type: "number" },
  ],
  pet_academy_trainer: [
    { key: "training_programs", label: "Program pelatihan atau kelas", placeholder: "Obedience dasar, sosialisasi, kelas puppy" },
    { key: "class_capacity", label: "Kapasitas peserta per kelas", placeholder: "8", type: "number" },
    { key: "trainer_count", label: "Jumlah pengajar/trainer", placeholder: "3", type: "number" },
  ],
  pet_pharmacy: [
    { key: "health_product_categories", label: "Kategori produk kesehatan", placeholder: "Obat, suplemen, produk perawatan" },
    { key: "pharmacy_license", label: "Izin penjualan/penyaluran yang relevan", placeholder: "Jenis izin dan nomor izin yang berlaku" },
    { key: "prescription_handling", label: "Alur penanganan produk dengan resep", placeholder: "Siapa yang memverifikasi resep dan bagaimana pemenuhannya", type: "textarea" },
  ],
  diagnostic_laboratory: [
    { key: "test_types", label: "Jenis pemeriksaan tersedia", placeholder: "Hematologi, kimia darah, parasitologi" },
    { key: "sample_pickup", label: "Cara penerimaan atau penjemputan sampel", placeholder: "Di laboratorium, kurir, penjemputan terjadwal" },
    { key: "turnaround_time", label: "Perkiraan waktu hasil", placeholder: "Contoh: 1–2 hari kerja" },
  ],
  shelter_rescue: [
    { key: "animals_in_care", label: "Jumlah hewan dalam perawatan saat ini", placeholder: "25", type: "number" },
    { key: "adoption_process", label: "Proses screening dan adopsi", placeholder: "Tahapan pemeriksaan calon adopter dan tindak lanjut", type: "textarea" },
    { key: "rescue_area", label: "Wilayah kegiatan rescue", placeholder: "Jakarta, Bogor, Depok" },
  ],
  pet_community: [
    { key: "member_count", label: "Jumlah anggota komunitas", placeholder: "500", type: "number" },
    { key: "community_focus", label: "Fokus komunitas", placeholder: "Pendidikan, adopsi, ras tertentu, kegiatan lokal" },
    { key: "activity_frequency", label: "Frekuensi kegiatan", placeholder: "Pertemuan bulanan dan edukasi mingguan" },
  ],
  pet_event_organizer: [
    { key: "event_types", label: "Jenis acara yang diselenggarakan", placeholder: "Pameran, lomba, seminar, bazar" },
    { key: "event_capacity", label: "Perkiraan kapasitas peserta", placeholder: "300", type: "number" },
    { key: "event_schedule", label: "Rencana acara terdekat", placeholder: "Bulan, kota, dan konsep acara", type: "textarea" },
  ],
  pet_friendly_venue: [
    { key: "venue_type", label: "Jenis tempat", placeholder: "Kafe, restoran, hotel, taman" },
    { key: "pet_policy", label: "Aturan kunjungan membawa pet", placeholder: "Area yang diizinkan, tali, ukuran pet, vaksin", type: "textarea" },
    { key: "pet_facilities", label: "Fasilitas untuk pet", placeholder: "Area bermain, air minum, tempat istirahat" },
  ],
  pet_insurance: [
    { key: "product_type", label: "Jenis produk perlindungan", placeholder: "Kesehatan, kecelakaan, tanggung jawab pihak ketiga" },
    { key: "coverage_summary", label: "Ringkasan cakupan dan pengecualian", placeholder: "Manfaat, batas nilai, masa tunggu, pengecualian utama", type: "textarea" },
    { key: "licensing_authority", label: "Otoritas dan nomor izin produk/perusahaan", placeholder: "Nama otoritas dan nomor izin" },
  ],
  brand_manufacturer: [
    { key: "product_lines", label: "Lini dan kategori produk", placeholder: "Makanan kering, sampo, aksesori" },
    { key: "production_capacity", label: "Kapasitas pasokan per bulan", placeholder: "Contoh: 10.000 unit" },
    { key: "distribution_channels", label: "Kanal distribusi yang berjalan", placeholder: "Distributor, petshop, marketplace" },
  ],
  distributor_supplier: [
    { key: "supply_categories", label: "Kategori barang yang dipasok", placeholder: "Makanan, obat, perlengkapan" },
    { key: "delivery_regions", label: "Wilayah distribusi", placeholder: "Jawa dan Bali" },
    { key: "minimum_order", label: "Ketentuan minimal pemesanan", placeholder: "MOQ atau nilai minimum dan waktu pemenuhan" },
  ],
  logistics_pet_transport: [
    { key: "service_type", label: "Jenis layanan transportasi", placeholder: "Pengiriman produk, pet travel, antar jemput pet" },
    { key: "fleet_capacity", label: "Armada dan kapasitas layanan", placeholder: "Jenis kendaraan dan jumlah perjalanan per hari" },
    { key: "animal_safety_protocol", label: "Prosedur keselamatan saat membawa pet", placeholder: "Kandang, ventilasi, pendamping, kontak darurat", type: "textarea" },
  ],
  government_association: [
    { key: "organization_mandate", label: "Mandat atau bidang kerja organisasi", placeholder: "Profesi veteriner, kesejahteraan hewan, edukasi" },
    { key: "member_scope", label: "Cakupan anggota atau wilayah kerja", placeholder: "Nasional, provinsi, atau jumlah anggota" },
    { key: "collaboration_program", label: "Program kerja sama yang diusulkan", placeholder: "Tujuan, penerima manfaat, dan bentuk kegiatan", type: "textarea" },
  ],
};
