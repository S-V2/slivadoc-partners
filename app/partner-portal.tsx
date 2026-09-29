"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { partnershipCategories, partnershipCategoryPath } from "./partnership-categories";
import LanguageSwitcher from "./language-switcher";

const deliveryPartners = [
  { name: "Lion Parcel", slug: "lion-parcel", logo: "/partners/lion-parcel.svg", width: 170, height: 32 },
  { name: "JNE", slug: "jne", logo: "/partners/jne.svg", width: 116, height: 48 },
  { name: "J&T Cargo", slug: "jnt-cargo", logo: "/partners/jnt-cargo.svg", width: 223, height: 52 },
  { name: "SiCepat Express", slug: "sicepat", logo: "/partners/sicepat.svg", width: 120, height: 32 },
  { name: "IDExpress", slug: "idexpress", logo: "/partners/idexpress.svg", width: 1599, height: 1335 },
] as const;

const paymentPartners = [
  { name: "BatPay", slug: "batpay", logo: "/partners/batpay.webp", width: 1024, height: 353 },
  { name: "OCBC", slug: "ocbc", logo: "/partners/ocbc.png", width: 1452, height: 392 },
  { name: "CIMB Niaga", slug: "cimb", logo: "/partners/cimb.svg", width: 1445, height: 221 },
  { name: "Mandiri", slug: "mandiri", logo: "/partners/mandiri.png", width: 400, height: 117 },
] as const;

const ecosystemPillars = [
  {
    label: "Health & Clinical",
    title: "Kesehatan & klinis",
    description: "Klinik, dokter hewan, laboratorium, dan apotek terhubung dalam perjalanan perawatan yang lebih utuh.",
    icon: "stethoscope",
    meta: "Klinik · Dokter · Lab · Apotek",
  },
  {
    label: "Care & Hospitality",
    title: "Perawatan & hospitality",
    description: "Grooming, pet hotel, daycare, trainer, dan home service bertemu pet owner di saat yang tepat.",
    icon: "sparkle",
    meta: "Grooming · Hotel · Trainer",
  },
  {
    label: "Commerce & Supply",
    title: "Commerce & brand",
    description: "Pet shop, brand, produsen, dan distributor bergerak dalam rantai pasok yang saling mendukung.",
    icon: "bag",
    meta: "Retail · Brand · Supplier",
  },
  {
    label: "Community & Impact",
    title: "Komunitas & dampak",
    description: "Komunitas, event, shelter, dan asosiasi membangun edukasi, engagement, dan dampak yang lebih luas.",
    icon: "users",
    meta: "Community · Event · Rescue",
  },
  {
    label: "Trust & Protection",
    title: "Proteksi & kepercayaan",
    description: "Verifikasi partner, asuransi, dan standar ekosistem membantu setiap interaksi terasa lebih aman.",
    icon: "shield",
    meta: "Verified · Insurance · Standard",
  },
  {
    label: "Payment & Logistics",
    title: "Pembayaran & logistik",
    description: "Transaksi, pengiriman, dan pemenuhan pesanan menjadi penghubung dari kebutuhan ke pengalaman nyata.",
    icon: "truck",
    meta: "Payment · Delivery · Fulfillment",
  },
] as const;

const valueFlow = [
  { number: "01", title: "Ditemukan", description: "Pet owner menemukan partner dan layanan yang relevan.", icon: "pin" },
  { number: "02", title: "Dipilih", description: "Profil, katalog, jadwal, dan kredibilitas membantu keputusan.", icon: "calendar" },
  { number: "03", title: "Dibayar", description: "Transaksi masuk melalui alur pembayaran yang terhubung.", icon: "card" },
  { number: "04", title: "Dipenuhi", description: "Layanan atau produk diselesaikan dengan dukungan operasional.", icon: "truck" },
  { number: "05", title: "Bertumbuh", description: "Data dan relasi pelanggan membuka peluang berikutnya.", icon: "trend" },
] as const;

const whatsappSupportMessage = encodeURIComponent(
  "Halo Tim Slivadoc, saya tertarik bergabung sebagai partner Slivadoc. Saya ingin mendapatkan informasi dan bantuan mengenai proses pendaftaran serta kebutuhan bisnis saya. Terima kasih.",
);
const whatsappSupportURL = `https://wa.me/6281977388341?text=${whatsappSupportMessage}`;

