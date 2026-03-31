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
    <section id="testimonials" className="border-b border-black/10 bg-white grid-overlay overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left - Big Title */}
        <div className="p-8 md:p-24 md:border-r border-black/10 flex flex-col justify-center">
          <FadeUp>
             <p className="text-[10px] font-black tracking-[0.4em] text-[#FF4D00] uppercase mb-6">Avis Clients</p>
          </FadeUp>
          <EditableText
            isEditing={isEditing}
            value={tData.title}
            onSave={(v) => handleUpdate("title", v)}
            as="h2"
            className="text-4xl md:text-7xl font-black tracking-tighter text-[#000000] uppercase leading-[0.85]"
          />
        </div>

        {/* Right - Testimonials */}
        <div className="p-8 md:p-24 flex flex-col justify-center gap-12 bg-[#F9F9F9]">
          {tData.items.map((testimonial, i) => (
            <div key={i} className={`flex flex-col gap-8 transition-opacity duration-500 ${activeIndex === i ? "opacity-100" : "hidden opacity-0"}`}>
               <div className="text-4xl text-[#FF4D00] font-black leading-none">"</div>
               <EditableText
                  isEditing={isEditing}
                  value={testimonial.content}
                  onSave={(v) => {
                    const newItems = [...tData.items];
                    newItems[i].content = v;
                    handleUpdate("items", newItems);
                  }}
                  as="p"
                  className="text-2xl md:text-3xl font-bold tracking-tight text-black leading-tight italic"
                />
               <div className="flex flex-col gap-1 border-l-4 border-black pl-6">
                  <EditableText
                    isEditing={isEditing}
                    value={testimonial.name}
                    onSave={(v) => {
                      const newItems = [...tData.items];
                      newItems[i].name = v;
                      handleUpdate("items", newItems);
                    }}
                    as="span"
                    className="text-sm font-black uppercase tracking-widest text-black"
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

          <div className="flex gap-4">
             {tData.items.map((_, i) => (
               <button
                 key={i}
                 onClick={() => setActiveIndex(i)}
                 className={`w-12 h-2 rounded-full transition-all duration-500 ${activeIndex === i ? "bg-[#FF4D00] w-20 shadow-lg shadow-[#FF4D00]/20" : "bg-black/10 hover:bg-black/20"}`}
               />
             ))}
          </div>
        </div>
      </div>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
