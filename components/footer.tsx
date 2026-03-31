"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-32 pb-16 relative overflow-hidden">
      {/* Subtle radial gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ 
          background: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.05) 0%, transparent 60%)" 
        }}
      />
      
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link 
              href="/" 
              data-cursor="hover"
              className="text-2xl font-black tracking-tighter text-white mb-8 block"
            >
              ALHAMBRA<span className="text-[#C9A84C]">.</span>
            </Link>
            <p className="text-[17px] text-[#888888] max-w-[320px] leading-relaxed">
              Nous façonnons l&apos;avenir numérique des entreprises ambitieuses.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-8">Navigation</h4>
            <ul className="space-y-4">
              {["Travaux", "Services", "Process", "Contact"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase()}`} 
                    data-cursor="hover"
                    className="text-[14px] text-[#555555] hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-8">Légal</h4>
            <ul className="space-y-4">
              {["Mentions Légales", "Confidentialité", "Cookies"].map((item) => (
                <li key={item}>
                  <Link 
                    href="#" 
                    data-cursor="hover"
                    className="text-[14px] text-[#555555] hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
          <span className="text-[12px] font-mono text-[#555555] tracking-tight">
            © {currentYear} ALHAMBRA — TOUS DROITS RÉSERVÉS.
          </span>
          <div className="flex gap-8">
            {["LINKEDIN", "TWITTER", "INSTAGRAM"].map((social) => (
              <Link 
                key={social} 
                href="#" 
                data-cursor="hover"
                className="text-[10px] font-bold tracking-widest text-[#555555] hover:text-white transition-colors"
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
