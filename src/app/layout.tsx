import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Automom — AI Meeting Minutes Generator",
  description: "Turn meeting transcripts into structured minutes in seconds.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Automom — AI Meeting Minutes Generator",
    description: "Turn meeting transcripts into structured minutes in seconds.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary",
    title: "Automom — AI Meeting Minutes Generator",
    description: "Turn meeting transcripts into structured minutes in seconds.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* suppressHydrationWarning is required by next-themes: the theme
          class is applied client-side before React hydrates, which would
          otherwise cause a harmless but noisy mismatch warning. */}
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
          <ThemeProvider>
            <Header />
            {children}
            <Footer />
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
