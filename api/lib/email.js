/**
 * JIMSCALING — Free Resource delivery email (express mirror)
 * =====================================================================
 * This template is the transactional delivery email generated after a
 * user submits the "Free Resources" form.
 *
 * DESIGN: personalized resource delivery from a strategy studio.
 * The recipient should immediately understand:
 *   "This was generated for me, from what I submitted, and it's ready."
 *
 * STATIC BRAND CONTENT  (written here, shipped as-is)
 *   - brand lock-up, hero headline, editorial body copy,
 *     CTA labels, sign-off, transactional footer
 *
 * DYNAMIC SUBMISSION CONTENT (injected below, escaped before render)
 *   firstName      -> greeting + personalization meta line
 *   fullName       -> fallback when firstName is unavailable
 *   role           -> "you came through as" + submission insight
 *   country        -> provenance line + submission insight
 *   resourceTitle  -> the requested resource name
 *   email          -> recipient proof in the footer
 *   viewUrl        -> primary CTA "View PDF" + "open in browser"
 *   downloadUrl    -> secondary CTA "Download PDF" + "download directly"
 *   requestDate    -> humanised "Requested Aug 17, 2026" meta
 *   siteUrl        -> host, shown only when it is a real (non-dev) domain
 *
 * SECURITY: every user-provided value flows through escapeHtml() so a
 * submission can never inject markup. hrefs pass through trustedHref(),
 * which only allows http(s) — never javascript:, data:, etc.
 * =====================================================================
 */

const GROUND = "#e9e2d5"; // page / email-client background
const SURFACE = "#fbf8f1"; // email surface (paper)
const INK = "#111111"; // primary text
const MUTED = "#55524c"; // secondary text
const DIVIDER = "#ddd7cb"; // hairlines / separators
const ACCENT = "#2457d6"; // single brand accent — CTAs + links
const FOOTER = "#111111"; // dark footer + hero
const WHITE = "#ffffff";

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function siteLabel(siteUrl) {
  try {
    return new URL(siteUrl).host.replace(/^www\./, "");
  } catch {
    return siteUrl;
  }
}

/**
 * Development / private hosts are hidden from the customer-facing email.
 * The siteUrl remains part of the application data — it is just not
 * rendered prominently when it is a dev loopback address.
 */
function isDevHost(host) {
  if (/^localhost(\.|$)/i.test(host)) return true;
  if (/^127(?:\.\d{1,3}){3}$/.test(host)) return true;
  if (/^\[?::1\]?$/.test(host)) return true;
  if (/\.(local|lan|internal)$/i.test(host)) return true;
  return false;
}

/**
 * Only trusted protocols may appear inside an href. Anything else is
 * rejected so a malicious submission can never turn the CTA into an
 * unsafe link (javascript:, data:, vbscript:, …).
 */
function trustedHref(value) {
  const url = String(value ?? "").trim();
  return /^https?:\/\//i.test(url) ? url : "#";
}

function formatRequestDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function buildEmailContent(input) {
  // ---- Dynamic values: escape BEFORE they touch the template ----
  const title = escapeHtml(input.resourceTitle);
  const firstName = escapeHtml(input.firstName || "there");
  const fullName = escapeHtml(input.fullName || input.firstName);
  const role = escapeHtml(input.role || "").trim();
  const country = escapeHtml(input.country || "").trim();
  const recipient = escapeHtml(input.email);
  const requestDate = formatRequestDate(input.requestDate);
  const senderName = escapeHtml(input.senderName || "Jimscaling Strategy");

  // Port is stripped so detection and display treat localhost:3000 as
  // "localhost" and never leak the dev URL into a production email.
  const host = siteLabel(input.siteUrl).replace(/:\d+$/, "");
  const hostSafe = escapeHtml(host);
  const hostIsVisible = !isDevHost(host);

  const viewHref = trustedHref(input.viewUrl);
  const downloadHref = trustedHref(input.downloadUrl);

  const subject = input.subject;

  // ---- Conditional copy: missing values must never leak "out of ." ----
  const cameThrough = role
    ? country
      ? `You came through as a <strong class="pv">${role}</strong> out of <strong class="pv">${country}</strong> — the exact kind of person this was built for.`
      : `You came through as a <strong class="pv">${role}</strong> — the exact kind of person this was built for.`
    : `You came through as someone who takes growth seriously — this was built exactly for you.`;

  // ---- Personalization meta line (hero) ----
  const metaParts = [
    `Prepared for <strong class="meta-strong" style="font-weight:700;color:${WHITE};">${firstName}</strong>`,
  ];
  if (requestDate) {
    metaParts.push(`Requested <strong class="meta-strong" style="font-weight:700;color:${WHITE};">${requestDate}</strong>`);
  } else if (hostIsVisible) {
    metaParts.push(`requested on <strong class="meta-strong" style="font-weight:700;color:${WHITE};">${hostSafe}</strong>`);
  }
  const metaLine = metaParts.join(`<span class="meta-dot" style="margin:0 8px;">·</span>`);

  // ---- Submission insight card: only render when the data really exists ----
  const insightCard = role && country
    ? `
          <tr>
            <td class="pad" bgcolor="${SURFACE}" style="padding:10px 48px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid ${DIVIDER};border-bottom:1px solid ${DIVIDER};padding:22px 0 20px;">
                    <p class="insight-label" style="font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:3px;line-height:1.4;color:${MUTED};margin:0 0 8px;">YOU CAME THROUGH AS</p>
                    <p class="insight-value" style="font-family:${FONT_STACK};font-size:24px;font-weight:800;letter-spacing:-0.2px;line-height:1.2;color:${INK};margin:0 0 4px;">${role}</p>
                    <p class="insight-sub" style="font-family:${FONT_STACK};font-size:13px;line-height:1.5;color:${MUTED};margin:0;">out of <strong class="pv" style="font-weight:700;color:${INK};">${country}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  const preheaderText = `${firstName}, your ${title} PDF is ready — free, no catch, waiting below.`;

  const hostClauseFooter = hostIsVisible ? ` on ${hostSafe}` : "";

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    /* ---------- resets ---------- */
    .preheader { display:none !important; visibility:hidden; opacity:0; mso-hide:all; font-size:1px; line-height:1px; max-height:0; max-width:0; overflow:hidden; }
    body { Margin:0; padding:0; width:100%; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; word-spacing:normal; }

    /* ---------- mobile overrides ---------- */
    @media screen and (max-width: 600px) {
      .container { width:100% !important; max-width:100% !important; }
      .body-gutter { padding-left:10px !important; padding-right:10px !important; }
      .pad { padding-left:24px !important; padding-right:24px !important; }
      .pad-top { padding-top:28px !important; }
      .hero-title { font-size:38px !important; line-height:1.06 !important; }
      .cta-button { font-size:16px !important; }
      .footer-pad { padding-left:24px !important; padding-right:24px !important; }
    }
  </style>
</head>
<body style="Margin:0;padding:0;width:100%;background-color:${GROUND};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;word-spacing:normal;">
  <!-- Hidden preheader: controls the inbox snippet -->
  <div class="preheader" style="display:none !important;visibility:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;overflow:hidden;">${preheaderText}&nbsp;&zwnj;</div>

  <!--
    Outlook-safe wrapper: Outlook Desktop honours the fixed 640px table in
    the [if mso] block; every other client gets the fluid max-width 640px
    card below and centres it with margin:0 auto.
  -->
  <!--[if mso]>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${GROUND}" style="background-color:${GROUND};">
    <tr>
      <td align="center" bgcolor="${GROUND}" style="background-color:${GROUND};padding:40px 0;">
  <![endif]-->

  <table class="body-gutter" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${GROUND};padding:40px 24px;">
    <tr>
      <td align="center">
        <table class="container" role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;margin:0 auto;background-color:${SURFACE};border:1px solid ${DIVIDER};border-collapse:separate;">
          <!--
            The card is drawn as three stacked blocks:
            paper header -> ink hero -> paper body -> ink footer.
            Rounded corners are applied to the hero (top) and footer (bottom)
            <td>s. Clients that strip border-radius fall back to square
            corners cleanly, which is an acceptable degradation.
          -->

          <!-- HEADER : brand lock-up on paper -->
          <tr>
            <td class="pad" bgcolor="${SURFACE}" style="padding:32px 48px 24px;" align="left">
              <p style="font-family:${FONT_STACK};font-size:13px;font-weight:800;letter-spacing:5px;line-height:1.4;color:${INK};margin:0;">JIMSCALING</p>
              <p style="font-family:${FONT_STACK};font-size:10px;font-weight:500;letter-spacing:2px;line-height:1.4;color:${MUTED};margin:5px 0 0 0;text-transform:uppercase;">Strategy &amp; Performance Creative</p>
            </td>
          </tr>

          <!-- hairline divider under the brand -->
          <tr>
            <td style="background-color:${DIVIDER};height:1px;line-height:1px;font-size:1px;padding:0;">&nbsp;</td>
          </tr>

          <!-- HERO : ink block, dominant headline + personalization meta -->
          <tr>
            <td class="pad pad-top" bgcolor="${FOOTER}" style="background-color:${FOOTER};border-radius:20px 20px 0 0;padding:44px 48px 38px;" align="left">
              <p class="eyebrow" style="font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:4px;line-height:1.4;color:${DIVIDER};margin:0 0 16px 0;">FREE RESOURCE</p>
              <h1 class="hero-title" style="font-family:${FONT_STACK};font-size:42px;font-weight:800;letter-spacing:-1px;line-height:1.08;color:${SURFACE};margin:0 0 20px 0;">Free Resources &mdash;<br />it&rsquo;s yours, free</h1>
              <p class="personalization-meta" style="font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:${DIVIDER};margin:0;">${metaLine}</p>
            </td>
          </tr>

          <!-- GREETING + BODY : conversational copy on paper -->
          <tr>
            <td class="pad" bgcolor="${SURFACE}" style="padding:38px 48px 0;">
              <h2 style="font-family:${FONT_STACK};font-size:21px;font-weight:800;letter-spacing:-0.2px;line-height:1.3;color:${INK};margin:0 0 18px 0;">Hi ${firstName},</h2>
              <p style="font-family:${FONT_STACK};font-size:16px;font-weight:400;line-height:1.65;color:${INK};margin:0 0 18px 0;">
                You just submitted for <strong class="pv" style="font-weight:700;color:${INK};">${title}</strong>, so here it is &mdash; free, no catch, no follow-up required. One PDF, straight to the point: the thinking, the structure, and the exact steps I walk through with strategy clients.
              </p>
              <p style="font-family:${FONT_STACK};font-size:16px;font-weight:400;line-height:1.65;color:${INK};margin:0 0 18px 0;">${cameThrough}</p>
              <p class="last-paragraph" style="font-family:${FONT_STACK};font-size:16px;font-weight:400;line-height:1.65;color:${INK};margin:0;">
                Most brands buy assets and hope. The ones who win build a system. <strong class="pv" style="font-weight:700;color:${INK};">${firstName}</strong>, you&rsquo;ve already done the first step &mdash; give yourself a moment of credit for that.
              </p>
              <p style="font-family:${FONT_STACK};font-size:16px;font-weight:400;line-height:1.65;color:${INK};margin:18px 0 0 0;">Read it this week, keep what fits, leave the rest.</p>
            </td>
          </tr>

          ${insightCard}

          <!-- CTA : one dominant action + one quiet secondary action -->
          <tr>
            <td class="pad" bgcolor="${SURFACE}" style="padding:34px 48px 4px;" align="left">
              <!--
                Bulletproof button: the clickable area is a block anchor inside
                a table cell that carries bgcolor + background-color, so Outlook
                Desktop paints the blue behind the text even when it ignores
                anchor background styles. border-radius degrades to square.
              -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${ACCENT}" class="cta-cell" style="background-color:${ACCENT};border-radius:12px;">
                    <a class="cta-button" href="${viewHref}" target="_blank" rel="noopener" style="display:block;font-family:${FONT_STACK};font-size:16px;font-weight:800;letter-spacing:0.3px;line-height:1.4;color:${WHITE};text-decoration:none;padding:18px 32px;text-align:center;">View PDF</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="pad" bgcolor="${SURFACE}" style="padding:18px 48px 6px;" align="center">
              <a class="cta-secondary" href="${downloadHref}" target="_blank" rel="noopener" style="display:inline-block;font-family:${FONT_STACK};font-size:14px;font-weight:700;line-height:1.4;color:${INK};text-decoration:underline;text-underline-offset:4px;padding:6px 4px;">Download PDF</a>
            </td>
          </tr>

          <!-- FALLBACK LINKS : for clients that mangle buttons/bullets -->
          <tr>
            <td class="pad" bgcolor="${SURFACE}" style="padding:8px 48px 2px;" align="center">
              <p style="font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${MUTED};margin:0;">
                Buttons not working?
                <a href="${viewHref}" target="_blank" rel="noopener" style="font-family:${FONT_STACK};color:${ACCENT};font-weight:600;text-decoration:underline;">open in browser</a>
                &nbsp;&middot;&nbsp;
                <a href="${downloadHref}" target="_blank" rel="noopener" style="font-family:${FONT_STACK};color:${ACCENT};font-weight:600;text-decoration:underline;">download directly</a>
              </p>
            </td>
          </tr>

          <!-- CLOSING : human sign-off -->
          <tr>
            <td class="pad" bgcolor="${SURFACE}" style="padding:36px 48px 40px;">
              <p style="font-family:${FONT_STACK};font-size:16px;font-weight:400;line-height:1.65;color:${INK};margin:0 0 24px 0;">
                If something in there sparks a question, just hit reply &mdash; a real person reads every message, and I&rsquo;m happy to point you in the right direction.
              </p>
              <p style="font-family:${FONT_STACK};font-size:16px;line-height:1.55;color:${INK};margin:0;">
                Best,<br />
                <span style="font-size:17px;font-weight:800;">Jim</span><br />
                <span style="font-size:12px;line-height:1.5;color:${MUTED};">${senderName} &middot; Strategy for brands that want to grow.</span>
              </p>
            </td>
          </tr>

          <!-- FOOTER : transactional explanation on ink -->
          <tr>
            <td class="footer-pad" bgcolor="${FOOTER}" style="background-color:${FOOTER};border-radius:0 0 20px 20px;padding:30px 48px 34px;" align="center">
              <p style="font-family:${FONT_STACK};font-size:11px;font-weight:800;letter-spacing:4px;line-height:1.6;color:${SURFACE};margin:0 0 12px 0;">JIMSCALING</p>
              <p style="font-family:${FONT_STACK};font-size:12px;line-height:1.7;color:${DIVIDER};margin:0 0 8px 0;">
                You&rsquo;re receiving this because you submitted for <strong style="color:${WHITE};">${title}</strong>${hostClauseFooter} (${recipient}).
              </p>
              <p style="font-family:${FONT_STACK};font-size:11px;line-height:1.7;color:${DIVIDER};margin:0;">
                This is a transactional message about the resource you asked for &mdash; no spam, no lists. If it wasn&rsquo;t you, reply and we&rsquo;ll take care of it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

  <!--[if mso]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>`;

  const text = [
    subject,
    ``,
    `Hi ${input.firstName || "there"},`,
    ``,
    `You just submitted for ${input.resourceTitle}, so here it is — free, no catch, no follow-up required. One PDF, straight to the point: the thinking, the structure, and the exact steps I walk through with strategy clients.`,
    ``,
    role && country
      ? `You came through as a ${input.role} out of ${input.country} — the exact kind of person this was built for.`
      : role
        ? `You came through as a ${input.role} — the exact kind of person this was built for.`
        : `You came through as someone who takes growth seriously — this was built exactly for you.`,
    ``,
    `Most brands buy assets and hope. The ones who win build a system. ${input.firstName || "You"}, you've already done the first step — give yourself a moment of credit for that.`,
    ``,
    `Read it this week, keep what fits, leave the rest.`,
    ``,
    `View the PDF here: ${viewHref}`,
    `Download the PDF here: ${downloadHref}`,
    ``,
    `If something in there sparks a question, just hit reply — a real person reads every message, and I'm happy to point you in the right direction.`,
    ``,
    `Best,`,
    `Jim`,
    `${input.senderName || "Jimscaling Strategy"} · Strategy for brands that want to grow.`,
    ``,
    `—`,
    `You're receiving this because you submitted for ${input.resourceTitle}${hostIsVisible ? ` on ${host}` : ""} (${input.senderEmail}). This is a transactional message — no spam, no lists.`,
  ].join("\n");

  return { subject, html, text };
}