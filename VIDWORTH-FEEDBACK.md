# VidWorth — integration feedback from a first install

Written by the engineer who did the first end-to-end install of the pixel on a
real site, while doing it. Everything below is measured on production unless
marked *inferred*.

| | |
|---|---|
| **Site** | `jimscaling.online` — Vite + React SPA, plus 5 static HTML entry points |
| **Channel** | `cmt3dyfqp0018i504lp16fy88` |
| **Build** | tracker `v6`, replay recorder `v2` |
| **Method** | `VidWorthDebug()`, `VidWorthReplayStatus()`, CDP network log, `CompressionStream` |

---

## TL;DR — what I would fix, in this order

| # | Fix | Why it is first |
|---|---|---|
| 1 | **Gzip the keyframe before splitting it** | Measured 5.7× on a real page. Makes the reassembly bug almost unreachable. |
| 2 | **Stop a failed keyframe from poisoning the whole session** | This is what turned one broken page into an account with almost no usable replays. |
| 3 | **Retry / degrade the keyframe instead of recording onto nothing** | Failure is currently silent for days. |
| 4 | **Ship the stub queue in the snippet** | Measured 1,453 ms where every event call is silently discarded. |
| 5 | **Decorate links with `tid` automatically** | Every customer hand-rolls this and the failure is permanent and invisible. |
| 6 | **Route- and selector-level masking in the console** | Per-element markup does not scale past a landing page. |
| 7 | **A test mode** | I had to write junk into production to verify the install. |

Items 1–4 are silent-failure bugs. Items 5–7 are the ones that will hurt as
soon as a customer bigger than this one arrives.

---

## 1. Session replay

### 1.1 A keyframe that splits into more than one part is never assembled

Four sessions, same site, same tracker, minutes apart:

| Page | Nodes | Keyframe | Parts | Status | Plays |
|---|---:|---:|---:|---|---|
| `/free-resources` (first page of session) | 118 | 50,988 B | 1 | `accepted` @ +1.78s | yes |
| `/` homepage, production | 764 | 148,217 B | 2 | `partial`, `acceptedAt: null` @ 163s | no |
| `/` homepage, local build | 764 | 217,208 B | 3 | `partial`, never | no |
| `/` second document, same tab | — | 127,746 B | 2 | `rejected_409` | no |

One part is accepted in under two seconds. Two or more parts is never accepted —
not after 2m43s, not ever. The threshold where one part becomes two sits near
**100 KB** (*inferred* from the split points above).

Every documented cap was respected with room to spare — **764 nodes against a
12,000 cap, 44 KB of CSS against a 400 KB cap.** So the constraint that actually
breaks installs is undocumented, and a customer has no way to anticipate it.

In the network log the `seq: 0` POST to `/api/replay/{channelId}` **hung and
never resolved**, while the following chunk returned `204` in milliseconds. If
part one never lands the set can never complete, which matches the observed
state exactly. That looks like the direct cause rather than a symptom.

Matched pair for tracing, one minute apart on one site:

```
rs_ed364325b0cb4ce8ab8fe59c77a212e5   2 parts   partial    blank
rs_518608499a4f404eb3c44c84f7dc9a95   1 part    accepted   plays
```

### 1.2 A failed keyframe poisons every later page in the session

This is the finding that matters most, and I only caught it by accident.

`/free-resources` records fine **on its own** — 1 part, accepted. But when I
reached it by navigating from the homepage in the same tab, it sent a
**single-part 62,208 B keyframe and got `rejected_409`**, then `stopped: true`.

The session id lives in `sessionStorage` (`vidworth_rsid`), so it is inherited
across hard navigations. The homepage's keyframe was never accepted. The
free-resources keyframe was then refused as a duplicate — against a session that
holds no keyframe at all. A perfectly good snapshot was rejected in favour of one
that does not exist.

**The consequence:** a session is decided by its first page. Land on the
homepage and *nothing* in that visit is playable, no matter how many small pages
follow. The only replays that work on this account are visitors who landed
directly on `/free-resources` and never touched the homepage — which is exactly
the pattern the account owner reported, and it is not a coincidence.

This is what converts "one page is too big" into "this account has almost no
replay". Fixing 1.1 fixes this too, but the `409` should be fixed on its own
merits: **when the session has no accepted keyframe, accept the incoming one
instead of rejecting it.** Refusing a duplicate is correct only when there is
something to duplicate.

Multi-document sites are ordinary, not an edge case — a static marketing site
beside an SPA, Astro, Hugo, Next with a mix of static and client routes. This
site has six HTML entry points.

### 1.3 The recorder never checks its own work

`acceptedAt` is right there in the recorder's own state. Today it sends once,
never looks, and keeps recording for up to 30 minutes onto a snapshot the server
does not hold. Every one of those sessions is dead at the moment it is created,
and nobody finds out until somebody opens the player days later.

