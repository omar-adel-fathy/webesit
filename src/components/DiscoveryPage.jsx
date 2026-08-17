import { useEffect } from "react";
import { ArrowUpRight, CheckCircle2, ExternalLink, PlaySquare } from "lucide-react";
import SiteHeader, { navLinks } from "./SiteHeader";
import SiteFooter from "./SiteFooter";

const SITE_URL = "https://jimscaling.online";
const YOUTUBE_URL = "https://www.youtube.com/@jimscaling";

const videoNotes = [
  {
    title: "I Got 1,000,000 Views but $0 Sales (The 6-Step Fix for Shopify Brands)",
    summary: "A practical breakdown of why reach does not automatically become revenue and how a Shopify brand can connect creative angles to conversion intent.",
  },
  {
    title: "The 3-Step Performance OS for Shopify Scaling [FULL BREAKDOWN]",
    summary: "A concise walkthrough of the Performance OS: the creative diagnosis, testing structure, and review loop behind consistent output.",
  },
  {
    title: "Why Your Shopify AI Ads are Burning Money (The Performance OS Fix)",
    summary: "A field note on using AI for speed without losing the human brand direction and testing discipline that makes paid creative useful.",
  },
];

const pageCopy = {
  about: {
    title: "About Jim Scaling | The Creative Scaling Founder Story",
    description: "Learn who Jimmy is, why he built Creative Scaling, and how Jim Scaling helps Shopify brands build a repeatable performance creative system.",
    eyebrow: "About Jim Scaling",
    heading: "A clearer creative system for Shopify brands.",
    intro: "Jim Scaling is the public home of Jimmy's Creative Scaling work: a performance creative system that helps Shopify brands turn research, hooks, production, delivery, and review into one repeatable operating rhythm.",
  },
  jimmy: {
    title: "Jimmy | Jim Scaling Founder and Creative Scaling Guide",
    description: "Meet Jimmy, the founder behind Jim Scaling and Creative Scaling for Shopify brands, AI-assisted creative production, and the Ask Jimmy fit guide.",
    eyebrow: "Meet Jimmy",
    heading: "The person behind the Performance OS.",
    intro: "Jimmy builds the strategy, creative direction, and systems thinking behind Jim Scaling. His work focuses on helping Shopify brands produce better ads with AI without turning their brand into generic AI content.",
  },
  news: {
    title: "Jim Scaling News & Field Notes | Shopify Creative Systems",
    description: "Jim Scaling news, publishing updates, and field notes about Shopify creative testing, AI-assisted ads, performance hooks, and weekly creative systems.",
    eyebrow: "News & field notes",
    heading: "What Jim Scaling is testing, learning, and publishing.",
    intro: "This is the Jim Scaling update desk: a first-party place for new videos, creative-system lessons, and practical notes on how Shopify brands can keep learning instead of repeating random content.",
  },
  youtube: {
    title: "Jim Scaling on YouTube | Shopify Ads and AI Creative",
    description: "Watch Jim Scaling on YouTube for practical breakdowns of Shopify ads, AI creatives, performance hooks, and the Creative Scaling Performance OS.",
    eyebrow: "Jim Scaling on YouTube",
    heading: "One channel for the creative systems behind better Shopify ads.",
    intro: "The Jim Scaling YouTube channel turns the ideas behind Creative Scaling into practical breakdowns for Shopify brands: what to test, why ads burn money, and how to build a creative engine that ships.",
  },
};

