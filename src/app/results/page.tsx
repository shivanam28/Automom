"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  FileText,
  Calendar,
  CheckCircle2,
  ListTodo,
  Tag,
  ArrowLeft,
  Download,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/Card";
import { FeedbackForm } from "@/components/FeedbackForm";
import { loadResults } from "@/lib/resultsStore";
import {
  FREE_DOWNLOAD_LIMIT,
  getRemainingDownloads,
  incrementDownloadCount,
  hasReachedLimit,
  markPendingDownload,
  consumePendingDownload,
} from "@/lib/usageLimit";
import type { MeetingMinutes } from "@/types/meeting";

export default function ResultsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [minutes, setMinutes] = useState<MeetingMinutes | null | undefined>(
    undefined
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setMinutes(loadResults());
    setRemaining(getRemainingDownloads());
  }, []);

  // Runs whenever auth state or the loaded minutes change. If the user
  // just came back from signing in specifically to unlock a download
  // (flagged before we sent them to Clerk), resume it automatically
  // instead of leaving them to notice and click Download again.
  useEffect(() => {
    if (isLoaded && isSignedIn && minutes && consumePendingDownload()) {
      toast.success("Signed in — downloading your PDF now.");
      handleDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, minutes]);

  function handleSignInToUnlockDownload() {
    markPendingDownload();
    // forceRedirectUrl keeps the user on this exact page after auth,
    // instead of Clerk's default (which falls back to the home page).
    openSignIn({ forceRedirectUrl: window.location.href });
  }

  async function handleDownload() {
    if (!minutes) return;

    // Signed-in users bypass the limit entirely. Anonymous users hitting
    // zero get a sign-in prompt instead of a download.
    if (!isSignedIn && hasReachedLimit()) {
      toast.error("You've used all 5 free downloads. Sign in to continue.");
      return;
    }

    setIsDownloading(true);

    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(minutes),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to generate PDF.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(minutes.meeting_title || "meeting-minutes")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (!isSignedIn) {
        incrementDownloadCount();
        setRemaining(getRemainingDownloads());
      }

      toast.success("PDF downloaded.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Download failed.";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  }

  // Still checking sessionStorage — avoid a flash of the empty state.
  if (minutes === undefined) {
    return null;
  }

  // Nothing found — most likely a direct visit to /results without
  // generating anything first (e.g. page refresh navigated here cold,
  // or a shared link opened in a different browser/session).
  if (minutes === null) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          No results found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Results are only available in the session where they were
          generated. Upload a transcript to get started.
        </p>
        <button
          onClick={() => router.push("/upload")}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Go to Upload
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => router.push("/upload")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upload
        </button>

        <div className="flex items-center gap-3">
          {isLoaded && !isSignedIn && remaining !== null && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Remaining Free Downloads&nbsp;
              <span className={remaining === 0 ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}>
                {remaining} / {FREE_DOWNLOAD_LIMIT}
              </span>
            </span>
          )}

          {isLoaded && !isSignedIn && remaining === 0 ? (
            <button
              onClick={handleSignInToUnlockDownload}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <Lock className="h-4 w-4" />
              Sign In to Continue
            </button>
          ) : (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading ? "Preparing PDF..." : "Download PDF"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {minutes.meeting_title || "Untitled Meeting"}
        </h1>
        {minutes.meeting_datetime && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {minutes.meeting_datetime}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card icon={FileText} title="Executive Summary" className="md:col-span-2">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {minutes.summary}
          </p>
        </Card>

        <Card icon={CheckCircle2} title="Key Decisions">
          {minutes.decisions.length > 0 ? (
            <ul className="space-y-2">
              {minutes.decisions.map((decision, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                  {decision}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">No decisions recorded.</p>
          )}
        </Card>

        <Card icon={ListTodo} title="Action Items">
          {minutes.action_items.length > 0 ? (
            <ul className="space-y-2">
              {minutes.action_items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500">No action items recorded.</p>
          )}
        </Card>

        <Card icon={Tag} title="Keywords" className="md:col-span-2">
          <div className="flex flex-wrap gap-2">
            {minutes.keywords.map((keyword, i) => (
              <span
                key={i}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
              >
                {keyword}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <FeedbackForm meetingTitle={minutes.meeting_title} />
      </div>
    </main>
  );
}
