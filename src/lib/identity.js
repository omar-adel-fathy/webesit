// Binding this browser to our own record of the person.
//
// VidWorth holds one half of a customer — the video, the link, the campaign,
// the pages they hesitated on. We hold the other half in Baserow. The key that
// says those are the same person is our own row id, and `VidWorthIdentify` is
// what hands it over. Without it a visitor's phone and their laptop stay two
// unrelated strangers, and a second visit weeks later starts from nothing.
//
// An email is deliberately NOT that key: people change them, own several, and
// share one more often than anybody expects.

const STORAGE_KEY = "vidworth-identity";

// `source` names whose id this is, so it can never collide with an id minted by
// some other system and merge two strangers into one person.
const SOURCE = "app";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Called once, at the moment the API confirms who somebody is.
export function rememberVisitor({ leadId, email, name, country, role }) {
  if (!leadId) return;

  const identity = { id: String(leadId), email, name, country, role };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  } catch {
    // A storage-blocked browser still gets identified for this page; it just
    // will not be remembered on the next one. That is expected, not a failure.
  }
  bind(identity);
}

// Called on every load, not only the visit that created the record. Identify is
// idempotent and cheap, and calling it once at capture only is the usual reason
// this ends up half-wired.
export function identifyKnownVisitor() {
  const identity = read();
  if (identity) bind(identity);
}

function bind(identity) {
  window.VidWorthIdentify?.(identity.id, {
    source: SOURCE,
    email: identity.email,
    name: identity.name,
    country: identity.country,
    role: identity.role,
  });
}
