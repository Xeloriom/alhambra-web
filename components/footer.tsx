"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#d2d2d7] pt-32 pb-16 relative overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link 
              href="/" 
              className="text-2xl font-black tracking-tighter text-[#1d1d1f] mb-8 block"
            >
              ALHAMBRAWeb<span className="text-[#1d1d1f]">.</span>
            </Link>
            <p className="text-[17px] text-[#6e6e73] max-w-[320px] leading-relaxed">
              Nous façonnons l&apos;avenir numérique des entreprises ambitieuses.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.1em] text-[#86868b] uppercase mb-8">Navigation</h4>
            <ul className="space-y-4">
              {["Travaux", "Services", "Process", "Contact"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase()}`} 
                    className="text-[14px] text-[#1d1d1f] hover:text-[#6e6e73] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.1em] text-[#86868b] uppercase mb-8">Légal</h4>
            <ul className="space-y-4">
              {["Mentions Légales", "Confidentialité", "Cookies"].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    className="text-[14px] text-[#1d1d1f] hover:text-[#6e6e73] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#e8e8ed] gap-6">
          <span className="text-[12px] text-[#86868b] tracking-tight">
            © {currentYear} ALHAMBRAWeb — TOUS DROITS RÉSERVÉS.
          </span>
          <div className="flex gap-8">
            {["LINKEDIN", "TWITTER", "INSTAGRAM"].map((social) => (
              <Link 
                key={social} 
                href="#" 
                className="text-[10px] font-bold tracking-widest text-[#86868b] hover:text-[#1d1d1f] transition-colors"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
