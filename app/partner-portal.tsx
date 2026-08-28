"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import Image from "next/image";

type PartnerForm = {
  partner_type: string;
  legal_name: string;
  brand_name: string;
  entity_type: string;
  legal_document_number: string;
  legal_document_url: string;
  established_year: string;
  branch_count: string;
  employee_count: string;
  pic_name: string;
  pic_position: string;
  email: string;
  whatsapp: string;
  alternate_phone: string;
  digital_profile_url: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  service_coverage: string;
  services_offered: string;
  operation_hours: string;
  business_description: string;
  partnership_goal: string;
  expected_timeline: string;
  monthly_customer_volume: string;
  existing_software: string;
  referral_source: string;
  terms_accepted: boolean;
  data_consent: boolean;
  truth_declaration: boolean;
};

type FieldErrors = Record<string, string>;

const partnerCategories = [
  { value: "veterinary_clinic", label: "Klinik & RS Hewan", description: "Booking, medical record, POS, dan stok", icon: "plus" },
  { value: "independent_veterinarian", label: "Dokter Hewan", description: "Konsultasi online dan home visit", icon: "stethoscope" },
  { value: "pet_shop", label: "Pet Shop", description: "Marketplace, inventory, dan member", icon: "bag" },
  { value: "pet_grooming", label: "Grooming & Salon", description: "Booking, groomer, dan paket layanan", icon: "sparkle" },
  { value: "pet_hotel_daycare", label: "Pet Hotel & Daycare", description: "Kamar, reservasi, dan care log", icon: "home" },
  { value: "home_service", label: "Home Service", description: "Dispatch, driver, dan bukti layanan", icon: "route" },
  { value: "pet_academy_trainer", label: "Academy & Trainer", description: "Kelas, enrollment, dan progres", icon: "award" },
  { value: "pet_pharmacy", label: "Apotek Pet", description: "Produk kesehatan, stok, dan order", icon: "pill" },
  { value: "diagnostic_laboratory", label: "Laboratorium", description: "Lab order, hasil, dan rekam medis", icon: "lab" },
  { value: "shelter_rescue", label: "Shelter & Rescue", description: "Adopsi, moderasi, dan screening", icon: "heart" },
  { value: "pet_community", label: "Komunitas Pet", description: "Community, PetHub, dan campaign", icon: "users" },
  { value: "pet_event_organizer", label: "Pet Event", description: "Event, ticketing, dan analytics", icon: "calendar" },
  { value: "pet_friendly_venue", label: "Pet-Friendly Venue", description: "PetSpot, discovery, dan traffic", icon: "pin" },
  { value: "pet_insurance", label: "Asuransi Pet", description: "Proteksi dan partner offer", icon: "shield" },
  { value: "brand_manufacturer", label: "Brand & Produsen", description: "Commerce, campaign, dan insight", icon: "cube" },
  { value: "distributor_supplier", label: "Distributor & Supplier", description: "Supply, purchase order, dan coverage", icon: "truck" },
  { value: "logistics_pet_transport", label: "Logistik & Transport", description: "Delivery, pet travel, dan tracking", icon: "send" },
  { value: "government_association", label: "Instansi & Asosiasi", description: "Standar, edukasi, dan program", icon: "building" },
] as const;

const provinces = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Sumatera Selatan", "Kepulauan Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Jawa Barat", "Banten", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah",
  "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara", "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan", "Papua Barat Daya",
];

const initialForm: PartnerForm = {
  partner_type: "", legal_name: "", brand_name: "", entity_type: "", legal_document_number: "", legal_document_url: "",
  established_year: "", branch_count: "", employee_count: "", pic_name: "", pic_position: "", email: "", whatsapp: "",
  alternate_phone: "", digital_profile_url: "", address: "", province: "", city: "", district: "", postal_code: "",
  service_coverage: "", services_offered: "", operation_hours: "", business_description: "", partnership_goal: "",
  expected_timeline: "", monthly_customer_volume: "", existing_software: "", referral_source: "", terms_accepted: false,
  data_consent: false, truth_declaration: false,
};

const steps = ["Profil partner", "PIC & kontak", "Lokasi & operasi", "Kebutuhan", "Konfirmasi"];

