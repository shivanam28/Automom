"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { toast } from "sonner";
import { validateFile } from "@/lib/validation";

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  isLoading?: boolean;
}

export function UploadZone({ onFileAccepted, isLoading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const result = validateFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (!result.valid) {
        toast.error(result.error);
        return;
      }

      onFileAccepted(file);
    },
    [onFileAccepted]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
        isDragging
          ? "border-brand-500 bg-brand-50 dark:bg-brand-950/20"
          : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"
      } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="rounded-full bg-brand-50 p-3 dark:bg-brand-950/40">
        {isDragging ? (
          <FileText className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        ) : (
          <UploadCloud className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        )}
      </div>

      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Drag and drop your transcript here
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500">.txt or .docx, up to 5MB</p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Choose File"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".txt,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
