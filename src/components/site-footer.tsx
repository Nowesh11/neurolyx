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
          src="/logo-gold.png"
          alt=""
          fill
          sizes="48px"
          className="scale-[1.75] object-contain"
        />
      </span>
      <span className="relative block h-7 w-20 shrink-0 overflow-hidden">
        <Image
          src="/nlx-gold.png"
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
            "radial-gradient(60% 50% at 50% 100%, rgba(226,183,116,0.10) 0%, rgba(10,9,8,0) 70%)",
        }}
      />

      {/* ---------- CTA band ---------- */}
      <div className="mx-auto max-w-7xl px-6 pt-20 md:pt-28">
        <div className="gold-ring relative overflow-hidden rounded-[2rem] bg-surface/70 p-8 sm:p-12 lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-brand-primary/15 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-brand-secondary/10 blur-[100px]"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h2 className="max-w-2xl text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance">
                Got something that should be{" "}
                <span className="font-serif font-normal tracking-[-0.01em] text-brand-primary italic">
                  running by itself?
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
                Tell us what is eating your time. You will get an honest answer
                on whether it is worth building — and what it would cost.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="#contact"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-7 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_-12px_rgba(226,183,116,0.7)] transition-colors hover:bg-brand-hover focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
              >
                Start a project
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-surface-muted/60 px-7 text-sm font-medium text-foreground transition-colors hover:border-brand-primary/50 hover:bg-surface-muted focus-visible:ring-3 focus-visible:ring-brand-primary/40 focus-visible:outline-none"
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
            <MapPin className="size-4 shrink-0 text-brand-primary" />
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

      {/* ---------- Wordmark ---------- */}
      {/* Full-width, gold-gradient signature. `vw` sizing makes it span the
          viewport at any width; the fade at the foot sinks it into the page. */}
      <div aria-hidden className="relative overflow-hidden px-4 select-none">
        <p
          className="text-gold-gradient text-center font-medium whitespace-nowrap"
          style={{
            fontSize: "clamp(4rem, 20.5vw, 19rem)",
            letterSpacing: "-0.06em",
            lineHeight: 0.85,
            maskImage: "linear-gradient(to bottom, #000 30%, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 30%, transparent 95%)",
          }}
        >
          neurolyx
        </p>
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
