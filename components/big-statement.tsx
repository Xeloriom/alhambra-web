"use client";

import { useRef } from "react";
import { EditableText } from "@/components/editable-text";

interface BigStatementProps {
  data?: { text: string };
  onUpdate?: (path: string, value: any) => void;
  isEditing?: boolean;
}

export function BigStatement({ data, onUpdate, isEditing = false }: BigStatementProps) {
  const sData = data || { text: "NOUS NE CRÉONS PAS SEULEMENT DES SITES WEB. NOUS CRÉONS DES EXPÉRIENCES." };

  const handleUpdate = (value: string) => {
    if (onUpdate) onUpdate("statement.text", value);
  };

  return (
    <section className="py-24 md:py-48 border-b border-black/10 bg-[#FF4D00] overflow-hidden">
      <div className="flex flex-col gap-6 md:gap-12">
        <div className="whitespace-nowrap">
          <EditableText
            isEditing={isEditing}
            value={sData.text}
            onSave={handleUpdate}
            as="h2"
            className="text-[clamp(2.5rem,8vw,12rem)] font-black tracking-tighter text-[#F9F9F9] uppercase leading-none italic"
          />
        </div>
        <div className="whitespace-nowrap flex justify-end">
           <h2 className="text-[clamp(2.5rem,8vw,12rem)] font-black tracking-tighter text-[#F9F9F9] uppercase leading-none opacity-20 outline-text">
            {sData.text.split('.')[0]}
           </h2>
        </div>
      </div>
      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 1px #F9F9F9;
          color: transparent;
        }
      `}</style>
      <div className="hidden">alhambra-web.com</div>
    </section>
  );
}
