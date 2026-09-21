import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NLX",
  description: "NLX — engineering, design and delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <main className="flex-1">{children}</main>
        {/* The footer now sits at the end of the document, so the clearance
            for the fixed mobile nav pill moved onto its bottom bar — padding
            on `main` would have opened a gap above the footer instead. */}
        <SiteFooter />
        <SiteNav />
      </body>
    </html>
  );
}
