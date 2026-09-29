"use client";

import { FormEvent, KeyboardEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "../analytics";
import type { PartnershipCategory } from "../partnership-categories";

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
const serviceExamples: Record<string, string> = {
  veterinary_clinic: "Konsultasi, vaksinasi, rawat inap",
  independent_veterinarian: "Konsultasi online, kunjungan rumah",
  pet_shop: "Makanan hewan, aksesori, kebutuhan harian",
  pet_grooming: "Mandi, potong bulu, perawatan kuku",
  pet_hotel_daycare: "Penitipan harian, kamar inap, aktivitas",
  home_service: "Grooming ke rumah, pet care kunjungan",
  pet_academy_trainer: "Kelas obedience, pelatihan perilaku",
  pet_pharmacy: "Produk kesehatan, suplemen, perawatan",
  diagnostic_laboratory: "Tes darah, pemeriksaan diagnostik",
  shelter_rescue: "Rescue, adopsi, edukasi adopter",
  pet_community: "Pertemuan komunitas, edukasi, kampanye",
  pet_event_organizer: "Pameran, kompetisi, workshop pet",
  pet_friendly_venue: "Kafe pet friendly, reservasi, fasilitas",
  pet_insurance: "Perlindungan kesehatan, manfaat polis",
  brand_manufacturer: "Makanan hewan, produk perawatan",
  distributor_supplier: "Pasokan grosir, distribusi produk",
  logistics_pet_transport: "Pengiriman produk, transportasi pet",
  government_association: "Edukasi, standar profesi, program publik",
};

const whatsappSupportMessage = encodeURIComponent(
  "Halo Tim Slivadoc, saya tertarik bergabung sebagai partner Slivadoc. Saya ingin mendapatkan informasi dan bantuan mengenai proses pendaftaran serta kebutuhan bisnis saya. Terima kasih.",
);
const whatsappSupportURL = `https://wa.me/6281977388341?text=${whatsappSupportMessage}`;

export default function PartnershipForm({ category }: { category: PartnershipCategory }) {
  const [form, setForm] = useState<PartnerForm>({ ...initialForm, partner_type: category.value });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const formStarted = useRef(false);
  const selectedCategory = category;

  function update<K extends keyof PartnerForm>(name: K, value: PartnerForm[K]) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function trackFormStart(source: string) {
    if (formStarted.current) return;
    formStarted.current = true;
    trackEvent("form_start", {
      form_id: "partner_application",
      form_name: "Slivadoc Partner Application",
      source,
    });
  }

  function scrollToForm(source?: string) {
    if (source) trackFormStart(source);
    document.getElementById("daftar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextStep() {
    const stepErrors = validatePartnerForm(form, step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) {
      trackEvent("form_validation_error", {
        form_id: "partner_application",
        invalid_field_count: Object.keys(stepErrors).length,
        step_number: step + 1,
      });
      return;
    }
    trackEvent("form_step_complete", {
      form_id: "partner_application",
      step_number: step + 1,
      step_name: steps[step],
    });
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
      trackEvent("form_validation_error", {
        form_id: "partner_application",
        invalid_field_count: Object.keys(allErrors).length,
        step_number: firstStep + 1,
      });
      scrollToForm();
      return;
    }
    setSubmitting(true);
    setServerError("");
    let responseStatus = 0;
    try {
      const response = await fetch("/api/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          partner_type: category.value,
          established_year: Number(form.established_year),
          branch_count: Number(form.branch_count),
          employee_count: Number(form.employee_count),
          services_offered: form.services_offered.split(",").map((item) => item.trim()).filter(Boolean),
        }),
      });
      responseStatus = response.status;
      const result = await response.json() as { application_number?: string; message?: string; fields?: FieldErrors };
      if (!response.ok) {
        if (result.fields) setErrors(result.fields);
        throw new Error(result.message || "Pendaftaran belum dapat dikirim.");
      }
      setApplicationNumber(result.application_number || "PTR-SLIVADOC");
      trackEvent("generate_lead", {
        form_id: "partner_application",
        lead_type: form.partner_type,
        referral_source: form.referral_source,
      });
      trackEvent("form_submit", {
        form_id: "partner_application",
        form_name: "Slivadoc Partner Application",
      });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Pendaftaran belum dapat dikirim. Coba kembali beberapa saat lagi.");
      trackEvent("form_submit_error", {
        form_id: "partner_application",
        status_code: responseStatus,
        error_type: responseStatus ? "server" : "network",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm({ ...initialForm, partner_type: category.value });
    setStep(0);
    setErrors({});
    setApplicationNumber("");
    setServerError("");
    formStarted.current = false;
  }

  return (
      <section className="registration-section" id="daftar">
        <div className="registration-aside">
          <span className="section-label light">Your place in the ecosystem</span>
          <h2>Daftar kemitraan {category.label}</h2>
          <p>{category.intro} Ceritakan profil dan kebutuhan Anda agar tim Operations dapat meninjau pengajuan ini.</p>
          <div className="aside-checklist">
            <span><i>✓</i><b>Semua data tersimpan aman</b><small>Hanya digunakan untuk proses partnership.</small></span>
            <span><i>✓</i><b>Review langsung oleh Operations</b><small>Status masuk ke antrean dashboard Slivadoc.</small></span>
            <span><i>✓</i><b>Seluruh akses partner 100% gratis</b><small>Tanpa biaya pendaftaran, onboarding, fitur, atau langganan. Pendampingan dari Slivadoc juga gratis.</small></span>
          </div>
          <a className="aside-support" href={whatsappSupportURL} target="_blank" rel="noopener noreferrer"><Icon name="chat" /><span><small>Butuh bantuan?</small><b>Chat WhatsApp Customer Support</b></span></a>
        </div>
        <div className="registration-card">
          {applicationNumber ? (
            <div className="success-state" role="status">
              <span className="success-icon">✓</span>
              <small>Pendaftaran berhasil diterima</small>
              <h2>Selamat datang di langkah pertama pertumbuhan baru.</h2>
              <p>Tim Operations Slivadoc akan meninjau data Anda. Simpan nomor aplikasi berikut untuk referensi.</p>
              <strong>{applicationNumber}</strong>
              <div><button className="button-primary" onClick={resetForm}>Isi ulang formulir</button><a className="button-secondary" href="#top">Kembali ke atas</a></div>
            </div>
          ) : (
            <form onSubmit={submit} onFocusCapture={() => trackFormStart("form_interaction")} noValidate>
              <div className="form-heading">
                <div>
                  <small>Langkah <span className="notranslate" translate="no">{step + 1}</span> dari <span className="notranslate" translate="no">{steps.length}</span></small>
                  <h3 key={`step-heading-${step}`}>{steps[step]}</h3>
                </div>
                <span className="notranslate" translate="no">{Math.round(((step + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="form-progress"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
              <ol className="form-steps" aria-label="Tahapan pendaftaran">
                {steps.map((item, index) => <li className={index === step ? "active" : index < step ? "done" : ""} key={item}><button type="button" onClick={() => index < step && setStep(index)}><span className="notranslate" translate="no">{index < step ? "✓" : index + 1}</span><small>{item}</small></button></li>)}
              </ol>
              {serverError && <div className="form-alert notranslate" role="alert" translate="no"><span>!</span>{serverError}</div>}

              {step === 0 && <div className="form-panel" key="partner-profile-step">
                <input type="hidden" name="partner_type" value={category.value} />
                {selectedCategory && <div className="selected-partner"><span><Icon name={selectedCategory.icon} /></span><div><b>{selectedCategory.label}</b><small>{selectedCategory.description}</small></div></div>}
                <div className="field-grid two"><TextField label="Nama legal badan/usaha" name="legal_name" value={form.legal_name} onChange={(value) => update("legal_name", value)} error={errors.legal_name} placeholder="Contoh: PT Sahabat Satwa Indonesia" /><TextField label="Nama brand/publik" name="brand_name" value={form.brand_name} onChange={(value) => update("brand_name", value)} error={errors.brand_name} placeholder="Contoh: Sahabat Satwa" /></div>
                <div className="field-grid two"><SelectField label="Bentuk usaha/organisasi" name="entity_type" value={form.entity_type} onChange={(value) => update("entity_type", value)} error={errors.entity_type} options={[{value:"pt",label:"PT"},{value:"cv",label:"CV"},{value:"koperasi",label:"Koperasi"},{value:"yayasan",label:"Yayasan"},{value:"klinik_pribadi",label:"Klinik/praktik pribadi"},{value:"profesional_individu",label:"Profesional individu"},{value:"komunitas",label:"Komunitas"},{value:"instansi",label:"Instansi/asosiasi"},{value:"other",label:"Lainnya"}]} /><TextField label="Tahun berdiri" name="established_year" type="number" value={form.established_year} onChange={(value) => update("established_year", value)} error={errors.established_year} placeholder="2024" /></div>
                <TextField label="Nomor legalitas/registrasi" name="legal_document_number" value={form.legal_document_number} onChange={(value) => update("legal_document_number", value)} error={errors.legal_document_number} placeholder="NIB, SIP, akta, atau nomor registrasi organisasi" />
                <TextField label="Tautan dokumen legalitas" name="legal_document_url" type="url" value={form.legal_document_url} onChange={(value) => update("legal_document_url", value)} error={errors.legal_document_url} placeholder="https://drive.google.com/... (pastikan dapat dilihat)" hint="Gunakan tautan berizin lihat; jangan cantumkan password." />
              </div>}

              {step === 1 && <div className="form-panel" key="partner-contact-step">
                <div className="field-grid two"><TextField label="Nama lengkap PIC" name="pic_name" value={form.pic_name} onChange={(value) => update("pic_name", value)} error={errors.pic_name} placeholder="Nama penanggung jawab" /><TextField label="Jabatan PIC" name="pic_position" value={form.pic_position} onChange={(value) => update("pic_position", value)} error={errors.pic_position} placeholder="Owner / Business Development" /></div>
                <TextField label="Email bisnis" name="email" type="email" value={form.email} onChange={(value) => update("email", value)} error={errors.email} placeholder="partner@bisnis.com" />
                <div className="field-grid two"><TextField label="Nomor WhatsApp aktif" name="whatsapp" type="tel" value={form.whatsapp} onChange={(value) => update("whatsapp", value)} error={errors.whatsapp} placeholder="081234567890" /><TextField label="Nomor kontak alternatif" name="alternate_phone" type="tel" value={form.alternate_phone} onChange={(value) => update("alternate_phone", value)} error={errors.alternate_phone} placeholder="081112223333" /></div>
                <TextField label="Website atau profil bisnis" name="digital_profile_url" type="url" value={form.digital_profile_url} onChange={(value) => update("digital_profile_url", value)} error={errors.digital_profile_url} placeholder="https://instagram.com/brand atau website resmi" />
              </div>}

              {step === 2 && <div className="form-panel" key="partner-location-step">
                <TextAreaField label="Alamat operasional lengkap" name="address" value={form.address} onChange={(value) => update("address", value)} error={errors.address} placeholder="Nama jalan, nomor, gedung, RT/RW, dan kelurahan" />
                <div className="field-grid two"><SelectField label="Provinsi" name="province" value={form.province} onChange={(value) => update("province", value)} error={errors.province} options={provinces.map((item) => ({value:item,label:item}))} /><TextField label="Kabupaten/kota" name="city" value={form.city} onChange={(value) => update("city", value)} error={errors.city} placeholder="Jakarta Selatan" /></div>
                <div className="field-grid two"><TextField label="Kecamatan" name="district" value={form.district} onChange={(value) => update("district", value)} error={errors.district} placeholder="Kebayoran Baru" /><TextField label="Kode pos" name="postal_code" inputMode="numeric" maxLength={5} value={form.postal_code} onChange={(value) => update("postal_code", value.replace(/\D/g, ""))} error={errors.postal_code} placeholder="12120" /></div>
                <div className="field-grid two"><TextField label="Jumlah lokasi/cabang" name="branch_count" type="number" value={form.branch_count} onChange={(value) => update("branch_count", value)} error={errors.branch_count} placeholder="1" /><TextField label="Jumlah anggota tim" name="employee_count" type="number" value={form.employee_count} onChange={(value) => update("employee_count", value)} error={errors.employee_count} placeholder="5" /></div>
                <TextField label="Area cakupan layanan" name="service_coverage" value={form.service_coverage} onChange={(value) => update("service_coverage", value)} error={errors.service_coverage} placeholder="Contoh: Jabodetabek / seluruh Indonesia" />
                <TextField label="Jam operasional" name="operation_hours" value={form.operation_hours} onChange={(value) => update("operation_hours", value)} error={errors.operation_hours} placeholder="Senin–Minggu, 08.00–21.00" />
              </div>}

              {step === 3 && <div className="form-panel" key="partner-needs-step">
                <TextField label="Layanan/produk utama" name="services_offered" value={form.services_offered} onChange={(value) => update("services_offered", value)} error={errors.services_offered} placeholder={`${serviceExamples[category.value]} (pisahkan dengan koma)`} />
                <TextAreaField label="Ceritakan bisnis atau organisasi Anda" name="business_description" value={form.business_description} onChange={(value) => update("business_description", value)} error={errors.business_description} placeholder="Jelaskan fokus, pelanggan, keunggulan, dan layanan utama (minimal 30 karakter)." maxLength={2000} />
                <TextAreaField label="Apa tujuan bergabung dengan Slivadoc?" name="partnership_goal" value={form.partnership_goal} onChange={(value) => update("partnership_goal", value)} error={errors.partnership_goal} placeholder="Jelaskan target, kendala, dan bentuk kolaborasi yang Anda harapkan (minimal 30 karakter)." maxLength={2000} />
                <div className="field-grid two"><SelectField label="Target mulai" name="expected_timeline" value={form.expected_timeline} onChange={(value) => update("expected_timeline", value)} error={errors.expected_timeline} options={[{value:"secepatnya",label:"Secepatnya"},{value:"dalam_30_hari",label:"Dalam 30 hari"},{value:"1_3_bulan",label:"1–3 bulan"},{value:"3_6_bulan",label:"3–6 bulan"},{value:"eksplorasi",label:"Masih eksplorasi"}]} /><SelectField label="Customer/order per bulan" name="monthly_customer_volume" value={form.monthly_customer_volume} onChange={(value) => update("monthly_customer_volume", value)} error={errors.monthly_customer_volume} options={[{value:"prelaunch",label:"Belum beroperasi"},{value:"1-50",label:"1–50"},{value:"51-200",label:"51–200"},{value:"201-500",label:"201–500"},{value:"501-2000",label:"501–2.000"},{value:"2000+",label:"> 2.000"}]} /></div>
                <div className="field-grid two"><TextField label="Sistem yang digunakan saat ini" name="existing_software" value={form.existing_software} onChange={(value) => update("existing_software", value)} error={errors.existing_software} placeholder="Belum ada / spreadsheet / POS lain" /><SelectField label="Mengetahui Slivadoc dari" name="referral_source" value={form.referral_source} onChange={(value) => update("referral_source", value)} error={errors.referral_source} options={["Instagram","TikTok","Google","Teman/partner","Event","Tim Slivadoc","Media lain"].map((item)=>({value:item,label:item}))} /></div>
              </div>}

              {step === 4 && <div className="form-panel confirmation-panel" key="partner-confirmation-step">
                <div className="confirmation-summary"><span><Icon name={selectedCategory?.icon || "paw"} /></span><div><small>Kategori terpilih</small><b>{selectedCategory?.label || "Belum dipilih"}</b><p>{form.brand_name || "Nama partner"} · {form.city || "Lokasi"}</p></div></div>
                <h4>Konfirmasi & persetujuan</h4>
                <CheckField checked={form.terms_accepted} onChange={(value) => update("terms_accepted", value)} error={errors.terms_accepted} label="Saya menyetujui syarat pendaftaran dan proses kemitraan Slivadoc." />
                <CheckField checked={form.data_consent} onChange={(value) => update("data_consent", value)} error={errors.data_consent} label="Saya menyetujui pemrosesan data untuk verifikasi, komunikasi, dan onboarding partner." />
                <CheckField checked={form.truth_declaration} onChange={(value) => update("truth_declaration", value)} error={errors.truth_declaration} label="Saya menyatakan seluruh data dan dokumen yang dikirim benar serta dapat dipertanggungjawabkan." />
                <div className="privacy-note"><Icon name="lock" /><span><b>Data Anda tidak dipublikasikan otomatis.</b><small>Tim Operations akan melakukan review sebelum profil partner atau layanan diaktifkan.</small></span></div>
              </div>}

              <div className="form-navigation">
                {step > 0 ? <button className="button-back" type="button" onClick={previousStep} key="back-button">← Kembali</button> : <span key="back-button-placeholder" />}
                {step < steps.length - 1 ? (
                  <button className="button-primary" type="button" onClick={nextStep} key="continue-button">Lanjutkan <span>→</span></button>
                ) : (
                  <button className="button-primary submit-button" type="submit" disabled={submitting} aria-busy={submitting} key="submit-button">
                    <span className="submit-content" hidden={submitting}>Kirim pendaftaran <span>→</span></span>
                    <span className="submit-content notranslate" translate="no" hidden={!submitting}><i className="spinner" /> Mengirim data…</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

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
  return <label className={error ? "form-field invalid" : "form-field"}><span>{label}<b>*</b></span><input name={name} type={type} value={value} onChange={(event)=>onChange(event.target.value)} placeholder={placeholder} inputMode={inputMode || (type === "tel" ? "tel" : type === "email" ? "email" : type === "url" ? "url" : undefined)} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} required />{hint && <small hidden={Boolean(error)}>{hint}</small>}<small id={`${name}-error`} className="field-error notranslate" translate="no" hidden={!error}>{error || ""}</small></label>;
}

function TextAreaField({ label, name, value, onChange, error, placeholder, maxLength = 1000 }: { label:string; name:string; value:string; onChange:(value:string)=>void; error?:string; placeholder:string; maxLength?:number }) {
  return <label className={error ? "form-field invalid" : "form-field"}><span>{label}<b>*</b></span><textarea name={name} value={value} onChange={(event)=>onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} aria-invalid={Boolean(error)} required /> <small className={error ? "field-error field-counter notranslate" : "field-counter notranslate"} translate="no">{error || `${value.length}/${maxLength}`}</small></label>;
}

type SelectOption = { value:string; label:string };

function SelectField({ label, name, value, onChange, error, options }: { label:string; name:string; value:string; onChange:(value:string)=>void; error?:string; options:Array<SelectOption> }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const fieldId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const labelId = `${fieldId}-label`;
  const listId = `${fieldId}-list`;
  const errorId = `${fieldId}-error`;
  const searchable = options.length >= 10;
  const selectedOption = options.find((option) => option.value === value);
  const normalizedQuery = query.trim().toLocaleLowerCase("id");
  const filteredOptions = normalizedQuery
    ? options.filter((option) => option.label.toLocaleLowerCase("id").includes(normalizedQuery))
    : options;
  const activeOption = filteredOptions[activeIndex];
  const activeOptionValue = activeOption?.value;

  useEffect(() => {
    if (!open) return;

    function closeWhenClickingOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", closeWhenClickingOutside);
    return () => document.removeEventListener("pointerdown", closeWhenClickingOutside);
  }, [open]);

  useEffect(() => {
    if (open && searchable) window.requestAnimationFrame(() => searchRef.current?.focus());
  }, [open, searchable]);

  useEffect(() => {
    if (!open || !activeOptionValue) return;
    document.getElementById(`${fieldId}-option-${activeOptionValue}`)?.scrollIntoView({ block: "nearest" });
  }, [activeOptionValue, fieldId, open]);

  function openMenu() {
    const selectedIndex = options.findIndex((option) => option.value === value);
    setQuery("");
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function closeAndFocus() {
    setOpen(false);
    setQuery("");
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function choose(option: SelectOption) {
    onChange(option.value);
    closeAndFocus();
  }

  function moveActive(direction: 1 | -1) {
    if (!filteredOptions.length) return;
    setActiveIndex((current) => {
      const next = current + direction;
      if (next < 0) return filteredOptions.length - 1;
      if (next >= filteredOptions.length) return 0;
      return next;
    });
  }

  function handleListKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(filteredOptions.length - 1, 0));
    } else if (event.key === "Enter" && activeOption) {
      event.preventDefault();
      choose(activeOption);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocus();
    } else if (event.key === "Tab") {
      setOpen(false);
      setQuery("");
    }
  }

  function handleTriggerKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) openMenu();
      else moveActive(event.key === "ArrowDown" ? 1 : -1);
    } else if (open) {
      handleListKeyboard(event);
    }
  }

  return (
    <div className={`${error ? "form-field select-field invalid" : "form-field select-field"}${open ? " open" : ""}`} ref={rootRef}>
      <span id={labelId}>{label}<b>*</b></span>
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        id={`${fieldId}-trigger`}
        className="custom-select-trigger"
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-labelledby={`${labelId} ${fieldId}-trigger`}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        aria-required="true"
        aria-activedescendant={open && activeOption ? `${fieldId}-option-${activeOption.value}` : undefined}
        onClick={() => open ? closeAndFocus() : openMenu()}
        onKeyDown={handleTriggerKeyboard}
      >
        <span className={selectedOption ? "custom-select-value" : "custom-select-value placeholder"} key={selectedOption?.value || "placeholder"}>{selectedOption?.label || `Pilih ${label.toLowerCase()}`}</span>
        <span className="custom-select-chevron" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 7.5 5 5 5-5" /></svg></span>
      </button>

      {open && (
        <>
          <button className="custom-select-overlay" type="button" tabIndex={-1} aria-label={`Tutup pilihan ${label.toLowerCase()}`} onClick={closeAndFocus} />
          <div className="custom-select-popover">
            <div className="custom-select-heading"><span><b>Pilih {label.toLowerCase()}</b><small>{options.length} pilihan tersedia</small></span><button type="button" onClick={closeAndFocus} aria-label="Tutup dropdown">×</button></div>
            {searchable && (
              <label className="custom-select-search">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleListKeyboard}
                  placeholder={`Cari ${label.toLowerCase()}...`}
                  role="combobox"
                  aria-label={`Cari ${label.toLowerCase()}`}
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={activeOption ? `${fieldId}-option-${activeOption.value}` : undefined}
                />
              </label>
            )}
            <div id={listId} className="custom-select-list" role="listbox" aria-labelledby={labelId} onKeyDown={searchable ? undefined : handleListKeyboard}>
              {filteredOptions.length ? filteredOptions.map((option, index) => {
                const selected = option.value === value;
                const active = index === activeIndex;
                return (
                  <button
                    id={`${fieldId}-option-${option.value}`}
                    className={`custom-select-option${selected ? " selected" : ""}${active ? " active" : ""}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    key={option.value}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                  >
                    <span>{option.label}</span><i aria-hidden="true">{selected ? "✓" : ""}</i>
                  </button>
                );
              }) : <div className="custom-select-empty"><span>⌕</span><b>Pilihan tidak ditemukan</b><small>Coba gunakan kata pencarian lain.</small></div>}
            </div>
          </div>
        </>
      )}
      <small id={errorId} className="field-error notranslate" translate="no" hidden={!error}>{error || ""}</small>
    </div>
  );
}

function CheckField({ checked, onChange, error, label }: { checked:boolean; onChange:(value:boolean)=>void; error?:string; label:string }) {
  return <label className={error ? "check-field invalid" : "check-field"}><input className="check-input" type="checkbox" checked={checked} onChange={(event)=>onChange(event.target.checked)} /><span className="check-control" aria-hidden="true">✓</span><span className="check-copy"><b>{label}</b><small className="notranslate" translate="no" hidden={!error}>{error || ""}</small></span></label>;
}

function Icon({ name }: { name:string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<string, ReactNode> = {
    plus:<><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></>, stethoscope:<><path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v2a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="10.5" r="2"/></>, bag:<><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></>, sparkle:<><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>, home:<><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>, route:<><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M8.5 16.5 15.5 7.5"/></>, award:<><circle cx="12" cy="8" r="5"/><path d="m8.5 12-1 9 4.5-2 4.5 2-1-9"/></>, pill:<><path d="M8.5 19.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7l-7 7Z"/><path d="m5 9 7 7"/></>, lab:<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/></>, heart:<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>, users:<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></>, calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>, pin:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>, shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>, cube:<><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/></>, truck:<><path d="M3 5h11v11H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>, card:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></>, send:<><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>, building:<><path d="M3 21h18M6 21V7l6-4 6 4v14M9 10h.01M9 14h.01M15 10h.01M15 14h.01M10 21v-3h4v3"/></>, trend:<><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></>, chat:<><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/></>, lock:<><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>, paw:<><circle cx="12" cy="14" r="4"/><circle cx="6" cy="9" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/></>,
  };
  return <svg {...common}>{paths[name] || paths.paw}</svg>;
}
