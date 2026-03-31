"use client";

import { RevealText, FadeUp } from "@/components/reveal-text";
import { EditableText } from "@/components/editable-text";

interface WhyChooseUsProps {
  data?: {
    title: string;
    subtitle: string;
    items: { title: string; description: string; }[];
  };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function WhyChooseUs({ data, onUpdate, isEditing = false }: WhyChooseUsProps) {
  const wData = data || {
    title: "Pourquoi Nous ?",
    subtitle: "Plus qu'une agence.",
    items: []
  };

  const handleUpdate = (field: string, value: any) => {
    if (onUpdate) onUpdate(`why.${field}`, value);
  };

  return (
    <section id="why-choose-us" className="border-b border-black/10 bg-white grid-overlay overflow-hidden">
      <div className="px-8 md:px-12 py-16 md:py-24 border-b border-black/10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <FadeUp>
             <p className="text-[10px] font-black tracking-[0.4em] text-[#FF4D00] uppercase mb-4">Valeur Ajoutée</p>
          </FadeUp>
          <EditableText
            isEditing={isEditing}
            value={wData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-5xl md:text-7xl font-black tracking-tighter text-[#000000] uppercase leading-[0.85]"
          />
        </div>
        <FadeUp delay={0.2} className="max-w-sm">
           <EditableText
            isEditing={isEditing}
            value={wData.subtitle}
            onSave={(v) => handleUpdate("subtitle", v)}
            as="p"
            className="text-base text-black/50 leading-relaxed font-medium"
          />
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {wData.items.map((item, i) => (
          <div key={i} className={`p-8 md:p-16 flex flex-col gap-8 ${i < wData.items.length - 1 ? "md:border-r border-black/10" : ""} hover:bg-[#F9F9F9] transition-colors group`}>
             <div className="w-16 h-16 bg-[#F5F5F7] rounded-3xl flex items-center justify-center text-2xl group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-500 shadow-sm">
                {i === 0 ? "⚡" : i === 1 ? "🎨" : "🚀"}
             </div>
             <div className="space-y-4">
                <EditableText
                  isEditing={isEditing}
                  value={item.title}
                  onSave={(v) => {
                    const newItems = [...wData.items];
                    newItems[i].title = v;
                    handleUpdate("items", newItems);
                  }}
                  as="h3"
                  className="text-2xl font-black uppercase tracking-tight"
                />
                <EditableText
                  isEditing={isEditing}
                  value={item.description}
                  onSave={(v) => {
                    const newItems = [...wData.items];
                    newItems[i].description = v;
                    handleUpdate("items", newItems);
                  }}
                  as="p"
                  className="text-sm text-black/40 leading-relaxed font-medium"
                />
             </div>
          </div>
        ))}
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
