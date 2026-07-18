import type { LucideIcon } from "lucide-react";

interface CardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ icon: Icon, title, children, className = "" }: CardProps) {
  return (
    <div
      className={`animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
