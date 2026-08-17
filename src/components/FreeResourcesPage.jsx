import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const DEFAULT_COUNTRY_OPTIONS = ["United States", "Canada", "United Kingdom", "Australia", "Egypt"];

const COUNTRY_META = {
  "United States": { flag: "🇺🇸", dial: "+1" },
  USA: { flag: "🇺🇸", dial: "+1", label: "United States" },
  Canada: { flag: "🇨🇦", dial: "+1" },
  "United Kingdom": { flag: "🇬🇧", dial: "+44" },
  UK: { flag: "🇬🇧", dial: "+44", label: "United Kingdom" },
  Australia: { flag: "🇦🇺", dial: "+61" },
  Egypt: { flag: "🇪🇬", dial: "+20" },
  "United Arab Emirates": { flag: "🇦🇪", dial: "+971" },
  "Saudi Arabia": { flag: "🇸🇦", dial: "+966" },
  Qatar: { flag: "🇶🇦", dial: "+974" },
  Kuwait: { flag: "🇰🇼", dial: "+965" },
  Bahrain: { flag: "🇧🇭", dial: "+973" },
  Oman: { flag: "🇴🇲", dial: "+968" },
  Jordan: { flag: "🇯🇴", dial: "+962" },
  Lebanon: { flag: "🇱🇧", dial: "+961" },
  Morocco: { flag: "🇲🇦", dial: "+212" },
  Tunisia: { flag: "🇹🇳", dial: "+216" },
  Algeria: { flag: "🇩🇿", dial: "+213" },
  Germany: { flag: "🇩🇪", dial: "+49" },
  France: { flag: "🇫🇷", dial: "+33" },
  Italy: { flag: "🇮🇹", dial: "+39" },
  Spain: { flag: "🇪🇸", dial: "+34" },
  Netherlands: { flag: "🇳🇱", dial: "+31" },
  India: { flag: "🇮🇳", dial: "+91" },
  Pakistan: { flag: "🇵🇰", dial: "+92" },
  Turkey: { flag: "🇹🇷", dial: "+90" },
};

const bullets = [
  "Built from real client work, not theory",
  "A clear process you can apply to any brand this week",
  "No upsells, no spam — just the resource",
];

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  role: "",
  consent: true,
};

const errorMessages = {
  validation: "Please check the highlighted fields and try again.",
  rate_limit: "You've submitted too many times. Wait a minute and try again.",
  duplicate: "You already requested this resource. Check your inbox — it's on its way.",
  delivery_failed: "We received your request, but the email hit a snag. Try again in a few minutes.",
  delivery_unavailable: "We received your request, but email delivery is briefly unavailable. Try again in a few minutes.",
  unavailable: "Our servers are still warming up. Try again in a minute.",
  too_large: "That submission was too large. Try again.",
  forbidden: "Something went wrong with the request. Reload the page and try again.",
  server: "Something went wrong on our end. Please try again in a moment.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

function captureAttribution() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const attribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const value = params.get(key);
    if (value) attribution[key] = value;
  }
  return attribution;
}

function countryLabel(country) {
  const meta = COUNTRY_META[country];
  if (!meta) {
    return country;
  }
  return `${meta.flag} ${meta.label ?? country} ${meta.dial}`;
}

function SuccessCard({ email }) {
  return (
    <div className="rounded-[2rem] border border-[#CBBF9A]/70 bg-[#F8F1E6]/80 p-6 md:p-8 shadow-2xl text-left">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#2454E8]">
        <CheckCircle2 className="h-6 w-6 text-white" />
      </div>
      <h3 className="font-heading text-2xl font-extrabold text-[#111113]">You’re on the list.</h3>
      <p className="mt-3 text-sm leading-6 text-[#111113]/70">
        Your free resource is on the way to <span className="font-bold text-[#111113]">{email}</span>.
      </p>
      <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#667350]">Check your inbox</p>
    </div>
  );
}

