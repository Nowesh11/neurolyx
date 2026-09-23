"use client"

import type { IconType } from "react-icons"
import {
  SiAnthropic,
  SiDocker,
  SiElectron,
  SiExpo,
  SiFastapi,
  SiFirebase,
  SiFlutter,
  SiLangchain,
  SiMongodb,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiWhatsapp,
} from "react-icons/si"

import {
  Accent,
  Reveal,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

type Tech = { name: string; icon: IconType }

const groups: { label: string; note: string; items: Tech[] }[] = [
  {
    label: "Web",
    note: "Fast, SEO-ready, accessible",
    items: [
      { name: "Next.js", icon: SiNextdotjs },
      { name: "React", icon: SiReact },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    label: "Mobile & desktop",
    note: "One codebase, every platform",
    items: [
      { name: "Flutter", icon: SiFlutter },
      { name: "React Native", icon: SiReact },
      { name: "Expo", icon: SiExpo },
      { name: "Electron", icon: SiElectron },
    ],
  },
  {
    label: "Backend & data",
    note: "Proven, well-documented",
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "FastAPI", icon: SiFastapi },
      { name: "Python", icon: SiPython },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Supabase", icon: SiSupabase },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Redis", icon: SiRedis },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    label: "AI & automation",
    note: "Grounded in your own data",
    items: [
      { name: "Claude", icon: SiAnthropic },
      { name: "LangChain", icon: SiLangchain },
      { name: "n8n", icon: SiN8N },
      { name: "WhatsApp Cloud API", icon: SiWhatsapp },
    ],
  },
  {
    label: "Ship & run",
    note: "Deployed on your accounts",
    items: [
      { name: "Docker", icon: SiDocker },
      { name: "Vercel", icon: SiVercel },
    ],
  },
]

const all = groups.flatMap((g) => g.items)
const half = Math.ceil(all.length / 2)
const rows = [all.slice(0, half), all.slice(half)]

function LogoRow({ items, reverse }: { items: Tech[]; reverse?: boolean }) {
  // Rendered twice so the -50% translate loops seamlessly.
  const doubled = [...items, ...items]
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <ul
        className={cn(
          "flex w-max gap-3 pr-3",
          reverse ? "animate-nlx-marquee-reverse" : "animate-nlx-marquee"
        )}
      >
        {doubled.map((tech, i) => {
          const Icon = tech.icon
          return (
            <li
              key={`${tech.name}-${i}`}
              className="flex items-center gap-3 rounded-full border border-border bg-surface/70 py-2.5 pr-5 pl-2.5 text-sm whitespace-nowrap text-text-secondary"
            >
              <span className="grid size-8 place-content-center rounded-full bg-surface-muted">
                <Icon aria-hidden className="size-4 text-brand-primary" />
              </span>
              {tech.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function TechStackSection() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/30 py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="04">Tech stack</SectionLabel>
            <SectionTitle className="mt-6">
              Boring tools that <Accent>will still be here</Accent> in five
              years.
            </SectionTitle>
          </div>
          <p className="max-w-md text-base leading-relaxed text-text-secondary lg:col-span-5 lg:justify-self-end">
            Nothing exotic. Every one of these is widely used and well
            documented, so if you ever hand the project to someone else they
            will know exactly what they are looking at — you are never locked
            in to us.
          </p>
        </Reveal>
      </div>

      {/* Full-bleed marquee — the list is also in the spec grid below, so
          the moving copy is hidden from assistive tech. */}
      <div aria-hidden className="mt-16 flex flex-col gap-3">
        <LogoRow items={rows[0]} />
        <LogoRow items={rows[1]} reverse />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal className="mt-16 grid grid-cols-1 overflow-hidden rounded-3xl border border-border sm:grid-cols-2 lg:grid-cols-5">
          {groups.map((group, i) => (
            <div
              key={group.label}
              className={cn(
                "flex flex-col gap-4 border-border bg-background/40 p-6",
                // Hairline dividers between cells at every breakpoint.
                i > 0 && "border-t sm:border-t-0",
                i % 2 === 1 && "sm:border-l",
                i >= 2 && "sm:border-t lg:border-t-0",
                i > 0 && "lg:border-l"
              )}
            >
              <div>
                <p className="font-mono text-[11px] text-brand-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-base font-medium text-foreground">
                  {group.label}
                </h3>
                <p className="mt-1 text-xs text-text-muted">{group.note}</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {group.items.map((tech) => (
                  <li key={tech.name} className="text-sm text-text-secondary">
                    {tech.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  )
}
