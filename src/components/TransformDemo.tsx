import { ArrowRight } from "lucide-react";

export function TransformDemo() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-3">
      <div className="w-full max-w-xs rotate-[-1.5deg] rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Raw Transcript
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Priya: ok so — Arjun did you finish the mockups... Arjun: yeah
          basically, um, I think we ship onboarding first then— Meera: wait
          I need two more weeks for the API...
        </p>
      </div>

      <div className="flex items-center justify-center py-1 sm:py-0">
        <ArrowRight className="h-5 w-5 rotate-90 text-brand-400 sm:rotate-0" />
      </div>

      <div className="w-full max-w-xs rotate-[1.5deg] rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Meeting Minutes
        </p>
        <div className="space-y-1.5">
          <div className="flex gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
            <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-brand-500" />
            Onboarding ships before dashboard changes
          </div>
          <div className="flex gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
            <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-brand-500" />
            Meera: API changes ready by Mar 28
          </div>
        </div>
      </div>
    </div>
  );
}
