import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { log } from "./log.js";

const DEFAULT_BASEROW_URL = "https://api.baserow.io/api";
const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_SUBJECT = "Your Free Resource Is Ready";
const DEFAULT_FROM_NAME = "Jimscaling Strategy";
const DEFAULT_RESOURCE_TITLE = "Free Resources";
const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_DEDUP_WINDOW_MS = 30 * 60 * 1000;

function loadDotEnvFromDisk() {
  const env = {};
  for (const fileName of [".env.local", ".env"]) {
    const filePath = join(process.cwd(), fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    const contents = readFileSync(filePath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) {
        continue;
      }

      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[match[1]] = value;
    }
  }
  return env;
}

export const DELIVERY_STATUS = {
  PENDING: "Pending",
  SENT: "Sent",
  FAILED: "Failed",
};

function toPositiveInt(value, fallback, name) {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    log.warn(`Invalid value for ${name}, using fallback ${fallback}`);
    return fallback;
  }
  return parsed;
}

function normalizeBaserowUrl(value) {
  if (!value) {
    return DEFAULT_BASEROW_URL;
  }
  const trimmed = String(value).trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/api")) {
    return trimmed;
  }
  return `${trimmed}/api`;
}

export function getConfig(env = process.env) {
  const mergedEnv = { ...loadDotEnvFromDisk(), ...env };

  return {
    baserowApiUrl: normalizeBaserowUrl(mergedEnv.BASEROW_API_URL),
    baserowToken: (mergedEnv.BASEROW_API_TOKEN ?? "").trim(),
    baserowDatabaseId: (mergedEnv.BASEROW_DATABASE_ID ?? "").trim(),
    baserowTableId: (mergedEnv.BASEROW_TABLE_ID ?? "").trim(),
    resendApiKey: (mergedEnv.RESEND_API_KEY ?? "").trim(),
    resendFromEmail: (mergedEnv.RESEND_FROM_EMAIL ?? "").trim().toLowerCase(),
    resendFromName: (mergedEnv.RESEND_FROM_NAME ?? DEFAULT_FROM_NAME).trim(),
    resendAudienceId: (mergedEnv.RESEND_AUDIENCE_ID ?? "").trim(),
    resourceTitle: (mergedEnv.RESOURCE_TITLE ?? DEFAULT_RESOURCE_TITLE).trim(),
    resourceViewUrl: (mergedEnv.RESOURCE_VIEW_URL ?? "").trim(),
    resourceDownloadUrl: (mergedEnv.RESOURCE_DOWNLOAD_URL ?? "").trim(),
    googleDriveFileId: (mergedEnv.GOOGLE_DRIVE_FILE_ID ?? "").trim(),
    siteUrl: (mergedEnv.SITE_URL ?? DEFAULT_SITE_URL).trim().replace(/\/+$/, ""),
    emailSubject: (mergedEnv.EMAIL_SUBJECT ?? DEFAULT_SUBJECT).trim(),
    rateLimitMax: toPositiveInt(mergedEnv.RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX, "RATE_LIMIT_MAX"),
    rateLimitWindowMs: toPositiveInt(mergedEnv.RATE_LIMIT_WINDOW_MS, DEFAULT_RATE_LIMIT_WINDOW_MS, "RATE_LIMIT_WINDOW_MS"),
    dedupWindowMs: toPositiveInt(mergedEnv.DEDUP_WINDOW_MS, DEFAULT_DEDUP_WINDOW_MS, "DEDUP_WINDOW_MS"),
  };
}

export function missingVariables(config) {
  const missing = [];
  if (!config.baserowToken) {
    missing.push("BASEROW_API_TOKEN");
  }
  if (!config.baserowTableId) {
    missing.push("BASEROW_TABLE_ID");
  }
  if (!config.resendApiKey) {
    missing.push("RESEND_API_KEY");
  }
  if (!config.resendFromEmail) {
    missing.push("RESEND_FROM_EMAIL");
  }
  if (!config.resourceViewUrl && !config.googleDriveFileId && !config.resourceDownloadUrl) {
    missing.push("GOOGLE_DRIVE_FILE_ID (or RESOURCE_VIEW_URL)");
  }
  return missing;
}