function SeoHead({ type }) {
  const copy = pageCopy[type];
  useEffect(() => {
    document.title = copy.title;
    const setMeta = (name, content) => {
      let element = document.head.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    const setProperty = (property, content) => {
      let element = document.head.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    const canonicalUrl = `${SITE_URL}/${type}/`;
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
    setMeta("description", copy.description);
    setProperty("og:title", copy.title);
    setProperty("og:description", copy.description);
    setProperty("og:url", canonicalUrl);
    setProperty("og:type", type === "news" ? "article" : "website");
    setMeta("twitter:title", copy.title);
    setMeta("twitter:description", copy.description);
  }, [copy, type]);
  return null;
}

function PageLink({ href, children }) {
  return (
    <a href={href} className="discovery-link">
      {children} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

function SharedIdentity({ type }) {
  return (
    <section className="discovery-section discovery-soft" aria-labelledby="identity-title">
      <div className="discovery-grid two-up">
        <div>
          <p className="discovery-kicker">Search clarity</p>
          <h2 id="identity-title">What does “Jim Scaling” mean?</h2>
          <p>
            Jim Scaling is not a fictional power-scaling topic, a paint brand, or a reference to another researcher. On this website, Jim Scaling means Jimmy’s Creative Scaling practice for Shopify brands: performance creative systems, AI-assisted production, and structured testing.
          </p>
        </div>
        <div className="discovery-card">
          <p className="discovery-kicker">The short answer</p>
          <p className="discovery-quote">Jim Scaling = Creative Scaling for Shopify brands.</p>
          <p className="muted">The official source for this identity is <a href={SITE_URL}>jimscaling.online</a>.</p>
        </div>
      </div>
    </section>
  );
}

function AboutContent() {
  return (
    <>
      <section className="discovery-section" aria-labelledby="founder-title">
        <div className="discovery-grid two-up">
          <div>
            <p className="discovery-kicker">Founder story</p>
            <h2 id="founder-title">Why Jimmy built Creative Scaling.</h2>
            <p>
              Jimmy built Creative Scaling after seeing how difficult it is for a growing Shopify brand to produce content that fits the brand, explains the product, tests the right hooks, and supports both organic discovery and paid acquisition.
            </p>
            <p>
              The answer was not another disconnected editing service. It was a complete creative workflow: research, hooks, concepts, scripts, production, delivery, feedback, and performance review. That workflow is what Jim Scaling documents and builds with the right Growth Partners.
            </p>
          </div>
          <div className="discovery-card highlight-card">
            <p className="discovery-kicker">The operating belief</p>
            <p className="discovery-quote">Better ads come from a better learning system, not random content volume.</p>
            <p className="muted">Human brand direction gives AI production a point of view. Testing gives the work a feedback loop.</p>
          </div>
        </div>
      </section>
      <section className="discovery-section discovery-soft" aria-labelledby="proof-title">
        <div className="discovery-grid two-up">
          <div>
            <p className="discovery-kicker">Owned-brand study</p>
            <h2 id="proof-title">HER ALTAR shaped the system.</h2>
            <p>
              HER ALTAR was Jimmy’s owned Shopify fashion-brand testing ground. It helped him study how hybrid AI production, clear hooks, and consistent publishing can support organic discovery and performance creative learning.
            </p>
            <p className="muted">The figures below are owned-brand proof points, not promises of a client outcome: 700K+ organic views and 7K+ followers in roughly 10 days.</p>
          </div>
          <div className="stats-grid">
            <div className="discovery-stat"><strong>700K+</strong><span>organic views</span></div>
            <div className="discovery-stat"><strong>7K+</strong><span>followers in roughly 10 days</span></div>
            <div className="discovery-stat"><strong>6 days</strong><span>creative sprint target</span></div>
            <div className="discovery-stat"><strong>$30K+</strong><span>best-fit monthly revenue</span></div>
          </div>
        </div>
      </section>
    </>
  );
}

function JimmyContent() {
  return (
    <>
      <section className="discovery-section" aria-labelledby="jimmy-work-title">
        <div className="discovery-grid two-up">
          <div>
            <p className="discovery-kicker">Founder and guide</p>
            <h2 id="jimmy-work-title">What Jimmy does.</h2>
            <p>
              Jimmy works at the intersection of creative direction, Shopify growth, and AI-assisted production. He helps brands understand which creative bottleneck is slowing them down, then turns that diagnosis into a practical sprint plan.
            </p>
            <p>
              The work is intentionally specific. Creative Scaling does not run media buying or promise ROAS. It works alongside a brand’s media buyer or internal team to build the creative engine that powers paid and organic testing.
            </p>
          </div>
          <div className="discovery-card">
            <p className="discovery-kicker">Ask Jimmy</p>
            <h3>A fit guide for the next creative decision.</h3>
            <p>Ask Jimmy is the on-site assistant for questions about fit, packages, onboarding, creative sprints, and the Performance OS. It is a guide to the process, not a replacement for a Strategy Review.</p>
            <a className="text-link" href="/#apply">Ask about a Strategy Review <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
      <section className="discovery-section discovery-soft" aria-labelledby="jimmy-principles-title">
        <p className="discovery-kicker">Jimmy’s creative principles</p>
        <h2 id="jimmy-principles-title">Use AI for speed. Keep the brand human.</h2>
        <div className="principle-list">
          {["Start with customer pain, product truth, and a real offer.", "Map hooks before producing a large batch of assets.", "Ship in a repeatable sprint so the team can learn every week.", "Review CPA, CTR, hook response, and qualitative feedback together."]
            .map((item) => <div className="principle-row" key={item}><CheckCircle2 aria-hidden="true" className="h-5 w-5" /><span>{item}</span></div>)}
        </div>
      </section>
    </>
  );
}

function NewsContent() {
  return (
    <>
      <section className="discovery-section" aria-labelledby="news-title">
        <div className="discovery-grid two-up">
          <div>
            <p className="discovery-kicker">Publishing rhythm</p>
            <h2 id="news-title">One useful video every two days.</h2>
            <p>
              Jim Scaling is building a consistent publishing habit around Shopify creative systems. The current goal is one video every two days, with each episode turning a real creative question into a clearer decision for founders and growth teams.
            </p>
            <p className="muted">This page will collect new videos, field notes, and practical updates as the library grows.</p>
          </div>
          <div className="discovery-card highlight-card">
            <p className="discovery-kicker">What to expect</p>
            <p className="discovery-quote">Shorter feedback loops between publishing, testing, and better creative decisions.</p>
            <a className="text-link" href={YOUTUBE_URL} target="_blank" rel="noreferrer">Open the YouTube channel <ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
      <section className="discovery-section discovery-soft" aria-labelledby="latest-title">
        <p className="discovery-kicker">Latest public videos</p>
        <h2 id="latest-title">The ideas Jim Scaling is publishing now.</h2>
        <div className="video-grid">
          {videoNotes.map((video) => (
            <article className="discovery-card video-card" key={video.title}>
              <div className="video-icon"><PlaySquare aria-hidden="true" className="h-5 w-5" /></div>
              <h3>{video.title}</h3>
              <p>{video.summary}</p>
              <a className="text-link" href={YOUTUBE_URL} target="_blank" rel="noreferrer">Watch on Jim Scaling <ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function YouTubeContent() {
  return (
    <>
      <section className="discovery-section" aria-labelledby="channel-title">
        <div className="discovery-grid two-up">
          <div>
            <p className="discovery-kicker">Official channel</p>
            <h2 id="channel-title">Jim Scaling on YouTube.</h2>
            <p>
              The official <strong>Jim Scaling</strong> channel is where Jimmy shares practical breakdowns of Shopify ads, AI creative, performance hooks, and the Creative Scaling Performance OS.
            </p>
            <a className="discovery-link" href={YOUTUBE_URL} target="_blank" rel="noreferrer">Visit @jimscaling <ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
          </div>
          <div className="discovery-card channel-card">
            <div className="channel-badge">@jimscaling</div>
            <p className="discovery-quote">I help Shopify brands create better-performing ads with AI.</p>
            <p className="muted">The publishing goal is one video every two days, covering creative systems, testing lessons, and practical founder education.</p>
          </div>
        </div>
      </section>
      <section className="discovery-section discovery-soft" aria-labelledby="watch-title">
        <p className="discovery-kicker">Watch by problem</p>
        <h2 id="watch-title">Start with the question your brand is facing.</h2>
        <div className="video-grid">
          {videoNotes.map((video) => (
            <article className="discovery-card video-card" key={video.title}>
              <div className="video-icon"><PlaySquare aria-hidden="true" className="h-5 w-5" /></div>
              <h3>{video.title}</h3>
              <p>{video.summary}</p>
              <a className="text-link" href={YOUTUBE_URL} target="_blank" rel="noreferrer">Watch the channel <ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default function DiscoveryPage({ type }) {
  const copy = pageCopy[type];
  const content = type === "about" ? <AboutContent /> : type === "jimmy" ? <JimmyContent /> : type === "news" ? <NewsContent /> : <YouTubeContent />;
  const goHome = () => window.history.pushState({}, "", "/");
  return (
    <div className="discovery-page">
      <SeoHead type={type} />
      <SiteHeader navItems={navLinks} onNavigate={(href) => {
        if (href.startsWith("/")) window.location.assign(href);
        else window.location.assign(`/${href}`);
      }} ctaHref="/#apply" />
      <main>
        <section className="discovery-hero">
          <div className="discovery-kicker">{copy.eyebrow}</div>
          <h1>{copy.heading}</h1>
          <p>{copy.intro}</p>
          <div className="discovery-actions">
            <a className="discovery-link primary-link" href="/#apply">Apply for a Strategy Review <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
            <a className="discovery-link" href={YOUTUBE_URL} target="_blank" rel="noreferrer">Watch Jim Scaling <ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
          </div>
        </section>
        {content}
        <SharedIdentity type={type} />
        <section className="discovery-section discovery-cta" aria-labelledby="next-title">
          <p className="discovery-kicker">Continue exploring</p>
          <h2 id="next-title">See the full Creative Scaling system.</h2>
          <div className="discovery-actions">
            <PageLink href="/">Return to the Performance OS homepage</PageLink>
            <PageLink href="/about/">Read the founder story</PageLink>
            <PageLink href="/news/">Read the latest field notes</PageLink>
            <PageLink href="/jimmy/">Meet Jimmy</PageLink>
            <PageLink href="/youtube/">Watch on YouTube</PageLink>
          </div>
        </section>
      </main>
      <SiteFooter onNavigate={(href) => href.startsWith("/") ? window.location.assign(href) : window.location.assign(`/${href}`)} />
    </div>
  );
}
