"use client";

import { useEffect, useState } from "react";

export function CalendlyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-black hover:text-[#FF4D00] text-3xl font-bold z-10"
        >
          ×
        </button>
        <iframe
          src="https://calendly.com/votre-compte/appel-decouverte?hide_event_types=1&hide_gdpr_banner=1"
          width="100%"
          height="100%"
          frameBorder="0"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
