import type { Metadata, Viewport } from "next";
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

/**
 * The icons themselves are picked up from the file conventions in this
 * folder — `favicon.ico`, `icon.png` and `apple-icon.png` — so there is no
 * `icons` key here. Next emits the `<link>` tags automatically.
 */
export const metadata: Metadata = {
  title: {
    default: "NLX — AI automation & custom software",
    template: "%s · NLX",
  },
  description:
    "Independent AI automation and software studio. WhatsApp and AI chatbots, workflow automation, and custom web, mobile and desktop software — built end to end.",
  applicationName: "NLX",
};

// Tints the browser chrome on mobile to the same stage colour as the site.
export const viewport: Viewport = {
  themeColor: "#080A0F",
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
