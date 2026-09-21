// Intentionally a Server Component: this footer has no state, effects or
// event handlers, only CSS hover. Keeping it off the client bundle also means
// `new Date().getFullYear()` below is evaluated once on the server, so it can
// never disagree with a client render across a new-year boundary.
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUp, Mail, MapPin, MessageCircle, Phone } from "lucide-react"

import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
} from "@/lib/contact-schema"
import { cn } from "@/lib/utils"

const columns: { heading: string; links: { label: string; href: string }[] }[] =
  [
    {
      heading: "Services",
      links: [
        { label: "WhatsApp chatbots", href: "#services" },
        { label: "AI chatbots & agents", href: "#services" },
        { label: "Workflow automation", href: "#services" },
        { label: "Custom software", href: "#services" },
        { label: "Dashboards & analytics", href: "#services" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Work", href: "#portfolio" },
        { label: "Tech stack", href: "#stack" },
        { label: "Pricing", href: "#pricing" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ]

const contactLinks = [
  {
    icon: MessageCircle,
    label: CONTACT_PHONE_DISPLAY,
    sub: "WhatsApp",
    href: CONTACT_WHATSAPP_URL,
    external: true,
  },
  {
    icon: Phone,
    label: CONTACT_PHONE_DISPLAY,
    sub: "Call",
    href: `tel:${CONTACT_PHONE_TEL}`,
    external: false,
  },
  {
    icon: Mail,
    label: CONTACT_EMAIL,
    sub: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
  },
]

function FooterLogo() {
  return (
    <Link
      href="#home"
      aria-label="NLX — back to top"
      className="flex w-fit shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/*
        Same treatment as the navbar: the source PNGs bake in a lot of padding,
        so each sits in a cropped box and is scaled past it. The `-dark`
        variants are the ones with the white field knocked out to alpha — the
        plain `logo.png` / `nlx.png` would show a white rectangle here.
      */}
      <span className="relative block h-9 w-12 shrink-0 overflow-hidden">
        <Image
          src="/logo-dark.png"
          alt=""
          fill
          sizes="48px"
          className="scale-[1.75] object-contain"
        />
      </span>
      <span className="relative block h-7 w-20 shrink-0 overflow-hidden">
        <Image
          src="/nlx-dark.png"
          alt="NLX"
          fill
          sizes="80px"
          className="scale-[2.6] object-contain"
        />
      </span>
    </Link>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative isolate w-full overflow-hidden bg-background text-foreground">
      {/* Hairline that reads as a lit edge rather than a plain border. */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, rgba(59,130,246,0.12) 0%, rgba(8,10,15,0) 70%)",
        }}
      />

      {/* Oversized wordmark bled off the bottom edge, echoing the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-6 -z-10 flex justify-center overflow-hidden select-none"
      >
        <span
          className="font-sans font-black text-[#F8FAFC] whitespace-nowrap"
          style={{
            opacity: 0.035,
            letterSpacing: "-0.05em",
            fontSize: "clamp(5rem, 18vw, 16rem)",
            lineHeight: 0.8,
          }}
        >
          NEUROLYX
        </span>
      </div>

      {/* ---------- CTA band ---------- */}
      <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-20">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-sm sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 120% at 90% 10%, rgba(59,130,246,0.18) 0%, rgba(8,10,15,0) 60%)",
            }}
          />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                Got something that should be running by itself?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-text-secondary sm:text-base">
                Tell us what is eating your time. You will get an honest answer
                on whether it is worth building — and what it would cost.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="#contact"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-6 text-sm font-semibold text-[#0B0F17] shadow-[0_6px_22px_rgba(59,130,246,0.35)] transition-colors hover:bg-brand-hover focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
              >
                Start a project
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface-muted/60 px-6 text-sm font-medium text-foreground transition-colors hover:border-brand-primary/50 hover:bg-surface-muted focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
              >
                <MessageCircle className="size-4" />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Main grid ---------- */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-4">
          <FooterLogo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
            An independent AI automation and software studio. We build the
            chatbots, automations and custom software that small businesses
            actually need — and hand every bit of it over in your name.
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-text-muted">
            <MapPin className="size-4 shrink-0 text-brand-secondary" />
            Working with clients across Malaysia and remote
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.heading} className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold tracking-widest text-text-muted uppercase">
              {column.heading}
            </h3>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-brand-primary focus-visible:text-brand-primary focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="sm:col-span-2 lg:col-span-4">
          <h3 className="mb-4 text-xs font-semibold tracking-widest text-text-muted uppercase">
            Get in touch
          </h3>
          <ul className="space-y-3">
            {contactLinks.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.sub}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 transition-all hover:border-brand-primary/40 hover:bg-surface focus-visible:ring-3 focus-visible:ring-brand-primary/30 focus-visible:outline-none"
                  >
                    <span className="grid size-9 shrink-0 place-content-center rounded-lg border border-border bg-surface-muted transition-colors group-hover:border-brand-primary/40">
                      <Icon className="size-4 text-brand-primary" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[0.7rem] font-medium tracking-widest text-text-muted uppercase">
                        {item.sub}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary motion-reduce:group-hover:translate-x-0" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="border-t border-border/60">
        <div
          className={cn(
            "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6",
            // Clears the nav pill fixed to the bottom of the viewport on mobile.
            "pb-28 sm:flex-row sm:pb-6"
          )}
        >
          <p className="text-xs text-text-muted">
            © {year} NLX · Neurolyx. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <p className="text-xs text-text-muted">
              Replies within one working day
            </p>
            <Link
              href="#home"
              className="group inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-primary/50 hover:text-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/30 focus-visible:outline-none"
            >
              Back to top
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
