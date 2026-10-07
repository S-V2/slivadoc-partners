import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./language-switcher";

const whatsappSupportMessage = encodeURIComponent(
  "Halo Tim Slivadoc, saya tertarik bergabung sebagai partner Slivadoc. Saya ingin mendapatkan informasi dan bantuan mengenai proses pendaftaran serta kebutuhan bisnis saya. Terima kasih.",
);
export const whatsappSupportURL = `https://wa.me/6281977388341?text=${whatsappSupportMessage}`;

export function PawMark() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 18.5c-5.9 0-11.7 5.3-11.7 10.7 0 4 3.4 6.3 7 5.1 1.7-.6 3.2-1 4.7-1s3 .4 4.7 1c3.6 1.2 7-1.1 7-5.1 0-5.4-5.8-10.7-11.7-10.7Z"/><ellipse cx="9.3" cy="15" rx="4.2" ry="5.4" transform="rotate(-27 9.3 15)"/><ellipse cx="30.7" cy="15" rx="4.2" ry="5.4" transform="rotate(27 30.7 15)"/><ellipse cx="17" cy="9" rx="4.1" ry="5.4" transform="rotate(-8 17 9)"/><ellipse cx="25" cy="9" rx="4.1" ry="5.4" transform="rotate(8 25 9)"/></svg>;
}

export function PartnerSiteHeader({ registration = false, trainer = false }: { registration?: boolean; trainer?: boolean }) {
  const root = registration ? "/" : "";
  return <header className="partner-header">
    <Link className="partner-logo notranslate" href={registration ? "/" : "#beranda"} aria-label="Slivadoc Partners" translate="no">
      <Image className="logo-mark" src="/brand/slivadoc-logo.png" alt="" aria-hidden="true" width={38} height={38} priority />
      <span>sliva<b>doc</b><small>partners</small></span>
    </Link>
    <nav aria-label="Navigasi utama">
      <Link href={`${root}#ekosistem`}>Ekosistem</Link>
      <Link href={`${root}#kategori-partner`}>Kategori</Link>
      <Link href={`${root}#manfaat`}>Alur nilai</Link>
      <Link href={`${root}#partner-strategis`}>Partner strategis</Link>
      <Link href={`${root}#proses`}>Cara bergabung</Link>
    </nav>
    <LanguageSwitcher />
    <a className="header-cta" href={registration ? "#daftar" : "#kategori-partner"}>
      <span className="header-cta-full">{trainer ? "Daftar Pet Trainer" : registration ? "Isi formulir" : "Gabung ekosistem"}</span>
      <span className="header-cta-short">{registration ? "Daftar" : "Gabung"}</span>
    </a>
  </header>;
}

export function PartnerSiteFooter() {
  return <footer className="partner-footer">
    <Link className="partner-logo footer-logo notranslate" href="/" aria-label="Slivadoc Partners" translate="no"><Image className="logo-mark" src="/brand/slivadoc-logo.png" alt="" aria-hidden="true" width={38} height={38} /><span>sliva<b>doc</b><small>partners</small></span></Link>
    <p>Ekosistem pet care Indonesia yang menghubungkan layanan, operasional, komunitas, dan pertumbuhan.</p>
    <div><a href="mailto:support@slivadoc.com">support@slivadoc.com</a><a href={whatsappSupportURL} target="_blank" rel="noopener noreferrer">+62 819-7738-8341</a></div>
    <small>© {new Date().getFullYear()} PT Sliva Technology Indonesia</small>
  </footer>;
}

export function PartnerSupportWidget() {
  return <a className="support-widget" href={whatsappSupportURL} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp Customer Support Slivadoc">
    <span className="support-widget-copy"><small>Customer Support</small><strong>Butuh bantuan? Chat kami</strong></span>
    <span className="support-mascot" aria-hidden="true"><PawMark /><i /></span>
  </a>;
}
