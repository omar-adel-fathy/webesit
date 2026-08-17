"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createLeadSchema, type Attribution } from "@/lib/validation";
import { COUNTRIES } from "@/lib/countries";
import CountrySelect from "./CountrySelect";
import SuccessCard from "./SuccessCard";

type Status = "idle" | "submitting" | "success" | "error";

interface LeadFormProps {
  countryOptions: string[];
  resourceTitle: string;
}

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  country: string;
  role: string;
  consent: boolean;
}

const PHONE_COUNTRY_OPTIONS = COUNTRIES.map((c) => c.name);

const PHONE_COUNTRY_CODES: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.name, c.dialCode])
);

const EMPTY: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  phoneCountry: "United States",
  country: "",
  role: "",
  consent: true,
};

const errorMessages: Record<string, string> = {
  validation: "Please check the highlighted fields and try again.",
  rate_limit: "You've submitted too many times. Wait a minute and try again.",
  duplicate: "You already requested this resource. Check your inbox — it's on its way. If it hasn't arrived, email us and we'll resend it.",
  delivery_failed: "We received your request, but the email hit a snag. Try again in a few minutes.",
  delivery_unavailable: "We received your request, but email delivery is briefly unavailable. Try again in a few minutes.",
  unavailable: "Our servers are still warming up. Try again in a minute.",
  too_large: "That submission was too large. Try again.",
  forbidden: "Something went wrong with the request. Reload the page and try again.",
  server: "Something went wrong on our end. Please try again in a moment.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

function captureAttribution(): Attribution {
  if (typeof window === "undefined") {
    return {};
  }
  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {};
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
  for (const key of keys) {
    const value = params.get(key);
    if (value) {
      attribution[key] = value;
    }
  }
  return attribution;
}

export default function LeadForm({ countryOptions, resourceTitle }: LeadFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [attribution, setAttribution] = useState<Attribution>({});

  const normalizePhone = (value: string, phoneCountry: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    const prefix = PHONE_COUNTRY_CODES[phoneCountry] ?? "+1";
    if (trimmed.startsWith("+")) {
      return trimmed;
    }
    return `${prefix} ${trimmed.replace(/^0+/, "")}`;
  };

  const schema = useMemo(() => createLeadSchema(countryOptions), [countryOptions]);

  useEffect(() => {
    const captured = captureAttribution();
    if (captured.utm_source || captured.utm_medium || captured.utm_campaign || captured.utm_content) {
      setAttribution(captured);
    }
  }, []);

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateClient = (): Record<string, string> | null => {
    const result = schema.safeParse({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone ? normalizePhone(values.phone, values.phoneCountry) : undefined,
      country: values.country,
      role: values.role,
      consent: true,
      attribution,
    });
    if (result.success) {
      return null;
    }
    const errors: Record<string, string> = {};
    try {
      const flat = result.error.flatten().fieldErrors as Record<string, string[]>;
      for (const [field, messages] of Object.entries(flat)) {
        const first = (messages ?? [])[0];
        if (first) {
          errors[field] = first;
        }
      }
    } catch {
      errors._form = "Please check your answers and try again.";
    }
    return errors;
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    const errors = validateClient();
    if (errors) {
      setFieldErrors(errors);
      setFormError("Please fix the highlighted fields.");
      setStatus("error");
      return;
    }

    setFormError(null);
    setFieldErrors({});
    setStatus("submitting");

    const payload = {
      fullName: values.fullName,
      email: values.email.trim().toLowerCase(),
      phone: values.phone ? normalizePhone(values.phone, values.phoneCountry) : undefined,
      country: values.country,
      role: values.role,
      consent: true,
      company: "",
      attribution,
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
        details?: Record<string, string>;
      };

      if (response.ok && data.success) {
        setSubmittedEmail(values.email.trim().toLowerCase());
        setStatus("success");
        return;
      }

      const code = data.error ?? "server";
      if (code === "validation" && data.details) {
        setFieldErrors(data.details);
        setFormError("Please fix the highlighted fields.");
      } else {
        setFormError(errorMessages[code] ?? errorMessages.server);
      }
      setStatus("error");
    } catch {
      setFormError(errorMessages.network);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-card-lift sm:p-8">
        <SuccessCard email={submittedEmail} />
      </div>
    );
  }

  const inputBase = (invalid: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:ring-2 ${
      invalid ? "border-red-300 focus:ring-red-200" : "border-ink/15 focus:border-ink/40 focus:ring-blue-200"
    }`;

  return (
    <div className="rounded-3xl border border-blue-200 bg-paper p-6 shadow-card-lift sm:p-8">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-extrabold text-ink">Claim {resourceTitle}</h2>
        <p className="mt-1 text-sm text-blue-700">Instant delivery. Usually in your inbox in about 10 seconds.</p>
      </div>

      {formError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-700"
        >
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-xs font-bold tracking-wide text-ink/70">
            FULL NAME *
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => set("fullName", event.target.value)}
            placeholder="Jane Doe"
            aria-invalid={Boolean(fieldErrors.fullName)}
            className={inputBase(Boolean(fieldErrors.fullName))}
          />
          {fieldErrors.fullName && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-bold tracking-wide text-ink/70">
            EMAIL *
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            placeholder="you@company.com"
            aria-invalid={Boolean(fieldErrors.email)}
            className={inputBase(Boolean(fieldErrors.email))}
          />
          {fieldErrors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.email}</p>}
          {fieldErrors._form && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors._form}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-bold tracking-wide text-ink/70">
            PHONE <span className="font-medium text-ink/40">(OPTIONAL)</span>
          </label>
          <div className="grid grid-cols-[118px_minmax(0,1fr)] gap-2">
            <CountrySelect
              id="phoneCountry"
              options={PHONE_COUNTRY_OPTIONS}
              value={values.phoneCountry}
              onChange={(value) => set("phoneCountry", value)}
            />
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
              placeholder={`${PHONE_COUNTRY_CODES[values.phoneCountry] ?? "+1"} 555 010 1234`}
              aria-invalid={Boolean(fieldErrors.phone)}
              className={inputBase(Boolean(fieldErrors.phone))}
            />
          </div>
          {fieldErrors.phone && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="country" className="mb-1.5 block text-xs font-bold tracking-wide text-ink/70">
            COUNTRY *
          </label>
          <CountrySelect
            id="country"
            options={countryOptions}
            value={values.country}
            onChange={(value) => set("country", value)}
            error={fieldErrors.country}
          />
          {fieldErrors.country && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.country}</p>}
        </div>

        <div>
          <label htmlFor="role" className="mb-1.5 block text-xs font-bold tracking-wide text-ink/70">
            ROLE / JOB TITLE *
          </label>
          <input
            id="role"
            type="text"
            autoComplete="organization-title"
            value={values.role}
            onChange={(event) => set("role", event.target.value)}
            placeholder="e.g. Founder, Head of Growth, Marketing Manager"
            aria-invalid={Boolean(fieldErrors.role)}
            className={inputBase(Boolean(fieldErrors.role))}
          />
          {fieldErrors.role && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.role}</p>}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group relative mt-1 w-full overflow-hidden rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <span className="flex items-center justify-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Sending&hellip;
            </span>
          ) : (
            "Claim Free Resources"
          )}
        </button>

        <p className="text-center font-mono text-[10px] leading-relaxed tracking-wide text-ink/40">
          NO CREDIT CARD &middot; NO CATCH &middot; NO SPAM
        </p>
      </form>
    </div>
  );
}