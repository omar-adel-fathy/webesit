import { canonicalizeCountryValue, isKnownCountry } from "./countries.js";

function sanitize(value) {
  if (typeof value !== "string") {
    return value;
  }
  return value.replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
}

function sanitizePhone(value) {
  if (typeof value !== "string") {
    return value;
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return cleaned === "" ? undefined : cleaned;
}

function validateName(value) {
  const sanitized = sanitize(value);
  if (typeof sanitized !== "string" || sanitized.length < 2) {
    return "Please enter your full name.";
  }
  if (sanitized.length > 100) {
    return "That name looks too long.";
  }
  if (!/^[\p{L}\p{M}'’\-\. ]+$/u.test(sanitized)) {
    return "Name contains characters that aren't allowed.";
  }
  return null;
}

function validateEmail(value) {
  const sanitized = sanitize(value);
  if (typeof sanitized !== "string" || !sanitized) {
    return "Please enter a valid email address.";
  }
  if (sanitized.length > 254) {
    return "That email looks too long.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
    return "Please enter a valid email address.";
  }
  return null;
}

function validatePhone(value) {
  const sanitized = sanitizePhone(value);
  if (sanitized === undefined) {
    return null;
  }
  if (typeof sanitized !== "string" || !/^\+?[0-9][0-9\s().\-]{6,29}$/.test(sanitized)) {
    return "Please enter a valid phone number, including the country code for international numbers.";
  }
  return null;
}

function validateRole(value) {
  const sanitized = sanitize(value);
  if (typeof sanitized !== "string" || sanitized.length < 2) {
    return "Please add your role or job title.";
  }
  if (sanitized.length > 100) {
    return "That role is too long.";
  }
  if (!/^[\p{L}\p{M}0-9'’\-\.\(\)\/&, ]+$/u.test(sanitized)) {
    return "Role contains characters that aren't allowed.";
  }
  return null;
}

function validateCountry(value, options) {
  if (typeof value !== "string" || !isKnownCountry(value, options)) {
    return "Please select a country from the list.";
  }
  return null;
}

function validateAttribution(value) {
  const sanitized = sanitize(value);
  if (typeof sanitized !== "string" || sanitized === "") {
    return null;
  }
  if (sanitized.length > 120) {
    return "Too long.";
  }
  return null;
}

export function parseLead(body, countryOptions) {
  if (typeof body !== "object" || body === null) {
    return { ok: false, details: { _form: "Invalid request body." } };
  }

  const details = {};

  const nameError = validateName(body.fullName);
  if (nameError) details.fullName = nameError;

  const emailError = validateEmail(body.email);
  if (emailError) details.email = emailError;

  const phoneError = validatePhone(body.phone);
  if (phoneError) details.phone = phoneError;

  const canonicalCountry = canonicalizeCountryValue(body.country, countryOptions);
  const countryError = validateCountry(canonicalCountry, countryOptions);
  if (countryError) details.country = countryError;

  const roleError = validateRole(body.role);
  if (roleError) details.role = roleError;

  if (body.consent === false) {
    details.consent = "Please confirm you agree to receive the resource.";
  }

  if (body.attribution && typeof body.attribution === "object") {
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const attributionError = validateAttribution(body.attribution[key]);
      if (attributionError) details[key] = attributionError;
    }
  }

  if (Object.keys(details).length > 0) {
    return { ok: false, details };
  }

  return {
    ok: true,
    data: {
      fullName: sanitize(body.fullName),
      email: sanitize(body.email).toLowerCase(),
      phone: sanitizePhone(body.phone),
      country: canonicalCountry,
      role: sanitize(body.role),
      consent: body.consent !== false,
      attribution: body.attribution && typeof body.attribution === "object" ? body.attribution : undefined,
    },
  };
}

export function describeAttribution(attribution) {
  if (!attribution) {
    return "";
  }
  const parts = [];
  if (attribution.utm_source) parts.push(`utm_source=${attribution.utm_source}`);
  if (attribution.utm_medium) parts.push(`utm_medium=${attribution.utm_medium}`);
  if (attribution.utm_campaign) parts.push(`utm_campaign=${attribution.utm_campaign}`);
  if (attribution.utm_content) parts.push(`utm_content=${attribution.utm_content}`);
  // The VidWorth click id, so the stored lead names the video it came from.
  if (attribution.tid) parts.push(`tid=${attribution.tid}`);
  return parts.join(", ");
}

export function hasHoneypotTrigger(body) {
  if (typeof body !== "object" || body === null) {
    return false;
  }
  return typeof body.company === "string" && body.company.trim().length > 0;
}

export function leadSource(input, fallback = "website") {
  return input.attribution?.utm_source?.trim() || fallback;
}