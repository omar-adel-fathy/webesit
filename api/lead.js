import { getConfig, missingVariables, DELIVERY_STATUS } from "./lib/config.js";
import { log, maskPhone } from "./lib/log.js";
import { parseLead, hasHoneypotTrigger, describeAttribution, leadSource } from "./lib/validation.js";
import { rateLimit } from "./lib/rate-limit.js";
import { checkDuplicate, markSubmission, updateState } from "./lib/dedup.js";
import {
  getFieldMeta,
  getCountryOptionsFromMeta,
  createLeadRow,
  patchDeliveryStatus,
  baserowDiagnostic,
} from "./lib/baserow.js";
import { upsertContact, sendDeliveryEmail, resendDiagnostic } from "./lib/resend.js";
import { buildEmailContent } from "./lib/email.js";
import { normalizeResourceUrls } from "./lib/drive.js";
import { isAllowedOrigin } from "./lib/origin.js";

const DEFAULT_COUNTRY_OPTIONS = ["USA", "Canada", "United Kingdom", "Australia"];
const MAX_BODY_BYTES = 16_384;

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim() || "unknown";
  }
  return req.headers["x-real-ip"] ?? req.socket?.remoteAddress ?? "unknown";
}

function json(res, status, payload, extraHeaders) {
  res.status(status);
  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      res.setHeader(key, value);
    }
  }
  res.json(payload);
}

function safeMessage() {
  return "Something went wrong. Please try again in a moment.";
}

function firstNameOf(fullName) {
  return String(fullName || "").trim().split(/\s+/)[0] ?? "";
}

