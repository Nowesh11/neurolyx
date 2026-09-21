"use client"

import * as React from "react"
import { useActionState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  BUDGET_OPTIONS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
  PROJECT_TYPES,
  initialContactState,
} from "@/lib/contact-schema"
import { submitContactForm } from "@/lib/contact-submit"
import { cn } from "@/lib/utils"
import { useRevealOnce } from "@/hooks/use-reveal-once"

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT_PHONE_DISPLAY,
    detail: "Fastest reply — usually within the hour",
    href: CONTACT_WHATSAPP_URL,
    external: true,
    accent: "text-[#22D3EE]",
  },
  {
    icon: Phone,
    label: "Call",
    value: CONTACT_PHONE_DISPLAY,
    detail: "Mon–Sat, 9am – 7pm MYT",
    href: `tel:${CONTACT_PHONE_TEL}`,
    external: false,
    accent: "text-brand-primary",
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    detail: "Best for detailed briefs and documents",
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
    accent: "text-brand-primary",
  },
]

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-xs text-error">
      {message}
    </p>
  )
}

export function ContactSection() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactState
  )
  const { ref, revealed } = useRevealOnce<HTMLDivElement>()

  // `useActionState` keeps the last result, so a local flag is what lets
  // someone send a second message without a page reload.
  const [sendingAnother, setSendingAnother] = React.useState(false)
  const showSuccess = state.status === "success" && !sendingAnother

  // The chosen option lives here, not in the radio group's own uncontrolled
  // state. Left uncontrolled, a re-render after a failed submit left the group
  // *looking* selected (`data-checked` was set) while every underlying native
  // radio reported `checked: false` — so `projectType` silently dropped out of
  // the FormData and the next submit complained "pick an option" about an
  // option that was visibly picked. This state survives the re-render, and a
  // hidden input below carries it into the form data.
  const [projectType, setProjectType] = React.useState("")

  // Move focus to the outcome banner so a screen reader (and a keyboard user)
  // learns the result instead of being left on the submit button.
  const outcomeRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (state.status !== "idle") outcomeRef.current?.focus()
  }, [state])

  return (
    <section className="relative w-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 55% at 85% 0%, rgba(59,130,246,0.12) 0%, rgba(8,10,15,0) 60%), radial-gradient(70% 50% at 5% 90%, rgba(8,145,178,0.10) 0%, rgba(8,10,15,0) 65%)",
        }}
      />

      <div
        ref={ref}
        className={cn(
          "relative mx-auto max-w-7xl px-6 py-20 transition-all duration-700 ease-out md:py-28 motion-reduce:transition-none",
          revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <div className="max-w-2xl">
          <Badge
            variant="outline"
            className="mb-6 border-brand-primary/30 bg-brand-primary/10 text-brand-primary"
          >
            Contact
          </Badge>
          <h2 className="text-balance text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
            Tell us what&apos;s slowing you down.{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">
              We&apos;ll tell you if we can fix it.
            </span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            No sales script and no obligation. Describe the problem and
            you&apos;ll get an honest answer on whether it&apos;s worth
            building, roughly what it would cost, and how long it would take.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left — direct channels */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {channels.map((channel) => {
              const Icon = channel.icon
              return (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-surface/60 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-primary/50 hover:bg-surface focus-visible:ring-3 focus-visible:ring-brand-primary/30 focus-visible:outline-none motion-reduce:hover:translate-y-0"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted transition-colors group-hover:border-brand-primary/40">
                    <Icon className={cn("size-5", channel.accent)} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-xs font-medium tracking-widest text-text-muted uppercase">
                      {channel.label}
                    </span>
                    <span className="truncate text-base font-semibold text-foreground">
                      {channel.value}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {channel.detail}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 ml-auto size-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-primary motion-reduce:group-hover:translate-x-0" />
                </a>
              )
            })}

            <div className="mt-2 flex items-start gap-3 rounded-2xl border border-border/60 bg-surface-muted/30 p-5">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-secondary" />
              <p className="text-sm leading-relaxed text-text-secondary">
                <span className="font-medium text-foreground">
                  Replies within one working day.
                </span>{" "}
                You&apos;ll hear back from the person who would build it — not a
                sales rep.
              </p>
            </div>
          </div>

          {/* Right — the form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-surface/60 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              {showSuccess ? (
                <div
                  ref={outcomeRef}
                  tabIndex={-1}
                  className="flex flex-col items-center gap-4 py-10 text-center outline-none"
                >
                  <span className="flex size-14 items-center justify-center rounded-full border border-success/30 bg-success/10">
                    <CheckCircle2 className="size-7 text-success" />
                  </span>
                  <h3 className="text-xl font-semibold">Message sent</h3>
                  <p className="max-w-sm text-sm text-text-secondary">
                    {state.message}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 h-10 rounded-full px-5"
                    onClick={() => {
                      setProjectType("")
                      setSendingAnother(true)
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form action={formAction} className="flex flex-col gap-5">
                  {/* Honeypot — hidden from people, irresistible to bots. */}
                  <input
                    type="text"
                    name="botcheck"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-name">
                        Name <span className="text-error">*</span>
                      </Label>
                      <Input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        defaultValue={state.values.name}
                        aria-invalid={Boolean(state.errors.name)}
                        aria-describedby={
                          state.errors.name ? "contact-name-error" : undefined
                        }
                      />
                      <FieldError
                        id="contact-name-error"
                        message={state.errors.name}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-email">
                        Email <span className="text-error">*</span>
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        defaultValue={state.values.email}
                        aria-invalid={Boolean(state.errors.email)}
                        aria-describedby={
                          state.errors.email ? "contact-email-error" : undefined
                        }
                      />
                      <FieldError
                        id="contact-email-error"
                        message={state.errors.email}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-phone">
                        Phone{" "}
                        <span className="text-xs font-normal text-text-muted">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="011-1234 5678"
                        defaultValue={state.values.phone}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-company">
                        Business{" "}
                        <span className="text-xs font-normal text-text-muted">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="contact-company"
                        name="company"
                        autoComplete="organization"
                        placeholder="Company name"
                        defaultValue={state.values.company}
                      />
                    </div>
                  </div>

                  <fieldset className="flex flex-col gap-3">
                    <legend className="mb-1 text-sm font-medium text-foreground">
                      What are you looking for?{" "}
                      <span className="text-error">*</span>
                    </legend>
                    {/*
                      The value is submitted through this hidden input rather
                      than through the radio group's own `name`. Base UI's
                      native radios fall out of sync after the form re-renders
                      (the group keeps `data-checked` on the right option
                      while every underlying input reports `checked: false`),
                      which silently dropped `projectType` from the FormData.
                      Driving it from the state we already hold is exact.
                    */}
                    <input
                      type="hidden"
                      name="projectType"
                      value={projectType}
                    />
                    <RadioGroup
                      value={projectType}
                      onValueChange={(value) => setProjectType(String(value))}
                      aria-describedby={
                        state.errors.projectType
                          ? "contact-projectType-error"
                          : undefined
                      }
                      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <RadioGroupCard
                          key={type.value}
                          value={type.value}
                          label={type.label}
                          hint={type.hint}
                        />
                      ))}
                    </RadioGroup>
                    <FieldError
                      id="contact-projectType-error"
                      message={state.errors.projectType}
                    />
                  </fieldset>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-budget">
                      Rough budget{" "}
                      <span className="text-xs font-normal text-text-muted">
                        (optional)
                      </span>
                    </Label>
                    <select
                      id="contact-budget"
                      name="budget"
                      defaultValue={state.values.budget ?? ""}
                      className="h-10 w-full rounded-lg border border-border bg-surface-muted/60 px-3 text-sm text-foreground shadow-sm transition-colors outline-none hover:border-border-strong focus-visible:border-brand-primary focus-visible:ring-3 focus-visible:ring-brand-primary/25 [&>option]:bg-surface [&>option]:text-foreground"
                    >
                      <option value="">Prefer not to say</option>
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-message">
                      What do you need? <span className="text-error">*</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      maxLength={5000}
                      placeholder="What's the task eating your time right now? Anything about your current tools or process helps."
                      defaultValue={state.values.message}
                      aria-invalid={Boolean(state.errors.message)}
                      aria-describedby={
                        state.errors.message
                          ? "contact-message-error"
                          : undefined
                      }
                    />
                    <FieldError
                      id="contact-message-error"
                      message={state.errors.message}
                    />
                  </div>

                  {state.status === "error" && (
                    <div
                      ref={outcomeRef}
                      tabIndex={-1}
                      role="alert"
                      className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-error outline-none"
                    >
                      {state.message}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={pending}
                      className="h-11 rounded-full px-7"
                    >
                      {pending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-text-muted">
                      Or message us on{" "}
                      <a
                        href={CONTACT_WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-brand-primary underline-offset-4 hover:underline"
                      >
                        WhatsApp
                      </a>{" "}
                      for a faster reply.
                    </p>
                  </div>

                  {/* Politely announced for assistive tech even when the
                      visible alert above is not rendered. */}
                  <p aria-live="polite" className="sr-only">
                    {state.status === "error" ? state.message : ""}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
