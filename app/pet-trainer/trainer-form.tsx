"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { trackEvent } from "../analytics";
import { PartnerSiteHeader, PartnerSiteFooter, PartnerSupportWidget } from "../partner-site-chrome";

type TrainerFormData = {
  full_name: string; display_name: string; email: string; whatsapp: string;
  province: string; city: string; district: string; service_coverage: string;
  pet_types: string[]; specialties: string[]; service_modes: string[];
  experience_years: string; education: string; certifications: string;
  certificate_url: string; portfolio_url: string; profile_url: string;
  bio: string; training_approach: string; availability: string; languages: string;
  onsite_radius_km: string; session_fee_from: string; referral_source: string;
  terms_accepted: boolean; data_consent: boolean; truth_declaration: boolean;
};

const initial: TrainerFormData = {
  full_name: "", display_name: "", email: "", whatsapp: "",
  province: "", city: "", district: "", service_coverage: "",
  pet_types: [], specialties: [], service_modes: [], experience_years: "",
  education: "", certifications: "", certificate_url: "", portfolio_url: "", profile_url: "",
  bio: "", training_approach: "", availability: "", languages: "Bahasa Indonesia",
  onsite_radius_km: "0", session_fee_from: "", referral_source: "",
  terms_accepted: false, data_consent: false, truth_declaration: false,
};
const petOptions = [
  ["anjing", "Anjing"], ["kucing", "Kucing"], ["burung", "Burung"], ["kelinci", "Kelinci"],
  ["reptil", "Reptil"], ["hewan_kecil", "Hewan kecil"], ["kuda", "Kuda"], ["lainnya", "Lainnya"],
];
const specialtyOptions = [
  ["basic_obedience", "Basic obedience"], ["behavior", "Perilaku"], ["puppy_kitten", "Puppy & kitten"],
  ["socialization", "Sosialisasi"], ["agility", "Agility"], ["trick", "Trick training"],
  ["toilet_training", "Toilet training"], ["separation_anxiety", "Separation anxiety"],
  ["advanced", "Advanced training"], ["other", "Lainnya"],
];
const modeOptions = [
  ["online", "Konsultasi online"], ["home_visit", "Home visit"], ["training_location", "Di lokasi training"],
];
const stepNames = ["Identitas", "Keahlian", "Layanan & portofolio", "Konfirmasi"];
type Errors = Record<string, string>;

function validate(form: TrainerFormData, step: number): Errors {
  const errors: Errors = {};
  const required = (field: keyof TrainerFormData, label: string, min = 3) => {
    const value = form[field];
    if (typeof value !== "string" || value.trim().length < min) errors[field] = `Isi ${label} minimal ${min} karakter.`;
  };
  const url = (field: "certificate_url" | "portfolio_url" | "profile_url") => {
    if (!form[field]) return;
    try {
      const parsed = new URL(form[field]);
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error("invalid");
    } catch { errors[field] = "Gunakan tautan http:// atau https:// yang valid."; }
  };
  if (step === 0) {
    required("full_name", "nama lengkap");
    required("display_name", "nama publik");
    required("province", "provinsi");
    required("city", "kota");
    required("district", "kecamatan");
    required("service_coverage", "area layanan");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Isi email yang valid.";
    if (!/^(?:\+62|62|0)8[0-9\s-]{8,14}$/.test(form.whatsapp.trim())) errors.whatsapp = "Isi nomor WhatsApp Indonesia aktif.";
  }
  if (step === 1) {
    if (!form.pet_types.length) errors.pet_types = "Pilih minimal satu jenis hewan.";
    if (!form.specialties.length) errors.specialties = "Pilih minimal satu spesialisasi.";
    if (!form.service_modes.length) errors.service_modes = "Pilih minimal satu metode layanan.";
    if (form.experience_years === "" || !Number.isInteger(Number(form.experience_years)) || Number(form.experience_years) < 0 || Number(form.experience_years) > 80) errors.experience_years = "Isi pengalaman 0–80 tahun.";
    required("bio", "profil profesional", 30);
    required("training_approach", "pendekatan training", 30);
  }
  if (step === 2) {
    required("availability", "jadwal", 5);
    required("referral_source", "sumber informasi", 2);
    if (!form.languages.split(",").map((item) => item.trim()).filter(Boolean).length) errors.languages = "Isi minimal satu bahasa.";
    if (!Number.isInteger(Number(form.onsite_radius_km)) || Number(form.onsite_radius_km) < 0 || Number(form.onsite_radius_km) > 500) errors.onsite_radius_km = "Isi radius 0–500 km.";
    if (form.session_fee_from !== "" && (!Number.isInteger(Number(form.session_fee_from)) || Number(form.session_fee_from) < 0 || Number(form.session_fee_from) > 100000000)) errors.session_fee_from = "Isi tarif dalam rupiah, maksimal Rp100 juta.";
    url("certificate_url"); url("portfolio_url"); url("profile_url");
  }
  if (step === 3) {
    if (!form.terms_accepted) errors.terms_accepted = "Persetujuan syarat wajib diberikan.";
    if (!form.data_consent) errors.data_consent = "Persetujuan pemrosesan data wajib diberikan.";
    if (!form.truth_declaration) errors.truth_declaration = "Pernyataan kebenaran data wajib diberikan.";
  }
  return errors;
}

