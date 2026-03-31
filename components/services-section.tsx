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
    <section id="services" className="border-b border-[#E5E5E5] bg-white text-black">
      <div className="px-8 md:px-20 py-20 md:py-32 border-b border-[#E5E5E5] flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-2xl text-left">
          <FadeUp>
            <p className="text-[10px] font-black tracking-[0.4em] text-black/40 uppercase mb-6">
              Services
            </p>
          </FadeUp>
          <EditableText
            isEditing={isEditing}
            value={sData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-5xl md:text-7xl font-bold tracking-tighter text-black uppercase leading-[0.9]"
          />
        </div>
        <FadeUp delay={0.2} className="max-w-sm text-left">
          <EditableText
            isEditing={isEditing}
            value={sData.subtitle}
            onSave={(v) => handleUpdate("subtitle", v)}
            as="p"
            className="text-lg text-black/50 leading-relaxed font-light"
          />
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {sData.items.map((service, i) => (
          <div key={i} className={`p-10 md:p-16 flex flex-col gap-10 ${i < sData.items.length - 1 ? "md:border-r border-[#E5E5E5]" : ""} hover:bg-[#FAFAFA] transition-colors group`}>
            <div className="w-16 h-16 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg flex items-center justify-center text-black font-bold text-2xl group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-500">
               {i + 1}
            </div>
            <div className="space-y-6 text-left">
              <EditableText
                isEditing={isEditing}
                value={service.title}
                onSave={(v) => {
                  const newItems = [...sData.items];
                  newItems[i].title = v;
                  handleUpdate("items", newItems);
                }}
                as="h3"
                className="text-2xl font-bold uppercase tracking-tight"
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
                className="text-sm text-black/50 leading-relaxed font-light"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
