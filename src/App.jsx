import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Layers3,
  Menu,
  MessageCircle,
  MousePointerClick,
  PlaySquare,
  Send,
  Sparkles,
  Target,
  Workflow,
  X,
} from "lucide-react";

const calendarUrl =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2h1UL-d25Vx4J5qkG9BDu-XIOB-zT31kIvy43Ec-N2V7RpfYooRGqSLHuE9yROmIHjEOrTeh-3?gv=true";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Case Study", href: "#case-study" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const proofStats = [
  ["700K+", "organic views from owned brand content"],
  ["7K+", "followers in roughly 10 days"],
  ["Weekly", "creative delivery and testing sprints"],
  ["$30K+", "monthly revenue best-fit threshold"],
];

const problemCards = [
  {
    title: "Creative fatigue hits too fast",
    text: "Winners stop working before the next useful batch of concepts is ready.",
  },
  {
    title: "Output is not tied to learning",
    text: "The team makes more assets, but the tests do not reveal what to do next.",
  },
  {
    title: "No clear creative engine",
    text: "Hooks, concepts, production, delivery, feedback, and performance review are disconnected.",
  },
];

const services = [
  {
    icon: Target,
    title: "Performance Statics",
    text: "Static ad creatives built to test hooks, products, offers, angles, retargeting, and product storytelling.",
  },
  {
    icon: PlaySquare,
    title: "Performance Video Creatives",
    text: "Short-form paid and organic videos for TikTok, Reels, Shorts, Meta, UGC-style tests, and product demos.",
  },
  {
    icon: BarChart3,
    title: "Creative Strategy",
    text: "Hook research, competitor patterns, testing priorities, creative angles, and a weekly roadmap.",
  },
  {
    icon: Workflow,
    title: "Creative Systems",
    text: "Sprint planning, delivery folders, feedback flow, usage notes, performance review, and next-sprint planning.",
  },
];

const processSteps = [
  ["01", "Discovery", "Brand, offer, products, audience, creative process, and bottlenecks."],
  ["02", "Strategy", "Priorities, angles, offers, and the first testing roadmap."],
  ["03", "Research", "Competitors, customer pain points, past winners, and market patterns."],
  ["04", "Hooks", "Hook directions and testing hypotheses for the sprint."],
  ["05", "Production", "Performance statics and video creatives based on the sprint plan."],
  ["06", "Review", "Feedback, performance signals, learning, and the next sprint."],
];

const packages = [
  {
    name: "Starter",
    price: "$2,000/mo",
    copy: "For brands beginning structured creative testing.",
    items: ["20 Performance Statics", "Up to 7 Performance Videos", "Creative strategy", "Monthly planning", "2 revision rounds"],
  },
  {
    name: "Growth",
    price: "$5,000/mo",
    copy: "For brands scaling paid and organic creative output.",
    items: ["45 Performance Statics", "Up to 18 Performance Videos", "Weekly strategy calls", "Competitor research", "Priority production"],
    recommended: true,
  },
  {
    name: "Scale",
    price: "$8,000/mo",
    copy: "For brands running large creative testing programs.",
    items: ["80 Performance Statics", "Up to 35 Performance Videos", "Weekly Performance Reviews", "Custom planning", "Highest priority queue"],
  },
];

const faqItems = [
  ["Is this just editing?", "No. Creative Scaling combines research, hooks, strategy, production, delivery, feedback, and performance review."],
  ["Who is this for?", "Shopify brands doing $30k+/month or more with a product that already has demand and a need for consistent creative output."],
  ["Do you guarantee ad results?", "No. The goal is a better testing engine: faster output, clearer learning, and stronger creative decisions."],
  ["Why apply before booking?", "The application protects the calendar and makes the Strategy Review more useful for brands that are likely to fit."],
];

