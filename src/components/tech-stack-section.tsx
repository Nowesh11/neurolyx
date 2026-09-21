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

import DisplayCards from "@/components/ui/display-cards"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRevealOnce } from "@/hooks/use-reveal-once"

type Tech = { name: string; icon: IconType }

const groups: { label: string; items: Tech[] }[] = [
  {
    label: "Web",
    items: [
      { name: "Next.js", icon: SiNextdotjs },
      { name: "React", icon: SiReact },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    label: "Mobile & desktop",
    items: [
      { name: "Flutter", icon: SiFlutter },
      { name: "React Native", icon: SiReact },
      { name: "Expo", icon: SiExpo },
      { name: "Electron", icon: SiElectron },
    ],
  },
  {
    label: "Backend & data",
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
    items: [
      { name: "Claude", icon: SiAnthropic },
      { name: "LangChain", icon: SiLangchain },
      { name: "n8n", icon: SiN8N },
      { name: "WhatsApp Cloud API", icon: SiWhatsapp },
    ],
  },
  {
    label: "Ship & run",
    items: [
      { name: "Docker", icon: SiDocker },
      { name: "Vercel", icon: SiVercel },
    ],
  },
]

const cards = [
  {
    icon: <SiNextdotjs className="size-4" />,
    title: "Web",
    description: "Next.js · React · Tailwind",
    date: "Fast, SEO-ready, accessible",
    className: cn(
      "[grid-area:stack] hover:-translate-y-10",
      "before:absolute before:top-0 before:left-0 before:h-full before:w-full before:rounded-xl before:bg-background/60 before:content-[''] before:transition-opacity before:duration-700 hover:before:opacity-0 focus-visible:before:opacity-0 grayscale hover:grayscale-0 focus-visible:grayscale-0"
    ),
  },
  {
    icon: <SiFlutter className="size-4" />,
    title: "Mobile & desktop",
    description: "Flutter · React Native · Electron",
    date: "One codebase, every platform",
    className: cn(
      "[grid-area:stack] translate-x-6 translate-y-10 hover:-translate-y-1 sm:translate-x-14 lg:translate-x-16",
      "before:absolute before:top-0 before:left-0 before:h-full before:w-full before:rounded-xl before:bg-background/60 before:content-[''] before:transition-opacity before:duration-700 hover:before:opacity-0 focus-visible:before:opacity-0 grayscale hover:grayscale-0 focus-visible:grayscale-0"
    ),
  },
  {
    icon: <SiFastapi className="size-4" />,
    title: "Backend & AI",
    description: "Node.js · FastAPI · Postgres",
    date: "Claude, n8n and your own data",
    className:
      "[grid-area:stack] translate-x-12 translate-y-20 hover:translate-y-10 sm:translate-x-28 lg:translate-x-32",
  },
]

export function TechStackSection() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>()

  return (
    <section className="relative w-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 80% 10%, rgba(59,130,246,0.10) 0%, rgba(8,10,15,0) 65%), radial-gradient(60% 45% at 10% 90%, rgba(8,145,178,0.08) 0%, rgba(8,10,15,0) 60%)",
        }}
      />

      <div
        ref={ref}
        className={cn(
          "relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 py-20 transition-all duration-700 ease-out md:py-28 lg:grid-cols-12 lg:gap-10 motion-reduce:transition-none",
          revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <div className="lg:col-span-6">
          <Badge
            variant="outline"
            className="mb-6 border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
          >
            Tech stack
          </Badge>

          <h2 className="text-balance text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
            Boring tools that{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
              will still be here
            </span>{" "}
            in five years
          </h2>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary">
            Nothing here is exotic. Every one of these is widely used and well
            documented, so if you ever hand the project to someone else, they
            will know exactly what they are looking at — and you are never
            locked in to us.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="mb-3 text-xs font-semibold tracking-widest text-text-muted uppercase">
                  {group.label}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((tech) => {
                    const Icon = tech.icon
                    return (
                      <li
                        key={`${group.label}-${tech.name}`}
                        className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted/50 px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-brand-primary/40 hover:text-foreground"
                      >
                        <Icon
                          aria-hidden
                          className="size-4 shrink-0 text-brand-primary"
                        />
                        {tech.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:col-span-6 lg:justify-end">
          <DisplayCards cards={cards} />
        </div>
      </div>
    </section>
  )
}
