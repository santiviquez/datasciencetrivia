import type { Metadata } from "next";
import Script from "next/script";
import { Dela_Gothic_One, Maven_Pro, Poppins } from "next/font/google";
import { SITE, absoluteUrl } from "@/lib/site";
import { QUESTION_COUNT } from "@/lib/questions";
import "./globals.css";

const maven = Maven_Pro({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-maven",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: `Free data science flashcards. ${QUESTION_COUNT} questions and answers on machine learning, statistics, deep learning, LLMs and the history of AI — practise for interviews or just test yourself.`,
  applicationName: SITE.name,
  authors: [{ name: SITE.author.name, url: SITE.author.x }],
  creator: SITE.author.name,
  keywords: [
    "data science trivia",
    "data science flashcards",
    "data science interview questions",
    "machine learning interview questions",
    "statistics interview questions",
    "deep learning interview questions",
    "llm interview questions",
    "generative ai interview questions",
    "machine learning quiz",
    "data science quiz",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: absoluteUrl("/"),
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: `@${SITE.author.handle}`,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${maven.variable} ${poppins.variable} ${dela.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <Script
          defer
          data-domain="datasciencetrivia.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
