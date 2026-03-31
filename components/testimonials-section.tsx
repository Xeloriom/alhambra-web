"use client";

import { useState } from "react";
import { RevealText, FadeUp } from "@/components/reveal-text";
import { EditableText } from "@/components/editable-text";

interface TestimonialsSectionProps {
  data?: {
    title: string;
    items: { name: string; role: string; content: string; }[];
  };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function TestimonialsSection({ data, onUpdate, isEditing = false }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const tData = data || {
    title: "Ils nous font confiance",
    items: []
  };

  const handleUpdate = (field: string, value: any) => {
    if (onUpdate) onUpdate(`testimonials.${field}`, value);
  };

  return (
    <section id="testimonials" className="border-b border-black/10 bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left - Big Title */}
        <div className="p-8 md:p-32 md:border-r border-black/10 flex flex-col justify-center">
          <FadeUp>
             <p className="text-[10px] font-black tracking-[0.4em] text-black/40 uppercase mb-8">Avis Clients</p>
          </FadeUp>
          <EditableText
            isEditing={isEditing}
            value={tData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-4xl md:text-8xl font-black tracking-tighter text-black uppercase leading-[0.85]"
          />
        </div>

        {/* Right - Testimonials */}
        <div className="p-8 md:p-32 flex flex-col justify-center gap-16 bg-[#FAFAFA]">
          {tData.items.map((testimonial, i) => (
            <div key={i} className={`flex flex-col gap-10 transition-opacity duration-500 ${activeIndex === i ? "opacity-100" : "hidden opacity-0"}`}>
               <div className="text-5xl text-black font-black leading-none">"</div>
               <EditableText
                  isEditing={isEditing}
                  value={testimonial.content}
                  onSave={(v) => {
                    const newItems = [...tData.items];
                    newItems[i].content = v;
                    handleUpdate("items", newItems);
                  }}
                  as="p"
                  className="text-2xl md:text-4xl font-bold tracking-tight text-black leading-tight italic"
                />
               <div className="flex flex-col gap-2 border-l-4 border-black pl-8">
                  <EditableText
                    isEditing={isEditing}
                    value={testimonial.name}
                    onSave={(v) => {
                      const newItems = [...tData.items];
                      newItems[i].name = v;
                      handleUpdate("items", newItems);
                    }}
                    as="span"
                    className="text-lg font-black uppercase tracking-widest text-black"
                  />
                  <EditableText
                    isEditing={isEditing}
                    value={testimonial.role}
                    onSave={(v) => {
                      const newItems = [...tData.items];
                      newItems[i].role = v;
                      handleUpdate("items", newItems);
                    }}
                    as="span"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30"
                  />
               </div>
            </div>
          ))}

          <div className="flex gap-6">
             {tData.items.map((_, i) => (
               <button
                 key={i}
                 onClick={() => setActiveIndex(i)}
                 className={`w-16 h-1.5 rounded-full transition-all duration-500 ${activeIndex === i ? "bg-black w-24" : "bg-black/10 hover:bg-black/20"}`}
               />
             ))}
          </div>
        </div>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
