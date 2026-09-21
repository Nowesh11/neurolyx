/**
 * Shared shapes and validation for the contact form.
 *
 * Note on architecture: the submission runs in the browser, not in a Server
 * Action. Web3Forms rejects server-side POSTs on the free plan —
 * `{"success": false, "message": "This method is not allowed. Use our API in
 * client side ... (Pro plan is required)"}` with HTTP 403 — so the request has
 * to come from the page itself. That is also why the key is
 * `NEXT_PUBLIC_…`: Web3Forms access keys are public by design, and the
 * endpoint is write-only (a key lets someone send you mail, not read anything).
 */

/**
 * Contact details, in one place. The hero's WhatsApp CTA and the contact
 * section both read from here, so the number can never drift between them.
 * WhatsApp needs the full international form with no `+` and no leading zero.
 */
export const CONTACT_PHONE_DISPLAY = "011-1280 1350"
export const CONTACT_PHONE_TEL = "+601112801350"
export const CONTACT_WHATSAPP_URL = "https://wa.me/601112801350"
export const CONTACT_EMAIL = "nowesh03@gmail.com"

export const PROJECT_TYPES = [
  {
    value: "website",
    label: "Website",
    hint: "Marketing site, landing page, e‑commerce",
  },
  {
    value: "mobile-app",
    label: "Mobile app",
    hint: "iOS, Android or cross‑platform",
  },
  {
    value: "ai-automation",
    label: "AI automation",
    hint: "Workflows, agents, document processing",
  },
  {
    value: "whatsapp-chatbot",
    label: "WhatsApp chatbot",
    hint: "Enquiries, bookings, support",
  },
  {
    value: "custom-software",
    label: "Custom software",
    hint: "Internal tools, desktop, dashboards",
  },
  {
    value: "not-sure",
    label: "Not sure yet",
    hint: "Talk it through with us first",
  },
] as const

export type ProjectTypeValue = (typeof PROJECT_TYPES)[number]["value"]

export const PROJECT_TYPE_VALUES: string[] = PROJECT_TYPES.map((t) => t.value)

export const BUDGET_OPTIONS = [
  "Under RM 5k",
  "RM 5k – 15k",
  "RM 15k – 40k",
  "RM 40k+",
  "Not sure yet",
]

export type ContactValues = {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  message: string
}

export type ContactFormState = {
  status: "idle" | "success" | "error"
  message: string
  /** Field-level messages, keyed by input name. */
  errors: Record<string, string>
  /** Echoed back so a failed submit does not wipe what was typed. */
  values: Partial<ContactValues>
}

export const initialContactState: ContactFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: {},
}

export const CONTACT_SUCCESS_MESSAGE =
  "Thanks — your message is on its way. We usually reply within one working day."

// Deliberately permissive. The goal is to catch a typo like "name@gmail"
// before it costs someone a reply, not to police exotic-but-valid addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function readContactValues(formData: FormData): ContactValues {
  const str = (key: string) => {
    const value = formData.get(key)
    return typeof value === "string" ? value.trim() : ""
  }
  return {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    company: str("company"),
    projectType: str("projectType"),
    budget: str("budget"),
    message: str("message"),
  }
}

export function validateContact(values: ContactValues): Record<string, string> {
  const errors: Record<string, string> = {}

  if (values.name.length < 2) {
    errors.name = "Please tell us your name."
  }
  if (!EMAIL_RE.test(values.email)) {
    errors.email = "Please enter an email address we can reply to."
  }
  if (!PROJECT_TYPE_VALUES.includes(values.projectType)) {
    errors.projectType = "Pick the option closest to what you need."
  }
  if (values.message.length < 10) {
    errors.message = "A sentence or two about the project, please."
  } else if (values.message.length > 5000) {
    errors.message = "That is a little long — please keep it under 5000 characters."
  }

  return errors
}