What it should do instead:

1. Re-check `acceptedAt` after a short delay.
2. Retry with backoff.
3. Degrade in a defined order — **drop the inlined CSS copy first**, since the
   original `<link>` is retained anyway and same-origin sheets are refetchable —
   and re-send.
4. Only then give up, and set `reason` so the failure has a name instead of
   `null`.

Right now `stopped: true, reason: null` is the state of a session that died
without explanation.

### 1.4 Store the stylesheet once, not once per session

44,310 B of every keyframe on this site is a copy of one same-origin stylesheet
that is byte-identical on every page and in every session. Key it by URL +
content hash, upload once, reference thereafter. Roughly **30% off every
keyframe here before compression**, and near-total elimination of a repeated
upload across a busy channel.

### 1.5 Compression — the measured case for doing this first

The keyframe is JSON wrapping a serialized DOM and an inlined stylesheet. It is
about as compressible as a payload gets, and it currently ships raw.

```
keyframe content     129,035 B
gzipped               22,637 B      5.7x
stylesheet alone      44,310 B  ->  8,758 B
```

`CompressionStream("gzip")` is browser-native everywhere current, a handful of
lines, and needs only `Content-Encoding` handling on the ingest. The 148 KB
keyframe becomes ~26 KB — **smaller than the page that already works today**. A
page four times the size of this homepage would still land in a single part.

This does not raise the ceiling. It removes the multi-part path for essentially
every real site, and takes 1.1, 1.2 and most of 1.3 out of reach with it.

---

## 2. The snippet silently drops events for the first ~1.5 seconds

> **Resolved.** The install snippet now ships a stub queue (`window.VidWorthQ`)
> ahead of the async tag, and the live tracker drains it — it checks each global
> for `__vwStub` and replays the recorded arguments in order. This site now
> carries the stub on all six entry points, so the section below describes the
> state before that change rather than the state today.


Measured from document start on production:

```
typeof window.VidWorthTrack at document start   "undefined"
ms until VidWorthTrack is callable              1453
stub queue present (VidWorthTrack.q)            false
```

The script is `async`, so for **1.45 seconds** none of the globals exist. The
documented calling convention is `window.VidWorthSignup?.({ … })` — which means
every call in that window is **silently discarded**. No error, no queue, no
console warning, nothing in `VidWorthDebug()` to say it happened.

The docs acknowledge this and push it onto the customer:

> If a call genuinely must not be lost, queue it yourself and flush when
> `window.VidWorthTrack` appears.

That is backwards. Every other analytics vendor ships the stub queue *in the
snippet*, because it is four lines and it is the vendor's problem:

```js
window.VidWorthTrack = window.VidWorthTrack || function () {
  (window.VidWorthTrack.q = window.VidWorthTrack.q || []).push(arguments);
};
```

Do that for every global, flush on load. Then `?.` becomes a safety net rather
than a data-loss mechanism, and the "queue it yourself" paragraph can be deleted.

**Who this hits hardest:** fast interactions near page load — a CTA click above
the fold, a returning user's `VidWorthIdentify()`, a redirect-through page, a
thank-you page that converts and immediately navigates. Exactly the moments that
matter, on the slowest connections, and it is invisible in aggregate because the
events simply never exist.

---

## 3. Attribution is hand-rolled, and it fails permanently and silently

`tid` is read from the URL and held for the session. Any client-side navigation
that rebuilds the URL drops it. On this site every in-app navigation did:

```js
window.location.assign("/" + href);        // query string gone
window.history.pushState({}, "", path);    // query string gone
```

The docs warn about this in prose — *"never strip, rewrite or canonicalise
`tid`"* — but the warning only helps someone who already knows to look. There is
no helper, no linter, and no debug warning when a navigation lands on a page
whose URL lost a `tid` the tracker is still holding.

**Ask:** ship link decoration, the way cross-domain linkers already work
elsewhere.

- `VidWorthDecorateUrl(href)` returning the href with `tid` reattached, so
  routers and `location.assign` calls have a one-liner.
- Optionally an automatic mode that decorates same-origin anchors on click.
- At minimum, under `?vw_debug=1`, warn when a same-origin navigation drops a
  `tid` that is currently held.

I fixed this by hand across four call sites in three files. Every customer with a
router will have the same bug, and none of them will find out — the conversions
just quietly arrive unattributed.

---

## 4. Masking does not scale past a landing page

Today masking is per-element markup only: `data-vw-block` / `data-vw-mask`
written literally into the DOM. That is workable for a landing page with two
sensitive regions. It does not survive contact with a SaaS app.

