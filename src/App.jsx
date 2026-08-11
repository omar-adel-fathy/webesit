import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  FolderGit2,
  Menu,
  MessageCircle,
  PlaySquare,
  Plus,
  Send,
  Target,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import brandLogo from "../ChatGPT Image Jul 23, 2026, 02_16_52 AM.png";

const tallyFormId = import.meta.env.VITE_TALLY_FORM_ID || "WOkqMa";

const navLinks = [
  { label: "Apply", href: "#apply" },
  { label: "Interactive Plan", href: "#interactive-plan" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Case Study", href: "#case-study" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const proofStats = [
  { value: "700K+", label: "organic views", highlight: true },
  { value: "7K+", label: "followers in ~10 days", highlight: false },
  { value: "Weekly", label: "creative delivery", highlight: false },
  { value: "$30K+", label: "best-fit threshold", highlight: false },
];

const problemCards = [
  {
    kicker: "01 — FATIGUE",
    title: "Creative fatigue hits too fast",
    text: "Your winners stop working, but the next batch of creatives is not ready.",
  },
  {
    kicker: "02 — RANDOM",
    title: "Content is made randomly",
    text: "The team makes more assets, but not more useful tests.",
  },
  {
    kicker: "03 — NO ENGINE",
    title: "There is no creative engine",
    text: "Ideas, hooks, scripts, production, delivery, feedback, and performance review are not connected.",
  },
];

const services = [
  {
    icon: Target,
    title: "Performance Statics",
    text: "Static ad creatives designed for testing angles, offers, products, and hooks.",
    bullets: ["Meta & TikTok ads", "Retargeting assets", "Product storytelling", "Offer testing"],
  },
  {
    icon: PlaySquare,
    title: "Performance Video Creatives",
    text: "Short-form video creatives built for paid ads and organic content.",
    bullets: ["TikTok & Instagram Reels", "YouTube Shorts", "Meta video ads", "UGC-style testing"],
  },
  {
    icon: BarChart3,
    title: "Creative Strategy",
    text: "The planning layer behind the output that decides what to make and why.",
    bullets: ["Hook & competitor research", "Creative testing angles", "Testing roadmap", "Weekly planning"],
  },
  {
    icon: Workflow,
    title: "Creative Systems",
    text: "The operating system that keeps production clear and organized.",
    bullets: ["Weekly creative sprints", "Drive delivery structure", "Feedback tracking", "Performance review"],
  },
];

const timelineSteps = [
  { num: "01", name: "Discovery", desc: "Brand, offer, products, audience, current creative process, and bottlenecks." },
  { num: "02", name: "Strategy", desc: "Priorities, angles, offers, and the first creative roadmap." },
  { num: "03", name: "Research", desc: "Competitors, customer pain points, past winners, and market patterns." },
  { num: "04", name: "Hooks", desc: "Hook directions and testing hypotheses for the sprint." },
  { num: "05", name: "Production", desc: "Performance statics and video creatives based on the sprint plan." },
  { num: "06", name: "Delivery", desc: "Creative Delivery organized in Drive with notes, platform, hook, CTA, and usage guidance." },
  { num: "07", name: "Review", desc: "Feedback, learnings, performance signals, and next sprint planning." },
];

const afterBookingSteps = [
  { number: "01", title: "Apply", text: "Submit the Tally form. You are automatically forwarded to the booking calendar." },
  { number: "02", title: "Discovery call", text: "We review your brand, offer, creative process, and goals." },
  { number: "03", title: "Recommendation", text: "If there is a fit, we recommend the best package and the first Creative Sprint." },
  { number: "04", title: "Proposal", text: "You receive the plan, timeline, investment, terms, and delivery structure." },
  { number: "05", title: "Onboarding", text: "You upload assets and get access to the Growth Partner Workspace." },
  { number: "06", title: "Kickoff", text: "We align priorities, approvals, communication, and the first testing roadmap." },
  { number: "07", title: "Weekly Production", text: "Organized Creative Delivery arrives each week with testing notes per asset." },
  { number: "08", title: "Review & Next Sprint", text: "We review feedback and signals, then plan what comes next." },
];

const packagesList = [
  {
    name: "Pilot Sprint",
    price: "$1,200",
    priceKicker: "One-off evaluation",
    copy: "Test the Creative Scaling workflow before committing monthly.",
    terms: "$500 deposit · $700 upon delivery",
    items: [
      "10 Performance Statics",
      "3 Performance Video Creatives",
      "Hook Library included",
      "6-day turnaround",
      "100% credit toward Growth if upgraded within 14 days",
    ],
  },
  {
    name: "Beta Growth",
    price: "$2,000/mo",
    priceKicker: "Core beta offer",
    copy: "Build a structured creative testing system. Locked in before price increases to $3,500/mo.",
    terms: "Retainer · locks in before price increase",
    items: [
      "20 Performance Statics per month",
      "7 Performance Video Creatives per month",
      "Weekly Sprint Board workspace",
      "3 Winning Angles Guarantee",
    ],
    recommended: true,
  },
  {
    name: "Scale Partner",
    price: "$4,500/mo",
    priceKicker: "High-volume speed",
    copy: "High-volume beta for brands that need more creative testing speed.",
    terms: "$1,500 deposit · $3,000 on approval",
    items: [
      "45 Performance Statics per month",
      "18 Performance Video Creatives per month",
      "72-hour priority queue",
      "Pay-On-Approval: balance due after batch review",
    ],
  },
];

const faqItems = [
  { q: "Who is Creative Scaling for?", a: "Shopify brands doing $30k+/month that need a more consistent system for producing and testing performance creatives across paid ads and organic content." },
  { q: "Do you work with brands under $30k/month?", a: "Sometimes. The system is usually most valuable once a brand has demand and active testing. Jimmy AI can help you understand what to prepare before booking." },
  { q: "Do you run ads?", a: "No. Creative Scaling focuses on the creatives powering paid and organic growth. We work alongside your media buyer or internal team." },
  { q: "Do you make content for both organic and paid?", a: "Yes. The system supports discovery content and conversion-focused creative testing." },
  { q: "What do you need from us to start?", a: "Your website, product information, brand assets, past creatives, customer insights, competitors, and performance context. For paid testing we also need view-only Ads Manager access." },
  { q: "How are revisions handled?", a: "One clear feedback flow per sprint. Each package has a defined revision structure so nothing gets lost across messages." },
  { q: "How is delivery handled?", a: "Creative Delivery lives in a shared Drive workspace with weekly folders, asset notes, usage guidance, and feedback tracking." },
  { q: "Why do you charge premium pricing?", a: "You are not paying for isolated files. You are paying for strategy, research, creative direction, production, weekly planning, organized delivery, feedback, and ongoing testing." },
  { q: "Do you guarantee ad results?", a: "We guarantee creative performance against an agreed testing benchmark. If a sprint fails to produce winning angles, we iterate for free until the baseline CPA/CTR is reached. We do not guarantee ROAS or sales." },
  { q: "What makes Creative Scaling different from cheap AI creative?", a: "We combine high-end human brand direction with AI speed to deliver studio-grade ads — not buggy dropshipping-looking visuals." },
];

// ---- Brand & Platform Logos ----
const SHOPIFY_LOGO = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg";
const TIKTOK_LOGO = "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg";
const META_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png";
const HER_ALTAR_1 = "https://heraltar.shop/cdn/shop/files/ChatGPT_Image_May_27_2026_05_16_39_PM_0f693532-0cce-464f-a54e-32d4aeed18aa.png?v=1781612616&width=160";
const HER_ALTAR_2 = "https://heraltar.shop/cdn/shop/files/ChatGPT_Image_May_27_2026_05_16_48_PM_bb30ded5-22c6-4b69-80ab-ff6ca3e75e81.png?v=1781612611&width=160";

const smoothSpring = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: smoothSpring } },
};