const applicationSteps = [
  {
    key: "brand",
    label: "Brand",
    title: "Tell us about the brand.",
    fields: [
      { name: "brandName", label: "Brand name", placeholder: "HER ALTAR", type: "text" },
      { name: "website", label: "Website", placeholder: "https://yourstore.com", type: "url" },
    ],
  },
  {
    key: "stage",
    label: "Stage",
    title: "Where is the business now?",
    fields: [
      { name: "revenue", label: "Monthly revenue", type: "select", options: ["Under $30k", "$30k-$100k", "$100k-$250k", "$250k-$500k", "$500k+"] },
      { name: "team", label: "Who owns creative now?", type: "select", options: ["Founder", "Internal team", "Media buyer", "Freelancers", "Mixed"] },
    ],
  },
  {
    key: "bottleneck",
    label: "Bottleneck",
    title: "What needs fixing first?",
    fields: [
      { name: "bottleneck", label: "Main bottleneck", type: "select", options: ["Creative fatigue", "Not enough assets", "Weak testing structure", "Need paid + organic support", "Not sure"] },
      { name: "notes", label: "What is happening right now?", placeholder: "Short context helps us prep the call.", type: "textarea" },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const smoothSpring = [0.16, 1, 0.3, 1];

function Label({ children }) {
  return (
    <div className="section-kicker inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#151515]/70">
      <span className="h-1.5 w-1.5 rounded-full bg-[#2454E8]" />
      {children}
    </div>
  );
}

function AccentText({ children }) {
  return <span className="accent-word ink-underline inline-block text-[#2454E8]">{children}</span>;
}

function BlueButton({ children, href = "#", className = "" }) {
  return (
    <a
      href={href}
      className={`cool-button group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2454E8] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(36,84,232,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(36,84,232,0.35)] ${className}`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

function OutlineButton({ children, href = "#" }) {
  return (
    <a
      href={href}
      className="glass-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#151515]/20 bg-[#F3EBDD]/75 px-5 py-3 text-sm font-bold text-[#151515] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#151515]/45 hover:bg-white/55"
    >
      {children}
      <ChevronRight className="h-4 w-4" />
    </a>
  );
}

function PaperCard({ children, className = "" }) {
  return (
    <div className={`card-surface rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/85 p-6 shadow-[0_22px_70px_rgba(21,21,21,0.12)] backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function BrandSystemVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: -1 }}
      transition={{ duration: 0.8, ease: smoothSpring }}
      className="relative mx-auto w-full max-w-[520px]"
    >
      <div className="absolute -left-5 top-10 h-28 w-44 -rotate-6 bg-[#CBBF9A]/55 shadow-sm" />
      <div className="absolute -right-4 bottom-20 h-28 w-28 rounded-full border border-[#151515]/25" />
      <PaperCard className="relative overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[#151515]/15 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#151515] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight">Creative Operating System</p>
              <p className="text-xs text-[#151515]/55">weekly sprint board</p>
            </div>
          </div>
          <span className="rounded-full bg-[#2454E8] px-3 py-1 font-mono text-xs font-bold text-white">LIVE</span>
        </div>
        <div className="grid gap-3 p-5">
          {[
            ["Research", "Competitors, reviews, market patterns"],
            ["Hooks", "12 testing hypotheses"],
            ["Production", "Statics + short-form videos"],
            ["Delivery", "Usage notes, CTA, platform, angle"],
            ["Review", "Signals, feedback, next sprint"],
          ].map(([title, text], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.08, duration: 0.45 }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#151515]/10 bg-white/35 p-4"
            >
              <div>
                <p className="font-serif text-2xl leading-none text-[#151515]">{title}</p>
                <p className="mt-1 text-sm text-[#151515]/60">{text}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2454E8]" />
            </motion.div>
          ))}
        </div>
      </PaperCard>
      <div className="absolute -bottom-4 right-8 rounded-full bg-[#D85C9D] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-white shadow-lg">
        no random assets
      </div>
    </motion.div>
  );
}

function ApplicationFlow() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    brandName: "",
    website: "",
    revenue: "$30k-$100k",
    team: "Founder",
    bottleneck: "Creative fatigue",
    notes: "",
  });

  const current = applicationSteps[step];
  const progress = ((step + 1) / applicationSteps.length) * 100;

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const submitApplication = async () => {
    const payload = { ...form, submittedAt: new Date().toISOString() };
    localStorage.setItem("creative-scaling-application", JSON.stringify(payload));

    const endpoint = import.meta.env.VITE_APPLICATION_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.warn("Application endpoint failed", error);
      }
    }

    setSubmitted(true);
  };

  return (
    <PaperCard className="overflow-hidden p-0">
      <div className="border-b border-[#151515]/15 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold tracking-tight">Strategy Review Application</p>
            <p className="text-xs text-[#151515]/55">Apply first. Book after the fit check.</p>
          </div>
          <span className="font-mono text-xs font-bold text-[#2454E8]">{submitted ? "READY TO BOOK" : `STEP ${step + 1}/3`}</span>
        </div>
        {!submitted && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#151515]/10">
            <motion.div className="h-full bg-[#2454E8]" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key={current.key}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
            className="p-5"
          >
            <div className="mb-5 flex flex-wrap gap-2">
              {applicationSteps.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] transition ${
                    index === step
                      ? "border-[#2454E8] bg-[#2454E8] text-white"
                      : "border-[#151515]/15 bg-[#F3EBDD]/80 text-[#151515]/55"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <h3 className="font-serif text-4xl leading-none">{current.title}</h3>
            <div className="mt-6 grid gap-4">
              {current.fields.map((field) => (
                <label key={field.name} className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#151515]/55">{field.label}</span>
                  {field.type === "select" ? (
                    <select
                      value={form[field.name]}
                      onChange={(event) => updateField(field.name, event.target.value)}
                      className="w-full rounded-2xl border border-[#151515]/15 bg-white/45 px-4 py-4 font-bold outline-none transition focus:border-[#2454E8]"
                    >
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={form[field.name]}
                      onChange={(event) => updateField(field.name, event.target.value)}
                      placeholder={field.placeholder}
                      className="min-h-32 w-full resize-y rounded-2xl border border-[#151515]/15 bg-white/45 px-4 py-4 font-bold outline-none transition focus:border-[#2454E8]"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.name]}
                      onChange={(event) => updateField(field.name, event.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-[#151515]/15 bg-white/45 px-4 py-4 font-bold outline-none transition focus:border-[#2454E8]"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((value) => value - 1)}
                  className="glass-button min-h-12 rounded-full border border-[#151515]/20 bg-[#F3EBDD]/75 px-5 py-3 text-sm font-bold text-[#151515] transition hover:-translate-y-1"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={() => (step === applicationSteps.length - 1 ? submitApplication() : setStep((value) => value + 1))}
                className="cool-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2454E8] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(36,84,232,0.25)] transition hover:-translate-y-1"
              >
                {step === applicationSteps.length - 1 ? "Submit application" : "Continue"}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35 }}
            className="p-5"
          >
            <div className="mb-4 rounded-2xl border border-[#2454E8]/25 bg-[#2454E8]/10 p-4">
              <p className="font-serif text-3xl leading-none text-[#151515]">Application received. Book the Strategy Review.</p>
              <p className="mt-3 text-sm leading-6 text-[#151515]/65">
                Your answers are saved for this flow. Pick a time below and come ready to review your creative bottleneck.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.4rem] border border-[#151515]/15 bg-[#F3EBDD]">
              <iframe
                src={calendarUrl}
                title="Book a Strategy Review"
                style={{ border: 0 }}
                width="100%"
                height="620"
                frameBorder="0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaperCard>
  );
}

function JimmyChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me about fit, pricing, deliverables, the application, or what happens after you book a Strategy Review.",
    },
  ]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/jimmy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Jimmy AI is not connected yet.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message === "Missing DEEPSEEK_API_KEY"
              ? "Jimmy is designed and ready, but the DeepSeek API key is not added yet. Add DEEPSEEK_API_KEY to the environment to make this live."
              : error.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex max-w-[280px] items-center gap-3 rounded-2xl border border-[#151515]/15 bg-[#F8F1E6]/95 px-4 py-3 text-sm font-bold text-[#151515] shadow-[0_18px_45px_rgba(21,21,21,0.18)] backdrop-blur transition hover:-translate-y-1 hover:border-[#2454E8]/45"
      >
        <MessageCircle className="h-5 w-5 text-[#2454E8]" />
        Ask Jimmy AI
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#151515]/25 px-4 py-5 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="ml-auto flex h-full max-h-[760px] w-full max-w-[460px] flex-col overflow-hidden rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6] shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#151515]/15 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#151515] text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold tracking-tight">Jimmy AI</p>
                    <p className="text-xs text-[#151515]/55">Creative Scaling fit assistant</p>
                  </div>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#151515]/15 bg-white/35">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "ml-auto bg-[#2454E8] text-white"
                        : "bg-[#F3EBDD] text-[#151515]/75"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {loading && <div className="w-fit rounded-2xl bg-[#F3EBDD] px-4 py-3 text-sm font-bold text-[#151515]/50">Jimmy is thinking...</div>}
              </div>

              <div className="border-t border-[#151515]/15 p-4">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") sendMessage();
                    }}
                    placeholder="Ask about fit, pricing, process..."
                    className="min-h-12 flex-1 rounded-full border border-[#151515]/15 bg-white/45 px-4 text-sm font-bold outline-none focus:border-[#2454E8]"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    className="grid h-12 w-12 place-items-center rounded-full bg-[#2454E8] text-white shadow-lg transition hover:scale-105"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
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

export default function OmarAISystemsLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 42);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const packageFit = useMemo(() => ["$30k+ / month", "$100k+ / month", "$250k+ / month", "$500k+ / month"], []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F3EBDD] text-[#151515] selection:bg-[#D85C9D]/30">
      <style>{`
        .font-serif { font-family: 'Space Grotesk', Inter, system-ui, sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        main { font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif; }
        .paper-grain:before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .16;
          mix-blend-mode: multiply;
          background-image: radial-gradient(#151515 0.7px, transparent 0.7px);
          background-size: 5px 5px;
          z-index: 60;
        }
        .torn-edge {
          clip-path: polygon(0 4%, 6% 0, 16% 3%, 28% 0, 42% 4%, 55% 1%, 67% 4%, 78% 0, 91% 3%, 100% 0, 98% 100%, 88% 96%, 74% 99%, 62% 96%, 48% 100%, 33% 97%, 20% 100%, 8% 96%, 0 100%);
        }
      `}</style>
      <div className="paper-grain" />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
        <div className="ambient-drift ambient-center absolute -top-44 h-[520px] w-[520px] rounded-full bg-[#D85C9D]/10 blur-3xl" />
        <div className="ambient-drift ambient-drift-slow absolute right-[-220px] top-40 h-[520px] w-[520px] rounded-full bg-[#2454E8]/10 blur-3xl" />
        <div className="ambient-drift ambient-drift-soft absolute bottom-[-220px] left-[-160px] h-[520px] w-[520px] rounded-full bg-[#CBBF9A]/35 blur-3xl" />
      </div>

      <header className={`fixed left-0 top-0 z-50 w-full px-4 pointer-events-none transition-all duration-700 md:px-8 ${isScrolled ? "py-3" : "py-6"}`}>
        <div className={`nav-glass pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] px-4 py-3 transition-all duration-700 md:px-8 ${isScrolled ? "border border-[#151515]/10 bg-[#F8F1E6]/82 shadow-[0_32px_64px_-18px_rgba(21,21,21,0.25)] backdrop-blur-2xl" : "border border-transparent bg-transparent"}`}>
          <button onClick={() => scrollToSection("#top")} className="group flex items-center gap-3 text-left">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-[#151515]/15 bg-[#151515] text-white shadow-sm transition group-hover:border-[#2454E8]/45 group-hover:bg-[#2454E8]">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Creative Scaling</p>
              <p className="text-xs text-[#151515]/55">Performance creative systems</p>
            </div>
          </button>

          <nav className="hidden items-center gap-8 text-[10px] font-black uppercase tracking-[0.22em] text-[#151515]/45 md:flex">
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => scrollToSection(link.href)} className="nav-link relative transition hover:text-[#2454E8]">
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <BlueButton href="#apply" className="px-4 py-2.5">Book a Strategy Review</BlueButton>
          </div>

          <button onClick={() => setMenuOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#151515]/15 bg-white/35 transition hover:bg-[#2454E8]/10 md:hidden" aria-label="Toggle menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -16, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -16, height: 0 }} transition={{ duration: 0.45, ease: smoothSpring }} className="pointer-events-auto mx-auto mt-3 max-w-7xl overflow-hidden rounded-[2rem] border border-[#151515]/10 bg-[#F8F1E6]/95 px-5 py-5 shadow-2xl backdrop-blur-2xl md:hidden">
              <div className="grid gap-4 text-sm font-black uppercase tracking-[0.18em] text-[#151515]/55">
                {navLinks.map((link) => (
                  <button key={link.label} onClick={() => scrollToSection(link.href)} className="text-left transition hover:text-[#2454E8]">
                    {link.label}
                  </button>
                ))}
                <button onClick={() => scrollToSection("#apply")} className="mt-2 rounded-2xl bg-[#151515] px-4 py-4 text-center text-[11px] text-white">
                  Book a Strategy Review
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="top" className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-18 pt-28 md:grid-cols-[1fr_0.9fr] md:px-8 md:pb-24 md:pt-32">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7, ease: smoothSpring }} className="flex flex-col justify-center">
          <Label>Performance Creative Systems</Label>
          <h1 className="hero-title mt-7 max-w-4xl font-serif text-[3.6rem] font-bold leading-[0.9] text-[#151515] sm:text-[5rem] md:text-[6.8rem] lg:text-[7.6rem]">
            Build a creative engine for <AccentText>Shopify</AccentText> growth.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#151515]/72 md:text-xl">
            We help Shopify brands launch performance statics, video creatives, and testing systems so they can test faster, learn faster, and stop running out of winning creatives.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BlueButton href="#apply">Book a Strategy Review</BlueButton>
            <OutlineButton href="#process">See How It Works</OutlineButton>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Best for $30k+/month", "Paid + organic creative", "No random one-off assets"].map((item) => (
              <span key={item} className="rounded-full border border-[#151515]/15 bg-[#F8F1E6]/75 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#151515]/60">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
        <BrandSystemVisual />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {proofStats.map(([value, label], index) => (
            <motion.div key={label} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} transition={{ duration: 0.55, delay: index * 0.05, ease: smoothSpring }} whileHover={{ y: -8, scale: 1.015 }} className="reveal-card rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/75 p-5 shadow-sm">
              <p className="font-serif text-5xl font-semibold leading-none text-[#2454E8]">{value}</p>
              <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-[#151515]/70">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Label>The real problem</Label>
            <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
              Most brands do not have a media buying problem. They have a <AccentText>creative system</AccentText> problem.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#151515]/68">
            Winning ads come from repeated testing, clear hooks, strong creative direction, and a workflow that keeps shipping useful ideas every week.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {problemCards.map((card, index) => (
            <PaperCard key={card.title} className="reveal-card">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#87916F]">0{index + 1}</span>
              <h3 className="mt-8 font-serif text-4xl leading-none">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#151515]/65">{card.text}</p>
            </PaperCard>
          ))}
        </div>
      </section>

      <section id="services" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10">
          <Label>Services</Label>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
            Output and learning, not more <AccentText>random content</AccentText>.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} transition={{ duration: 0.55, delay: index * 0.04, ease: smoothSpring }} whileHover={{ y: -8, scale: 1.012 }} className="reveal-card group rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/75 p-6 shadow-sm transition hover:bg-white/50 hover:shadow-[0_18px_50px_rgba(21,21,21,0.1)]">
                <div className="mb-10 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#151515] text-white transition group-hover:bg-[#2454E8]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-[#151515]/35">0{index + 1}</span>
                </div>
                <h3 className="font-serif text-3xl leading-none">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#151515]/65">{service.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="case-study" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="editorial-panel relative overflow-hidden rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/88 p-6 text-[#151515] shadow-[0_30px_90px_rgba(21,21,21,0.12)] md:p-10">
          <div className="relative z-10 grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div>
              <Label>Owned Proof</Label>
              <h2 className="mt-7 max-w-3xl font-serif text-6xl font-bold leading-[0.86] md:text-8xl">
                HER ALTAR was the testing ground.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#151515]/70">
                A real Shopify brand built with product selection, store design, creative direction, content strategy, organic content, and paid creative thinking.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "700K+ organic views from owned content",
                "7K+ followers in roughly 10 days",
                "Thousands of site visitors before checkout was interrupted by a payment issue",
                "Lessons became the Creative Scaling process",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#151515]/12 bg-white/35 p-4 text-sm font-semibold text-[#151515]/78 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#D85C9D]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="torn-edge bg-[#D85C9D]/75 px-6 py-12 shadow-[0_20px_60px_rgba(216,92,157,0.18)] md:px-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <h2 className="font-serif text-5xl font-semibold leading-[0.92] text-[#151515] md:text-7xl">
              How the Creative Scaling system works.
            </h2>
            <div className="space-y-5 text-lg leading-8 text-[#151515]/78">
              <p>We do not just make assets. We build a weekly system for deciding what to make, why it matters, where it will be used, and what it should test.</p>
              <p className="font-serif text-3xl font-bold leading-none text-white">Creative Delivery. Performance Review. Next Sprint.</p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {processSteps.map(([number, title, text]) => (
            <PaperCard key={title} className="p-5">
              <span className="font-mono text-xs text-[#151515]/35">{number}</span>
              <h3 className="mt-3 font-serif text-3xl leading-none">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#151515]/65">{text}</p>
            </PaperCard>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:items-center">
        <div>
          <Label>Fit Filter</Label>
          <h2 className="mt-6 font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
            Built for Shopify brands ready to test seriously.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#151515]/70">
            The higher your testing volume, the more valuable the system becomes.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {packageFit.map((range) => (
              <span key={range} className="rounded-full border border-[#151515]/15 bg-[#F8F1E6]/80 px-4 py-2 font-mono text-sm font-bold text-[#2454E8]">
                {range}
              </span>
            ))}
          </div>
        </div>
        <PaperCard>
          <div className="grid gap-4">
            {["Real product demand", "Need more consistent creative output", "Value structure and process", "Want both paid and organic support", "Ready to share brand and performance context"].map((item) => (
              <div key={item} className="flex items-center justify-between border-b border-[#151515]/10 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <MousePointerClick className="h-5 w-5 text-[#2454E8]" />
                  <span className="font-bold">{item}</span>
                </div>
                <span className="text-[#151515]/35">-&gt;</span>
              </div>
            ))}
          </div>
        </PaperCard>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10">
          <Label>Packages</Label>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
            Starting prices that set clear expectations.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {packages.map((item) => (
            <PaperCard key={item.name} className={`relative ${item.recommended ? "border-[#2454E8]/45" : ""}`}>
              {item.recommended && <span className="absolute right-5 top-5 rounded-full bg-[#2454E8] px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.12em] text-white">Recommended</span>}
              <h3 className="font-serif text-5xl leading-none">{item.name}</h3>
              <p className="mt-4 font-serif text-3xl font-bold leading-none text-[#2454E8]">Starting at {item.price}</p>
              <p className="mt-4 text-sm leading-7 text-[#151515]/65">{item.copy}</p>
              <div className="mt-6 grid gap-3">
                {item.items.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-bold text-[#151515]/72">
                    <CheckCircle2 className="h-4 w-4 text-[#2454E8]" />
                    {feature}
                  </div>
                ))}
              </div>
            </PaperCard>
          ))}
        </div>
      </section>

      <section id="apply" className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[0.82fr_1.18fr] md:px-8">
        <div className="flex flex-col justify-center">
          <Label>Apply Then Book</Label>
          <h2 className="mt-6 font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
            Complete the short application before booking.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#151515]/70">
            This protects the calendar and makes the Strategy Review more premium. Once the application is submitted, the booking calendar appears.
          </p>
          <div className="mt-8 grid gap-3">
            {["Brand context", "Revenue range", "Current creative bottleneck", "Then book the call"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-bold text-[#151515]/72">
                <ClipboardCheck className="h-5 w-5 text-[#2454E8]" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <ApplicationFlow />
      </section>

      <section id="faq" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10">
          <Label>FAQ</Label>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
            Clear answers before the call.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map(([question, answer]) => (
            <PaperCard key={question}>
              <h3 className="font-serif text-3xl leading-none">{question}</h3>
              <p className="mt-4 text-sm leading-7 text-[#151515]/65">{answer}</p>
            </PaperCard>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <PaperCard className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <Label>Final CTA</Label>
            <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
              Stop running out of winning creative.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#151515]/70">
              Apply for a Strategy Review and see what your first Creative Sprint should focus on.
            </p>
          </div>
          <BlueButton href="#apply">Start Application</BlueButton>
        </PaperCard>
      </section>

      <footer className="relative z-10 border-t border-[#151515]/10 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-4xl leading-none">Creative Scaling</p>
            <p className="mt-2 text-sm font-semibold text-[#151515]/60">Performance creative systems for Shopify brands.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-[#151515]/65">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-[#2454E8]">{link.label}</a>
            ))}
          </div>
        </div>
      </footer>

      <JimmyChat />
    </main>
  );
}
