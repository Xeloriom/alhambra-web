"use client";

import { useState } from "react";
import { RevealText, FadeUp } from "@/components/reveal-text";
import { EditableText } from "@/components/editable-text";

interface FAQSectionProps {
  data?: {
    title: string;
    items: { q: string; a: string; }[];
  };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function FAQSection({ data, onUpdate, isEditing = false }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const fData = data || {
    title: "Questions Fréquentes",
    items: []
  };

  const handleUpdate = (field: string, value: any) => {
    if (onUpdate) onUpdate(`faq.${field}`, value);
  };

  return (
    <section id="faq" className="border-b border-black/10 bg-white grid-overlay">
      <div className="px-8 md:px-12 py-16 md:py-24 border-b border-black/10">
        <FadeUp>
           <p className="text-[10px] font-black tracking-[0.4em] text-[#FF4D00] uppercase mb-4">Support & Aide</p>
        </FadeUp>
        <EditableText
          isEditing={isEditing}
          value={fData.title}
          onSave={(v) => handleUpdate("title", v)}
          as="h2"
          className="text-4xl md:text-6xl font-black tracking-tighter text-[#000000] uppercase leading-[0.9]"
        />
      </div>

      <div className="divide-y divide-black/10">
        {fData.items.map((item, i) => (
          <div key={i} className="flex flex-col hover:bg-[#F9F9F9] transition-all">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="px-8 md:px-12 py-10 md:py-12 flex items-center justify-between text-left group"
            >
              <div className="flex-1 mr-8">
                 <EditableText
                  isEditing={isEditing}
                  value={item.q}
                  onSave={(v) => {
                    const newItems = [...fData.items];
                    newItems[i].q = v;
                    handleUpdate("items", newItems);
                  }}
                  as="h3"
                  className="text-xl md:text-2xl font-black uppercase tracking-tight group-hover:text-[#FF4D00] transition-colors"
                />
              </div>
              <div className={`w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-transform duration-500 ${openIndex === i ? "rotate-45" : ""}`}>
                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2V10M2 6H10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? "max-h-[300px] border-t border-black/5 bg-white/50" : "max-h-0"}`}>
               <div className="px-8 md:px-12 py-10 md:py-12 max-w-2xl">
                  <EditableText
                    isEditing={isEditing}
                    value={item.a}
                    onSave={(v) => {
                      const newItems = [...fData.items];
                      newItems[i].a = v;
                      handleUpdate("items", newItems);
                    }}
                    as="p"
                    className="text-base text-black/50 leading-relaxed font-medium"
                  />
               </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
