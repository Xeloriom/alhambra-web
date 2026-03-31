"use client";

import { RevealText, FadeUp } from "@/components/reveal-text";
import { EditableText } from "@/components/editable-text";

interface ProcessSectionProps {
  data?: {
    title: string;
    subtitle: string;
    steps: { num: string; title: string; text: string; }[];
  };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function ProcessSection({ data, onUpdate, isEditing = false }: ProcessSectionProps) {
  const pData = data || {
    title: "Notre Approche",
    subtitle: "Un processus structuré.",
    steps: []
  };

  const handleUpdate = (field: string, value: any) => {
    if (onUpdate) onUpdate(`process.${field}`, value);
  };

  return (
    <section id="process" className="border-b border-black/10 bg-[#000000] text-[#F9F9F9] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF4D00]/5 blur-[120px] pointer-events-none" />
      
      <div className="px-8 md:px-12 py-16 md:py-32 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-12 relative z-10">
        <div className="max-w-xl">
          <FadeUp>
             <p className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-4">Méthodologie</p>
          </FadeUp>
          <EditableText
            isEditing={isEditing}
            value={pData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-5xl md:text-8xl font-black tracking-tighter text-[#F9F9F9] uppercase leading-[0.85]"
          />
        </div>
        <FadeUp delay={0.2} className="max-w-sm">
           <EditableText
            isEditing={isEditing}
            value={pData.subtitle}
            onSave={(v) => handleUpdate("subtitle", v)}
            as="p"
            className="text-lg text-white/40 leading-relaxed font-medium"
          />
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 relative z-10">
        {pData.steps.map((step, i) => (
          <div key={i} className={`px-8 md:px-12 py-16 md:py-24 flex flex-col gap-10 ${i < pData.steps.length - 1 ? "md:border-r border-white/10" : ""} hover:bg-white/5 transition-all group`}>
             <div className="flex items-start justify-between">
                <EditableText
                  isEditing={isEditing}
                  value={step.num}
                  onSave={(v) => {
                    const newSteps = [...pData.steps];
                    newSteps[i].num = v;
                    handleUpdate("steps", newSteps);
                  }}
                  as="span"
                  className="text-5xl md:text-7xl font-black italic text-white/5 group-hover:text-[#FF4D00] transition-all duration-500"
                />
             </div>
             <div className="space-y-4">
                <EditableText
                  isEditing={isEditing}
                  value={step.title}
                  onSave={(v) => {
                    const newSteps = [...pData.steps];
                    newSteps[i].title = v;
                    handleUpdate("steps", newSteps);
                  }}
                  as="h3"
                  className="text-2xl font-black uppercase tracking-tight"
                />
                <EditableText
                  isEditing={isEditing}
                  value={step.text}
                  onSave={(v) => {
                    const newSteps = [...pData.steps];
                    newSteps[i].text = v;
                    handleUpdate("steps", newSteps);
                  }}
                  as="p"
                  className="text-sm text-white/30 leading-relaxed font-medium"
                />
             </div>
          </div>
        ))}
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
