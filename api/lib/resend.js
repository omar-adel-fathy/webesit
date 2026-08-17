import { log, maskPhone } from "./log.js";

const RESEND_BASE_URL = "https://api.resend.com";
const REQUEST_TIMEOUT_MS = 12_000;

export class ResendError extends Error {
  constructor(code, status, message) {
    super(message);
    this.name = "ResendError";
    this.code = code;
    this.status = status;
  }
}

async function resendRequest(config, path, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${config.resendApiKey}`);
  if (init.body) {
    headers.set("Content-Type", "application/json");
  }
  try {
    return await fetch(`${RESEND_BASE_URL}${path}`, {
      ...init,
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const err = error;
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      throw new ResendError("network", null, "Request to Resend timed out");
    }
    throw new ResendError("network", null, `Request to Resend failed: ${err.message}`);
  }
}

function classifyResend(response, message) {
  if (response.status === 401 || response.status === 403) {
    throw new ResendError("invalid-api-key", response.status, message);
  }
  throw new ResendError("api-error", response.status, message);
}

export async function upsertContact(config, input) {
  if (!config.resendAudienceId) {
    log.warn(`RESEND_AUDIENCE_ID not set - skipping contact sync for ${input.email}`);
    return { synced: false, method: "skipped" };
  }

  const nameParts = String(input.fullName || "").trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const metadata = {
    full_name: input.fullName,
    role: input.role,
    country: input.country,
    source: input.source,
    resource: input.resource,
    signup_date: new Date().toISOString(),
  };
  if (input.phone) {
    metadata.phone = input.phone;
  }

  const search = await resendRequest(
    config,
    `/contacts?audience_id=${encodeURIComponent(config.resendAudienceId)}&email=${encodeURIComponent(input.email)}`,
  );
  if (!search.ok) {
    classifyResend(search, `Failed to search contacts (${search.status})`);
  }
  const searchJson = await search.json();

  if (searchJson.data && searchJson.data.length > 0) {
    const contactId = searchJson.data[0].id;
    const update = await resendRequest(config, `/contacts/${contactId}`, {
      method: "PATCH",
      body: JSON.stringify({ first_name: firstName, last_name: lastName, metadata }),
    });
    if (!update.ok) {
      classifyResend(update, `Failed to update contact (${update.status})`);
    }
    log.info(`Resend contact updated for ${input.email} (${contactId})`);
    return { synced: true, method: "updated" };
  }

  const create = await resendRequest(config, "/contacts", {
    method: "POST",
    body: JSON.stringify({
      audience_id: config.resendAudienceId,
      email: input.email,
      first_name: firstName,
      last_name: lastName,
      unsubscribed: false,
      metadata,
    }),
  });
  if (!create.ok) {
    if (create.status === 404) {
      throw new ResendError("unknown-audience", 404, "Resend audience not found");
    }
    classifyResend(create, `Failed to create contact (${create.status})`);
  }
  const createJson = await create.json();
  log.info(`Resend contact created for ${input.email} (${createJson.id ?? "unknown id"})`);
  log.info(`Contact sync done: phone=${maskPhone(input.phone)}`);
  return { synced: true, method: "created" };
}

export async function sendDeliveryEmail(config, input) {
  const from = `${config.resendFromName} <${config.resendFromEmail}>`;
  const response = await resendRequest(config, "/emails", {
    method: "POST",
    body: JSON.stringify({
      from,
      to: input.to,
      reply_to: config.resendFromEmail,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 422) {
      if (/domain|sender|from/i.test(detail)) {
        throw new ResendError("unverified-sender", 422, `Sender ${from} is not verified in Resend`);
      }
      throw new ResendError("invalid-payload", 422, `Resend rejected the email payload (${detail.slice(0, 200)})`);
    }
    if (response.status === 401 || response.status === 403) {
      throw new ResendError("invalid-api-key", response.status, "Resend API key rejected");
    }
    throw new ResendError("api-error", response.status, `Resend failed to send (${response.status})`);
  }

  const json = await response.json();
  log.info(`Delivery email sent to ${input.to} (${json.id ?? "unknown id"})`);
  return json.id ?? "unknown";
}

export function resendDiagnostic(config, error) {
  if (error instanceof ResendError) {
    switch (error.code) {
      case "invalid-api-key":
        return "RESEND_API_KEY is invalid. Create a key at https://resend.com/api-keys";
      case "unverified-sender":
        return `RESEND_FROM_EMAIL (${config.resendFromEmail}) is not verified in Resend. Verify the domain in Resend > Domains, or use the Resend "onboarding@resend.dev" address temporarily.`;
      case "unknown-audience":
        return `RESEND_AUDIENCE_ID (${config.resendAudienceId}) was not found. Open Resend > Audiences and copy the id from the audience URL.`;
      case "invalid-payload":
        return `Resend rejected the email. ${error.message}`;
      case "network":
        return "Could not reach api.resend.com. Check that the server can reach the internet.";
      default:
        return `Resend failed (${error.status ?? "unknown"}). See server logs.`;
    }
  }
  return "Resend integration failed. See server logs.";
}