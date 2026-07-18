"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import { SAMPLE_TRANSCRIPT } from "@/lib/sampleTranscript";
import { saveResults } from "@/lib/resultsStore";

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleFileAccepted(file: File) {
    setIsLoading(true);
    setExtractedText(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }

      setExtractedText(data.text);
      setSourceName(data.filename);
      toast.success("Transcript extracted successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSample() {
    setExtractedText(SAMPLE_TRANSCRIPT);
    setSourceName("sample-transcript.txt");
    toast.success("Sample transcript loaded.");
  }

  async function handleGenerate() {
    if (!extractedText) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-minutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate minutes.");
      }

      saveResults(data);
      router.push("/results");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate minutes.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Upload your meeting transcript
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          We&apos;ll turn it into structured minutes in seconds.
        </p>
      </div>

      <UploadZone onFileAccepted={handleFileAccepted} isLoading={isLoading} />

      <button
        type="button"
        onClick={handleSample}
        disabled={isLoading}
        className="mx-auto flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400 dark:hover:text-brand-300"
      >
        <Sparkles className="h-4 w-4" />
        Try Sample Transcript
      </button>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Extracting text...
        </div>
      )}

      {extractedText && (
        <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Extracted from {sourceName}
          </p>
          <p className="max-h-64 overflow-y-auto whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
            {extractedText}
          </p>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating minutes...
              </>
            ) : (
              "Generate Meeting Minutes"
            )}
          </button>
        </div>
      )}
    </main>
  );
}
