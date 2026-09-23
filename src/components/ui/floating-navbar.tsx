"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface FloatingNavbarProps {
  items: NavItem[]
  contactHref?: string
  ctaText?: string
  className?: string
}

type LampTransition = {
  type: "spring"
  stiffness: number
  damping: number
  mass: number
}

const LAMP_TRANSITION: LampTransition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.8,
}

/**
 * Logo asset note: `logo.png` / `nlx.png` are opaque PNGs — white field, navy
 * artwork — so the usual `mix-blend-multiply` only strips the white against a
 * LIGHT backdrop. On this dark theme it would erase the artwork instead, so the
 * `*-gold.png` variants are used: white field knocked out to alpha, navy
 * remapped to ivory #F5EFE6 and the blue accent to champagne gold #E2B774
 * (generated from the `*-dark.png` files with sharp). Each sits in a cropped box
 * (`object-contain` + a scale) to zoom past the padding baked into the source.
 */
function Logo({ showWordmark = true }: { showWordmark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="NLX — home"
      className="flex shrink-0 items-center gap-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <span className="relative block h-6 w-8 shrink-0 overflow-hidden">
        <Image
          src="/logo-gold.png"
          alt=""
          fill
          sizes="32px"
          loading="eager"
          fetchPriority="high"
          className="scale-[1.75] object-contain"
        />
      </span>
      {showWordmark && (
        <span className="relative block h-5 w-14 shrink-0 overflow-hidden">
          <Image
            src="/nlx-gold.png"
            alt="NLX"
            fill
            sizes="56px"
            loading="eager"
            fetchPriority="high"
            className="scale-[2.6] object-contain"
          />
        </span>
      )}
    </Link>
  )
}

/**
 * Hoisted out of FloatingNavbar on purpose. Declared inline it would be a new
 * component *type* on every render, so React would unmount and remount the
 * whole list each time `activeTab` changed — which destroys the `layoutId`
 * element the lamp animates between, and the lamp would jump instead of slide.
 */
function NavLinks({
  items,
  activeTab,
  onSelect,
  iconOnly = false,
}: {
  items: NavItem[]
  activeTab: string
  onSelect: (name: string) => void
  iconOnly?: boolean
}) {
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.name

        return (
          <li key={item.name}>
            <a
              href={item.url}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelect(item.name)}
              className={cn(
                "relative flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                "text-text-secondary hover:text-brand-primary",
                "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                isActive && "text-brand-primary"
              )}
            >
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layoutId={iconOnly ? "nlx-lamp-mobile" : "nlx-lamp-desktop"}
                  initial={false}
                  transition={LAMP_TRANSITION}
                  className="absolute inset-0 rounded-full bg-brand-primary/15"
                >
                  <span className="absolute -top-[7px] left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-brand-primary">
                    <span className="absolute -top-1.5 left-1/2 h-4 w-9 -translate-x-1/2 rounded-full bg-brand-primary/30 blur-md" />
                  </span>
                </motion.span>
              )}

              {iconOnly ? (
                <>
                  <Icon
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden="true"
                    className="relative z-10"
                  />
                  <span className="sr-only">{item.name}</span>
                </>
              ) : (
                <span className="relative z-10">{item.name}</span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Compact floating navbar — logo, nav links and CTA in ONE short rounded pill,
 * centred with margin on both sides (not full-bleed). Replaces the previous
 * full-width SiteHeader + separate floating NavBar pattern.
 *
 * The pill hugs its content rather than stretching to a fixed width, so the
 * logo sits directly beside the first nav item instead of being pushed to the
 * far edge by `justify-between`.
 *
 * On mobile all three pieces in one bar would be cramped, so it splits: a small
 * logo chip top-left and an icon-only nav pill fixed to the bottom (thumb
 * reach). Both breakpoints are pure CSS, not a JS `isMobile` flag, so the first
 * paint is already correct and there is no hydration mismatch. The two nav
 * copies use different `layoutId`s so their lamps never fight over one element.
 */
export function FloatingNavbar({
  items,
  contactHref = "#contact",
  ctaText = "Book a consult",
  className,
}: FloatingNavbarProps) {
  const [activeTab, setActiveTab] = useState(() => items[0]?.name ?? "")

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const match = items.find((item) => item.url === hash)
      if (match) setActiveTab(match.name)
    }

    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [items])

  return (
    <>
      {/* Desktop / tablet — one short pill that hugs its contents */}
      <header
        className={cn(
          "fixed top-4 left-1/2 z-50 hidden -translate-x-1/2 sm:flex",
          "w-auto max-w-[calc(100%-2rem)] items-center justify-center gap-4",
          "rounded-full border border-white/10 bg-surface/70 backdrop-blur-xl",
          "px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
          "animate-in fade-in slide-in-from-top-3 duration-700 ease-out fill-mode-both",
          className
        )}
      >
        <Logo />
        <nav aria-label="Primary">
          <NavLinks
            items={items}
            activeTab={activeTab}
            onSelect={setActiveTab}
          />
        </nav>
        <a
          href={contactHref}
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-primary-foreground transition-colors outline-none hover:bg-brand-hover active:bg-brand-active focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {ctaText}
        </a>
      </header>

      {/* Mobile — logo chip top-left, icon-only nav pill bottom for thumb reach */}
      <div className="fixed top-4 left-4 z-50 flex items-center rounded-full border border-white/10 bg-surface/70 px-3 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-700 ease-out fill-mode-both sm:hidden">
        <Logo showWordmark={false} />
      </div>
      <nav
        aria-label="Primary"
        className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-surface/70 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 ease-out fill-mode-both sm:hidden"
      >
        <NavLinks
          items={items}
          activeTab={activeTab}
          onSelect={setActiveTab}
          iconOnly
        />
      </nav>
    </>
  )
}