// Empty placeholder — logos are now embedded per-section below
function AmbientBlurredLogosBackground() { return null; }

// Reusable blurred logo pair for each section
function SectionBlurredLogos({ leftSrc, leftRound, rightSrc, rightRound }) {
  return (
    <>
      {/* Left blurred logo */}
      <div className={`blurred-logo-ambient left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 w-32 h-32 md:w-44 md:h-44 ${leftRound ? "rounded-full overflow-hidden" : ""}`}>
        <img src={leftSrc} alt="" className="w-full h-full object-contain" />
      </div>
      {/* Right blurred logo */}
      <div className={`blurred-logo-ambient right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-32 h-32 md:w-44 md:h-44 ${rightRound ? "rounded-full overflow-hidden" : ""}`}>
        <img src={rightSrc} alt="" className="w-full h-full object-contain" />
      </div>
    </>
  );
}

// ---- Interactive Actionable Strategy Plan Widget ----
function InteractiveActionablePlan() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "01",
      title: "1. Brand & Bottleneck Audit",
      subtitle: "Qualify stage and bottleneck factors upfront",
      deliverable: "Creative Testing Blueprint",
      desc: "We analyze your Shopify store context, current winning ad angles, baseline CPA/CTR metrics, and inventory focus. We pinpoint exactly why past ads hit creative fatigue.",
      actionPoints: [
        "Audit top 10 past performing statics & video ads",
        "Benchmark baseline CPA, CTR, and hook rates",
        "Define 3 target audience avatars & offer hooks",
      ],
      tag: "AUDIT & BENCHMARK",
      cls: "bg-blue-100 text-blue-900",
    },
    {
      id: "02",
      title: "2. Systemized Hook Matrix",
      subtitle: "Generate high-converting hypotheses",
      deliverable: "Weekly Hook Matrix & Briefs",
      desc: "Instead of guessing, we engineer 10+ hook variations per sprint across visual hooks, text overlays, and audio angles designed to stop the scroll in the first 3 seconds.",
      actionPoints: [
        "Competitor ad angle mining & teardowns",
        "Hybrid AI + Human script generation",
        "Visual hook storyboard mapping",
      ],
      tag: "STRATEGY MATRIX",
      cls: "bg-amber-100 text-amber-900",
    },
    {
      id: "03",
      title: "3. Hybrid AI Production Sprint",
      subtitle: "Studio-grade quality delivered in 6 days",
      deliverable: "Statics & Video Creatives Batch",
      desc: "We combine high-end studio brand direction with AI speeds. Producing high-resolution statics and video ads ready to launch—without $5,000 agency fees or buggy AI spam.",
      actionPoints: [
        "10 Performance Statics per sprint batch",
        "3-7 Short-form Video Creatives (Reels/TikTok/Meta)",
        "Formatted for 9:16, 4:5, and 1:1 ratios",
      ],
      tag: "HYBRID PRODUCTION",
      cls: "bg-purple-100 text-purple-900",
    },
    {
      id: "04",
      title: "4. Organized Drive Delivery",
      subtitle: "Instant launch-ready workspace",
      deliverable: "Drive Workspace & Testing Notes",
      desc: "Creatives arrive organized in a shared Google Drive workspace with clear platform notes, hook names, suggested copy, CTA angles, and usage guidelines for your media buyer.",
      actionPoints: [
        "Platform-ready PNG & MP4 files with clean naming",
        "Hook-by-hook placement recommendations",
        "Feedback tracker sheet synced live",
      ],
      tag: "DRIVE DELIVERY",
      cls: "bg-emerald-100 text-emerald-900",
    },
    {
      id: "05",
      title: "5. Scorecard & Guarantee Review",
      subtitle: "Double down on winning angles",
      deliverable: "Winning Angles Scorecard",
      desc: "We evaluate real account performance. If we haven't hit at least 3 winning angles that beat your benchmark, our guarantee kicks in and we produce the next batch for free.",
      actionPoints: [
        "Identify winning ad angles (Winner / Scale / Retest)",
        "Re-invest budget into high CTR/CPA combinations",
        "Plan next weekly sprint based on real data",
      ],
      tag: "WINNING BENCHMARK",
      cls: "bg-rose-100 text-rose-900",
    },
  ];

  return (
    <section id="interactive-plan" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
        <div className="section-kicker">Interactive System Roadmap</div>
        <h2 className="font-heading text-3xl font-extrabold sm:text-5xl text-[#111113]">
          Actionable Creative Strategy Plan
        </h2>
        <p className="text-sm md:text-base text-[#111113]/75 font-medium">
          Click through any step below to see exactly how Creative Scaling plans, produces, delivers, and benchmarks your ad creatives.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Step selector list (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                activeStep === idx
                  ? "bg-white border-[#2454E8] shadow-lg ring-1 ring-[#2454E8]/20"
                  : "bg-white/60 border-[#CBBF9A]/60 hover:bg-white/80 text-[#111113]/70"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-xl font-mono text-xs font-bold ${
                    activeStep === idx
                      ? "bg-[#2454E8] text-white"
                      : "bg-[#F3EBDD] text-[#111113]"
                  }`}
                >
                  {s.id}
                </span>
                <div>
                  <p className="font-bold text-sm text-[#111113]">{s.title}</p>
                  <p className="text-[11px] text-[#111113]/60">{s.subtitle}</p>
                </div>
              </div>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  activeStep === idx ? "translate-x-1 text-[#2454E8]" : "text-[#111113]/30"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Step detail card (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="card-surface p-6 md:p-8 space-y-5 text-left h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold font-mono uppercase tracking-wider ${steps[activeStep].cls}`}>
                    {steps[activeStep].tag}
                  </span>
                  <span className="font-mono text-xs text-[#667350] font-bold">
                    STEP {steps[activeStep].id} OF 05
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-extrabold text-[#111113]">
                  {steps[activeStep].title}
                </h3>

                <p className="text-sm text-[#111113]/80 leading-6 font-medium">
                  {steps[activeStep].desc}
                </p>

                <div className="border-t border-[#CBBF9A]/60 pt-4 space-y-2.5">
                  <p className="font-mono text-[10px] font-bold text-[#667350] uppercase tracking-wider">
                    Actionable Workflow Checklist:
                  </p>
                  {steps[activeStep].actionPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm font-semibold text-[#111113]">
                      <CheckCircle2 className="h-4 w-4 text-[#2454E8] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#CBBF9A]/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#111113]/50 uppercase font-bold">Deliverable:</span>
                  <p className="text-xs font-bold text-[#2454E8]">{steps[activeStep].deliverable}</p>
                </div>
                <a
                  href="#apply"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#apply")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="cool-button text-xs py-2 px-4"
                >
                  Apply for Strategy Review
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ---- Workspace Dashboard Simulator ----
function WorkspaceDashboardSimulator() {
  const [activeTab, setActiveTab] = useState("sprint");

  const tabs = [
    { id: "sprint", label: "Sprint Board", icon: FolderGit2 },
    { id: "hooks", label: "Hook Matrix", icon: Target },
    { id: "drive", label: "Drive Delivery", icon: Workflow },
    { id: "scorecard", label: "Scorecard", icon: BarChart3 },
  ];

  return (
    <div className="mt-10 space-y-5 w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white border-[#2454E8] text-[#2454E8] shadow-md"
                  : "bg-transparent border-[#CBBF9A]/80 text-[#111113]/70 hover:bg-white/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-[#CBBF9A]/80 bg-white/80 backdrop-blur-md shadow-2xl">
        {/* Window chrome */}
        <div className="h-10 bg-[#F3EBDD]/90 border-b border-[#CBBF9A]/60 px-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <p className="font-mono text-[10px] text-[#111113]/70 font-bold">creative-scaling-os // {activeTab}</p>
          <div className="w-12" />
        </div>

        <div className="p-5 md:p-7 min-h-[300px] text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              {activeTab === "sprint" && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "1. Planning / Research", badge: "ROADMAP", badgeCls: "bg-amber-100 text-amber-900", title: "Competitor Hook Research", sub: "Top 5 fashion hooks currently scaling." },
                    { label: "2. Creative Sprints", badge: "IN PROGRESS", badgeCls: "bg-blue-100 text-blue-900", title: "10 Statics + 3 Video Sprint", sub: "Designing hook variations for offers." },
                    { label: "3. Active Delivery", badge: "COMPLETED", badgeCls: "bg-emerald-100 text-emerald-900", title: "Sprint #04 Folder", sub: "Drive synced with platform notes." },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <p className="font-mono text-[10px] font-bold text-[#667350] uppercase tracking-wide">{item.label}</p>
                      <div className="rounded-2xl border border-[#CBBF9A]/60 bg-[#F8F1E6]/60 p-4 space-y-2">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold font-mono ${item.badgeCls}`}>{item.badge}</span>
                        <p className="font-bold text-sm text-[#111113]">{item.title}</p>
                        <p className="text-xs text-[#111113]/70">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "hooks" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#CBBF9A]/70 text-[#111113]/70 font-bold">
                        <th className="py-2.5 font-mono uppercase tracking-wider">Hook Code</th>
                        <th className="py-2.5 font-mono uppercase tracking-wider">Hypothesis Angle</th>
                        <th className="py-2.5 font-mono uppercase tracking-wider">Variant</th>
                        <th className="py-2.5 font-mono uppercase tracking-wider">Target CPA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CBBF9A]/50">
                      {[
                        ["HK_01", "Split-screen AI hybrid garment fit", "Static 01", "$22.00"],
                        ["HK_02", "UGC unboxing with honest hook voiceover", "Video 03", "$25.00"],
                        ["HK_03", "Clean product walk with social proof", "Static 04", "$20.00"],
                      ].map(([code, angle, variant, cpa]) => (
                        <tr key={code}>
                          <td className="py-3 font-mono font-bold text-[#2454E8]">{code}</td>
                          <td className="py-3 font-semibold text-[#111113]">{angle}</td>
                          <td className="py-3 font-mono text-[#111113]/80">{variant}</td>
                          <td className="py-3 font-mono font-bold text-[#111113]">{cpa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "drive" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { folder: "Sprint_04_Statics/", detail: "10 PNG assets · usage notes included" },
                    { folder: "Sprint_04_Videos/", detail: "3 MP4 assets · platform specs attached" },
                    { folder: "Feedback_Tracker.sheet", detail: "Revision log · week 04 feedback" },
                    { folder: "Performance_Review.doc", detail: "Signals + next sprint plan" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-[#CBBF9A]/60 bg-[#F8F1E6]/60">
                      <div className="p-2.5 bg-[#2454E8]/10 text-[#2454E8] rounded-xl">
                        <FolderGit2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#111113]">{item.folder}</p>
                        <p className="text-[11px] text-[#111113]/70 font-mono mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "scorecard" && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "CS_01_A", status: "WINNER", cpa: "$18.50", action: "Double budget", cls: "bg-emerald-100 text-emerald-900", cpaColor: "text-emerald-600" },
                    { id: "CS_03_C", status: "STABLE", cpa: "$24.10", action: "Maintain spend", cls: "bg-blue-100 text-blue-900", cpaColor: "text-[#111113]" },
                    { id: "CS_04_B", status: "ITERATE", cpa: "$38.90", action: "Redesign visual", cls: "bg-rose-100 text-rose-900", cpaColor: "text-rose-600" },
                  ].map((item) => (
                    <div key={item.id} className="rounded-2xl border border-[#CBBF9A]/60 bg-[#F8F1E6]/60 p-4 space-y-2">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold font-mono ${item.cls}`}>{item.status}</span>
                      <p className="font-bold text-xs text-[#111113]">{item.id}</p>
                      <p className={`font-mono font-bold text-lg ${item.cpaColor}`}>{item.cpa} CPA</p>
                      <p className="text-[11px] text-[#111113]/70">{item.action}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---- SECTION 2: Clean, Distraction-Free Form Container ----
function CleanBookingSection() {
  useEffect(() => {
    const loadTally = () => {
      if (typeof window !== "undefined" && window.Tally) {
        window.Tally.loadEmbeds();
      } else {
        document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((el) => {
          el.src = el.dataset.tallySrc;
        });
      }
    };

    if (typeof window !== "undefined" && window.Tally) {
      loadTally();
    } else {
      const script = document.createElement("script");
      script.src = "https://tally.so/widgets/embed.js";
      script.async = true;
      script.onload = loadTally;
      script.onerror = loadTally;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="rounded-[2.25rem] border border-[#CBBF9A]/70 bg-[#F8F1E6]/80 backdrop-blur-md p-3 md:p-6 shadow-2xl transition-all duration-300">
        <div className="tally-wrapper w-full rounded-2xl">
          <iframe
            data-tally-src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&dynamicHeight=1`}
            src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&dynamicHeight=1`}
            width="100%"
            height="540"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Creative Scaling Strategy Review Application"
            loading="eager"
            className="w-full border-0 block"
          />
        </div>
      </div>
    </div>
  );
}

// ---- Jimmy AI Chatbot ----
function JimmyChat() {
  const HISTORY_KEY = "jimmy-chat-history";
  const VERSION_KEY = "jimmy-chat-version";
  const VERSION = "7";
  const INIT_MSG = "I help with fit, packages, onboarding, and process. What would you like to know about Creative Scaling?";

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      if (localStorage.getItem(VERSION_KEY) !== VERSION) {
        localStorage.removeItem(HISTORY_KEY);
        localStorage.setItem(VERSION_KEY, VERSION);
        return [{ role: "assistant", content: INIT_MSG }];
      }
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [{ role: "assistant", content: INIT_MSG }];
    } catch {
      return [{ role: "assistant", content: INIT_MSG }];
    }
  });

  const listRef = useRef(null);
  const sendingRef = useRef(false);
  const inputRef = useRef("");
  const budgetRef = useRef({ count: 0, resetAt: Date.now() });

  useEffect(() => { inputRef.current = input; }, [input]);
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-16)));
    localStorage.setItem(VERSION_KEY, VERSION);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const newChat = () => {
    setMessages([{ role: "assistant", content: INIT_MSG }]);
    localStorage.removeItem(HISTORY_KEY);
    budgetRef.current = { count: 0, resetAt: Date.now() };
  };

  const checkBudget = () => {
    const now = Date.now();
    const b = budgetRef.current;
    if (now - b.resetAt > 60000) { b.count = 0; b.resetAt = now; }
    if (b.count >= 6) return false;
    b.count++;
    return true;
  };

  const blocked = [
    /ignore previous instructions/i, /system prompt/i, /jailbreak/i,
    /developer mode/i, /bypass|unlock|crack|hack|exploit|scam|phish|malware/i,
    /prompt injection/i, /reveal your (instructions|system|prompt)/i,
  ];

  const send = async (suggested) => {
    const text = (suggested || inputRef.current).trim();
    if (!text || sendingRef.current) return;
    if (text.length > 220 || blocked.some(p => p.test(text.toLowerCase()))) {
      setMessages(p => [...p, { role: "assistant", content: "I can only help with questions about Creative Scaling." }]);
      setInput("");
      return;
    }
    if (!checkBudget()) {
      setMessages(p => [...p, { role: "assistant", content: "Please wait a moment before asking another question." }]);
      setInput("");
      return;
    }

    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    if (next.filter(m => m.role === "user").length > 8) {
      setMessages([{ role: "assistant", content: "Starting a fresh thread." }]);
      localStorage.removeItem(HISTORY_KEY);
      budgetRef.current = { count: 0, resetAt: Date.now() };
      setInput("");
      return;
    }

    sendingRef.current = true;
    setLoading(true);
    setInput("");
    setMessages(p => [...p, userMsg]);

    try {
      let memory = {};
      try { const r = localStorage.getItem("creative-scaling-profile"); if (r) memory = JSON.parse(r); } catch (_) {}
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch("/api/jimmy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, memory }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.reply || "Can you rephrase your question?" }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "I had a connection issue. What is your Shopify brand's monthly revenue?" }]);
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  };

  const renderContent = (content) => {
    return content.split(/\r?\n/).map((line, i) => (
      <p key={i} className="text-xs leading-5 text-[#111113] mt-1.5 first:mt-0 font-medium">{line}</p>
    ));
  };

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#111113] text-white px-5 py-3 text-xs font-bold shadow-[0_12px_30px_rgba(17,17,19,0.35)] border border-white/15 backdrop-blur-md transition-all hover:bg-[#1b1b1e] hover:shadow-[0_16px_36px_rgba(36,84,232,0.3)] group"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2454E8] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2454E8]"></span>
        </span>
        <MessageCircle className="h-4 w-4 text-[#2454E8] transition-transform group-hover:scale-110" />
        <span className="tracking-wide">Ask Jimmy</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-end justify-end p-4 md:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[420px] max-h-[620px] h-[78vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-[#CBBF9A] shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#CBBF9A]/60 px-6 py-4 bg-[#F8F1E6]">
                <div className="text-left">
                  <p className="text-sm font-extrabold text-[#111113] tracking-tight">Ask Jimmy</p>
                  <p className="text-[10px] text-[#667350] font-mono uppercase tracking-wider font-bold">Fit Assistant</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={newChat}
                    title="New Chat"
                    className="grid h-8 w-8 place-items-center rounded-full bg-[#F3EBDD] hover:bg-[#CBBF9A]/50 transition text-[#111113]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    title="Close"
                    className="grid h-8 w-8 place-items-center rounded-full bg-[#F3EBDD] hover:bg-[#CBBF9A]/50 transition text-[#111113]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide bg-white">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-left ${
                      m.role === "user"
                        ? "ml-auto bg-[#2454E8] text-white text-xs font-semibold"
                        : "bg-[#F8F1E6] border border-[#CBBF9A]/60 text-[#111113]"
                    }`}
                  >
                    {m.role === "assistant" ? renderContent(m.content) : <p className="text-xs">{m.content}</p>}
                  </div>
                ))}
                {loading && (
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-[#F8F1E6] border border-[#CBBF9A]/60 px-4 py-3">
                    <span className="loading-dots"><span /><span /><span /></span>
                    <span className="text-xs text-[#111113]/70 font-semibold">Jimmy is typing...</span>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-[#CBBF9A]/60 bg-white space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {["Which package fits my brand?", "What happens after I book?", "Do you handle paid and organic?"].map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-[#CBBF9A]/70 bg-[#F8F1E6] px-3 py-1.5 text-[10px] font-bold text-[#111113]/80 transition hover:bg-[#2454E8] hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                    placeholder="Ask about sprints, packages, fit..."
                    className="flex-1 rounded-full border border-[#CBBF9A] bg-[#F8F1E6] px-4 text-xs font-medium outline-none focus:border-[#2454E8] min-h-10 text-[#111113] placeholder-[#111113]/40"
                  />
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="send-btn"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---- Main Landing Page Component ----
export default function CreativeScalingLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const scrollY = window.scrollY + 150;
      const ids = ["services", "interactive-plan", "process", "case-study", "pricing", "faq", "apply"];
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollY) { setActiveSection("#" + ids[i]); return; }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const scrollToTarget = () => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        };
        scrollToTarget();
        const t1 = setTimeout(scrollToTarget, 100);
        const t2 = setTimeout(scrollToTarget, 300);
        const t3 = setTimeout(scrollToTarget, 600);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
  }, []);

  const scrollTo = (href) => {
    if (href && href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        try { window.history.pushState(null, "", href); } catch (_) {}
      }
    }
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden text-[#111113] transition-colors duration-300 bg-[#F3EBDD]">

      {/* Solid Warm Beige Background with Floating Ambient Blurred Logos (50%-70% blur) across Section 1 & Section 2 */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-[15%] h-[500px] w-[500px] rounded-full bg-[#d85c9d]/12 blur-3xl ambient-drift" />
        <div className="absolute top-[25%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#2454E8]/10 blur-3xl ambient-drift ambient-drift-slow" />
        <div className="absolute bottom-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#CBBF9A]/30 blur-3xl" />
      </div>

      {/* Ambient Floating Blurred Logos Overlay */}
      <AmbientBlurredLogosBackground />

      {/* Progress bar */}
      <motion.div
        className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-[#2454E8]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ── HEADER ── */}
      <header className={`fixed left-0 top-0 z-50 w-full px-4 md:px-6 transition-all duration-500 ${isScrolled ? "py-2" : "py-5"}`}>
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 border ${
            isScrolled
              ? "border-[#CBBF9A]/80 bg-[#F8F1E6]/95 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-[#CBBF9A] shadow-sm">
              <img src={brandLogo} alt="Creative Scaling" className="h-full w-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] font-mono text-[#111113]">Creative Scaling</p>
              <p className="text-[9px] text-[#667350] font-mono tracking-wider font-bold">Performance OS</p>
            </div>
          </button>

          {/* Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`relative text-[11px] font-black uppercase tracking-widest font-mono transition ${
                  activeSection === link.href
                    ? "text-[#2454E8]"
                    : "text-[#111113]/70 hover:text-[#2454E8]"
                }`}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[#2454E8]"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            <a
              href="#apply"
              onClick={e => { e.preventDefault(); scrollTo("#apply"); }}
              className="hidden md:inline-flex cool-button text-xs py-2 h-9 px-5"
            >
              Apply for Strategy Review
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#CBBF9A] bg-white/70 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-4 right-4 mt-2 rounded-[2rem] border border-[#CBBF9A] bg-[#F8F1E6]/98 p-5 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <div className="grid gap-3 text-[11px] font-black uppercase tracking-widest font-mono">
                {navLinks.map(link => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="text-left py-2 border-b border-[#CBBF9A]/40 text-[#111113]/80 hover:text-[#2454E8]"
                  >
                    {link.label}
                  </button>
                ))}
                <a
                  href="#apply"
                  onClick={e => { e.preventDefault(); scrollTo("#apply"); }}
                  className="mt-2 cool-button w-full text-center text-xs"
                >
                  Apply for Strategy Review
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ══════════════════════════════════════════
          SECTION 1: THE HERO SECTION & GUARANTEE PROMISE
      ══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-28 md:px-8 md:pt-36 text-center flex flex-col items-center overflow-visible">
        {/* Section 1 blurred logos: Meta (left) + Shopify (right) */}
        <SectionBlurredLogos leftSrc={META_LOGO} leftRound={false} rightSrc={SHOPIFY_LOGO} rightRound={false} />
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl space-y-6">
          
          {/* Eyebrow / Kicker Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#CBBF9A] bg-white/80 px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#2454E8] animate-pulse" />
            <span className="font-mono text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#111113]">
              SHOPIFY PERFORMANCE CREATIVE OPERATING SYSTEM
            </span>
          </div>

          {/* Main Headline (H1) with Solid Blue Highlight on Performance Creative */}
          <h1 className="font-heading text-4xl font-extrabold leading-[1.08] sm:text-6xl md:text-[5rem] text-[#111113]">
            <span className="solid-highlight">Performance Creative</span> Systems for Shopify Brands.
          </h1>

          {/* Subheadline with Solid Blue Highlight on AI speed */}
          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-8 text-[#111113]/85 font-medium">
            We combine studio-grade brand direction with <span className="solid-highlight text-sm sm:text-base py-0.5 px-2">AI speed</span> to launch high-converting statics and video creatives in 6 days—giving you scalable ad angles without $5,000 agency fees or cheap, buggy-looking AI spam.
          </p>

          {/* Prominent Guarantee Feature Box (High-Contrast Card directly under subheadline) */}
          <div className="my-6 mx-auto max-w-3xl text-left">
            <div className="guarantee-card p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#2454E8] text-white">
                  <Zap className="h-4 w-4 fill-white" />
                </span>
                <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#2454E8]">
                  THE LAUNCH COHORT GUARANTEE
                </span>
              </div>
              <p className="font-heading text-lg sm:text-xl font-extrabold text-[#111113] leading-snug">
                If our creatives don't outperform your current winning ad angles, <span className="text-[#2454E8] font-extrabold">we work for free until they do.</span>
              </p>
              <p className="text-xs sm:text-sm text-[#111113]/80 leading-6">
                We benchmark every sprint against your account data. If we don't land you at least <span className="text-[#2454E8] font-bold">3 proven winning ad angles</span> that <span className="text-[#2454E8] font-bold">beat your baseline CPA or CTR</span>, we keep producing and testing new variations for free until we hit the metric.
              </p>
            </div>
          </div>

          {/* Primary Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-1">
            <a
              href="#apply"
              onClick={e => { e.preventDefault(); scrollTo("#apply"); }}
              className="cool-button text-sm w-full sm:w-auto px-8 py-4"
            >
              Apply for a Strategy Review
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              onClick={() => scrollTo("#interactive-plan")}
              className="glass-button text-sm w-full sm:w-auto px-8 py-4"
            >
              See Actionable Strategy Plan
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Micro-text under button */}
          <p className="text-xs font-bold font-mono text-[#667350] uppercase tracking-wider">
            Best for Shopify brands doing $30k+/month ready to run structured ad tests.
          </p>
        </motion.div>


        {/* Interactive Workspace OS Simulator */}
        <div className="w-full max-w-5xl">
          <WorkspaceDashboardSimulator />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: CLEAN, DISTRACTION-FREE FORM SUBMISSION
      ══════════════════════════════════════════ */}
      <section id="apply" className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24 overflow-visible">
        {/* Section 2 blurred logos: TikTok (left) + Creative Scaling (right) */}
        <SectionBlurredLogos leftSrc={TIKTOK_LOGO} leftRound={false} rightSrc={brandLogo} rightRound={true} />
        {/* Single Focus Header */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl text-[#111113]">
            Apply for a Strategy Review
          </h2>
          <p className="mx-auto max-w-lg text-sm text-[#111113]/70 font-medium">
            Complete the 60-second application to unlock calendar booking.
          </p>
        </div>

        {/* Clean, Clutter-Free Embedded Form */}
        <CleanBookingSection />

        {/* Streamlined Step Indicator */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          {[
            { step: "1", label: "Complete 60-second application" },
            { step: "→", label: "" },
            { step: "2", label: "Auto-forwarded to booking calendar" },
            { step: "→", label: "" },
            { step: "3", label: "Lock in Strategy Review" },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 ${item.step === "→" ? "text-[#CBBF9A] text-lg font-bold" : ""}`}>
              {item.step === "→" ? (
                <span>{item.step}</span>
              ) : (
                <>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2454E8] text-white text-[10px] font-bold font-mono">{item.step}</span>
                  <span className="text-xs font-bold text-[#111113]/80">{item.label}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INTERACTIVE ACTIONABLE PLAN SECTION
      ══════════════════════════════════════════ */}
      <InteractiveActionablePlan />

      {/* ══════════════════════════════════════════
          3. PROOF STRIP
      ══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:px-8 border-y border-[#CBBF9A]/60 bg-white/40 overflow-visible">
        {/* Section 3 blurred logos: HER ALTAR 1 (left) + HER ALTAR 2 (right) */}
        <SectionBlurredLogos leftSrc={HER_ALTAR_1} leftRound={true} rightSrc={HER_ALTAR_2} rightRound={true} />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-mono text-[11px] text-[#667350] font-bold uppercase tracking-widest text-center md:text-left">
            Proof built from real systems, not theory:
          </p>
          <div className="grid grid-cols-2 md:flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {proofStats.map((stat, i) => (
              <div key={i} className="text-center">
                <span className={`font-mono text-2xl md:text-3xl font-extrabold ${stat.highlight ? "text-[#2454E8]" : "text-[#111113]"}`}>
                  {stat.value}
                </span>
                <p className="text-[10px] font-mono text-[#111113]/60 font-bold uppercase mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. PROBLEM
      ══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 max-w-3xl">
          <div className="section-kicker">The real problem</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl md:text-6xl mt-4 text-[#111113] leading-tight">
            Most brands do not have a media buying problem.{" "}
            <span className="text-[#2454E8]">They have a creative system problem.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#111113]/75 leading-7 max-w-2xl font-medium">
            Winning ads come from repeated testing, clear hooks, strong creative direction, and a workflow that keeps shipping useful ideas every week.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {problemCards.map((card, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
            >
              <div className="card-surface p-6 text-left flex flex-col justify-between min-h-[200px] h-full">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#667350] uppercase tracking-widest">{card.kicker}</span>
                  <h3 className="font-heading text-xl font-bold mt-4 text-[#111113]">{card.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#111113]/75 leading-6 mt-3 font-medium">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. WHAT CREATIVE SCALING DOES
      ══════════════════════════════════════════ */}
      <section id="services" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10">
          <div className="section-kicker">Core capability</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl mt-4 text-[#111113]">What Creative Scaling does</h2>
          <p className="text-sm md:text-base text-[#111113]/75 mt-3 max-w-xl font-medium">
            We build the creative output and testing structure Shopify brands need to keep learning, improving, and scaling.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.07 }}
              >
                <div className="card-surface p-6 flex flex-col justify-between min-h-[270px] group text-left h-full">
                  <div className="space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-[#111113] text-white flex items-center justify-center transition group-hover:bg-[#2454E8]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#111113]">{svc.title}</h3>
                    <p className="text-xs text-[#111113]/70 leading-5 font-medium">{svc.text}</p>
                  </div>
                  <div className="border-t border-[#CBBF9A]/60 pt-4 mt-5 space-y-2">
                    {svc.bullets.map((b, bi) => (
                      <div key={bi} className="flex items-center gap-2 text-[11px] font-bold text-[#111113]/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2454E8] flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. WHY I BUILT IT
      ══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24 text-center">
        <div className="rounded-[2.5rem] border border-[#CBBF9A] bg-white/70 backdrop-blur-md p-8 md:p-12 shadow-lg">
          <div className="section-kicker">Founder story</div>
          <h2 className="font-heading text-3xl font-extrabold mt-4 text-[#111113]">Why I built Creative Scaling</h2>
          <div className="text-sm md:text-base text-[#111113]/80 leading-7 space-y-4 mt-6 text-left font-medium">
            <p>I built Creative Scaling after building my own Shopify brand from the ground up.</p>
            <p>I saw how hard it was to create content that actually fit the brand, explained the product, tested the right hooks, and supported both organic growth and paid acquisition.</p>
            <p>So instead of only making videos, I built a full creative system: research, hooks, concepts, scripts, production, delivery, feedback, and review.</p>
          </div>
          <p className="font-premium text-lg md:text-xl text-[#2454E8] border-t border-[#CBBF9A]/60 pt-5 mt-6 text-left font-semibold">
            Now Creative Scaling helps Shopify brands build that same kind of system without relying on random one-off content.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. HER ALTAR CASE STUDY
      ══════════════════════════════════════════ */}
      <section id="case-study" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="rounded-[2.5rem] border border-[#CBBF9A] bg-white/70 overflow-hidden shadow-lg">
          {/* Hero image strip at top */}
          <div className="relative h-36 md:h-48 overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${HER_ALTAR_1})` }} />
              <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${HER_ALTAR_2})` }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/95" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30" />
            <div className="absolute bottom-4 left-6">
              <span className="font-mono text-xs font-black uppercase tracking-widest text-white bg-[#d85c9d] px-3.5 py-1.5 rounded-full shadow-md">HER ALTAR</span>
            </div>
          </div>

          <div className="p-6 md:p-10 grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-5">
              <div className="section-kicker">Internal study — owned brand</div>
              <h2 className="font-heading text-3xl font-extrabold md:text-5xl text-[#111113] leading-tight">
                HER ALTAR: the system we built for ourselves
              </h2>
              <p className="text-sm text-[#111113]/75 leading-6 font-medium">
                A real Shopify fashion brand built to test hybrid AI production workflows — and the testing ground that shaped the Creative Scaling process.
              </p>
              <div className="flex gap-8">
                <div>
                  <span className="font-mono text-3xl md:text-4xl font-extrabold text-[#2454E8]">700k+</span>
                  <p className="text-[10px] font-mono text-[#111113]/60 font-bold mt-1 uppercase">Organic Views</p>
                </div>
                <div>
                  <span className="font-mono text-3xl md:text-4xl font-extrabold text-[#111113]">7k+</span>
                  <p className="text-[10px] font-mono text-[#111113]/60 font-bold mt-1 uppercase">Followers in ~10 Days</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                "Hybrid AI production reduces studio costs significantly",
                "Systemized hook maps beat raw video volume every time",
                "Brand direction remains critical when applying AI speeds",
                "A structured creative engine amplifies results at scale",
              ].map((lesson, i) => (
                <div key={i} className="flex gap-3 items-start p-4 rounded-2xl border border-[#CBBF9A]/60 bg-[#F8F1E6]/60">
                  <CheckCircle2 className="h-5 w-5 text-[#2454E8] shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm font-semibold text-[#111113]">{lesson}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="process" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-4">
          <div className="section-kicker">Workflow pipeline</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl text-[#111113]">How the Creative Scaling system works</h2>
          <p className="text-sm text-[#111113]/75 leading-6 font-medium">
            Every Growth Partner goes through a structured process. We do not just create assets — we build a weekly system for deciding what to make, why it matters, and what it should test.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {timelineSteps.map((step, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <div className="card-surface p-5 flex flex-col justify-between min-h-[170px] text-left h-full">
                <div>
                  <span className="font-mono text-[11px] font-bold text-[#667350]">{step.num}</span>
                  <p className="font-bold text-sm mt-3 text-[#111113]">{step.name}</p>
                </div>
                <p className="text-xs text-[#111113]/70 leading-5 mt-2 font-medium">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. PRICING
      ══════════════════════════════════════════ */}
      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="section-kicker">Beta retainer pricing</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl text-[#111113]">Launch Beta Cohort packages</h2>
          <p className="text-sm text-[#111113]/75 leading-6 font-medium">
            For our first 3 clients: lower entry pricing in exchange for speed, feedback, and anonymized performance learnings.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {packagesList.map((pkg, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`card-surface p-6 md:p-8 flex flex-col justify-between min-h-[500px] relative h-full ${
                pkg.recommended ? "border-[#2454E8] ring-2 ring-[#2454E8]/30 shadow-2xl" : ""
              }`}>
                {pkg.recommended && (
                  <span className="absolute top-5 right-5 bg-[#2454E8] text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Recommended
                  </span>
                )}
                <div>
                  <span className="font-mono text-[10px] text-[#667350] font-bold uppercase tracking-widest">{pkg.priceKicker}</span>
                  <h3 className="font-heading text-2xl font-bold mt-2 text-[#111113]">{pkg.name}</h3>
                  <p className="font-mono text-3xl md:text-4xl font-extrabold mt-4 text-[#2454E8]">{pkg.price}</p>
                  <p className="text-[11px] text-[#111113]/60 font-mono mt-1 uppercase font-bold">{pkg.terms}</p>
                  <p className="text-xs md:text-sm text-[#111113]/75 leading-6 mt-4 font-medium">{pkg.copy}</p>
                  <div className="mt-6 space-y-3 border-t border-[#CBBF9A]/60 pt-5">
                    {pkg.items.map((item, ii) => (
                      <div key={ii} className="flex gap-2.5 text-xs text-[#111113] font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-[#2454E8] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8">
                  <a
                    href="#apply"
                    onClick={e => { e.preventDefault(); scrollTo("#apply"); }}
                    className="cool-button w-full text-xs text-center py-3.5"
                  >
                    Apply for Strategy Review
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 max-w-3xl mx-auto p-6 rounded-2xl border border-[#CBBF9A]/70 bg-white/60 text-xs md:text-sm text-[#111113]/80 leading-6 space-y-3 font-medium">
          <p><strong className="text-[#111113] font-bold">Post-Beta Pricing:</strong> After the Launch Beta Cohort, pricing settles at Growth Partner starting at $3,500/mo and Scale Partner starting at $8,000/mo.</p>
          <p className="border-t border-[#CBBF9A]/60 pt-3"><strong className="text-[#111113] font-bold">Why the price is high:</strong> You are not paying for isolated files. You are paying for strategy, research, creative direction, production, weekly planning, organized delivery, feedback, and ongoing testing support.</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. AFTER BOOKING STEPS
      ══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10">
          <div className="section-kicker">After you apply</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl mt-4 text-[#111113]">
            What happens after you book a Strategy Review
          </h2>
          <p className="text-xs md:text-sm text-[#111113]/60 mt-2 font-medium">You will always know what happens next, where files live, and how feedback works.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {afterBookingSteps.map((step, i) => (
            <div key={i} className="card-surface p-5 text-left flex flex-col justify-between min-h-[160px] h-full">
              <div>
                <span className="font-mono text-[11px] text-[#667350] font-bold">{step.number}</span>
                <p className="font-bold text-sm mt-3 text-[#111113]">{step.title}</p>
              </div>
              <p className="text-xs text-[#111113]/70 leading-5 mt-2 font-medium">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          11. DELIVERABLES
      ══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="section-kicker">System assets</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl mt-4 text-[#111113]">What you receive inside the system</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Creative Strategy documents", "Hook Library mapping", "Competitor Research Board",
            "Structured Creative Briefs", "Weekly Creative Sprint Board", "Performance Statics",
            "Performance Video Creatives", "Creative Delivery Folder", "Feedback Tracker",
            "Monthly Performance Review", "Next Sprint Plan roadmaps",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-[#CBBF9A]/60 bg-white/50">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#2454E8] text-[10px] font-bold text-white font-mono shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-xs md:text-sm font-bold text-[#111113]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          12. FAQ
      ══════════════════════════════════════════ */}
      <section id="faq" className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10 text-center">
          <div className="section-kicker">Help center</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl mt-3 text-[#111113]">FAQ</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item, i) => (
            <div key={i} className="card-surface p-6 text-left h-full flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-base md:text-lg font-bold text-[#111113]">{item.q}</h3>
                <p className="text-xs md:text-sm text-[#111113]/75 leading-6 mt-3 font-medium">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          13. FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:px-8 text-center">
        <div className="rounded-[2.5rem] border border-[#CBBF9A] bg-white/70 backdrop-blur-md p-8 md:p-12 space-y-6 shadow-xl">
          <div className="section-kicker">Next sprint</div>
          <h2 className="font-heading text-3xl font-extrabold sm:text-5xl text-[#111113] max-w-2xl mx-auto leading-tight">
            Ready to build a creative engine instead of chasing your next winning ad?
          </h2>
          <p className="text-sm md:text-base text-[#111113]/75 max-w-lg mx-auto leading-6 font-medium">
            Apply for a Strategy Review and see what your first Creative Sprint should focus on.
          </p>
          <a
            href="#apply"
            onClick={e => { e.preventDefault(); scrollTo("#apply"); }}
            className="cool-button inline-flex text-sm px-8 py-4"
          >
            Apply for a Strategy Review
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="text-[11px] text-[#667350] font-mono uppercase tracking-widest font-bold">
            If we are a fit, we will map your creative roadmap and recommend the next best step.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-[#CBBF9A]/60 px-5 py-12 md:px-8 bg-[#F8F1E6]/70">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-heading text-xl font-bold uppercase tracking-widest text-[#111113]">Creative Scaling</p>
            <p className="text-xs text-[#111113]/60 font-medium mt-1">The Performance Creative Partner for Shopify Brands.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 text-xs">
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-[#667350] font-bold uppercase tracking-widest">Navigation</p>
              <div className="flex flex-col gap-2 font-bold text-[#111113]/70">
                {navLinks.map(l => (
                  <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left hover:text-[#2454E8]">{l.label}</button>
                ))}
              </div>
            </div>

          </div>
        </div>
        <div className="mx-auto max-w-7xl mt-8 pt-6 border-t border-[#CBBF9A]/40 flex items-center justify-between gap-4">
          <p className="text-[10px] text-[#111113]/50 font-mono">© 2026 Creative Scaling. All rights reserved.</p>
          <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition">
            <img src={brandLogo} alt="" className="h-5 w-5 rounded-full object-cover" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#111113]">Built by Creative Scaling</span>
          </div>
        </div>
      </footer>

      <JimmyChat />
    </main>
  );
}
