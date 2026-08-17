import { createHash } from "node:crypto";
import { log } from "./log.js";

const entries = new Map();

function keyFor(email, resourceTitle) {
  return createHash("sha256").update(`${String(email).toLowerCase().trim()}|${resourceTitle}`).digest("hex");
}

function prune() {
  const now = Date.now();
  for (const [key, entry] of entries) {
    if (entry.expiresAt <= now) {
      entries.delete(key);
    }
  }
}

export function checkDuplicate(email, resourceTitle) {
  prune();
  const key = keyFor(email, resourceTitle);
  const entry = entries.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt <= Date.now()) {
    entries.delete(key);
    return null;
  }
  return entry;
}

export function markSubmission(email, resourceTitle, leadId, state, ttlMs) {
  prune();
  const key = keyFor(email, resourceTitle);
  entries.set(key, { expiresAt: Date.now() + ttlMs, leadId, state });
  log.info(`Duplicate guard armed for ${email} (${resourceTitle}) for ${Math.round(ttlMs / 1000)}s`);
}

export function updateState(email, resourceTitle, state) {
  const key = keyFor(email, resourceTitle);
  const entry = entries.get(key);
  if (entry) {
    entry.state = state;
  }
}