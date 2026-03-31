"use client";

import { FadeUp } from "@/components/reveal-text";

const clients = [
  { name: "STRIPE", width: 80 },
  { name: "NOTION", width: 90 },
  { name: "FIGMA", width: 70 },
  { name: "SLACK", width: 80 },
  { name: "SPOTIFY", width: 95 },
  { name: "AIRBNB", width: 85 },
];

export function ClientLogos() {
  return (
    <section className="py-16 md:py-20 border-b border-black/10 bg-[#F9F9F9]">
      <div className="px-6 md:px-12 lg:px-16">
        <FadeUp>
          <p className="text-center text-xs font-semibold tracking-[0.25em] text-black/40 uppercase mb-12">
            Trusted by industry leaders
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 md:gap-x-20 gap-y-8">
            {clients.map((client) => (
              <div
                key={client.name}
                className="group relative"
              >
                <span
                  className="text-xl md:text-2xl font-black tracking-tighter text-black/20 group-hover:text-black transition-colors duration-300"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
