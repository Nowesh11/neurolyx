// Server Component: pure CSS animation, no state.
import { Fragment } from "react"

const capabilities = [
  "WhatsApp chatbots",
  "AI agents",
  "Workflow automation",
  "Custom software",
  "Live dashboards",
  "Mobile apps",
  "Integrations",
]

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
    >
      {capabilities.map((item, i) => (
        <Fragment key={item}>
          <li
            className={
              i % 2 === 0
                ? "font-serif text-3xl whitespace-nowrap text-foreground italic sm:text-5xl"
                : "text-2xl font-medium tracking-[-0.03em] whitespace-nowrap text-transparent sm:text-4xl [-webkit-text-stroke:1px_var(--text-secondary)]"
            }
          >
            {item}
          </li>
          <li aria-hidden className="text-lg text-brand-primary sm:text-2xl">
            ✦
          </li>
        </Fragment>
      ))}
    </ul>
  )
}

/**
 * The seam between the hero and the rest of the page. Two identical rows
 * slide by exactly one row's width (-50% of the track), so the loop is
 * seamless; the second copy is hidden from assistive tech.
 */
export function CapabilityMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/40 py-7 sm:py-9">
      <p className="sr-only">
        What we build: {capabilities.join(", ")}.
      </p>
      <div aria-hidden className="mask-fade-x flex">
        <div className="flex w-max animate-nlx-marquee">
          <Row hidden />
          <Row hidden />
        </div>
      </div>
    </div>
  )
}
