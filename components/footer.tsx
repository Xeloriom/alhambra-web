import Link from "next/link";

const footerLinks = [
  {
    heading: "Services",
    links: ["Design Web", "Apps Mobiles", "Logiciels Sur Mesure", "Design UI/UX"],
  },
  {
    heading: "Entreprise",
    links: ["À Propos", "Travaux", "Tarifs", "Blog"],
  },
  {
    heading: "Légal",
    links: ["Politique de Confidentialité", "Conditions d'Utilisation", "Politique de Cookies"],
  },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/10">
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-black/10">
        {/* Brand */}
        <div className="md:col-span-1 px-8 md:px-12 py-20 border-r border-black/10">
          <Link href="/" className="text-[#000000] font-black text-3xl tracking-tighter">
            ALHAMBRA<span className="text-[#FF4D00]">.</span>
          </Link>
          <p className="text-sm text-black/40 mt-6 leading-relaxed max-w-[200px]">
            Nous créons des expériences digitales durables.
          </p>
        </div>

        {/* Links */}
        {footerLinks.map((group) => (
          <div key={group.heading} className="px-8 py-20 border-r border-black/10">
            <p className="text-[10px] font-black tracking-[0.4em] text-black/30 uppercase mb-8">
              {group.heading}
            </p>
            <ul className="flex flex-col gap-4">
              {group.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm font-semibold text-black/60 hover:text-black transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="px-8 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-black/30 font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} ALHAMBRA Studio. Tous droits réservés.
        </p>
        <div className="flex items-center gap-10">
          {["Twitter", "LinkedIn", "Dribbble", "GitHub"].map((social) => (
            <Link
              key={social}
              href="#"
              className="text-[10px] font-black tracking-[0.4em] text-black/30 hover:text-black transition-colors uppercase"
            >
              {social}
            </Link>
          ))}
        </div>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </footer>
  );
}
