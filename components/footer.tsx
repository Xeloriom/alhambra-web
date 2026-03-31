"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f5f5f7] py-20 border-t border-[#d2d2d7]">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-1">
            <Link href="#hero" className="text-[18px] font-[700] tracking-[-0.02em] text-[#1d1d1f] mb-4 block">
              ALHAMBRA<span className="text-[#1d1d1f]">.</span>
            </Link>
            <p className="text-[15px] text-[#6e6e73] leading-relaxed max-w-[260px] mb-6">
              Nous créons des expériences digitales durables.
            </p>
            <span className="text-[12px] font-mono text-[#86868b]">alhambra-web.com</span>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-[0.06em] mb-6">Services</h4>
            <ul className="space-y-3">
              {["Design Web", "Apps Mobiles", "Logiciels Sur Mesure", "Design UI/UX"].map(link => (
                <li key={link}>
                  <Link href="#" className="text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-[0.06em] mb-6">Entreprise</h4>
            <ul className="space-y-3">
              {["À Propos", "Travaux", "Tarifs", "Blog"].map(link => (
                <li key={link}>
                  <Link href="#" className="text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-[0.06em] mb-6">Légal</h4>
            <ul className="space-y-3">
              {["Politique de Confidentialité", "Conditions d'Utilisation", "Politique de Cookies"].map(link => (
                <li key={link}>
                  <Link href="#" className="text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-[1px] bg-[#d2d2d7] w-full mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[13px] text-[#86868b]">
            © 2026 ALHAMBRA Studio. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "Dribbble", "GitHub"].map(social => (
              <Link key={social} href="#" className="text-[#86868b] hover:text-[#1d1d1f] transition-colors">
                <span className="text-[13px] font-medium">{social}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
