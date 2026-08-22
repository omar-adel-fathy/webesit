// Client-side navigation helpers.
//
// VidWorth attributes a visitor by the `tid` it finds in the URL, and some
// booking and CRM vendors forward that id as `utm_term` or `salesforce_uuid`
// instead. Every in-app navigation on this site replaces the whole URL, so
// dropping the query string would land the visitor on the next page with no
// click id and make whatever they do there permanently unattributable.
// Carry the inbound query across every hop.

export function withCurrentQuery(href) {
  if (typeof window === "undefined") return href;

  const inbound = window.location.search;
  if (!inbound || inbound === "?") return href;

  const [pathAndQuery, hash] = String(href).split("#");
  const [path, ownQuery] = pathAndQuery.split("?");

  const params = new URLSearchParams(ownQuery || "");
  for (const [key, value] of new URLSearchParams(inbound)) {
    if (!params.has(key)) params.append(key, value);
  }

  const query = params.toString();
  return `${path}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

// Accepts either a bare slug ("about") or an absolute path ("/about") and
// returns a path that still carries the current query string.
export function toPath(href) {
  const raw = String(href || "");
  return withCurrentQuery(raw.startsWith("/") ? raw : `/${raw}`);
}
