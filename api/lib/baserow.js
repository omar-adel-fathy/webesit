import { log } from "./log.js";

const META_TTL_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 12_000;
let metaCache = null;

export class BaserowError extends Error {
  constructor(code, status, message, detail) {
    super(message);
    this.name = "BaserowError";
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

function normalizeFieldName(name) {
  return String(name).toLowerCase().replace(/[\s_\-]/g, "").replace(/[^a-z0-9]/g, "");
}

export const FIELD_NAMES = {
  fullname: "Full Name",
  email: "Email",
  phone: "Phone",
  country: "Country",
  role: "Role",
  consent: "Consent",
  source: "Source",
  resource: "Resource",
  deliverystatus: "Delivery Status",
  submittedat: "Submitted At",
  notes: "Notes",
};

async function request(config, path, init = {}) {
  const url = `${config.baserowApiUrl}${path}`;
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Token ${config.baserowToken}`);
  if (init.body) {
    headers.set("Content-Type", "application/json");
  }
  try {
    return await fetch(url, { ...init, headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    const err = error;
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      throw new BaserowError("network", null, "Request to Baserow timed out", undefined);
    }
    throw new BaserowError("network", null, `Request to Baserow failed: ${err.message}`, undefined);
  }
}

async function listDatabases(config) {
  const response = await request(config, "/database/");
  if (!response.ok) {
    throw new BaserowError("api-error", response.status, `Failed to list databases (${response.status})`, undefined);
  }
  const json = await response.json();
  return json.results ?? [];
}

async function fetchFields(config) {
  const response = await request(config, `/database/fields/table/${config.baserowTableId}/`);
  if (!response.ok) {
    const detail = await safeDetail(response);
    throw new BaserowError("api-error", response.status, `Failed to read table fields (${response.status})`, detail);
  }
  const json = await response.json();
  return Array.isArray(json) ? json : [];
}

export async function getFieldMeta(config) {
  if (metaCache && Date.now() - metaCache.fetchedAt < META_TTL_MS) {
    return metaCache.fields;
  }
  const fields = await fetchFields(config);
  metaCache = { fields, fetchedAt: Date.now() };
  log.info(`Baserow table metadata loaded: ${fields.length} fields`);
  return fields;
}

async function classifyBaserowError(config, error) {
  let classified;
  if (error instanceof BaserowError) {
    classified = error;
  } else {
    classified = new BaserowError("api-error", null, "Unknown Baserow error", undefined);
  }

  if (classified.status === 401) {
    return new BaserowError("invalid-token", 401, classified.message, classified.detail);
  }
  if (classified.status === 403) {
    return new BaserowError("token-no-access", 403, classified.message, classified.detail);
  }
  if (classified.status === 404) {
    try {
      const databases = await listDatabases(config);
      const configuredId = Number(config.baserowDatabaseId);
      if (config.baserowDatabaseId && !databases.some((db) => db.id === configuredId)) {
        return new BaserowError("wrong-database-id", 404, classified.message, classified.detail);
      }
      return new BaserowError("wrong-table-id", 404, classified.message, classified.detail);
    } catch (probeError) {
      if (probeError instanceof BaserowError && probeError.status === 404) {
        return new BaserowError("wrong-api-url", 404, classified.message, classified.detail);
      }
      return new BaserowError("network", null, classified.message, classified.detail);
    }
  }

  if (classified.status === 400 && classified.detail) {
    const fieldMatch = classified.detail.match(/field\s*['"]?([^'"]+)['"]?\s*does not exist/i);
    if (fieldMatch) {
      return new BaserowError("missing-field", 400, classified.message, fieldMatch[1].trim());
    }
  }
  return classified;
}

export async function baserowDiagnostic(config, error) {
  const classified = await classifyBaserowError(config, error);
  switch (classified.code) {
    case "invalid-token":
      return "BASEROW_API_TOKEN is invalid. Generate a fresh token in Baserow: user menu > Settings > API tokens.";
    case "token-no-access":
      return "BASEROW_API_TOKEN has no access to this table. Give the token admin access to the database or the table.";
    case "wrong-api-url":
      return "BASEROW_API_URL points at the wrong host. For Baserow cloud use https://api.baserow.io/api";
    case "wrong-database-id":
      return `BASEROW_DATABASE_ID=${config.baserowDatabaseId} was not found. It should come from the URL: https://baserow.io/database/<DATABASE_ID>/table/...`;
    case "wrong-table-id":
      return `BASEROW_TABLE_ID=${config.baserowTableId} was not found. It should come from the URL: .../database/524985/table/<TABLE_ID>/...`;
    case "missing-field": {
      const detail = classified.detail ?? "a required field is missing";
      return `The configured table is missing a required field: ${detail}. Add it to the table in Baserow (or fix BASEROW_TABLE_ID).`;
    }
    case "network":
      return `Could not reach ${config.baserowApiUrl}. Check BASEROW_API_URL and that the server can reach the internet.`;
    default:
      return `Baserow returned an error (${classified.status ?? "unknown"}). See server logs for details.`;
  }
}

async function safeDetail(response) {
  try {
    const json = await response.json();
    if (typeof json.detail === "string") {
      return json.detail;
    }
    if (typeof json.error === "string") {
      return json.error;
    }
    return JSON.stringify(json).slice(0, 300);
  } catch {
    return "";
  }
}

function findField(meta, canonicalName) {
  return meta.find((field) => normalizeFieldName(field.name) === canonicalName);
}

export function fieldOptionValues(meta, canonicalName) {
  const field = findField(meta, canonicalName);
  return (field?.select_options ?? []).map((option) => option.value);
}

export function getCountryOptionsFromMeta(meta) {
  return fieldOptionValues(meta, "country");
}

export async function createLeadRow(config, meta, row) {
  const payload = {};
  const submittedAt = new Date().toISOString();

  const assignments = [
    ["fullname", row.fullName],
    ["email", row.email],
    ["phone", row.phone],
    ["country", row.country],
    ["role", row.role],
    ["consent", true],
    ["source", row.source],
    ["resource", row.resource],
    ["deliverystatus", row.deliveryStatus],
    ["submittedat", submittedAt],
    ["notes", row.notes],
  ];

  for (const [canonical, value] of assignments) {
    const field = findField(meta, canonical);
    if (field) {
      payload[field.name] = value;
    } else {
      log.warn(`Baserow table is missing the field "${FIELD_NAMES[canonical]}" - skipped in payload`);
    }
  }

  const response = await request(config, `/database/rows/table/${config.baserowTableId}/?user_field_names=true`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await safeDetail(response);
    throw new BaserowError("api-error", response.status, `Failed to create row (${response.status})`, detail);
  }

  const json = await response.json();
  if (!json.id) {
    throw new BaserowError("api-error", 200, "Baserow response did not include a row id", undefined);
  }
  return json.id;
}

export async function patchDeliveryStatus(config, meta, rowId, status) {
  const response = await request(config, `/database/rows/table/${config.baserowTableId}/${rowId}/?user_field_names=true`, {
    method: "PATCH",
    body: JSON.stringify({
      [FIELD_NAMES.deliverystatus]: status,
    }),
  });
  if (!response.ok) {
    const detail = await safeDetail(response);
    log.warn(`Could not update delivery status for row ${rowId}: ${detail}`);
  }
}