On a product with an admin area, a customer list, an inbox and a billing page,
the current model means touching every component, forever, and getting it right
first time — because **masking happens in the browser before transmission, so it
is not retroactive.** One missed component is unmaskable personal data already
sitting in your storage.

**Ask, in the console rather than the markup:**

- Route rules — *never record `/admin/*`*, *mask everything under `/app/*`*.
- Selector rules — *block `[data-role="customer"]`*, *mask `.invoice-total`*.
- A default-deny mode for authenticated routes.

**Also missing: any way to audit what was masked.** There is no view that says
"14 regions blocked, 3 masked in this recording". A customer with a compliance
obligation cannot currently prove the thing they are being asked to prove, and
cannot find the region someone forgot to mark.

The docs are right that this is the irreversible part of the install. That is
exactly why it should not depend on an engineer remembering to annotate every
future component.

---

## 5. There is no test path, so I wrote junk into production

To verify the install I had to fire real events at the live channel: a fake click
id `vw_local_test`, a fake lead, chat events, plan views. There is no sandbox, no
test channel, no `?vw_env=test`, and no way to mark or purge test data
afterwards.

Every integrator will do this, and every customer's first week of data will
contain the developer's own fixtures. That noise lands in the same funnel numbers
the product is selling.

**Ask:** a test mode that tags events, is excluded from dashboards by default, is
visible in a debug view, and can be purged in one action.

---

## 6. Developer ergonomics that are simply missing

Individually small, collectively the difference between an install that takes an
hour and one that takes a day.

- **No npm package.** For React / Next / Vue the guidance is "render the script
  from your root layout" plus hand-written global calls. A thin
  `@vidworth/browser` giving a `<VidWorthScript />`, the queue from §2 and typed
  calls would remove most of this document's §2 and §3.
- **No shipped TypeScript types.** The docs ask every customer to paste a
  `types/vidworth.d.ts` by hand. That declaration will drift from the real API the
  first time you add a method, in every customer repo simultaneously. Ship it as a
  package.
- **No `VidWorthReady` callback or promise.** Related to §2 — there is no
  supported way to run something once the tracker exists.
- **The script URL is unversioned**, with no changelog and no SRI. Customers
  cannot pin a version, so a change on your side changes behaviour on their site
  with no notice and no way to bisect. At minimum publish a changelog and a
  version-pinned URL for customers who want one.
- **No documented CSP requirements.** A site with a strict policy needs
  `script-src` and `connect-src` entries for `vidworth.co`. Nothing in the docs
  says so, and the failure is a silently absent pixel. Note the recorder is
  fetched from a *second* endpoint, `/api/replay/script/{channelId}` — that needs
  listing too.
- **No documented limits on payloads.** What happens to a `fields` object with
  200 keys, or a 10 KB string? Truncated, rejected, accepted? Unknown, so
  everyone guesses.
- **No server-side SDK.** §8 of the brief has customers hand-rolling HTTP with
  manual `externalId` idempotency. That is a package.
- **No way to query whether an `externalId` already landed.** `externalId` is
  required whenever an amount is present precisely because billing jobs retry —
  but a retrying job has no way to check, so the safe path is unavailable.
- **Event meanings live in a web UI with no link to the code.** Instrumentation is
  in the repo and under review; its meaning is a dropdown in a console. Nobody
  reviewing a PR can see that a new `VidWorthTrack("x")` will count as nothing
  until somebody clicks something. An `/api/v1/event-definitions` endpoint, or
  definitions-as-config, would let this live beside the instrumentation.
- **Dead clicks and rage clicks are detected but undocumented.** They appear in
  the session UI and are not mentioned anywhere in the setup material.
  Undocumented features are features nobody knows to use.

---

## 7. The setup prompt — the edits that would have prevented this

The prompt is genuinely good: specific, opinionated, honest about failure modes,
and it steered several decisions correctly. These are the gaps that let a broken
install pass its own checklist.

**1. No checklist line verifies that a replay actually plays.** Six lines cover
masking; none asks whether a recording can be rebuilt. Add:

> On the largest page of the site, wait ten seconds and run
> `VidWorthReplayStatus()`. Confirm `keyframe.status` is `accepted` and
> `acceptedAt` is not null. If it reads `partial`, every recording of that page
> will be blank — report it rather than ticking this line.

This one line is the difference between catching §1 during the install and
discovering it fifty installs later.

**2. "A recording is kilobytes rather than megabytes"** is reassurance that stops
anyone measuring. Real figures here: a 148 KB keyframe and 175 KB of session in
under three minutes. Say what drives size — node count, class-attribute
verbosity, the inlined stylesheet — and give the real ceiling.