async function handlePost(req, res) {
  const config = getConfig();
  const ip = clientIp(req);

  const origin = req.headers.origin;
  if (origin) {
    try {
      const expected = new URL(config.siteUrl).origin;
      if (!isAllowedOrigin(origin, expected)) {
        log.warn(`Blocked cross-origin submission from ${origin}`);
        return json(res, 403, { success: false, error: "forbidden", message: "This request did not come from the website." });
      }
    } catch {
      log.warn("SITE_URL is not a valid URL; skipping origin check");
    }
  }

  let bodyText = "";
  try {
    bodyText = JSON.stringify(req.body ?? {});
  } catch {
    bodyText = "{}";
  }

  const contentLength = Number(req.headers["content-length"] ?? "0");
  if (contentLength > MAX_BODY_BYTES || Buffer.byteLength(bodyText, "utf8") > MAX_BODY_BYTES) {
    return json(res, 413, { success: false, error: "too_large", message: "The submission was too large." });
  }

  const body = req.body ?? {};

  if (hasHoneypotTrigger(body)) {
    log.info(`Honeypot triggered (source ${ip})`);
    return json(res, 200, { success: true });
  }

  const missing = missingVariables(config);
  if (missing.length > 0) {
    log.error(`Missing environment variables: ${missing.join(", ")}`);
    return json(res, 503, { success: false, error: "unavailable", message: "The service is not fully configured yet. Please try again later." });
  }

  const limit = rateLimit(ip, config.rateLimitMax, config.rateLimitWindowMs);
  if (!limit.allowed) {
    return json(res, 429, { success: false, error: "rate_limit", message: "You've submitted too many times. Wait a minute and try again." }, { "Retry-After": String(limit.retryAfterSeconds) });
  }

  log.info(`Submission received from ${ip}`);

  let meta;
  try {
    meta = await getFieldMeta(config);
  } catch (error) {
    log.error(`Baserow metadata unavailable: ${await baserowDiagnostic(config, error)}`);
    return json(res, 502, { success: false, error: "server", message: safeMessage() });
  }

  const countryOptions = getCountryOptionsFromMeta(meta);
  const parsed = parseLead(body, countryOptions.length > 0 ? countryOptions : DEFAULT_COUNTRY_OPTIONS);
  if (!parsed.ok) {
    log.info(`Validation failed for ip=${ip}: ${JSON.stringify(parsed.details)}`);
    return json(res, 400, { success: false, error: "validation", message: "Please check the highlighted fields.", details: parsed.details });
  }

  const lead = parsed.data;
  const source = leadSource(lead);
  const attribution = describeAttribution(lead.attribution);
  const phone = lead.phone ?? null;

  const guard = checkDuplicate(lead.email, config.resourceTitle);
  if (guard) {
    if (guard.state === "Sent") {
      log.info(`Duplicate submission blocked for ${lead.email}`);
      return json(res, 409, { success: false, error: "duplicate", message: "You already requested this resource. Check your inbox — it's on its way." });
    }
    if (guard.leadId !== null && config.resendApiKey) {
      log.info(`Re-delivering resource to ${lead.email} (previous delivery ${guard.state})`);
      try {
        const urls = normalizeResourceUrls({
          googleDriveFileId: config.googleDriveFileId,
          resourceViewUrl: config.resourceViewUrl,
          resourceDownloadUrl: config.resourceDownloadUrl,
        });
        await upsertContact(config, {
          email: lead.email,
          fullName: lead.fullName,
          role: lead.role,
          country: lead.country,
          phone,
          source,
          resource: config.resourceTitle,
        });
        const emailContent = buildEmailContent({
          resourceTitle: config.resourceTitle,
          firstName: firstNameOf(lead.fullName),
          role: lead.role,
          country: lead.country,
          email: lead.email,
          viewUrl: urls.viewUrl ?? "",
          downloadUrl: urls.downloadUrl ?? "",
          subject: config.emailSubject,
          siteUrl: config.siteUrl,
          senderEmail: config.resendFromEmail,
          requestDate: new Date(),
        });
        await sendDeliveryEmail(config, {
          to: lead.email,
          firstName: firstNameOf(lead.fullName),
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
        await patchDeliveryStatus(config, meta, guard.leadId, DELIVERY_STATUS.SENT);
        updateState(lead.email, config.resourceTitle, "Sent");
        return json(res, 200, { success: true, message: "Resource re-sent. Check your inbox." });
      } catch (error) {
        log.error(`Re-delivery failed for ${lead.email}: ${resendDiagnostic(config, error)}`);
        return json(res, 500, { success: false, error: "delivery_failed", message: "We're re-sending your resource. Give it a few minutes and try again." });
      }
    }
    return json(res, 409, { success: false, error: "duplicate", message: "You already requested this resource. Check your inbox — it's on its way." });
  }

  const urls = normalizeResourceUrls({
    googleDriveFileId: config.googleDriveFileId,
    resourceViewUrl: config.resourceViewUrl,
    resourceDownloadUrl: config.resourceDownloadUrl,
  });

  let leadId;
  try {
    leadId = await createLeadRow(config, meta, {
      fullName: lead.fullName,
      email: lead.email,
      phone: phone ?? "",
      country: lead.country,
      role: lead.role,
      source,
      resource: config.resourceTitle,
      deliveryStatus: DELIVERY_STATUS.PENDING,
      notes: attribution ? `Attribution: ${attribution}` : "",
    });
    log.info(`Baserow lead created: id=${leadId}, email=${lead.email}, phone=${maskPhone(phone)}`);
  } catch (error) {
    log.error(`Baserow create failed for ${lead.email}: ${await baserowDiagnostic(config, error)}`);
    return json(res, 502, { success: false, error: "server", message: safeMessage() });
  }

  markSubmission(lead.email, config.resourceTitle, leadId, "Pending", config.dedupWindowMs);

  if (!config.resendApiKey) {
    log.error(`RESEND_API_KEY missing - marking delivery failed for lead ${leadId}`);
    await patchDeliveryStatus(config, meta, leadId, DELIVERY_STATUS.FAILED);
    updateState(lead.email, config.resourceTitle, "Failed");
    return json(res, 503, {
      success: false,
      error: "delivery_unavailable",
      message: "We received your request but the email is temporarily unavailable. Please try again in a few minutes.",
    });
  }

  if (!urls.viewUrl || !urls.downloadUrl) {
    const reason = !config.resourceViewUrl && !config.googleDriveFileId && !config.resourceDownloadUrl
      ? "GOOGLE_DRIVE_FILE_ID (or RESOURCE_VIEW_URL) missing"
      : "resource URLs could not be resolved";
    log.error(`Resource config issue for lead ${leadId}: ${reason}`);
    await patchDeliveryStatus(config, meta, leadId, DELIVERY_STATUS.FAILED);
    updateState(lead.email, config.resourceTitle, "Failed");
    return json(res, 503, {
      success: false,
      error: "delivery_unavailable",
      message: "We received your request but the delivery link is temporarily unavailable. Please try again in a few minutes.",
    });
  }

  try {
    await upsertContact(config, {
      email: lead.email,
      fullName: lead.fullName,
      role: lead.role,
      country: lead.country,
      phone,
      source,
      resource: config.resourceTitle,
    });
  } catch (error) {
    log.warn(`Resend contact sync failed for ${lead.email} (still sending email): ${resendDiagnostic(config, error)}`);
  }

  try {
    const emailContent = buildEmailContent({
      resourceTitle: config.resourceTitle,
      firstName: firstNameOf(lead.fullName),
      role: lead.role,
      country: lead.country,
      email: lead.email,
      viewUrl: urls.viewUrl,
      downloadUrl: urls.downloadUrl,
      subject: config.emailSubject,
      siteUrl: config.siteUrl,
      senderEmail: config.resendFromEmail,
      requestDate: new Date(),
    });
    await sendDeliveryEmail(config, {
      to: lead.email,
      firstName: firstNameOf(lead.fullName),
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
    await patchDeliveryStatus(config, meta, leadId, DELIVERY_STATUS.SENT);
    updateState(lead.email, config.resourceTitle, "Sent");
    log.info(`Submission complete: lead ${leadId} for ${lead.email}`);
    return json(res, 201, { success: true, message: "Check your inbox — your resource is on the way." });
  } catch (error) {
    log.error(`Email delivery failed for lead ${leadId} (${lead.email}): ${resendDiagnostic(config, error)}`);
    await patchDeliveryStatus(config, meta, leadId, DELIVERY_STATUS.FAILED);
    updateState(lead.email, config.resourceTitle, "Failed");
    return json(res, 500, { success: false, error: "delivery_failed", message: "We received your request but the email hit a snag. Try again in a few minutes." });
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    if (req.method === "HEAD") {
      res.status(200).end();
      return;
    }

    const config = getConfig();
    let countryOptions = DEFAULT_COUNTRY_OPTIONS;
    if (config.baserowToken && config.baserowTableId) {
      try {
        const meta = await getFieldMeta(config);
        const options = getCountryOptionsFromMeta(meta);
        if (options.length > 0) {
          countryOptions = options;
        }
      } catch (error) {
        log.warn(`Could not load country options for lead config: ${await baserowDiagnostic(config, error)}`);
      }
    }

    res.status(200).json({ ok: true, service: "lead", countryOptions });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed", message: "Use POST to submit a lead." });
    return;
  }

  try {
    await handlePost(req, res);
  } catch (error) {
    log.error(`Unexpected lead handler error: ${error?.stack ?? error}`);
    if (!res.headersSent) {
      json(res, 500, { success: false, error: "server", message: safeMessage() });
    }
  }
}
