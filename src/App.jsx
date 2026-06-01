import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Brush,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Layers3,
  Menu,
  MousePointerClick,
  PenLine,
  Rocket,
  Sparkles,
  Star,
  Workflow,
  X,
} from "lucide-react";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/omaradel.ai", note: "@omaradel.ai" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/omar-adel-754072337/", note: "needs update" },
  { label: "Visualfram", href: "https://visualfram.com", note: "AI workspace" },
  { label: "Heraltar.shop", href: "https://heraltar.shop", note: "24h AI brand" },
  { label: "Spaceleads.co", href: "https://spaceleads.co", note: "$1k to $7k case" },
  { label: "SignalRepair", href: "https://whop.com/joined/signal-repair/", note: "18h first sale" },
  {
    label: "Email",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=omarabokhshem1@gmail.com&su=AI%20audit%20request",
    note: "business",
  },
];

const proofStats = [
  {
    value: "40+",
    label: "brands supported",
    text: "AI visuals, websites, strategy, automations, marketing systems, and growth workflows.",
  },
  {
    value: "$1k -> $7k",
    label: "net/month growth case",
    text: "Helped improve website flow, positioning, marketing structure, and AI-backed systems over 2-3 months.",
  },
  {
    value: "24h",
    label: "AI-led launch tests",
    text: "Built fast brand, store, and campaign experiments using AI-led execution systems.",
  },
  {
    value: "Full-stack",
    label: "Visualfram built from scratch",
    text: "Frontend, backend, AI generation flows, workspace systems, and agency-ready workflows.",
  },
];

const proofStatsRich = [
  {
    number: "01",
    value: "40+",
    label: "brands supported",
    domain: "AI visuals / websites / systems",
    link: "#cases",
    text: "AI visuals, websites, strategy, automations, marketing systems, and growth workflows.",
  },
  {
    number: "02",
    value: "$1k -> $7k",
    label: "net/month growth case",
    domain: "spaceleads.co",
    link: "https://spaceleads.co",
    text: "Spaceleads.co: website flow, positioning, marketing structure, and AI-backed systems improved over 2-3 months.",
  },
  {
    number: "03",
    value: "24h",
    label: "brand built A-Z",
    domain: "heraltar.shop",
    link: "https://heraltar.shop",
    text: "Heraltar.shop was built as an AI-led ecommerce brand test from zero: branding, visuals, store, offer, and launch.",
  },
  {
    number: "04",
    value: "18h",
    label: "first sale system",
    domain: "SignalRepair",
    link: "#signalrepair",
    text: "Product info, AI-led marketing, content structure, and launch work fast, with 100+ creator collaborations.",
  },
  {
    number: "05",
    value: "Full-stack",
    label: "Visualfram built from scratch",
    domain: "visualfram.com",
    link: "https://visualfram.com",
    text: "Frontend, backend, AI generation flows, workspace systems, and agency-ready workflows.",
  },
];

const services = [
  {
    icon: Workflow,
    title: "AI Automations",
    text: "Lead flows, content systems, reporting, client intake, internal tools, and one-click actions that reduce manual work.",
  },
  {
    icon: Brush,
    title: "AI Visual Systems",
    text: "Brand-matched AI visual workflows, creative direction, prompt systems, production pipelines, and team training.",
  },
  {
    icon: Bot,
    title: "AI Chatbots",
    text: "Website, support, sales, and internal assistants built around your offer, customer questions, and brand voice.",
  },
  {
    icon: Globe2,
    title: "Websites & Conversion",
    text: "Offer clarity, page structure, UX flow, ecommerce improvements, and conversion-focused site systems.",
  },
  {
    icon: PenLine,
    title: "Team Training",
    text: "Simple workshops for founders, marketers, designers, and content teams who want to use AI daily.",
  },
  {
    icon: Rocket,
    title: "Growth Experiments",
    text: "Landing pages, content angles, funnels, creator campaigns, store tests, and fast AI-powered launch systems.",
  },
];

