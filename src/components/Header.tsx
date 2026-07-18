"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/upload", label: "Upload" },
  { href: "/reviews", label: "Reviews" },
  { href: "/help", label: "Help" },
];

export function Header() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <Logo />
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Automom
          </span>
        </Link>

        {/* Desktop nav — hidden below the sm breakpoint, replaced by the
            hamburger panel below instead of trying to squeeze links in. */}
        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <SignedIn>
            <div className="flex items-center gap-2">
              {user?.firstName && (
                <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
                  {user.firstName}
                </span>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg bg-brand-500 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-brand-600">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          {/* Hamburger toggle — only visible below the sm breakpoint,
              where the horizontal nav above is hidden. */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel — only rendered when open, only visible
          below sm. Links close the menu on click so navigating away
          doesn't leave it open in the background. */}
      {isMenuOpen && (
        <nav className="animate-fade-in flex flex-col gap-1 border-t border-slate-100 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
