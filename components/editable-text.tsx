"use client";

import { useState, useEffect, useRef } from "react";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditing?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export function EditableText({
  value,
  onSave,
  isEditing = false,
  className = "",
  as: Component = "span",
}: EditableTextProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (!isEditing) {
    return <Component className={className}>{value}</Component>;
  }

  const handleBlur = () => {
    setIsFocused(false);
    onSave(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={`relative group cursor-text transition-all duration-200 ${
        isFocused ? "ring-2 ring-[#FF4D00] ring-offset-4 rounded-lg bg-white/5" : "hover:bg-[#FF4D00]/5 hover:ring-1 hover:ring-[#FF4D00]/30 rounded-lg"
      }`}
      onClick={() => setIsFocused(true)}
    >
      {isFocused ? (
        Component === "p" || Component === "div" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`w-full bg-transparent outline-none resize-none overflow-hidden ${className}`}
            rows={localValue.split('\n').length || 1}
            style={{ height: 'auto' }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`w-full bg-transparent outline-none ${className}`}
          />
        )
      ) : (
        <>
          <Component className={className}>{localValue || "Texte vide..."}</Component>
          <div className="absolute -top-6 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="bg-[#FF4D00] text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter">Éditer</span>
          </div>
        </>
      )}
    </div>
  );
}