**3. The documented caps omit the only one that binds.** 30 min / 20,000 events /
6 MB / 400 chunks / 12,000 nodes / 400 KB CSS are all listed. The install failed
at 764 nodes and 44 KB of CSS. Document the ~100 KB keyframe limit, or remove it
via §1.5 and delete the line.

**4. "Exactly ONE file" is wrong for multi-entry sites.** *"If you find yourself
adding it to a second file, you are installing it twice"* argues against
installing on five of this site's six entry points — and a page without the
script is the unrecoverable attribution failure the same document warns about
hardest. Add: *"…unless the site has several independent HTML entry points, in
which case each one needs the tag. Installing twice means two tags in one page."*

**5. A hosted form in an iframe falls between two rules.** The prompt covers
custom forms in component state, and separately says never to double-instrument a
connected plugin. It never addresses a Tally or Typeform embed in a cross-origin
iframe. A previous agent on this codebase resolved the ambiguity by writing a
`postMessage` bridge that reported every application twice, on an account where
Tally was already connected. Add: *"A hosted form in an iframe is not a custom
form. Never bridge its `postMessage` events. Instrument the form being reached
instead — that is the part the vendor cannot report."*

**6. The declared account type does not change the prompt.** The facts say this
account is "a landing page or funnel", then ship the full product spec — user
ids, signup, login, onboarding, checkout, subscriptions, none of which exist. It
also says to *"instrument `VidWorthCheckout()` anyway"* on a site with no checkout
and no order id, which can only be obeyed by inventing an id — something rule 2
forbids two rules earlier. Branch the generated prompt on account type.

**7. `VidWorthTrack`'s payload shape is unspecified.** Examples show both
`{ meta: { days: 7 } }` and flat `{ email, name }`. Since a name can later be
promoted to *Creates a lead*, which keys are read for the lead decides whether
that promotion works at all. Agents have to guess, and a wrong guess only
surfaces months later.

**8. Multi-document sites are unaddressed for replay.** "One session is one tab"
is stated and `target="_blank"` is warned about, but nothing covers a site where
ordinary navigation is a full document load — which is where §1.2 lands.

**9. Two debug mechanisms, no stated difference.** `?vw_debug=1` appears in the
platform section; `localStorage.setItem("vidworth_debug", "1")` appears in the
verification section. Whether they do the same thing is never said.

**10. The report-back has no schema, so replay health goes unreported.** Require
named fields: file the script went in; every call site with file and event name;
every custom name introduced; every region masked and the routes searched;
anything skipped and why; **and the keyframe status of the largest page.**

---

## 8. What I would build into the console

- **A "Verify install" action** that headlessly loads the customer's own top URLs
  — you already know them from inbound pageviews — and reports per page: script
  present, endpoint correct, `tid` captured, keyframe size, part count, accepted
  y/n, masked-region count. This is the single feature that would have caught
  everything in §1 before the customer opened a player.
- **Keyframe acceptance rate on the pixel screen.** The server knows it. This
  account would have read *"accepted on 1 of 6 pages"* on day one instead of the
  owner discovering it recording by recording.
- **Flag event names that have gone unpromoted.** The brief concedes an
  unpromoted name *"counts as nothing forever — and that, far more often than a
  missing call, is why a funnel stage reads zero."* If it is the most common
  failure, build the nudge.

---

## Appendix — raw measurements

```
Environment
  tracker version              6
  replay recorder version      2
  sessionStorage keys          vidworth_rsid, vidworth_rt0,
                               vidworth_rseq, vidworth_rsample
  endpoints observed           /api/script/{ch}
                               /api/track/{ch}
                               /api/replay/script/{ch}
                               /api/replay/{ch}

Snippet availability (production, cold load)
  typeof VidWorthTrack at document start   undefined
  ms until callable                        1453
  stub queue present                       false

Homepage /  (764 nodes, 80,790 B outerHTML)
  stylesheets            1 same-origin, readable, 485 rules
  adoptedStyleSheets     0
  css minified           39,536 B
  css expanded           44,310 B
  keyframe               148,217 B, 2 parts, partial, acceptedAt null @ 163s
  session bytes          175,399 B @ 163s

/free-resources  (118 nodes, 16,437 B outerHTML)
  keyframe, first page of session    50,988 B, 1 part, accepted @ +1.78s
  keyframe, inherited session        62,208 B, 1 part, rejected_409, stopped

Compression (CompressionStream gzip, live page content)
  keyframe content       129,035 B -> 22,637 B    5.7x
  stylesheet alone        44,310 B ->  8,758 B    5.1x

Documented caps vs observed failure
  nodes        764 observed / 12,000 documented
  inlined css   44 KB observed / 400 KB documented
  keyframe     148 KB observed / undocumented
```

*Not a finding: the Sentry traffic visible on the homepage is Tally's, not
VidWorth's. I checked a page without the Tally embed and none fired.*
