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
    <section id="process" className="border-b border-black/10 bg-white text-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-black/5 blur-[120px] pointer-events-none" />
      
      <div className="px-8 md:px-12 py-24 md:py-48 border-b border-black/10 flex flex-col md:flex-row md:items-end justify-between gap-16 relative z-10">
        <div className="max-w-xl">
          <FadeUp>
             <p className="text-[10px] font-black tracking-[0.4em] text-black/40 uppercase mb-8">Méthodologie</p>
          </FadeUp>
          <EditableText
            isEditing={isEditing}
            value={pData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-5xl md:text-8xl font-black tracking-tighter text-black uppercase leading-[0.85]"
          />
        </div>
        <FadeUp delay={0.2} className="max-w-sm">
           <EditableText
            isEditing={isEditing}
            value={pData.subtitle}
            onSave={(v) => handleUpdate("subtitle", v)}
            as="p"
            className="text-lg text-black/40 leading-relaxed font-medium"
          />
        </FadeUp>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 relative z-10">
        {pData.steps.map((step, i) => (
          <div key={i} className={`px-8 md:px-12 py-24 md:py-32 flex flex-col gap-12 ${i < pData.steps.length - 1 ? "md:border-r border-black/10" : ""} hover:bg-black/[0.02] transition-all group`}>
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
                  className="text-5xl md:text-7xl font-black italic text-black/5 group-hover:text-black transition-all duration-500"
                />
             </div>
             <div className="space-y-6">
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
