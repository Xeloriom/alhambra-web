"use client";

import { RevealText, FadeUp } from "@/components/reveal-text";
import { EditableText } from "@/components/editable-text";

interface ServicesSectionProps {
  data?: {
    title: string;
    subtitle: string;
    items: { title: string; description: string; }[];
  };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function ServicesSection({ data, onUpdate, isEditing = false }: ServicesSectionProps) {
  const sData = data || {
    title: "Expertises",
    subtitle: "Nous combinons design d'exception et ingénierie de pointe.",
    items: []
  };

  const handleUpdate = (field: string, value: any) => {
    if (onUpdate) onUpdate(`services.${field}`, value);
  };

  return (
    <section id="services" className="border-b border-black/10 bg-white text-black">
      <div className="px-8 md:px-20 py-32 md:py-48 border-b border-black/10 flex flex-col md:flex-row md:items-end justify-between gap-16">
        <div className="max-w-3xl text-left">
          <FadeUp>
            <p className="text-[10px] font-black tracking-[0.4em] text-black/40 uppercase mb-8">
              Services
            </p>
          </FadeUp>
          <EditableText
            isEditing={isEditing}
            value={sData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-6xl md:text-9xl font-bold tracking-tighter text-black uppercase leading-[0.85]"
          />
        </div>
        <FadeUp delay={0.2} className="max-w-md text-left">
          <EditableText
            isEditing={isEditing}
            value={sData.subtitle}
            onSave={(v) => handleUpdate("subtitle", v)}
            as="p"
            className="text-xl text-black/50 leading-relaxed font-light"
          />
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {sData.items.map((service, i) => (
          <div key={i} className={`p-12 md:p-20 flex flex-col gap-12 ${i < sData.items.length - 1 ? "md:border-r border-black/10" : ""} hover:bg-[#FAFAFA] transition-colors group`}>
            <div className="w-20 h-20 bg-[#FAFAFA] border border-black/10 rounded-xl flex items-center justify-center text-black font-bold text-3xl group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500">
               {i + 1}
            </div>
            <div className="space-y-8 text-left">
              <EditableText
                isEditing={isEditing}
                value={service.title}
                onSave={(v) => {
                  const newItems = [...sData.items];
                  newItems[i].title = v;
                  handleUpdate("items", newItems);
                }}
                as="h3"
                className="text-3xl font-bold uppercase tracking-tight"
              />
              <EditableText
                isEditing={isEditing}
                value={service.description}
                onSave={(v) => {
                  const newItems = [...sData.items];
                  newItems[i].description = v;
                  handleUpdate("items", newItems);
                }}
                as="p"
                className="text-base text-black/50 leading-relaxed font-light"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