export default function TrainerForm() {
  const [form, setForm] = useState<TrainerFormData>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");

  function update<K extends keyof TrainerFormData>(name: K, value: TrainerFormData[K]) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => { const next = { ...current }; delete next[name]; return next; });
    setServerError("");
  }
  function toggle(name: "pet_types" | "specialties" | "service_modes", value: string) {
    update(name, form[name].includes(value) ? form[name].filter((item) => item !== value) : [...form[name], value]);
  }
  function navigate(next: number) {
    if (next > step) {
      const found = validate(form, step);
      setErrors(found);
      if (Object.keys(found).length) {
        document.querySelector(".trainer-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    setStep(next);
    setErrors({});
    setServerError("");
    document.querySelector(".trainer-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    for (let index = 0; index < stepNames.length; index++) {
      const found = validate(form, index);
      if (Object.keys(found).length) {
        setErrors(found); setStep(index);
        document.querySelector(".trainer-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    setSubmitting(true); setServerError("");
    try {
      const response = await fetch("/api/pet-trainer-applications", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          full_name: form.full_name.trim(), display_name: form.display_name.trim(),
          experience_years: Number(form.experience_years),
          onsite_radius_km: Number(form.onsite_radius_km),
          session_fee_from: form.session_fee_from === "" ? null : Number(form.session_fee_from),
          languages: form.languages.split(",").map((item) => item.trim()).filter(Boolean),
        }),
      });
      const result = await response.json() as { application_number?: string; message?: string; fields?: Errors };
      if (!response.ok) {
        if (result.fields) {
          setErrors(result.fields);
          const target = stepNames.findIndex((_, index) => Object.keys(validate(form, index)).some((key) => result.fields?.[key]));
          if (target >= 0) setStep(target);
        }
        throw new Error(result.message || "Pendaftaran belum dapat dikirim.");
      }
      setApplicationNumber(result.application_number || "");
      trackEvent("form_submit", { form_id: "pet_trainer_application", lead_type: "pet_trainer" });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Pendaftaran gagal dikirim. Silakan coba lagi.");
    } finally { setSubmitting(false); }
  }
  function field(name: keyof TrainerFormData, label: string, placeholder: string, type = "text", optional = false) {
    return <label className="trainer-field" key={name}><span>{label}{optional ? <small>Opsional</small> : <b>*</b>}</span>
      <input name={name} value={form[name] as string} type={type} placeholder={placeholder}
        min={type === "number" ? "0" : undefined} onChange={(event) => update(name, event.target.value as never)}
        aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `trainer-${name}-error` : undefined} />
      {errors[name] && <small className="trainer-error" id={`trainer-${name}-error`}>{errors[name]}</small>}
    </label>;
  }
  function area(name: "bio" | "training_approach" | "certifications" | "availability", label: string, placeholder: string, optional = false) {
    return <label className="trainer-field trainer-wide" key={name}><span>{label}{optional ? <small>Opsional</small> : <b>*</b>}</span>
      <textarea name={name} value={form[name]} placeholder={placeholder} maxLength={name === "certifications" ? 1000 : name === "availability" ? 500 : 2000}
        onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `trainer-${name}-error` : undefined} />
      <small className="trainer-counter">{form[name].length} karakter</small>
      {errors[name] && <small className="trainer-error" id={`trainer-${name}-error`}>{errors[name]}</small>}
    </label>;
  }
  function choices(name: "pet_types" | "specialties" | "service_modes", title: string, options: string[][]) {
    return <fieldset className="trainer-choices"><legend>{title}<b> *</b></legend>
      <div className="trainer-chip-grid">{options.map(([value, label]) =>
        <label className={form[name].includes(value) ? "trainer-chip selected" : "trainer-chip"} key={value}>
          <input type="checkbox" checked={form[name].includes(value)} onChange={() => toggle(name, value)} />
          <span className="trainer-chip-check" aria-hidden="true">✓</span>{label}
        </label>)}</div>
      {errors[name] && <small className="trainer-error">{errors[name]}</small>}
    </fieldset>;
  }
  function consent(name: "terms_accepted" | "data_consent" | "truth_declaration", label: string) {
    return <label className="trainer-consent" key={name}><input type="checkbox" checked={form[name]} onChange={(event) => update(name, event.target.checked)} />
      <span>{label}{errors[name] && <small className="trainer-error">{errors[name]}</small>}</span></label>;
  }

  return <main className="trainer-page">
    <PartnerSiteHeader registration trainer />
    <section className="trainer-hero"><div className="trainer-hero-inner"><div>
      <span className="trainer-eyebrow"><i /> Pendaftaran pet trainer Slivadoc</span>
      <h1>Bantu pet tumbuh, <em>satu sesi</em> pada satu waktu.</h1>
      <p>Ceritakan keahlian dan pendekatan Anda. Tim Slivadoc akan meninjau profil trainer sebelum layanan dapat ditampilkan dan dipesan oleh pet owner.</p>
      <div className="trainer-hero-actions"><a href="#daftar">Mulai pendaftaran <span>↗</span></a><span>Gratis • sekitar 8 menit</span></div>
    </div><div className="trainer-hero-art" aria-hidden="true"><div className="trainer-orbit"><span>✦</span><span>🐾</span><span>✳</span></div><div className="trainer-art-card"><span>TRAINER PROFILE</span><strong>Keahlianmu.<br />Dampak nyata.</strong><div><i>✓</i> Training <i>✓</i> Konsultasi <i>✓</i> Edukasi</div></div></div></div></section>
    <section className="trainer-process" id="alur"><div><span>01</span><b>Lengkapi profil</b><small>Identitas, pengalaman, dan bidang training.</small></div><div><span>02</span><b>Review tim Slivadoc</b><small>Tim memeriksa kelengkapan dan portofolio.</small></div><div><span>03</span><b>Onboarding</b><small>Pengaturan akun, jadwal, dan layanan setelah disetujui.</small></div></section>
    <section className="trainer-registration" id="daftar"><div className="trainer-aside"><span className="trainer-section-label">BERGABUNG SEBAGAI TRAINER</span><h2>Perkenalkan cara Anda <em>melatih dengan hati.</em></h2>
      <p>Formulir ini untuk profesional individu. Jika Anda mengelola akademi atau badan usaha, gunakan <Link href="/kemitraan/pet-academy">formulir kemitraan Pet Academy</Link>.</p>
      <div className="trainer-aside-note"><span>✦</span><div><b>Profil tetap privat selama review</b><small>Data kontak, dokumen, dan tarif hanya dipakai tim untuk verifikasi serta onboarding.</small></div></div>
    </div><div className="trainer-form-card">
      {applicationNumber ? <div className="trainer-success" role="status"><span>✓</span><h2>Pendaftaran diterima!</h2><p>Tim Slivadoc akan memeriksa profil Anda. Simpan nomor referensi ini untuk komunikasi lanjutan.</p><strong>{applicationNumber}</strong><Link href="/">Kembali ke partnership →</Link></div> :
      <form onSubmit={submit} noValidate><div className="trainer-form-top"><span>LANGKAH {step + 1} / {stepNames.length}</span><h3>{stepNames[step]}</h3><div className="trainer-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={4}><i style={{ width: `${((step + 1) / stepNames.length) * 100}%` }} /></div>
        <ol>{stepNames.map((name, index) => <li key={name} className={index === step ? "active" : index < step ? "done" : ""}><button type="button" onClick={() => index < step && navigate(index)} aria-current={index === step ? "step" : undefined}><span>{index < step ? "✓" : index + 1}</span><small>{name}</small></button></li>)}</ol></div>
        {serverError && <div className="trainer-alert" role="alert">{serverError}</div>}
        {step === 0 && <div className="trainer-fields">
          {field("full_name", "Nama lengkap sesuai identitas", "Nama lengkap Anda")}
          {field("display_name", "Nama yang tampil pada profil", "Contoh: Kak Dira")}
          {field("email", "Email aktif", "nama@email.com", "email")}
          {field("whatsapp", "Nomor WhatsApp", "081234567890", "tel")}
          {field("province", "Provinsi", "Contoh: DKI Jakarta")}
          {field("city", "Kabupaten / kota", "Contoh: Jakarta Barat")}
          {field("district", "Kecamatan", "Contoh: Kebon Jeruk")}
          {field("service_coverage", "Area cakupan layanan", "Contoh: Jakarta Barat dan Tangerang")}
        </div>}
        {step === 1 && <div className="trainer-fields">
          {choices("pet_types", "Jenis pet yang ditangani", petOptions)}
          {choices("specialties", "Bidang spesialisasi", specialtyOptions)}
          {choices("service_modes", "Metode layanan", modeOptions)}
          {field("experience_years", "Pengalaman sebagai trainer (tahun)", "Contoh: 3", "number")}
          {field("education", "Pendidikan relevan", "Program atau institusi", "text", true)}
          {area("bio", "Profil profesional", "Ceritakan pengalaman, jenis pet yang pernah ditangani, dan pencapaian Anda. Minimal 30 karakter.")}
          {area("training_approach", "Pendekatan training", "Jelaskan metode, kesejahteraan pet, dan cara Anda melibatkan pemilik. Minimal 30 karakter.")}
        </div>}
        {step === 2 && <div className="trainer-fields">
          {area("availability", "Ketersediaan jadwal", "Contoh: Senin–Jumat 10.00–18.00 WIB; Sabtu dengan janji.")}
          {field("onsite_radius_km", "Radius home visit (km, isi 0 bila tidak tersedia)", "0", "number")}
          {field("session_fee_from", "Tarif mulai per sesi (Rp)", "Contoh: 150000", "number", true)}
          {field("languages", "Bahasa layanan (pisahkan dengan koma)", "Bahasa Indonesia, Inggris")}
          {area("certifications", "Sertifikasi atau pelatihan", "Nama sertifikat, penerbit, dan tahun.", true)}
          {field("certificate_url", "Tautan bukti sertifikasi", "https://drive.google.com/...", "url", true)}
          {field("portfolio_url", "Tautan portofolio / contoh karya", "https://...", "url", true)}
          {field("profile_url", "Media sosial profesional / website", "https://instagram.com/...", "url", true)}
          {field("referral_source", "Mengetahui Slivadoc dari", "Instagram / teman / event")}
        </div>}
        {step === 3 && <div className="trainer-confirm"><div className="trainer-summary"><span>✦</span><div><small>PROFIL PENDAFTAR</small><b>{form.display_name || form.full_name}</b><p>{form.city} · {form.pet_types.length} jenis pet · {form.specialties.length} spesialisasi</p></div></div>
          <h4>Konfirmasi dan persetujuan</h4>
          {consent("terms_accepted", "Saya menyetujui proses pendaftaran dan ketentuan kemitraan Slivadoc.")}
          {consent("data_consent", "Saya menyetujui penggunaan data untuk verifikasi, komunikasi, dan onboarding.")}
          {consent("truth_declaration", "Saya menyatakan seluruh informasi yang saya kirim benar dan dapat diverifikasi.")}
          <p>Pengajuan tidak otomatis membuat akun trainer atau menampilkan profil Anda secara publik.</p>
        </div>}
        <div className="trainer-actions">{step > 0 ? <button type="button" className="trainer-back" onClick={() => navigate(step - 1)}>← Kembali</button> : <span />}
          {step < 3 ? <button type="button" className="trainer-next" onClick={() => navigate(step + 1)}>Lanjutkan →</button> :
            <button type="submit" className="trainer-next" disabled={submitting} aria-busy={submitting}>{submitting ? "Mengirim…" : "Kirim pendaftaran →"}</button>}</div>
      </form>}
    </div></section>
    <PartnerSiteFooter />
    <PartnerSupportWidget />
  </main>;
}