const cases = [
  {
    tag: "Website / Strategy / AI Systems",
    title: "Spaceleads.co",
    text: "Improved website structure, positioning, marketing flow, and AI-backed systems.",
    result: "From around $1k/month to around $7k net/month within 2-3 months after the improvements.",
    link: "https://spaceleads.co",
  },
  {
    tag: "Product / AI Workspace",
    title: "Visualfram",
    text: "Built an AI creative platform from frontend to backend, including generation flows, workspace systems, and agency-ready workflows.",
    result: "Used by creative teams and agencies, with custom workflow requests and white-label style usage.",
    link: "https://visualfram.com",
  },
  {
    tag: "Fast Launch / Growth Engine",
    title: "SignalRepair",
    text: "Built and launched a fast AI-led content and brand experiment from idea to first sale in under 18 hours.",
    result: "Now scaling the system and improving brand workflows with AI.",
    link: "https://whop.com/joined/signal-repair/",
  },
  {
    tag: "Ecommerce / Brand Test",
    title: "Heraltar.shop",
    text: "Built an AI-led ecommerce store test in 24 hours to prove better visuals, brand structure, and site flow can make a product easier to trust.",
    result: "First-sale focused experiment built using AI-led branding and launch execution.",
    link: "https://heraltar.shop",
  },
];