export default function PartnerPortal() {
  const [form, setForm] = useState<PartnerForm>(initialForm);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const selectedCategory = useMemo(() => partnerCategories.find((item) => item.value === form.partner_type), [form.partner_type]);

  function update<K extends keyof PartnerForm>(name: K, value: PartnerForm[K]) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function scrollToForm() {
    document.getElementById("daftar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chooseCategory(value: string, continueToForm = false) {
    update("partner_type", value);
    if (continueToForm) scrollToForm();
  }

  function nextStep() {
    const stepErrors = validatePartnerForm(form, step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    setServerError("");
    scrollToForm();
  }

  function previousStep() {
    setStep((current) => Math.max(0, current - 1));
    setServerError("");
    scrollToForm();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const allErrors = Array.from({ length: steps.length }, (_, index) => validatePartnerForm(form, index)).reduce((result, item) => ({ ...result, ...item }), {});
    if (Object.keys(allErrors).length) {
      setErrors(allErrors);
      const firstStep = firstInvalidStep(allErrors);
      setStep(firstStep);
      setServerError("Masih ada data yang perlu dilengkapi. Periksa kolom bertanda merah.");
      scrollToForm();
      return;
    }
    setSubmitting(true);
    setServerError("");
    try {
      const response = await fetch("/api/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          established_year: Number(form.established_year),
          branch_count: Number(form.branch_count),
          employee_count: Number(form.employee_count),
          services_offered: form.services_offered.split(",").map((item) => item.trim()).filter(Boolean),
        }),
      });
      const result = await response.json() as { application_number?: string; message?: string; fields?: FieldErrors };
      if (!response.ok) {
        if (result.fields) setErrors(result.fields);
        throw new Error(result.message || "Pendaftaran belum dapat dikirim.");
      }
      setApplicationNumber(result.application_number || "PTR-SLIVADOC");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Pendaftaran belum dapat dikirim. Coba kembali beberapa saat lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setStep(0);
    setErrors({});
    setApplicationNumber("");
    setServerError("");
  }

  return (
    <main className="partner-page">
      <header className="partner-header">
        <a className="partner-logo" href="#beranda" aria-label="Slivadoc Partners">
          <span className="logo-mark"><PawMark /></span>
          <span>sliva<b>doc</b><small>partners</small></span>
        </a>
        <nav aria-label="Navigasi utama">
          <a href="#ekosistem">Siapa yang bisa bergabung</a>
          <a href="#manfaat">Manfaat</a>
          <a href="#proses">Cara bergabung</a>
        </nav>
        <button className="header-cta" onClick={scrollToForm}>Daftar jadi partner</button>
      </header>

      <section className="partner-hero" id="beranda">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-copy">
          <span className="hero-kicker"><i /> Partner ecosystem untuk pet care Indonesia</span>
          <h1>Bisnis pet care Anda layak <em>tumbuh lebih jauh.</em></h1>
          <p>Gabung ke ekosistem Slivadoc untuk ditemukan pet owner, mengelola operasional lebih rapi, dan membuka peluang kolaborasi baru—dalam satu platform yang terhubung.</p>
          <div className="hero-actions">
            <button className="button-primary" onClick={scrollToForm}>Mulai gratis sekarang <span>→</span></button>
            <a className="button-secondary" href="#ekosistem">Lihat kategori partner</a>
          </div>
          <div className="hero-proof">
            <span><b>18</b><small>Kategori partner</small></span>
            <span><b>38</b><small>Provinsi terjangkau</small></span>
            <span><b>Full gratis</b><small>Seluruh fitur partner</small></span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Kolaborasi partner pet care Slivadoc">
          <div className="hero-image-frame"><Image src="/partner-hero.png" alt="Profesional pet care Indonesia berkolaborasi bersama Slivadoc" width={1448} height={1086} priority unoptimized sizes="(max-width: 900px) 92vw, 46vw" /></div>
          <div className="floating-card card-discovery"><span><Icon name="pin" /></span><div><b>Lebih mudah ditemukan</b><small>Tampil di discovery Slivadoc</small></div></div>
          <div className="floating-card card-growth"><span><Icon name="trend" /></span><div><b>Growth ready</b><small>Data, campaign, operasional</small></div></div>
          <div className="floating-pill"><i /> Partner onboarding terbuka</div>
        </div>
      </section>

      <section className="brand-strip" aria-label="Nilai utama Slivadoc Partners">
        {["Satu ekosistem", "Operasional terhubung", "Jangkauan lebih luas", "Partner terverifikasi"].map((item) => <span key={item}><i>✓</i>{item}</span>)}
      </section>

      <section className="ecosystem-section" id="ekosistem">
        <div className="section-heading">
          <span className="section-label">Terbuka untuk seluruh ekosistem</span>
          <h2>Apa pun peran bisnis Anda,<br />ada ruang untuk <em>bertumbuh.</em></h2>
          <p>Semua penyedia layanan, profesional, organisasi, brand, dan pendukung ekosistem yang tampil di fitur Slivadoc dapat mendaftar. Pet owner tetap menggunakan aplikasi khusus Pet Owner.</p>
        </div>
        <div className="category-grid">
          {partnerCategories.map((item) => (
            <button className={form.partner_type === item.value ? "category-card selected" : "category-card"} key={item.value} onClick={() => chooseCategory(item.value, true)}>
              <span className="category-icon"><Icon name={item.icon} /></span>
              <span><b>{item.label}</b><small>{item.description}</small></span>
              <i className="category-arrow">→</i>
            </button>
          ))}
        </div>
      </section>

      <section className="benefit-section" id="manfaat">
        <div className="benefit-intro">
          <span className="section-label light">Kenapa bergabung</span>
          <h2>Bukan sekadar listing.<br /><em>Ini mesin pertumbuhan.</em></h2>
          <p>Slivadoc membantu partner dari saat pertama ditemukan hingga layanan selesai—tanpa memisahkan discovery, booking, transaksi, dan hubungan pelanggan.</p>
          <button className="button-white" onClick={scrollToForm}>Jadi bagian ekosistem <span>→</span></button>
        </div>
        <div className="benefit-grid">
          {[
            ["01", "Jangkauan yang relevan", "Hadir di titik pencarian pet owner saat mereka benar-benar membutuhkan layanan atau produk."],
            ["02", "Operasional lebih rapi", "Kelola booking, katalog, transaksi, stok, data layanan, dan follow-up dari workflow yang terhubung."],
            ["03", "Kepercayaan lebih kuat", "Profil, legalitas, layanan, dan standar partner direview agar pet owner lebih yakin memilih."],
            ["04", "Peluang kolaborasi", "Buka akses ke campaign, event, komunitas, distribusi, dan program lintas partner Slivadoc."],
          ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="process-section" id="proses">
        <div className="section-heading compact">
          <span className="section-label">Proses yang transparan</span>
          <h2>Dari daftar hingga <em>siap tumbuh.</em></h2>
        </div>
        <div className="process-line">
          {[
            ["01", "Lengkapi profil", "Pilih kategori dan isi identitas bisnis, PIC, layanan, serta area operasional."],
            ["02", "Review Operations", "Tim Slivadoc memeriksa kelengkapan, legalitas, relevansi, dan kesiapan partner."],
            ["03", "Onboarding", "Partner yang disetujui masuk tahap aktivasi workspace, katalog, dan layanan."],
            ["04", "Mulai terhubung", "Partner siap ditemukan, menerima peluang, dan bertumbuh bersama ekosistem."],
          ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="registration-section" id="daftar">
        <div className="registration-aside">
          <span className="section-label light">Partner application</span>
          <h2>Siap membuka peluang baru?</h2>
          <p>Lengkapi semua data agar tim Operations dapat menilai dan menghubungi Anda dengan konteks yang tepat.</p>
          <div className="aside-checklist">
            <span><i>✓</i><b>Semua data tersimpan aman</b><small>Hanya digunakan untuk proses partnership.</small></span>
            <span><i>✓</i><b>Review langsung oleh Operations</b><small>Status masuk ke antrean dashboard Slivadoc.</small></span>
            <span><i>✓</i><b>Seluruh akses partner full gratis</b><small>Tanpa biaya pendaftaran, onboarding, fitur, atau langganan.</small></span>
          </div>
          <div className="aside-support"><Icon name="chat" /><span><small>Butuh bantuan?</small><b>support@slivadoc.com</b></span></div>
        </div>
        <div className="registration-card">
          {applicationNumber ? (
            <div className="success-state" role="status">
              <span className="success-icon">✓</span>
              <small>Pendaftaran berhasil diterima</small>
              <h2>Selamat datang di langkah pertama pertumbuhan baru.</h2>
              <p>Tim Operations Slivadoc akan meninjau data Anda. Simpan nomor aplikasi berikut untuk referensi.</p>
              <strong>{applicationNumber}</strong>
              <div><button className="button-primary" onClick={resetForm}>Daftarkan partner lain</button><a className="button-secondary" href="#beranda">Kembali ke atas</a></div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="form-heading">
                <div><small>Langkah {step + 1} dari {steps.length}</small><h3>{steps[step]}</h3></div>
                <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="form-progress"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
              <ol className="form-steps" aria-label="Tahapan pendaftaran">
                {steps.map((item, index) => <li className={index === step ? "active" : index < step ? "done" : ""} key={item}><button type="button" onClick={() => index < step && setStep(index)}><span>{index < step ? "✓" : index + 1}</span><small>{item}</small></button></li>)}
              </ol>
              {serverError && <div className="form-alert" role="alert"><span>!</span>{serverError}</div>}

              {step === 0 && <div className="form-panel">
                <SelectField label="Kategori partner" name="partner_type" value={form.partner_type} onChange={(value) => update("partner_type", value)} error={errors.partner_type} options={partnerCategories.map((item) => ({ value: item.value, label: item.label }))} />
                {selectedCategory && <div className="selected-partner"><span><Icon name={selectedCategory.icon} /></span><div><b>{selectedCategory.label}</b><small>{selectedCategory.description}</small></div></div>}
                <div className="field-grid two"><TextField label="Nama legal badan/usaha" name="legal_name" value={form.legal_name} onChange={(value) => update("legal_name", value)} error={errors.legal_name} placeholder="Contoh: PT Sahabat Satwa Indonesia" /><TextField label="Nama brand/publik" name="brand_name" value={form.brand_name} onChange={(value) => update("brand_name", value)} error={errors.brand_name} placeholder="Contoh: Sahabat Satwa" /></div>
                <div className="field-grid two"><SelectField label="Bentuk usaha/organisasi" name="entity_type" value={form.entity_type} onChange={(value) => update("entity_type", value)} error={errors.entity_type} options={[{value:"pt",label:"PT"},{value:"cv",label:"CV"},{value:"koperasi",label:"Koperasi"},{value:"yayasan",label:"Yayasan"},{value:"klinik_pribadi",label:"Klinik/praktik pribadi"},{value:"profesional_individu",label:"Profesional individu"},{value:"komunitas",label:"Komunitas"},{value:"instansi",label:"Instansi/asosiasi"},{value:"other",label:"Lainnya"}]} /><TextField label="Tahun berdiri" name="established_year" type="number" value={form.established_year} onChange={(value) => update("established_year", value)} error={errors.established_year} placeholder="2024" /></div>
                <TextField label="Nomor legalitas/registrasi" name="legal_document_number" value={form.legal_document_number} onChange={(value) => update("legal_document_number", value)} error={errors.legal_document_number} placeholder="NIB, SIP, akta, atau nomor registrasi organisasi" />
                <TextField label="Tautan dokumen legalitas" name="legal_document_url" type="url" value={form.legal_document_url} onChange={(value) => update("legal_document_url", value)} error={errors.legal_document_url} placeholder="https://drive.google.com/... (pastikan dapat dilihat)" hint="Gunakan tautan berizin lihat; jangan cantumkan password." />
              </div>}

              {step === 1 && <div className="form-panel">
                <div className="field-grid two"><TextField label="Nama lengkap PIC" name="pic_name" value={form.pic_name} onChange={(value) => update("pic_name", value)} error={errors.pic_name} placeholder="Nama penanggung jawab" /><TextField label="Jabatan PIC" name="pic_position" value={form.pic_position} onChange={(value) => update("pic_position", value)} error={errors.pic_position} placeholder="Owner / Business Development" /></div>
                <TextField label="Email bisnis" name="email" type="email" value={form.email} onChange={(value) => update("email", value)} error={errors.email} placeholder="partner@bisnis.com" />
                <div className="field-grid two"><TextField label="Nomor WhatsApp aktif" name="whatsapp" type="tel" value={form.whatsapp} onChange={(value) => update("whatsapp", value)} error={errors.whatsapp} placeholder="081234567890" /><TextField label="Nomor kontak alternatif" name="alternate_phone" type="tel" value={form.alternate_phone} onChange={(value) => update("alternate_phone", value)} error={errors.alternate_phone} placeholder="081112223333" /></div>
                <TextField label="Website atau profil bisnis" name="digital_profile_url" type="url" value={form.digital_profile_url} onChange={(value) => update("digital_profile_url", value)} error={errors.digital_profile_url} placeholder="https://instagram.com/brand atau website resmi" />
              </div>}

              {step === 2 && <div className="form-panel">
                <TextAreaField label="Alamat operasional lengkap" name="address" value={form.address} onChange={(value) => update("address", value)} error={errors.address} placeholder="Nama jalan, nomor, gedung, RT/RW, dan kelurahan" />
                <div className="field-grid two"><SelectField label="Provinsi" name="province" value={form.province} onChange={(value) => update("province", value)} error={errors.province} options={provinces.map((item) => ({value:item,label:item}))} /><TextField label="Kabupaten/kota" name="city" value={form.city} onChange={(value) => update("city", value)} error={errors.city} placeholder="Jakarta Selatan" /></div>
                <div className="field-grid two"><TextField label="Kecamatan" name="district" value={form.district} onChange={(value) => update("district", value)} error={errors.district} placeholder="Kebayoran Baru" /><TextField label="Kode pos" name="postal_code" inputMode="numeric" maxLength={5} value={form.postal_code} onChange={(value) => update("postal_code", value.replace(/\D/g, ""))} error={errors.postal_code} placeholder="12120" /></div>
                <div className="field-grid two"><TextField label="Jumlah lokasi/cabang" name="branch_count" type="number" value={form.branch_count} onChange={(value) => update("branch_count", value)} error={errors.branch_count} placeholder="1" /><TextField label="Jumlah anggota tim" name="employee_count" type="number" value={form.employee_count} onChange={(value) => update("employee_count", value)} error={errors.employee_count} placeholder="5" /></div>
                <TextField label="Area cakupan layanan" name="service_coverage" value={form.service_coverage} onChange={(value) => update("service_coverage", value)} error={errors.service_coverage} placeholder="Contoh: Jabodetabek / seluruh Indonesia" />
                <TextField label="Jam operasional" name="operation_hours" value={form.operation_hours} onChange={(value) => update("operation_hours", value)} error={errors.operation_hours} placeholder="Senin–Minggu, 08.00–21.00" />
              </div>}

              {step === 3 && <div className="form-panel">
                <TextField label="Layanan/produk utama" name="services_offered" value={form.services_offered} onChange={(value) => update("services_offered", value)} error={errors.services_offered} placeholder="Konsultasi, vaksinasi, grooming (pisahkan dengan koma)" />
                <TextAreaField label="Ceritakan bisnis atau organisasi Anda" name="business_description" value={form.business_description} onChange={(value) => update("business_description", value)} error={errors.business_description} placeholder="Jelaskan fokus, pelanggan, keunggulan, dan layanan utama (minimal 30 karakter)." maxLength={2000} />
                <TextAreaField label="Apa tujuan bergabung dengan Slivadoc?" name="partnership_goal" value={form.partnership_goal} onChange={(value) => update("partnership_goal", value)} error={errors.partnership_goal} placeholder="Jelaskan target, kendala, dan bentuk kolaborasi yang Anda harapkan (minimal 30 karakter)." maxLength={2000} />
                <div className="field-grid two"><SelectField label="Target mulai" name="expected_timeline" value={form.expected_timeline} onChange={(value) => update("expected_timeline", value)} error={errors.expected_timeline} options={[{value:"secepatnya",label:"Secepatnya"},{value:"dalam_30_hari",label:"Dalam 30 hari"},{value:"1_3_bulan",label:"1–3 bulan"},{value:"3_6_bulan",label:"3–6 bulan"},{value:"eksplorasi",label:"Masih eksplorasi"}]} /><SelectField label="Customer/order per bulan" name="monthly_customer_volume" value={form.monthly_customer_volume} onChange={(value) => update("monthly_customer_volume", value)} error={errors.monthly_customer_volume} options={[{value:"prelaunch",label:"Belum beroperasi"},{value:"1-50",label:"1–50"},{value:"51-200",label:"51–200"},{value:"201-500",label:"201–500"},{value:"501-2000",label:"501–2.000"},{value:"2000+",label:"> 2.000"}]} /></div>
                <div className="field-grid two"><TextField label="Sistem yang digunakan saat ini" name="existing_software" value={form.existing_software} onChange={(value) => update("existing_software", value)} error={errors.existing_software} placeholder="Belum ada / spreadsheet / POS lain" /><SelectField label="Mengetahui Slivadoc dari" name="referral_source" value={form.referral_source} onChange={(value) => update("referral_source", value)} error={errors.referral_source} options={["Instagram","TikTok","Google","Teman/partner","Event","Tim Slivadoc","Media lain"].map((item)=>({value:item,label:item}))} /></div>
              </div>}

              {step === 4 && <div className="form-panel confirmation-panel">
                <div className="confirmation-summary"><span><Icon name={selectedCategory?.icon || "paw"} /></span><div><small>Kategori terpilih</small><b>{selectedCategory?.label || "Belum dipilih"}</b><p>{form.brand_name || "Nama partner"} · {form.city || "Lokasi"}</p></div></div>
                <h4>Konfirmasi & persetujuan</h4>
                <CheckField checked={form.terms_accepted} onChange={(value) => update("terms_accepted", value)} error={errors.terms_accepted} label="Saya menyetujui syarat pendaftaran dan proses kemitraan Slivadoc." />
                <CheckField checked={form.data_consent} onChange={(value) => update("data_consent", value)} error={errors.data_consent} label="Saya menyetujui pemrosesan data untuk verifikasi, komunikasi, dan onboarding partner." />
                <CheckField checked={form.truth_declaration} onChange={(value) => update("truth_declaration", value)} error={errors.truth_declaration} label="Saya menyatakan seluruh data dan dokumen yang dikirim benar serta dapat dipertanggungjawabkan." />
                <div className="privacy-note"><Icon name="lock" /><span><b>Data Anda tidak dipublikasikan otomatis.</b><small>Tim Operations akan melakukan review sebelum profil partner atau layanan diaktifkan.</small></span></div>
              </div>}

              <div className="form-navigation">
                {step > 0 ? <button className="button-back" type="button" onClick={previousStep}>← Kembali</button> : <span />}
                {step < steps.length - 1 ? <button className="button-primary" type="button" onClick={nextStep}>Lanjutkan <span>→</span></button> : <button className="button-primary submit-button" type="submit" disabled={submitting}>{submitting ? <><i className="spinner" /> Mengirim data…</> : <>Kirim pendaftaran <span>→</span></>}</button>}
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading compact"><span className="section-label">Pertanyaan umum</span><h2>Sebelum Anda <em>bergabung.</em></h2></div>
        <div className="faq-list">
          {[
            ["Apakah mendaftar sebagai partner Slivadoc berbayar?", "Tidak. Semua partner terdaftar mendapatkan akses full gratis: pendaftaran, onboarding, seluruh fitur, dan kolaborasi tanpa biaya langganan."],
            ["Siapa saja yang dapat mendaftar?", "Seluruh penyedia layanan, profesional, organisasi, brand, venue, instansi, dan pendukung ekosistem pet care dapat mendaftar. Pet owner menggunakan aplikasi khusus Pet Owner."],
            ["Apa yang terjadi setelah formulir dikirim?", "Data masuk langsung ke dashboard Operations Slivadoc untuk diperiksa. Tim dapat memulai review, meminta informasi tambahan, menyetujui, atau menolak pengajuan."],
            ["Apakah profil langsung tampil di Slivadoc?", "Tidak. Aktivasi dilakukan setelah verifikasi dan onboarding agar informasi layanan, standar, area, serta operasional partner tersusun dengan benar."],
          ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="closing-cta"><span><PawMark /></span><div><small>Satu langkah untuk peluang yang lebih besar</small><h2>Mari tumbuh bersama Slivadoc.</h2></div><button className="button-white" onClick={scrollToForm}>Daftar jadi partner <span>→</span></button></section>

      <footer className="partner-footer">
        <a className="partner-logo footer-logo" href="#beranda"><span className="logo-mark"><PawMark /></span><span>sliva<b>doc</b><small>partners</small></span></a>
        <p>Ekosistem pet care Indonesia yang menghubungkan layanan, operasional, komunitas, dan pertumbuhan.</p>
        <div><a href="mailto:support@slivadoc.com">support@slivadoc.com</a><span>+62 819-7738-8341</span></div>
        <small>© {new Date().getFullYear()} PT Sliva Technology Indonesia</small>
      </footer>
    </main>
  );
}

function validatePartnerForm(form: PartnerForm, step: number): FieldErrors {
  const errors: FieldErrors = {};
  const required = (name: keyof PartnerForm, label: string, min = 1) => {
    const value = form[name];
    if (typeof value !== "string" || value.trim().length < min) errors[name] = `${label} wajib diisi${min > 1 ? ` minimal ${min} karakter` : ""}.`;
  };
  const validURL = (value: string) => {
    try { const parsed = new URL(value); return parsed.protocol === "https:" || parsed.protocol === "http:"; } catch { return false; }
  };
  const validPhone = (value: string) => /^(?:\+62|62|0)8[0-9\s().-]{7,16}$/.test(value.trim());
  if (step === 0) {
    required("partner_type", "Kategori partner"); required("legal_name", "Nama legal", 3); required("brand_name", "Nama brand", 2); required("entity_type", "Bentuk usaha"); required("legal_document_number", "Nomor legalitas", 3);
    if (!validURL(form.legal_document_url)) errors.legal_document_url = "Gunakan tautan dokumen dengan format http:// atau https://.";
    const year = Number(form.established_year); if (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear()) errors.established_year = `Masukkan tahun antara 1900–${new Date().getFullYear()}.`;
  }
  if (step === 1) {
    required("pic_name", "Nama PIC", 3); required("pic_position", "Jabatan PIC", 2);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Masukkan alamat email bisnis yang valid.";
    if (!validPhone(form.whatsapp)) errors.whatsapp = "Masukkan nomor WhatsApp Indonesia yang valid.";
    if (!validPhone(form.alternate_phone)) errors.alternate_phone = "Masukkan nomor alternatif Indonesia yang valid.";
    if (!validURL(form.digital_profile_url)) errors.digital_profile_url = "Gunakan URL website atau profil bisnis yang valid.";
  }
  if (step === 2) {
    required("address", "Alamat operasional", 10); required("province", "Provinsi"); required("city", "Kabupaten/kota", 3); required("district", "Kecamatan", 3); required("service_coverage", "Cakupan layanan", 3); required("operation_hours", "Jam operasional", 5);
    if (!/^\d{5}$/.test(form.postal_code)) errors.postal_code = "Kode pos wajib terdiri dari 5 digit.";
    if (Number(form.branch_count) < 1) errors.branch_count = "Jumlah lokasi minimal 1.";
    if (Number(form.employee_count) < 1) errors.employee_count = "Jumlah anggota tim minimal 1.";
  }
  if (step === 3) {
    required("services_offered", "Layanan/produk utama", 2); required("business_description", "Deskripsi bisnis", 30); required("partnership_goal", "Tujuan partnership", 30); required("expected_timeline", "Target mulai"); required("monthly_customer_volume", "Volume customer"); required("existing_software", "Sistem saat ini", 2); required("referral_source", "Sumber informasi");
  }
  if (step === 4) {
    if (!form.terms_accepted) errors.terms_accepted = "Persetujuan syarat pendaftaran wajib diberikan.";
    if (!form.data_consent) errors.data_consent = "Persetujuan pemrosesan data wajib diberikan.";
    if (!form.truth_declaration) errors.truth_declaration = "Pernyataan kebenaran data wajib diberikan.";
  }
  return errors;
}

function firstInvalidStep(errors: FieldErrors) {
  const groups = [
    ["partner_type","legal_name","brand_name","entity_type","legal_document_number","legal_document_url","established_year"],
    ["pic_name","pic_position","email","whatsapp","alternate_phone","digital_profile_url"],
    ["address","province","city","district","postal_code","branch_count","employee_count","service_coverage","operation_hours"],
    ["services_offered","business_description","partnership_goal","expected_timeline","monthly_customer_volume","existing_software","referral_source"],
    ["terms_accepted","data_consent","truth_declaration"],
  ];
  const index = groups.findIndex((group) => group.some((field) => errors[field]));
  return index >= 0 ? index : 0;
}

function TextField({ label, name, value, onChange, error, placeholder, type = "text", hint, inputMode, maxLength }: { label:string; name:string; value:string; onChange:(value:string)=>void; error?:string; placeholder:string; type?:string; hint?:string; inputMode?:"text"|"numeric"|"tel"|"email"|"url"; maxLength?:number }) {
  return <label className={error ? "form-field invalid" : "form-field"}><span>{label}<b>*</b></span><input name={name} type={type} value={value} onChange={(event)=>onChange(event.target.value)} placeholder={placeholder} inputMode={inputMode || (type === "tel" ? "tel" : type === "email" ? "email" : type === "url" ? "url" : undefined)} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} required />{hint && !error && <small>{hint}</small>}{error && <small id={`${name}-error`} className="field-error">{error}</small>}</label>;
}

function TextAreaField({ label, name, value, onChange, error, placeholder, maxLength = 1000 }: { label:string; name:string; value:string; onChange:(value:string)=>void; error?:string; placeholder:string; maxLength?:number }) {
  return <label className={error ? "form-field invalid" : "form-field"}><span>{label}<b>*</b></span><textarea name={name} value={value} onChange={(event)=>onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} aria-invalid={Boolean(error)} required /> <small className={error ? "field-error field-counter" : "field-counter"}>{error || `${value.length}/${maxLength}`}</small></label>;
}

function SelectField({ label, name, value, onChange, error, options }: { label:string; name:string; value:string; onChange:(value:string)=>void; error?:string; options:Array<{value:string;label:string}> }) {
  return <label className={error ? "form-field invalid" : "form-field"}><span>{label}<b>*</b></span><select name={name} value={value} onChange={(event)=>onChange(event.target.value)} aria-invalid={Boolean(error)} required><option value="" disabled>Pilih {label.toLowerCase()}</option>{options.map((option)=><option key={option.value} value={option.value}>{option.label}</option>)}</select>{error && <small className="field-error">{error}</small>}</label>;
}

function CheckField({ checked, onChange, error, label }: { checked:boolean; onChange:(value:boolean)=>void; error?:string; label:string }) {
  return <label className={error ? "check-field invalid" : "check-field"}><input type="checkbox" checked={checked} onChange={(event)=>onChange(event.target.checked)} /><span><b>{label}</b>{error && <small>{error}</small>}</span></label>;
}

function PawMark() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 18.5c-5.9 0-11.7 5.3-11.7 10.7 0 4 3.4 6.3 7 5.1 1.7-.6 3.2-1 4.7-1s3 .4 4.7 1c3.6 1.2 7-1.1 7-5.1 0-5.4-5.8-10.7-11.7-10.7Z"/><ellipse cx="9.3" cy="15" rx="4.2" ry="5.4" transform="rotate(-27 9.3 15)"/><ellipse cx="30.7" cy="15" rx="4.2" ry="5.4" transform="rotate(27 30.7 15)"/><ellipse cx="17" cy="9" rx="4.1" ry="5.4" transform="rotate(-8 17 9)"/><ellipse cx="25" cy="9" rx="4.1" ry="5.4" transform="rotate(8 25 9)"/></svg>;
}

function Icon({ name }: { name:string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<string, ReactNode> = {
    plus:<><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></>, stethoscope:<><path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v2a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="10.5" r="2"/></>, bag:<><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></>, sparkle:<><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>, home:<><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>, route:<><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M8.5 16.5 15.5 7.5"/></>, award:<><circle cx="12" cy="8" r="5"/><path d="m8.5 12-1 9 4.5-2 4.5 2-1-9"/></>, pill:<><path d="M8.5 19.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7l-7 7Z"/><path d="m5 9 7 7"/></>, lab:<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/></>, heart:<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>, users:<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></>, calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>, pin:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>, shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>, cube:<><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/></>, truck:<><path d="M3 5h11v11H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>, send:<><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>, building:<><path d="M3 21h18M6 21V7l6-4 6 4v14M9 10h.01M9 14h.01M15 10h.01M15 14h.01M10 21v-3h4v3"/></>, trend:<><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></>, chat:<><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/></>, lock:<><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>, paw:<><circle cx="12" cy="14" r="4"/><circle cx="6" cy="9" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/></>,
  };
  return <svg {...common}>{paths[name] || paths.paw}</svg>;
}
