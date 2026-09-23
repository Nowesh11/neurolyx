"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import {
  Accent,
  Reveal,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

type Project = {
  title: string
  category: string
  description: string
  href: string
  /** Remove once a project is real — see the note below. */
  tag?: string
  image: { src: string; alt: string }
  /** Bento placement on the 12-column desktop grid. */
  span: string
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  REPLACE THIS ARRAY WITH REAL WORK.
 *
 *  These are illustrative concepts, not delivered client projects, so the
 *  copy says so on the page and every `href` points at the contact form
 *  rather than a fake case study. Presenting invented builds as a track
 *  record would mislead the people deciding whether to hire you.
 *
 *  Swapping in the real thing is just this array: set `href` to the live
 *  site or case study (external URLs open in a new tab automatically), drop
 *  the image in `public/img/`, and delete the `tag: "Concept"` line plus
 *  the disclaimer under the heading below.
 * ─────────────────────────────────────────────────────────────────────────
 */
const projects: Project[] = [
  {
    title: "Clinic booking assistant",
    category: "WhatsApp · Scheduling",
    description:
      "Answers enquiries, checks the calendar and books the slot — without the front desk touching it.",
    href: "#contact",
    tag: "Concept",
    image: {
      src: "/img/work-clinic.jpg",
      alt: "A dark glass calendar slab beside a floating chat bubble",
    },
    span: "lg:col-span-7 lg:row-span-2",
  },
  {
    title: "Retail order assistant",
    category: "AI chat · E-commerce",
    description:
      "Stock, sizing and delivery times answered in chat, straight from the live catalogue.",
    href: "#contact",
    tag: "Concept",
    image: {
      src: "/img/work-retail.jpg",
      alt: "Matte black gift boxes and shopping bags with gold edges",
    },
    span: "lg:col-span-5",
  },
  {
    title: "Field service dispatch",
    category: "Mobile · Operations",
    description:
      "Jobs assigned to the nearest technician and closed out with photos and a signature.",
    href: "#contact",
    tag: "Concept",
    image: {
      src: "/img/work-field.jpg",
      alt: "A black stone relief map traced with gold route lines",
    },
    span: "lg:col-span-5",
  },
  {
    title: "Operations control tower",
    category: "Custom software",
    description:
      "One screen pulling from every system the business runs.",
    href: "#contact",
    tag: "Concept",
    image: {
      src: "/img/work-tower.jpg",
      alt: "Tall glass control panels arranged in a semicircle",
    },
    span: "lg:col-span-4",
  },
  {
    title: "Live operations dashboard",
    category: "Analytics",
    description:
      "Revenue, jobs and response times updating live, with alerts on drift.",
    href: "#contact",
    tag: "Concept",
    image: {
      src: "/img/work-dashboard.jpg",
      alt: "A dark glass panel showing glowing gold charts",
    },
    span: "lg:col-span-4",
  },
  {
    title: "Invoice & document flow",
    category: "Automation",
    description:
      "Quotes and invoices generated, sent and chased automatically.",
    href: "#contact",
    tag: "Concept",
    image: {
      src: "/img/work-invoice.jpg",
      alt: "Ivory paper sheets flowing along an arc of gold light",
    },
    span: "lg:col-span-4",
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const external = /^https?:\/\//.test(project.href)
  const featured = index === 0

  return (
    <a
      href={project.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-surface outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <Image
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes={
          featured
            ? "(min-width: 1024px) 58vw, 100vw"
            : "(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
        }
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:transition-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-500 group-hover:opacity-90"
      />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
        {project.tag ? (
          <span className="rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-[11px] font-medium tracking-[0.14em] text-text-secondary uppercase backdrop-blur-md">
            {project.tag}
          </span>
        ) : (
          <span />
        )}
        <span className="grid size-10 translate-y-1 place-content-center rounded-full bg-brand-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="relative p-5 sm:p-7">
        <p className="font-mono text-[11px] tracking-wide text-brand-primary">
          {String(index + 1).padStart(2, "0")} — {project.category}
        </p>
        <h3
          className={cn(
            "mt-2 font-medium tracking-[-0.03em] text-foreground",
            featured ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          {project.title}
        </h3>
        <p
          className={cn(
            "mt-2 max-w-md text-sm leading-relaxed text-text-secondary",
            !featured && "line-clamp-2"
          )}
        >
          {project.description}
        </p>
      </div>
    </a>
  )
}

export function PortfolioSection() {
  return (
    <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
      <Reveal className="mb-14 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <SectionLabel index="03">Selected work</SectionLabel>
          <SectionTitle className="mt-6">
            What this looks like <Accent>in practice.</Accent>
          </SectionTitle>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-text-secondary lg:col-span-5 lg:justify-self-end">
          Concept pieces showing the kind of thing we build — real case
          studies go up here as projects ship. Each one is a starting point
          for a conversation about yours.
        </p>
      </Reveal>

      <div className="grid auto-rows-[minmax(22rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {projects.map((project, i) => (
          <Reveal
            key={project.title}
            delay={(i % 3) * 90}
            className={cn(
              (i === 0 || i === projects.length - 1) && "sm:col-span-2",
              project.span
            )}
          >
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