const auditOptions = [
  "AI automations",
  "AI visuals",
  "AI chatbot",
  "Website / conversion",
  "Team training",
  "Custom AI tool",
  "SignalRepair collab",
  "Visualfram",
  "Not sure yet",
];

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Visualfram", href: "#visualfram" },
  { label: "Cases", href: "#cases" },
  { label: "Contact", href: "#contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const dropIn = {
  hidden: { opacity: 0, y: -70, rotateX: -18, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
};

const cardDrop = {
  hidden: { opacity: 0, y: 34, scale: 0.96, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
};

const externalLinkProps = (href) =>
  href?.startsWith("http")
    ? { target: "_blank", rel: "noreferrer" }
    : {};

const smoothSpring = [0.16, 1, 0.3, 1];

function DropLine({ children, delay = 0, className = "" }) {
  return (
    <span className="block overflow-visible">
      <motion.span
        className={`block origin-top ${className}`}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.82, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Label({ children }) {
  return (
    <div className="section-kicker inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#151515]/70">
      <span className="h-1.5 w-1.5 rounded-full bg-[#2454E8]" />
      {children}
    </div>
  );
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

function AccentText({ children }) {
  return (
    <span className="accent-word ink-underline inline-block text-[#2454E8]">
      {children}
    </span>
  );
}

function PaperCard({ children, className = "" }) {
  return (
    <div className={`card-surface rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/85 p-6 shadow-[0_22px_70px_rgba(21,21,21,0.12)] backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function StarMark({ className = "" }) {
  return (
    <div className={`relative h-9 w-9 ${className}`}>
      <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-[#2454E8]" />
      <div className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-[#2454E8]" />
      <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rotate-45 bg-[#2454E8]" />
      <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 -rotate-45 bg-[#2454E8]" />
    </div>
  );
}

function Crosshair({ className = "" }) {
  return (
    <div className={`relative h-12 w-12 rounded-full border border-[#151515]/30 ${className}`}>
      <div className="absolute left-1/2 top-[-10px] h-[68px] w-px -translate-x-1/2 bg-[#151515]/25" />
      <div className="absolute left-[-10px] top-1/2 h-px w-[68px] -translate-y-1/2 bg-[#151515]/25" />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D85C9D]" />
    </div>
  );
}

function PromptCard() {
  return (
    <PaperCard className="relative overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-[#151515]/15 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#151515] text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight">AI Audit Prompt</p>
            <p className="text-xs text-[#151515]/55">Built for real brand workflow</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full border border-[#151515]/40" />
          <span className="h-2 w-2 rounded-full border border-[#151515]/40" />
          <span className="h-2 w-2 rounded-full border border-[#151515]/40" />
        </div>
      </div>
      <div className="space-y-5 p-6">
        <h3 className="font-serif text-3xl leading-none text-[#151515] md:text-4xl">
          Build an AI workflow for my brand.
        </h3>
        {[
          ["Brand", "your brand"],
          ["Current problem", "what takes too much time"],
          ["Need", "automation / visuals / chatbot / training"],
          ["Goal", "save time / create content / support customers"],
        ].map(([label, placeholder]) => (
          <div key={label} className="grid grid-cols-[140px_1fr] items-center gap-4 border-b border-[#151515]/15 pb-3 text-sm">
            <span className="font-bold text-[#151515]/70">{label}:</span>
            <span className="font-mono text-[#151515]/45">[ {placeholder} ]</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-[#151515]/60">No AI noise. Just what to fix first.</p>
          <a
            href="#contact"
            aria-label="Book a 15-minute AI audit"
            className="grid h-12 w-12 place-items-center rounded-full bg-[#2454E8] text-white shadow-lg transition hover:scale-105"
          >
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </PaperCard>
  );
}

function FounderCollage() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[450px]">
      <div className="absolute right-2 top-8 z-10 h-16 w-40 -rotate-6 bg-[#CBBF9A]/55 shadow-sm" />
      <div className="absolute -left-2 top-16 z-20">
        <Crosshair />
      </div>
      <div className="absolute right-0 top-0 z-20">
        <StarMark />
      </div>
      <motion.div
        initial={{ rotate: 4, y: 16, opacity: 0 }}
        animate={{ rotate: -2, y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: smoothSpring }}
        whileHover={{ rotate: 0, y: -8, scale: 1.01 }}
        className="reveal-card absolute inset-x-8 top-12 z-10 rounded-[2rem] border border-[#151515]/15 bg-white p-3 shadow-[0_28px_80px_rgba(21,21,21,0.2)]"
      >
        <div className="relative grid aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-[#151515]">
          <img
            src="/assets/omar-face.png"
            alt="Omar Adel"
            className="h-full w-full object-cover object-[50%_34%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/70 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">Founder / Builder</p>
            <p className="mt-2 font-serif text-4xl font-bold leading-none">AI systems</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ x: 30, y: 30, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: smoothSpring }}
        whileHover={{ rotate: -1, y: -6 }}
        className="reveal-card absolute bottom-8 left-0 z-30 w-[78%] -rotate-3 rounded-[1.5rem] border border-[#151515]/15 bg-[#F8F1E6] p-5 shadow-[0_20px_60px_rgba(21,21,21,0.15)]"
      >
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D85C9D]">system note</p>
        <p className="mt-3 font-serif text-3xl leading-[0.95] text-[#151515]">
          AI should feel <span className="font-bold text-[#2454E8]">human</span>, useful, and fast.
        </p>
      </motion.div>
      <div className="absolute bottom-0 right-5 z-20 grid h-16 w-16 place-items-center rounded-full bg-[#2454E8] text-white shadow-xl">
        <ArrowUpRight className="h-6 w-6" />
      </div>
      <div className="absolute bottom-28 right-0 z-30 rounded-full bg-[#D85C9D] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-white shadow-lg">
        40+ brands
      </div>
    </div>
  );
}

export default function OmarAISystemsLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 42);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

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

      <header
        className={`fixed left-0 top-0 z-50 w-full px-4 pointer-events-none transition-all duration-700 md:px-8 ${
          isScrolled ? "py-3" : "py-6"
        }`}
      >
        <div
          className={`nav-glass pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] px-4 py-3 transition-all duration-700 md:px-8 ${
            isScrolled
              ? "border border-[#151515]/10 bg-[#F8F1E6]/82 shadow-[0_32px_64px_-18px_rgba(21,21,21,0.25)] backdrop-blur-2xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <button onClick={() => scrollToSection("#top")} className="group flex items-center gap-3 text-left">
            <div className="nav-avatar grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-[#151515]/15 bg-[#F8F1E6] p-0.5 shadow-sm transition group-hover:border-[#2454E8]/45 group-hover:shadow-[0_10px_28px_rgba(36,84,232,0.18)]">
              <img
                src="/assets/omar-face.png"
                alt="Omar Adel"
                className="h-full w-full rounded-full object-cover object-[50%_34%]"
              />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Omar Adel</p>
              <p className="text-xs text-[#151515]/55">AI systems for brands</p>
            </div>
          </button>

          <nav className="hidden items-center gap-8 text-[10px] font-black uppercase tracking-[0.22em] text-[#151515]/45 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="nav-link relative transition hover:text-[#2454E8]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <BlueButton href="#contact" className="px-4 py-2.5">Book a call</BlueButton>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-[#151515]/15 bg-white/35 transition hover:bg-[#2454E8]/10 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -16, height: 0 }}
            transition={{ duration: 0.45, ease: smoothSpring }}
            className="pointer-events-auto mx-auto mt-3 max-w-7xl overflow-hidden rounded-[2rem] border border-[#151515]/10 bg-[#F8F1E6]/95 px-5 py-5 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            <div className="grid gap-4 text-sm font-black uppercase tracking-[0.18em] text-[#151515]/55">
              {navLinks.map((link) => (
                <button key={link.label} onClick={() => scrollToSection(link.href)} className="text-left transition hover:text-[#2454E8]">
                  {link.label}
                </button>
              ))}
              <button onClick={() => scrollToSection("#contact")} className="mt-2 rounded-2xl bg-[#151515] px-4 py-4 text-center text-[11px] text-white">
                Book a call
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </header>

      <section id="top" className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-28 md:grid-cols-[1.12fr_0.88fr] md:px-8 md:pb-28 md:pt-32">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7, ease: smoothSpring }} className="flex flex-col justify-center">
          <Label>01 / AI Systems For Brands</Label>

          <h1 className="hero-title mt-7 max-w-4xl font-serif text-[4.3rem] font-bold leading-[0.82] text-[#151515] sm:text-[6.3rem] md:text-[8rem] lg:text-[9rem]">
            <DropLine>I make AI</DropLine>
            <DropLine delay={0.08}><AccentText>useful</AccentText> for</DropLine>
            <DropLine delay={0.16}>brands.</DropLine>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#151515]/72 md:text-xl">
            Automations, AI visuals, chatbots, websites, growth systems, and team training - built into your real workflow.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BlueButton href="#contact">Book a 15-min AI audit</BlueButton>
            <OutlineButton href="https://visualfram.com">Browse Visualfram</OutlineButton>
            <OutlineButton href="#signalrepair">Work / collab</OutlineButton>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              "Built Visualfram from scratch",
              "Supported 40+ brands",
              "AI systems teams actually use",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl border border-[#151515]/10 bg-white/25 px-4 py-3 text-sm font-bold text-[#151515]/72">
                <CheckCircle2 className="h-4 w-4 text-[#2454E8]" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <FounderCollage />
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-center">
          <h2 className="font-serif text-4xl leading-none md:text-5xl">Find me online</h2>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...externalLinkProps(link.href)}
                className="group rounded-full border border-[#151515]/15 bg-[#F8F1E6]/70 px-4 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-[#2454E8]/45 hover:text-[#2454E8]"
              >
                {link.label} <span className="inline-block transition group-hover:translate-x-0.5">-&gt;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {proofStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardDrop}
              transition={{ duration: 0.62, delay: index * 0.07, ease: smoothSpring }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="reveal-card rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/75 p-5 shadow-sm"
            >
              <p className="font-serif text-5xl font-semibold leading-none text-[#2454E8]">{stat.value}</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[#151515]">{stat.label}</p>
              <p className="mt-4 text-sm leading-6 text-[#151515]/65">{stat.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="services" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Label>02 / What I Do</Label>
            <h2 className="mt-6 max-w-3xl font-serif text-6xl font-semibold leading-[0.88] md:text-8xl">
              AI systems, not AI <AccentText>noise</AccentText>.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#151515]/68">
            I connect the creative side, the technical side, and the business side so AI becomes part of how the team works.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={cardDrop}
                transition={{ duration: 0.62, delay: index * 0.05, ease: smoothSpring }}
                whileHover={{ y: -8, scale: 1.012 }}
                className="reveal-card group rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/75 p-6 shadow-sm transition hover:bg-white/50 hover:shadow-[0_18px_50px_rgba(21,21,21,0.1)]"
              >
                <div className="mb-10 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#151515] text-white transition group-hover:bg-[#2454E8]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-[#151515]/35">0{index + 1}</span>
                </div>
                <h3 className="font-serif text-4xl leading-none">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#151515]/65">{service.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="flex flex-col justify-center">
          <Label>03 / AI Audit</Label>
          <h2 className="mt-6 font-serif text-6xl font-semibold leading-[0.88] md:text-8xl">
            Start with an honest audit.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#151515]/70">
            Book a quick call for your brand, workflow, or website. I'll show what looks strong, what is unclear, and what AI can actually fix first.
          </p>
          <div className="mt-8">
            <BlueButton href="#contact">Book a 15-min call</BlueButton>
          </div>
        </div>
        <PromptCard />
      </section>

      <section id="visualfram" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="editorial-panel relative overflow-hidden rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/88 p-6 text-[#151515] shadow-[0_30px_90px_rgba(21,21,21,0.12)] md:p-10">
          <div className="absolute right-10 top-9 hidden text-[11px] font-black uppercase tracking-[0.34em] text-[#151515]/55 md:block">AI-powered clarity</div>
          <div className="absolute right-20 top-20 hidden h-32 w-32 rounded-full border border-[#151515]/35 md:block">
            <div className="absolute left-1/2 top-[-20px] h-[172px] w-px -translate-x-1/2 bg-[#151515]/25" />
            <div className="absolute left-[-20px] top-1/2 h-px w-[172px] -translate-y-1/2 bg-[#151515]/25" />
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-3xl leading-none text-[#D85C9D]">+</div>
          </div>
          <div className="absolute -bottom-10 left-1/3 h-28 w-44 -rotate-3 bg-[#D85C9D]/70" />
          <div className="absolute right-8 bottom-8 hidden text-8xl font-black leading-none text-[#2454E8] md:block">*</div>

          <div className="relative z-10 grid gap-10 md:grid-cols-[0.95fr_1.05fr] md:items-center">
            <div>
              <Label>04 / Product Built By Omar</Label>
              <h2 className="mt-7 max-w-3xl font-serif text-7xl font-bold leading-[0.82] md:text-9xl">
                Visual<span className="text-[#2454E8]">fram</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#151515]/70">
                An AI workspace for creative teams, brands, and agencies - built to create AI visuals, manage creative workflows, build campaigns, and move faster without jumping between ten tools.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://visualfram.com"
                  className="cool-button inline-flex items-center justify-center gap-2 rounded-full bg-[#2454E8] px-5 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(36,84,232,0.22)] transition hover:-translate-y-0.5"
                >
                  Browse Visualfram <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="glass-button inline-flex items-center justify-center gap-2 rounded-full border border-[#151515]/20 bg-[#F3EBDD]/80 px-5 py-3 text-sm font-black text-[#151515] transition hover:-translate-y-0.5 hover:bg-white/70"
                >
                  Request custom system <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative rounded-[1.6rem] border border-[#151515]/15 bg-[#F3EBDD]/70 p-4 shadow-[0_24px_70px_rgba(21,21,21,0.12)] backdrop-blur">
              <div className="absolute -top-6 left-1/2 h-10 w-32 -translate-x-1/2 -rotate-2 bg-[#CBBF9A]/55 shadow-sm" />
              <div className="grid gap-3">
                {[
                  "Frontend + backend built from scratch",
                  "AI generation flows and creative workspace",
                  "Project systems for brands and agencies",
                  "Custom workflows and white-label style usage",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#151515]/12 bg-white/35 p-4 text-sm font-semibold text-[#151515]/78 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-[#D85C9D]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cases" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Label>05 / Case Notes</Label>
            <h2 className="mt-6 max-w-3xl font-serif text-6xl font-semibold leading-[0.88] md:text-8xl">
              Real systems. Real <AccentText>movement</AccentText>.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#151515]/68">
            These are written as clean proof points. Replace each one with screenshots, metrics, or deeper case studies when ready.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cases.map((item, index) => (
            <motion.a
              href={item.link}
              {...externalLinkProps(item.link)}
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardDrop}
              transition={{ duration: 0.62, delay: index * 0.06, ease: smoothSpring }}
              whileHover={{ y: -8, scale: 1.012 }}
              className="reveal-card group rounded-[2rem] border border-[#151515]/15 bg-[#F8F1E6]/75 p-6 shadow-sm transition hover:bg-white/50 hover:shadow-[0_18px_50px_rgba(21,21,21,0.1)]"
            >
              <div className="mb-10 flex items-start justify-between gap-4">
                <span className="rounded-full border border-[#151515]/10 bg-[#D85C9D]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#D85C9D]">
                  {item.tag}
                </span>
                <ArrowUpRight className="h-5 w-5 text-[#151515]/40 transition group-hover:text-[#2454E8]" />
              </div>
              <h3 className="font-serif text-5xl leading-none">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#151515]/65">{item.text}</p>
              <div className="mt-6 rounded-2xl border border-[#151515]/10 bg-[#F3EBDD]/75 p-4 text-sm font-bold leading-6 text-[#151515]/78">
                <span className="text-[#2454E8]">Result:</span> {item.result}
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="torn-edge bg-[#D85C9D]/75 px-6 py-12 shadow-[0_20px_60px_rgba(216,92,157,0.18)] md:px-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <h2 className="font-serif text-6xl font-semibold leading-[0.88] text-[#151515] md:text-8xl">
              Most brands are using AI wrong.
            </h2>
            <div className="space-y-5 text-lg leading-8 text-[#151515]/78">
              <p>They test tools, generate random content, and call it innovation.</p>
              <p>
                AI should become part of the actual business workflow - the website, the team, the content engine, the sales process, the creative direction, and the daily operations.
              </p>
              <p className="font-serif text-4xl font-bold leading-none text-white">That's what I build.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="signalrepair" className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:items-center">
        <div>
          <Label>06 / Collab</Label>
          <h2 className="mt-6 font-serif text-6xl font-semibold leading-[0.88] md:text-8xl">
            Collaborate with SignalRepair.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#151515]/70">
            I'm building SignalRepair as a content and growth engine. I'm open to creators, editors, AI visual people, strategists, and brands that want to test fast and build something real.
          </p>
          <div className="mt-8">
            <BlueButton href="#contact">Book a collab call</BlueButton>
          </div>
        </div>
        <PaperCard>
          <div className="grid gap-4">
            {[
              "Creator collaborations",
              "AI visual production",
              "Clipping and content systems",
              "Brand growth experiments",
              "Fast launch operations",
            ].map((item) => (
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

      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-8 rounded-[2.5rem] border border-[#151515]/15 bg-[#F8F1E6]/80 p-6 shadow-[0_25px_80px_rgba(21,21,21,0.12)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <Label>07 / Contact</Label>
            <h2 className="mt-6 font-serif text-6xl font-semibold leading-[0.88] md:text-8xl">
              Book a 15-minute AI audit.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#151515]/70">
              Pick a time and share your brand link, main problem, and what you want help with. I'll come prepared with the fastest AI opportunities.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {auditOptions.slice(0, 5).map((option) => (
                <span
                  key={option}
                  className="rounded-full border border-[#151515]/15 bg-[#F3EBDD]/80 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#151515]/60"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#151515]/15 bg-[#F3EBDD] p-3 shadow-[0_18px_55px_rgba(21,21,21,0.1)]">
            <iframe
              src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ00at7KcoB_RbiEk8-vFENRpxf6oGhOA3kKcn7-USQDL0Wej5F2vYCdcAcF5oQfgFIqaP2d_XPH?gv=true"
              title="Book a 15-minute AI audit"
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
            />
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#151515]/10 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-4xl leading-none">Omar Adel</p>
            <p className="mt-2 text-sm font-semibold text-[#151515]/60">AI systems for brands.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-[#151515]/65">
            <a href="https://visualfram.com" className="hover:text-[#2454E8]">Visualfram</a>
            <a href="#signalrepair" className="hover:text-[#2454E8]">SignalRepair</a>
            <a href="https://www.instagram.com/omaradel.ai" className="hover:text-[#2454E8]">Instagram</a>
            <a href="#" className="hover:text-[#2454E8]">LinkedIn</a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=omarabokhshem1@gmail.com&su=AI%20audit%20request" className="hover:text-[#2454E8]">Email</a>
          </div>
          <p className="max-w-xs text-sm font-semibold leading-6 text-[#151515]/55">
            Built with AI, taste, and way too many late nights.
          </p>
        </div>
      </footer>
    </main>
  );
}
