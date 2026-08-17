import handler from "./api/lead.js";
process.env.SITE_URL = "https://jimscaling.online";

const calls = [];
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  calls.push(`${init.method ?? "GET"} ${u}`);
  const json = (body) => ({
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });

  if (u.includes("api.baserow.io/api/database/fields/table/")) {
    return json([
      { id: 1, name: "Full Name", type: "text" },
      { id: 2, name: "Email", type: "email" },
      { id: 3, name: "Phone", type: "phone_number" },
      { id: 4, name: "Country", type: "single_select", select_options: [
        { id: 1, value: "USA" },
        { id: 2, value: "Canada" },
        { id: 3, value: "United Kingdom" },
        { id: 4, value: "Australia" },
      ] },
      { id: 5, name: "Role", type: "text" },
      { id: 6, name: "Consent", type: "boolean" },
      { id: 7, name: "Source", type: "text" },
      { id: 8, name: "Resource", type: "text" },
      { id: 9, name: "Delivery Status", type: "single_select" },
      { id: 10, name: "Submitted At", type: "datetime" },
      { id: 11, name: "Notes", type: "text" },
    ]);
  }
  if (u.includes("/database/rows/table/") && u.includes("?user_field_names=true")) {
    return json({ id: 12345 });
  }
  if (u.includes("api.resend.com/contacts?")) {
    return json({ data: [] });
  }
  if (u.includes("api.resend.com/contacts")) {
    return json({ id: "cnt_1" });
  }
  if (u.includes("api.resend.com/emails")) {
    return json({ id: "em_1" });
  }
  return json({});
};

function makeRes() {
  const state = { statusCode: 200, headers: {}, body: null };
  return {
    status(code) { state.statusCode = code; return this; },
    setHeader(k, v) { state.headers[k] = v; return this; },
    json(body) { state.body = body; },
    end() {},
    state,
  };
}

const req = (body, extra = {}) => ({
  method: "POST",
  headers: { "content-length": JSON.stringify(body).length, origin: "http://localhost:5173", ...(extra.headers || {}) },
  body,
  socket: { remoteAddress: "127.0.0.1" },
});

const payload = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 555 010 1234",
  country: "USA",
  role: "Founder",
  consent: true,
  company: "",
  attribution: { utm_source: "ig", utm_campaign: "launch" },
};

const cases = [
  { name: "success POST", req: req(payload), expect: 201 },
  { name: "validation POST", req: req({ ...payload, email: "bad-email" }), expect: 400 },
  { name: "honeypot POST", req: req({ ...payload, company: "spam-co", email: "bot@x.com" }), expect: 200 },
  { name: "forbidden origin", req: req(payload, { headers: { origin: "https://evil.example" } }), expect: 403 },
  { name: "GET", req: { method: "GET", headers: {}, socket: {} }, expect: 200 },
];

for (const c of cases) {
  const res = makeRes();
  await handler(c.req, res);
  const ok = res.state.statusCode === c.expect;
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.name} -> ${res.state.statusCode}${ok ? "" : ` (expected ${c.expect})`}`);
  if (res.state.body) {
    console.log("        ", JSON.stringify(res.state.body).slice(0, 140));
  }
}

console.log("\nfetch calls seen:");
for (const c of calls) console.log("   ", c);