const faqItems = [
  {
    question: "Apakah Slivadoc menyediakan aplikasi POS untuk petshop dan klinik hewan?",
    answer: "Ya. Slivadoc menyediakan aplikasi POS atau kasir terintegrasi untuk petshop, klinik hewan, grooming, dan bisnis pet care. Partner dapat mengelola transaksi, stok, pelanggan, booking, layanan, serta laporan operasional dari sistem yang saling terhubung.",
  },
  {
    question: "Apakah bergabung dan menggunakan Slivadoc benar-benar gratis?",
    answer: "Ya. Semua partner terdaftar mendapatkan akses full gratis. Pendaftaran, aktivasi akun, onboarding, penggunaan seluruh fitur aplikasi, dan pendampingan dari tim Slivadoc tidak dikenakan biaya pendaftaran, biaya aktivasi, biaya lisensi, atau biaya langganan.",
  },
  {
    question: "Apakah ada biaya tersembunyi atau biaya aplikasi di kemudian hari?",
    answer: "Tidak ada biaya tersembunyi untuk menggunakan aplikasi Slivadoc. Sebelum partner memakai layanan tambahan dari pihak ketiga di luar Slivadoc, tim kami akan menjelaskan kebutuhan dan ketentuannya secara terbuka agar tidak ada pengeluaran yang muncul tanpa persetujuan partner.",
  },
  {
    question: "Apa maksudnya kebutuhan bisnis partner dibantu 100% oleh Slivadoc?",
    answer: "Tim Slivadoc akan membantu memetakan kebutuhan bisnis, menyiapkan akun dan workspace, mengatur layanan atau katalog, membantu konfigurasi operasional, memberi panduan penggunaan, serta mendampingi proses onboarding. Partner tidak perlu memahami hal teknis atau membangun aplikasi sendiri.",
  },
  {
    question: "Siapa saja yang dapat mendaftar sebagai partner?",
    answer: "Klinik dan rumah sakit hewan, dokter hewan, pet shop, grooming, pet hotel, daycare, home service, pet academy, apotek pet, laboratorium, shelter, komunitas, event organizer, pet-friendly venue, asuransi, brand, produsen, distributor, logistik, instansi, dan organisasi lain di ekosistem hewan dapat mendaftar.",
  },
  {
    question: "Apakah usaha kecil, profesional individu, atau komunitas boleh bergabung?",
    answer: "Boleh. Slivadoc terbuka untuk usaha yang baru berkembang, profesional individu, komunitas, yayasan, dan organisasi. Pilih bentuk usaha yang paling sesuai di formulir, lalu tim kami akan membantu proses berikutnya.",
  },
  {
    question: "Apakah saya harus memiliki banyak cabang atau tim yang besar?",
    answer: "Tidak. Partner dengan satu lokasi atau usaha yang dikelola sendiri tetap dapat mendaftar. Informasi jumlah cabang dan anggota tim digunakan agar Slivadoc dapat menyiapkan kebutuhan operasional yang sesuai.",
  },
  {
    question: "Data dan dokumen apa yang perlu disiapkan?",
    answer: "Siapkan identitas usaha atau organisasi, nomor dan tautan dokumen legalitas yang dapat dilihat, data PIC, alamat operasional, area layanan, jam operasional, daftar layanan atau produk, serta penjelasan singkat mengenai kebutuhan bisnis Anda.",
  },
  {
    question: "Bagaimana jika dokumen legalitas saya belum lengkap?",
    answer: "Hubungi Customer Support Slivadoc melalui WhatsApp sebelum mengirim formulir. Tim kami akan membantu mengecek dokumen yang sudah tersedia dan menjelaskan langkah yang perlu dilengkapi agar pendaftaran tidak membingungkan.",
  },
  {
    question: "Apa yang terjadi setelah formulir dikirim?",
    answer: "Pengajuan langsung masuk ke dashboard Operations Slivadoc. Tim akan memeriksa kelengkapan data, kesesuaian kategori, legalitas, dan kebutuhan bisnis. Jika ada informasi yang kurang jelas, tim Slivadoc akan menghubungi PIC melalui email atau WhatsApp yang didaftarkan.",
  },
  {
    question: "Berapa lama proses pemeriksaan pengajuan?",
    answer: "Waktu pemeriksaan bergantung pada kelengkapan dan kejelasan data yang dikirim. Pastikan nomor WhatsApp dan email PIC aktif agar tim dapat segera menghubungi Anda apabila diperlukan konfirmasi tambahan.",
  },
  {
    question: "Apakah profil bisnis langsung tampil setelah mendaftar?",
    answer: "Belum. Profil dan layanan baru diaktifkan setelah proses verifikasi dan onboarding selesai. Tahap ini memastikan informasi bisnis, layanan, area operasional, dan akses tim sudah tersusun dengan benar sebelum digunakan.",
  },
  {
    question: "Apakah Slivadoc dapat digunakan untuk bisnis dengan beberapa cabang?",
    answer: "Bisa. Slivadoc mendukung kebutuhan bisnis multi-cabang. Tim akan membantu menyiapkan struktur cabang, akses pengguna, serta alur operasional agar setiap cabang dapat dikelola dengan rapi.",
  },
  {
    question: "Fitur apa saja yang akan disiapkan untuk partner?",
    answer: "Fitur disesuaikan dengan kategori dan kebutuhan partner, misalnya profil bisnis, katalog, booking, pelanggan, transaksi, stok, layanan, jadwal, tim, laporan, promosi, serta integrasi dengan ekosistem Slivadoc. Tim kami membantu memilih dan menyiapkan fitur yang relevan.",
  },
  {
    question: "Bagaimana jika saya masih memakai pencatatan manual atau aplikasi lain?",
    answer: "Tidak masalah. Ceritakan sistem yang sedang digunakan di formulir. Tim Slivadoc akan membantu menyusun proses perpindahan yang paling mudah agar kegiatan bisnis tetap berjalan dan tim partner tidak kewalahan.",
  },
  {
    question: "Apakah saya harus memiliki tim IT?",
    answer: "Tidak perlu. Slivadoc dirancang agar dapat digunakan oleh pemilik bisnis dan tim operasional tanpa pengetahuan teknis khusus. Tim Customer Support akan membantu penyiapan, pelatihan, dan penggunaan sehari-hari.",
  },
  {
    question: "Apakah data yang saya kirim langsung dipublikasikan?",
    answer: "Tidak. Data pendaftaran digunakan untuk verifikasi, komunikasi, dan onboarding. Informasi bisnis tidak dipublikasikan otomatis sebelum proses review selesai dan partner siap diaktifkan.",
  },
  {
    question: "Bagaimana jika pengajuan perlu diperbaiki atau belum disetujui?",
    answer: "Tim Slivadoc akan menjelaskan bagian yang perlu dilengkapi atau diperbaiki. Partner dapat menyiapkan informasi tersebut dan melanjutkan proses tanpa perlu bingung memulai dari awal.",
  },
  {
    question: "Bagaimana cara berbicara langsung dengan Customer Support Slivadoc?",
    answer: "Klik tombol maskot Customer Support di kanan bawah halaman. WhatsApp akan terbuka dengan pesan awal yang sudah disiapkan. Anda juga dapat menghubungi Slivadoc di +62 819-7738-8341.",
  },
] as const;

