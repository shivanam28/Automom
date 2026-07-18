"use client";

import Link from "next/link";
import { Video, MessageSquare, Users, FileQuestion, ArrowRight } from "lucide-react";
import { AccordionItem } from "@/components/Accordion";

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 text-center">
        <FileQuestion className="mx-auto mb-3 h-8 w-8 text-brand-500 dark:text-brand-400" />
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          How to get your meeting transcript
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Automom needs a transcript, not a recording. Here&apos;s how to
          export one from the platform you used.
        </p>
      </div>

      <div className="space-y-4">
        <AccordionItem icon={Video} title="Google Meet" defaultOpen>
          <ol className="list-decimal space-y-2 pl-4">
            <li>
              Transcripts must be turned on for the meeting — either by a
              Google Workspace admin, or manually during the call via{" "}
              <strong>Activities → Transcripts → Start transcript</strong>.
            </li>
            <li>
              After the meeting ends, Google Meet saves the transcript as a
              Google Doc in the meeting organizer&apos;s Drive, inside a
              folder called <strong>Meet Recordings</strong>.
            </li>
            <li>
              Open that Doc, then go to{" "}
              <strong>File → Download → Plain Text (.txt)</strong>.
            </li>
            <li>Upload the downloaded .txt file to Automom.</li>
          </ol>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Note: transcription is a Google Workspace feature and may not be
            available on free/personal Gmail accounts.
          </p>
        </AccordionItem>

        <AccordionItem icon={MessageSquare} title="Zoom">
          <ol className="list-decimal space-y-2 pl-4">
            <li>
              Cloud recording with audio transcript must be enabled before
              the meeting, under{" "}
              <strong>Settings → Recording → Audio transcript</strong>.
            </li>
            <li>
              After the meeting, go to{" "}
              <strong>zoom.us → Recordings → Cloud Recordings</strong> and
              open the finished recording.
            </li>
            <li>
              Find the <strong>Audio Transcript</strong> file and click{" "}
              <strong>Download</strong> — this saves a <code>.vtt</code>{" "}
              file.
            </li>
            <li>
              Open the <code>.vtt</code> file in any text editor (like
              Notepad or TextEdit) and save it as a plain <code>.txt</code>{" "}
              file.
            </li>
            <li>Upload that .txt file to Automom.</li>
          </ol>
        </AccordionItem>

        <AccordionItem icon={Users} title="Microsoft Teams">
          <ol className="list-decimal space-y-2 pl-4">
            <li>
              The meeting must be recorded (
              <strong>Record and transcribe</strong> from the meeting
              controls) — Teams generates the transcript automatically as
              the recording processes.
            </li>
            <li>
              Once ready, open the meeting chat or calendar event and click
              into the recording.
            </li>
            <li>
              Select the <strong>Transcript</strong> tab, then use the{" "}
              <strong>⋯ menu → Download</strong> to save it as a Word
              document (.docx).
            </li>
            <li>Upload that .docx file directly to Automom.</li>
          </ol>
        </AccordionItem>
      </div>

      <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Don&apos;t have a transcript handy? You can still see how Automom
          works using our built-in sample.
        </p>
        <Link
          href="/upload"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Try the Sample Transcript
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
