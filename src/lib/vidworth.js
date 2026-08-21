// Bridges the Tally strategy-review application to VidWorth.
//
// VidWorth captures form submissions automatically by reading the fields of
// real <form> elements on the page. The application form lives inside a
// cross-origin tally.so iframe, so the tracker cannot see it and the lead has
// to be forwarded explicitly when Tally reports the submission.

const TALLY_ORIGIN = "https://tally.so";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tally can emit the submitted event more than once for a single response.
const forwarded = new Set();

function parseMessage(data) {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data && typeof data === "object" ? data : null;
}

// Choice fields arrive as option ids; resolve them back to their labels.
function readValue(field) {
  const { value, options } = field;
  if (value === null || value === undefined || value === "") return "";

  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        const option = Array.isArray(options) ? options.find((item) => item.id === entry) : null;
        return option ? option.text : entry;
      })
      .filter((entry) => entry !== null && entry !== undefined && entry !== "")
      .join(", ");
  }

  if (typeof value === "object") return "";
  return String(value);
}

function toLead(payload) {
  const lead = { fields: {} };
  const fields = Array.isArray(payload?.fields) ? payload.fields : [];

  fields.forEach((field) => {
    const label = String(field?.label || "").trim();
    const type = String(field?.type || "").toUpperCase();
    const value = readValue(field);
    if (!value) return;

    const lowered = label.toLowerCase();

    if (!lead.email && (type === "INPUT_EMAIL" || EMAIL_PATTERN.test(value))) {
      lead.email = value;
    } else if (!lead.phone && (type === "INPUT_PHONE_NUMBER" || lowered.includes("phone"))) {
      lead.phone = value;
    } else if (!lead.name && lowered.includes("name")) {
      lead.name = value;
    } else if (label && type !== "HIDDEN_FIELDS") {
      lead.fields[label] = value;
    }
  });

  return lead;
}

// Forwards Tally application submissions to VidWorth. Returns a cleanup
// function so callers can detach the listener.
export function trackTallySubmissions() {
  if (typeof window === "undefined") return () => {};

  const onMessage = (event) => {
    if (event.origin !== TALLY_ORIGIN) return;

    const message = parseMessage(event.data);
    if (!message || message.event !== "Tally.FormSubmitted") return;
    if (typeof window.VidWorthLead !== "function") return;

    const payload = message.payload || {};
    const responseId = payload.respondentId || payload.responseId;
    if (responseId) {
      if (forwarded.has(responseId)) return;
      forwarded.add(responseId);
    }

    window.VidWorthLead(toLead(payload));
  };

  window.addEventListener("message", onMessage);
  return () => window.removeEventListener("message", onMessage);
}