export default function PartnerPortal() {
  return (
    <main className="partner-page">
      <header className="partner-header">
        <a className="partner-logo notranslate" href="#beranda" aria-label="Slivadoc Partners" translate="no">
          <Image className="logo-mark" src="/brand/slivadoc-logo.png" alt="" aria-hidden="true" width={38} height={38} priority />
          <span>sliva<b>doc</b><small>partners</small></span>
        </a>
        <nav aria-label="Navigasi utama">
          <a href="#ekosistem">Ekosistem</a>
          <a href="#kategori-partner">Kategori</a>
          <a href="#manfaat">Alur nilai</a>
          <a href="#partner-strategis">Partner strategis</a>
          <a href="#proses">Cara bergabung</a>
        </nav>
        <LanguageSwitcher />
        <a className="header-cta" href="#kategori-partner"><span className="header-cta-full">Gabung ekosistem</span><span className="header-cta-short">Gabung</span></a>
      </header>

      <section className="partner-hero" id="beranda">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-copy">
          <span className="hero-kicker"><i /> Ekosistem partner pet care Indonesia</span>
          <h1>Dari bisnis lokal menjadi bagian dari <em>ekosistem besar.</em></h1>
          <p>Slivadoc menghubungkan pet owner, layanan, commerce, komunitas, pembayaran, dan pengiriman dalam satu perjalanan. Gunakan aplikasi POS petshop, klinik hewan, grooming, serta bisnis pet care secara gratis untuk lebih mudah ditemukan, dipilih, dan bertumbuh.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#kategori-partner">Gabung ke ekosistem <span>→</span></a>
            <a className="button-secondary" href="#ekosistem">Jelajahi cara kerjanya</a>
          </div>
          <div className="hero-proof">
            <span><b>18</b><small>Kategori partner</small></span>
            <span><b>38</b><small>Provinsi di Indonesia</small></span>
            <span><b>100% Gratis</b><small>Seluruh fitur partner</small></span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Gambaran ekosistem pet care Slivadoc">
          <div className="hero-image-frame"><Image src="/brand/slivadoc-ecosystem-hero.webp" alt="Ilustrasi Slivadoc sebagai pusat ekosistem yang menghubungkan klinik hewan, pet shop, grooming, komunitas, pembayaran, dan logistik" width={1536} height={1024} priority sizes="(max-width: 900px) 94vw, 54vw" /></div>
          <div className="floating-card card-discovery"><span><Icon name="paw" /></span><div><b>Satu jaringan</b><small>Care · Commerce · Community</small></div></div>
          <div className="floating-card card-growth"><span><Icon name="trend" /></span><div><b>Alur end-to-end</b><small>Payment · Delivery · Growth</small></div></div>
          <div className="floating-pill"><i /> Partner onboarding sedang dibuka</div>
        </div>
      </section>

      <section className="brand-strip" aria-label="Nilai utama Slivadoc Partners">
        <div className="pet-runway" aria-hidden="true">
          <div className="pet-journey">
            <span className="pet-speed-lines"><i /><i /><i /></span>
            <span className="pet-runner-shadow" />
            <span className="pet-runner">
              <Image src="/brand/pet-runner.webp" alt="" width={480} height={221} sizes="(max-width: 480px) 112px, 148px" />
            </span>
          </div>
        </div>
        {["Health & Care", "Commerce & Brand", "Community & Impact", "Payment & Delivery"].map((item) => <span key={item}><i>✓</i>{item}</span>)}
      </section>

      <section className="ecosystem-map-section" id="ekosistem">
        <div className="ecosystem-map-intro">
          <span className="section-label light">The connected pet-care economy</span>
          <h2>Banyak pemain.<br /><em>Satu ekosistem.</em></h2>
          <p>Slivadoc dirancang sebagai lapisan penghubung agar setiap partner tidak berjalan sendiri. Layanan, transaksi, data, komunitas, dan distribusi bertemu dalam jaringan yang memberi nilai ke seluruh ekosistem.</p>
          <a href="#kategori-partner">Temukan posisi bisnis Anda <span>↓</span></a>
        </div>
        <div className="ecosystem-map-board">
          <div className="ecosystem-core">
            <span className="ecosystem-core-logo"><Image src="/brand/slivadoc-logo.png" alt="" aria-hidden="true" width={58} height={58} /></span>
            <small className="notranslate" translate="no">Slivadoc Ecosystem</small>
            <h3>Satu pusat.<br />Semua terhubung.</h3>
            <p>Discovery, operasional, transaksi, relasi, dan pertumbuhan.</p>
            <div><span>18 kategori</span><span>38 provinsi</span></div>
          </div>
          {ecosystemPillars.map((pillar, index) => (
            <article className={`ecosystem-pillar ecosystem-pillar-${index + 1}`} key={pillar.title}>
              <span className="ecosystem-pillar-icon"><Icon name={pillar.icon} /></span>
              <div>
                <small className="notranslate" translate="no">{pillar.label}</small>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <em className="notranslate" translate="no">{pillar.meta}</em>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ecosystem-section" id="kategori-partner">
        <div className="section-heading">
          <span className="section-label">18 pintu masuk ke ekosistem</span>
          <h2>Temukan posisi Anda.<br /><em>Bangun dampak bersama.</em></h2>
          <p>Semua penyedia layanan, profesional, organisasi, brand, dan pendukung ekosistem dapat mendaftar. Pilih kategori untuk membuka halaman pendaftaran khusus bidang Anda. Pet owner tetap menggunakan aplikasi khusus Pet Owner.</p>
        </div>
        <div className="category-grid">
          {partnershipCategories.map((item) => (
            <Link className="category-card" key={item.value} href={partnershipCategoryPath(item.slug)}>
              <span className="category-icon"><Icon name={item.icon} /></span>
              <span><b>{item.label}</b><small>{item.description}</small></span>
              <i className="category-arrow">→</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="value-flow-section" id="manfaat">
        <div className="value-flow-heading">
          <div>
            <span className="section-label">Nilai yang terus bergerak</span>
            <h2>Satu perjalanan dari kebutuhan menjadi <em>pertumbuhan.</em></h2>
          </div>
          <p>Slivadoc bukan sekadar tempat listing. Ekosistem ini membantu partner hadir di sepanjang perjalanan pet owner—dari pencarian pertama sampai relasi yang berulang.</p>
        </div>
        <ol className="value-flow">
          {valueFlow.map((item) => (
            <li key={item.number}>
              <span className="value-flow-number">{item.number}</span>
              <span className="value-flow-icon"><Icon name={item.icon} /></span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
        <div className="value-flow-callout">
          <div><span><Icon name="paw" /></span><p><small>Nilai untuk partner</small><b>Ditemukan lebih mudah. Dioperasikan lebih rapi. Bertumbuh lebih terukur.</b></p></div>
          <a className="button-primary" href="#kategori-partner">Ambil bagian sekarang <span>→</span></a>
        </div>
      </section>

      <section className="partner-network-section" id="partner-strategis">
        <div className="section-heading partner-network-heading">
          <span className="section-label">Partner strategis</span>
          <h2>Ekosistem besar butuh penggerak yang <em>bisa diandalkan.</em></h2>
          <p>Jaringan pengiriman dan pembayaran membantu alur dari transaksi sampai produk tiba di tujuan tetap bergerak praktis di dalam ekosistem Slivadoc.</p>
        </div>
        <div className="partner-network-grid">
          <article className="partner-group-card delivery-partner-card">
            <div className="partner-group-heading">
              <span className="partner-group-icon"><Icon name="truck" /></span>
              <div><small>Dukungan distribusi</small><h3>Partner Pengiriman</h3></div>
            </div>
            <ul className="partner-brand-list delivery-brand-list" aria-label="Daftar partner pengiriman Slivadoc">
              {deliveryPartners.map((partner) => (
                <li className={`partner-brand partner-brand-${partner.slug} notranslate`} key={partner.name} translate="no" title={partner.name}>
                  <span className="partner-brand-logo-shell">
                    <Image
                      className="partner-brand-logo"
                      src={partner.logo}
                      alt={`Logo ${partner.name}`}
                      width={partner.width}
                      height={partner.height}
                      sizes="150px"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </article>
          <article className="partner-group-card payment-partner-card">
            <div className="partner-group-heading">
              <span className="partner-group-icon"><Icon name="card" /></span>
              <div><small>Dukungan transaksi</small><h3>Partner Pembayaran</h3></div>
            </div>
            <ul className="partner-brand-list payment-brand-list" aria-label="Daftar partner pembayaran Slivadoc">
              {paymentPartners.map((partner) => (
                <li className={`partner-brand partner-brand-${partner.slug} notranslate`} key={partner.name} translate="no" title={partner.name}>
                  <span className="partner-brand-logo-shell">
                    <Image
                      className="partner-brand-logo"
                      src={partner.logo}
                      alt={`Logo ${partner.name}`}
                      width={partner.width}
                      height={partner.height}
                      sizes="150px"
                    />
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="warehouse-section" aria-labelledby="warehouse-title">
        <div className="warehouse-copy">
          <span className="section-label">Visi infrastruktur Slivadoc</span>
          <h2 id="warehouse-title">Membangun fondasi fisik untuk ekosistem yang <em>lebih besar.</em></h2>
          <p>Ke depan, Slivadoc dirancang memiliki warehouse dan mobil box pengiriman sendiri untuk mendukung distribusi produk pet care dari partner ke berbagai wilayah Indonesia dengan alur yang lebih terkontrol.</p>
          <div className="warehouse-points">
            <article><span><Icon name="cube" /></span><div><b>Warehouse terintegrasi</b><p>Pengelolaan stok, pemenuhan pesanan, dan distribusi dalam satu alur Slivadoc.</p></div></article>
            <article><span><Icon name="route" /></span><div><b>Armada beridentitas Slivadoc</b><p>Mobil box sendiri untuk mendukung pengiriman yang konsisten dan mudah dikenali.</p></div></article>
            <article><span><Icon name="trend" /></span><div><b>Siap bertumbuh nasional</b><p>Fondasi logistik untuk membantu ekosistem pet care menjangkau pasar yang lebih luas.</p></div></article>
          </div>
        </div>
        <div className="warehouse-visual">
          <div className="warehouse-image-frame">
            <Image src="/brand/slivadoc-warehouse.webp" alt="Ilustrasi rencana warehouse dan mobil box pengiriman dengan stiker logo Slivadoc" width={1536} height={1024} sizes="(max-width: 780px) calc(100vw - 40px), 54vw" />
          </div>
          <div className="warehouse-status-card">
            <span><Image src="/brand/slivadoc-logo.png" alt="" aria-hidden="true" width={34} height={34} /></span>
            <div><small>Rencana pengembangan</small><b>Slivadoc Warehouse & Delivery</b></div>
          </div>
        </div>
      </section>

      <section className="process-section" id="proses">
        <div className="section-heading compact">
          <span className="section-label">Masuk ke ekosistem</span>
          <h2>Empat langkah menuju <em>peluang yang lebih luas.</em></h2>
          <p>Tim Slivadoc mendampingi dari pemetaan kebutuhan hingga workspace dan layanan partner siap digunakan.</p>
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

      <section className="faq-section" id="faq">
        <div className="section-heading compact"><span className="section-label">Pertanyaan umum</span><h2>Jawaban yang jelas sebelum Anda <em>bergabung.</em></h2><p>Kami merangkum hal-hal yang paling sering ditanyakan calon partner dengan bahasa sederhana. Jika masih ada yang belum jelas, tim Slivadoc siap membantu melalui WhatsApp.</p></div>
        <div className="faq-list">
          {faqItems.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="closing-cta"><span><PawMark /></span><div><small>Ekosistemnya sedang tumbuh</small><h2>Pastikan bisnis Anda ada di dalamnya.</h2></div><a className="button-white" href="#kategori-partner">Gabung ke Slivadoc <span>→</span></a></section>

      <footer className="partner-footer">
        <a className="partner-logo footer-logo notranslate" href="#beranda" aria-label="Slivadoc Partners" translate="no"><Image className="logo-mark" src="/brand/slivadoc-logo.png" alt="" aria-hidden="true" width={38} height={38} /><span>sliva<b>doc</b><small>partners</small></span></a>
        <p>Ekosistem pet care Indonesia yang menghubungkan layanan, operasional, komunitas, dan pertumbuhan.</p>
        <div><a href="mailto:support@slivadoc.com">support@slivadoc.com</a><a href={whatsappSupportURL} target="_blank" rel="noopener noreferrer">+62 819-7738-8341</a></div>
        <small>© {new Date().getFullYear()} PT Sliva Technology Indonesia</small>
      </footer>

      <a className="support-widget" href={whatsappSupportURL} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp Customer Support Slivadoc">
        <span className="support-widget-copy"><small>Customer Support</small><strong>Butuh bantuan? Chat kami</strong></span>
        <span className="support-mascot" aria-hidden="true"><PawMark /><i /></span>
      </a>
    </main>
  );
}

function PawMark() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 18.5c-5.9 0-11.7 5.3-11.7 10.7 0 4 3.4 6.3 7 5.1 1.7-.6 3.2-1 4.7-1s3 .4 4.7 1c3.6 1.2 7-1.1 7-5.1 0-5.4-5.8-10.7-11.7-10.7Z"/><ellipse cx="9.3" cy="15" rx="4.2" ry="5.4" transform="rotate(-27 9.3 15)"/><ellipse cx="30.7" cy="15" rx="4.2" ry="5.4" transform="rotate(27 30.7 15)"/><ellipse cx="17" cy="9" rx="4.1" ry="5.4" transform="rotate(-8 17 9)"/><ellipse cx="25" cy="9" rx="4.1" ry="5.4" transform="rotate(8 25 9)"/></svg>;
}

function Icon({ name }: { name:string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<string, ReactNode> = {
    plus:<><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></>, stethoscope:<><path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v2a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="10.5" r="2"/></>, bag:<><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></>, sparkle:<><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>, home:<><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>, route:<><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M8.5 16.5 15.5 7.5"/></>, award:<><circle cx="12" cy="8" r="5"/><path d="m8.5 12-1 9 4.5-2 4.5 2-1-9"/></>, pill:<><path d="M8.5 19.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7l-7 7Z"/><path d="m5 9 7 7"/></>, lab:<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/></>, heart:<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>, users:<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></>, calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>, pin:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>, shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>, cube:<><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/></>, truck:<><path d="M3 5h11v11H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>, card:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></>, send:<><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>, building:<><path d="M3 21h18M6 21V7l6-4 6 4v14M9 10h.01M9 14h.01M15 10h.01M15 14h.01M10 21v-3h4v3"/></>, trend:<><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></>, chat:<><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/></>, lock:<><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>, paw:<><circle cx="12" cy="14" r="4"/><circle cx="6" cy="9" r="2"/><circle cx="18" cy="9" r="2"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/></>,
  };
  return <svg {...common}>{paths[name] || paths.paw}</svg>;
}
