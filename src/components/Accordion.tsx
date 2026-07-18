"use client";

import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface AccordionItemProps {
  icon: LucideIcon;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccordionItem({
  icon: Icon,
  title,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <span className="font-medium text-slate-900 dark:text-slate-100">{title}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="animate-fade-in border-t border-slate-100 px-6 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {children}
        </div>
      )}
    </div>
  );
}
