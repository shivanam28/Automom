"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileDown,
  Zap,
  Gift,
  UploadCloud,
  Brain,
  Download,
  ArrowRight,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { TransformDemo } from "@/components/TransformDemo";
import { ReviewCard } from "@/components/ReviewCard";
import type { Review } from "@/types/review";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Extraction",
    description:
      "Automatically pulls out decisions, action items, and a clean summary — no manual note-taking.",
  },
  {
    icon: FileDown,
    title: "Professional PDF Export",
    description:
      "Download polished, shareable meeting minutes formatted and ready to send.",
  },
  {
    icon: Zap,
    title: "Seconds, Not Hours",
    description:
      "What used to take 20 minutes of typing after every meeting now takes one upload.",
  },
  {
    icon: Gift,
    title: "Free to Start",
    description:
      "Try it instantly with 5 free downloads — no credit card, no setup required.",
  },
];

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload your transcript",
    description: "Drop in a .txt or .docx transcript from Meet, Zoom, or Teams.",
  },
  {
    icon: Brain,
    title: "AI extracts what matters",
    description: "Decisions, action items, and a summary are pulled out automatically.",
  },
  {
    icon: Download,
    title: "Download your minutes",
    description: "Get a professional, ready-to-share PDF in seconds.",
  },
];

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    fetch("/api/reviews?limit=3")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => setReviews([]));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <span className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          AI Meeting Minutes Generator
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
          Turn rambling transcripts into
          <br className="hidden sm:block" /> decisions, instantly.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
          Automom reads your raw meeting transcript and hands you back a
          structured summary, decisions, and action items — formatted and
          ready to share.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/upload"
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600"
          >
            Upload Your Transcript
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/upload"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Try it with a sample first →
          </Link>
        </div>

        <div className="mt-14 flex justify-center">
          <TransformDemo />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center text-lg font-semibold text-slate-900 dark:text-slate-50">
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40">
                  <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-10 text-center text-lg font-semibold text-slate-900 dark:text-slate-50">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="text-center">
                <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500">
                  <Icon className="h-5 w-5 text-white" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-medium text-white dark:bg-slate-700">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews preview */}
      <section className="border-t border-slate-100 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              What people are saying
            </h2>
            <Link
              href="/reviews"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              See all reviews →
            </Link>
          </div>

          {reviews === null && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400 dark:text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading reviews...
            </div>
          )}

          {reviews && reviews.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
              No reviews yet — be the first to try Automom and share your
              thoughts.
            </p>
          )}

          {reviews && reviews.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Stop writing meeting notes by hand.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Upload your first transcript and see structured minutes in seconds.
        </p>
        <Link
          href="/upload"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600"
        >
          Upload Your Transcript
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Requested: help link right after the CTA, for anyone who
            doesn't have a transcript in hand yet. */}
        <div className="mt-4">
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Don&apos;t have a transcript yet? See how to get one
          </Link>
        </div>
      </section>
    </main>
  );
}