export default function FreeResourcesPage() {
  const [values, setValues] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [attribution, setAttribution] = useState({});
  const [countryOptions, setCountryOptions] = useState(DEFAULT_COUNTRY_OPTIONS);

  useEffect(() => {
    const captured = captureAttribution();
    if (Object.keys(captured).length > 0) setAttribution(captured);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadCountryOptions() {
      try {
        const response = await fetch("/api/lead");
        if (!response.ok) return;
        const data = await response.json();
        if (!ignore && Array.isArray(data.countryOptions) && data.countryOptions.length > 0) {
          setCountryOptions(data.countryOptions);
        }
      } catch {
        // Keep the bundled fallback list when the API is not reachable.
      }
    }

    loadCountryOptions();
    return () => {
      ignore = true;
    };
  }, []);

  const navigate = (href) => {
    window.location.assign("/" + href);
  };

  const goHome = () => {
    window.location.assign("/");
  };

  const inputBase = (invalid) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#111113] outline-none transition placeholder:text-[#111113]/35 focus:ring-2 ${
      invalid ? "border-red-300 focus:ring-red-200" : "border-[#CBBF9A]/80 focus:border-[#2454E8] focus:ring-[#2454E8]/20"
    }`;

  const labelCls = "mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-[#667350]";

  const validateClient = () => {
    const errors = {};
    if (!values.fullName.trim()) errors.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
    if (!values.country.trim()) errors.country = "Please select a country from the list.";
    if (!values.role.trim()) errors.role = "Please tell us your role.";
    if (!values.consent) errors.consent = "Please confirm you agree to receive the resource.";
    return Object.keys(errors).length ? errors : null;
  };

  const setValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (status === "submitting") return;

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
      fullName: values.fullName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim() || undefined,
      country: values.country,
      role: values.role,
      consent: true,
      company: "",
      attribution,
      resourceTitle: "Free Resources",
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmittedEmail(values.email.trim().toLowerCase());
        setStatus("success");
        return;
      }

      const code = data.error || "server";
      if (code === "validation" && data.details) {
        setFieldErrors(data.details);
        setFormError("Please fix the highlighted fields.");
      } else {
        setFormError(errorMessages[code] || errorMessages.server);
      }
      setStatus("error");
    } catch {
      setFormError(errorMessages.network);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden text-[#111113] bg-[#F3EBDD]">
      {/* Solid Warm Beige Background with Floating Ambient Blurs (matches site-wide layout) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-[15%] h-[500px] w-[500px] rounded-full bg-[#d85c9d]/12 blur-3xl ambient-drift" />
        <div className="absolute top-[25%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#2454E8]/10 blur-3xl ambient-drift ambient-drift-slow" />
        <div className="absolute bottom-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#CBBF9A]/30 blur-3xl" />
      </div>

      <SiteHeader onNavigate={navigate} onLogoClick={goHome} />

      <main className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-24 sm:px-8 md:pt-28">
        <div className="mx-auto w-full max-w-xl">
          {status === "success" ? (
            <SuccessCard email={submittedEmail} />
          ) : (
            <div className="rounded-[2rem] border border-[#CBBF9A]/70 bg-[#F8F1E6]/80 p-6 md:p-8 shadow-2xl backdrop-blur-md text-left">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#CBBF9A] bg-white/80 px-4 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#2454E8] animate-pulse" />
                  <span className="font-mono text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#111113]">
                    Free Strategy Resource
                  </span>
                </div>
              </div>

              <h2 className="font-heading text-2xl font-extrabold text-[#111113]">Claim Free Resources</h2>
              <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#667350]">
                Instant delivery. In your inbox in about 10 seconds.
              </p>

              {formError && (
                <div role="alert" className="mt-5 mb-5 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-700">
                  {formError}
                </div>
              )}

              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
                <div>
                  <label htmlFor="fullName" className={labelCls}>FULL NAME *</label>
                  <input id="fullName" type="text" autoComplete="name" value={values.fullName} onChange={(event) => setValue("fullName", event.target.value)} placeholder="Jane Doe" aria-invalid={Boolean(fieldErrors.fullName)} className={inputBase(Boolean(fieldErrors.fullName))} />
                  {fieldErrors.fullName && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className={labelCls}>EMAIL *</label>
                  <input id="email" type="email" autoComplete="email" value={values.email} onChange={(event) => setValue("email", event.target.value)} placeholder="jane@brand.com" aria-invalid={Boolean(fieldErrors.email)} className={inputBase(Boolean(fieldErrors.email))} />
                  {fieldErrors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="country" className={labelCls}>COUNTRY *</label>
                  <select id="country" required value={values.country} onChange={(event) => setValue("country", event.target.value)} aria-invalid={Boolean(fieldErrors.country)} className={`${inputBase(Boolean(fieldErrors.country))} ${values.country ? "" : "text-[#111113]/35"}`}>
                    <option value="" disabled hidden>Choose a country</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country} className="text-[#111113]">{countryLabel(country)}</option>
                    ))}
                  </select>
                  {fieldErrors.country && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.country}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className={labelCls}>PHONE</label>
                  <input id="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => setValue("phone", event.target.value)} placeholder="+1 555 123 4567" className={inputBase(false)} />
                </div>

                <div>
                  <label htmlFor="role" className={labelCls}>ROLE / JOB TITLE *</label>
                  <input id="role" type="text" autoComplete="organization-title" value={values.role} onChange={(event) => setValue("role", event.target.value)} placeholder="Founder, marketer, growth lead..." aria-invalid={Boolean(fieldErrors.role)} className={inputBase(Boolean(fieldErrors.role))} />
                  {fieldErrors.role && <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.role}</p>}
                </div>

                <label className="flex items-start gap-3 rounded-xl border border-[#CBBF9A]/70 bg-white px-3 py-3 text-xs text-[#111113]/70 font-medium">
                  <input type="checkbox" checked={values.consent} onChange={(event) => setValue("consent", event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#CBBF9A] text-[#2454E8] focus:ring-[#2454E8]" />
                  <span>I agree to receive the resource and occasional relevant updates.</span>
                </label>
                {fieldErrors.consent && <p className="text-xs font-medium text-red-600">{fieldErrors.consent}</p>}

                <button type="submit" disabled={status === "submitting"} className="cool-button w-full text-sm py-4 disabled:cursor-not-allowed disabled:opacity-70">
                  {status === "submitting" ? "Sending..." : "Get the free resource"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
