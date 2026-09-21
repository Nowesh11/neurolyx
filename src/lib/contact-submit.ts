"use client"

import {
  CONTACT_SUCCESS_MESSAGE,
  PROJECT_TYPES,
  readContactValues,
  validateContact,
  type ContactFormState,
} from "@/lib/contact-schema"

const ENDPOINT = "https://api.web3forms.com/submit"

/**
 * Sends the contact form to Web3Forms.
 *
 * Runs in the browser because Web3Forms' free plan refuses server-side calls
 * (HTTP 403, "Use our API in client side"). The signature matches what
 * `useActionState` expects — that hook works with any async
 * `(prevState, formData)` function, not only Server Actions — so the form
 * still gets pending state and result handling for free.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const values = readContactValues(formData)

  // Honeypot. Real people never see this field, so anything in it is a bot.
  // Answer with the success message so the bot has no signal to adapt to.
  const botcheck = formData.get("botcheck")
  if (typeof botcheck === "string" && botcheck.trim()) {
    return {
      status: "success",
      message: CONTACT_SUCCESS_MESSAGE,
      errors: {},
      values: {},
    }
  }

  const errors = validateContact(values)
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
      values,
    }
  }

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
  if (!accessKey) {
    // Surfaced rather than swallowed: a silent no-op here means lost leads.
    console.error(
      "[contact] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — nothing was sent."
    )
    return {
      status: "error",
      message:
        "The contact form is not configured yet. Please email or WhatsApp us directly in the meantime.",
      errors: {},
      values,
    }
  }

  const projectLabel =
    PROJECT_TYPES.find((t) => t.value === values.projectType)?.label ??
    values.projectType

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New enquiry — ${projectLabel} — ${values.name}`,
        from_name: "NLX website",
        // Web3Forms uses `email` as the reply-to, so hitting reply in the
        // inbox goes straight back to whoever filled the form in.
        name: values.name,
        email: values.email,
        phone: values.phone || "Not provided",
        business: values.company || "Not provided",
        looking_for: projectLabel,
        budget: values.budget || "Not specified",
        message: values.message,
      }),
      // Don't leave someone staring at a spinner if Web3Forms is unreachable.
      signal: AbortSignal.timeout(15_000),
    })

    const result: unknown = await response.json().catch(() => null)
    const ok =
      response.ok &&
      typeof result === "object" &&
      result !== null &&
      (result as { success?: boolean }).success === true

    if (!ok) {
      console.error("[contact] Web3Forms rejected the submission:", result)
      return {
        status: "error",
        message:
          "Something went wrong sending that. Please try again, or reach us on WhatsApp.",
        errors: {},
        values,
      }
    }

    return {
      status: "success",
      message: CONTACT_SUCCESS_MESSAGE,
      errors: {},
      values: {},
    }
  } catch (error) {
    console.error("[contact] Failed to reach Web3Forms:", error)
    return {
      status: "error",
      message:
        "We could not reach the mail service. Please try again, or reach us on WhatsApp.",
      errors: {},
      values,
    }
  }
}
