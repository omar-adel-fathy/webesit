import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Menu,
  MessageCircle,
  MousePointerClick,
  PlaySquare,
  Plus,
  Send,
  Sparkles,
  Target,
  Workflow,
  X,
} from "lucide-react";
import brandLogo from "../ChatGPT Image Jul 23, 2026, 02_16_52 AM.png";

const calendarUrl =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2h1UL-d25Vx4J5qkG9BDu-XIOB-zT31kIvy43Ec-N2V7RpfYooRGqSLHuE9yROmIHjEOrTeh-3?gv=true";
const tallyFormId = import.meta.env.VITE_TALLY_FORM_ID || "WOkqMa";
const headerApplyHref = `https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;

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
  ["05", "Concepts", "Clear creative directions before production begins."],
  ["06", "Production", "Performance statics and video creatives based on the sprint plan."],
  ["07", "Creative Delivery", "Organized files with platform, hook, CTA, and usage notes."],
  ["08", "Testing", "Assets enter the paid or organic testing cycle."],
  ["09", "Feedback", "One clear feedback flow keeps revisions focused."],
  ["10", "Performance Review", "Signals and learnings guide stronger decisions."],
  ["11", "Next Sprint", "The next batch starts from what the last one taught us."],
];

const operatingItems = [
  "Creative Strategy", "Hook Library", "Competitor Research Board", "Creative Briefs", "Weekly Creative Sprint Board", "Performance Statics", "Performance Video Creatives", "Creative Delivery Folder", "Feedback Tracker", "Monthly Performance Review", "Next Sprint Plan",
];

const afterBookingSteps = [
  ["01", "Apply or book", "Share your brand, revenue range, current output, and biggest creative bottleneck."],
  ["02", "Discovery call", "We review your brand, offer, creative process, and goals."],
  ["03", "Recommendation", "If there is a fit, we recommend the best package and the first Creative Sprint."],
  ["04", "Proposal and contract", "You receive the plan, timeline, investment, terms, and delivery structure."],
  ["05", "Onboarding", "You upload assets and get access to the Growth Partner Workspace."],
  ["06", "Kickoff and strategy", "We align priorities, approvals, and the first testing roadmap."],
  ["07", "Weekly production", "Organized Creative Delivery arrives each week with testing notes."],
  ["08", "Review and next sprint", "We review feedback and signals, then plan what comes next."],
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
  ["Do you work with brands under $30k/month?", "Sometimes, but the system is usually most valuable once a brand has demand, traffic, or active testing. Jimmy can help you understand what to prepare first."],
  ["Do you run ads?", "Creative Scaling focuses on the creative powering paid and organic growth. We work alongside your media buyer or internal team."],
  ["Do you make content for both organic and paid?", "Yes. The system supports discovery content and conversion-focused creative testing."],
  ["What do you need from us to start?", "Your website, products, brand assets, past creatives, customer insights, competitors, and performance context when available."],
  ["How are revisions handled?", "One clear feedback flow keeps changes from getting lost. Each package has a defined revision structure."],
  ["How is delivery handled?", "Creative Delivery lives in a shared Drive workspace with weekly folders, usage notes, and feedback tracking."],
  ["Can you help with automations later?", "Yes. Automation and AI support can be added after the creative system is clear."],
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

function TypewriterText({ text, speed = 35, delay = 0, className = "", tag: Tag = "span" }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    indexRef.current = 0;
    setDisplayed("");
    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(timerRef.current);
      }
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [started, text, speed]);

  return (
    <Tag className={className}>
      {displayed}
      {displayed !== text && <span className="typed-cursor">|</span>}
    </Tag>
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

function AccentText({ children }) {
  return <span className="accent-word ink-underline inline-block text-[#2454E8]">{children}</span>;
}

function BlueButton({ children, href = "#", className = "", target }) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer noopener" : undefined}
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
      <div className="absolute -right-4 bottom-20 h-28 w-28 overflow-hidden rounded-full border border-[#151515]/25">
        <img src={brandLogo} alt="Brand Logo" className="h-full w-full object-cover" />
      </div>
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
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.4, ease: smoothSpring }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#151515]/10 bg-white/35 p-4"
            >
              <div>
                <p className="font-serif text-2xl leading-none text-[#151515]">{title}</p>
                <p className="mt-1 text-sm text-[#151515]/60">{text}</p>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 + 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2454E8]" />
              </motion.div>
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
  const [submitted, setSubmitted] = useState(() => localStorage.getItem("creative-scaling-tally-complete") === "true");
  const [booked, setBooked] = useState(() => localStorage.getItem("creative-scaling-booked") === "true");
  const [showManualFallback, setShowManualFallback] = useState(false);
  const tallyRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  useEffect(() => {
    const receiveTallyEvent = (event) => {
      if (!event.data || typeof event.data !== "object") return;

      const eventName =
        event.data?.eventName ||
        event.data?.event ||
        event.data?.type ||
        event.data?.action ||
        "";

      if (
        eventName === "Tally.FormSubmitted" ||
        eventName === "Tally.FormCompleted" ||
        eventName === "Tally.Form.PageSubmitted" ||
        eventName === "FORM_SUBMITTED" ||
        eventName === "Tally.submitted" ||
        (event.data?.isCompleted === true)
      ) {
        if (tallyRef.current) tallyRef.current.style.display = "none";
        localStorage.setItem("creative-scaling-tally-complete", "true");
        setSubmitted(true);
        setShowManualFallback(false);
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      }
    };

    const receiveCalendarEvent = (event) => {
      if (!event.data || typeof event.data !== "object") return;
      if (
        event.data?.eventType === "APPOINTMENT_SCHEDULED" ||
        event.data?.type === "APPOINTMENT_SCHEDULED" ||
        event.data?.status === "completed" ||
        event.data?.event === "booking_completed" ||
        event.data?.event === "APPOINTMENT_SCHEDULED"
      ) {
        localStorage.setItem("creative-scaling-booked", "true");
        setBooked(true);
      }
    };

    window.addEventListener("message", receiveTallyEvent);
    window.addEventListener("message", receiveCalendarEvent);
    return () => {
      window.removeEventListener("message", receiveTallyEvent);
      window.removeEventListener("message", receiveCalendarEvent);
    };
  }, []);

  useEffect(() => {
    if (!submitted) {
      fallbackTimerRef.current = setTimeout(() => {
        setShowManualFallback(true);
      }, 2000);
    }
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, [submitted]);

  const confirmBooking = () => {
    localStorage.setItem("creative-scaling-booked", "true");
    setBooked(true);
  };

  const manualSubmit = () => {
    if (tallyRef.current) tallyRef.current.style.display = "none";
    localStorage.setItem("creative-scaling-tally-complete", "true");
    setSubmitted(true);
    setShowManualFallback(false);
  };

  return (
    <PaperCard className="overflow-hidden p-0">
      <div className="border-b border-[#151515]/15 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold tracking-tight">Strategy Review Application</p>
            <p className="text-xs text-[#151515]/55">
              {booked ? "You booked a call — thank you." : submitted ? "Book your slot below" : "Apply first. Booking unlocks after Tally submits."}
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#2454E8]">
            {booked ? "BOOKED" : submitted ? "READY TO BOOK" : ""}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {booked ? (
          <motion.div
            key="thankyou"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="p-5 text-center"
          >
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#2454E8]/10">
              <CheckCircle2 className="h-10 w-10 text-[#2454E8]" />
            </div>
            <p className="font-serif text-4xl font-semibold leading-none text-[#151515]">I booked a call.</p>
            <p className="mt-4 text-sm leading-7 text-[#151515]/65">
              Thank you — your Strategy Review is confirmed and your booking is complete.
            </p>
            <p className="mt-6 font-serif text-5xl font-bold text-[#D85C9D]">See you there.</p>
          </motion.div>
        ) : !submitted ? (
          <motion.div
            key="tally"
            ref={tallyRef}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
          >
            <iframe
              src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
              title="Creative Scaling Strategy Review application"
              className="min-h-[590px] w-full border-0"
            />
            <AnimatePresence>
              {showManualFallback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="p-5"
                >
                  <p className="mb-3 text-sm font-semibold text-[#151515]/65">
                    Already submitted? If the calendar did not appear, click below.
                  </p>
                  <button
                    type="button"
                    onClick={manualSubmit}
                    className="w-full rounded-2xl bg-[#2454E8] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1"
                  >
                    I submitted the form — show booking calendar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
            <button
              type="button"
              onClick={confirmBooking}
              className="mt-4 w-full rounded-2xl bg-[#2454E8] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1"
            >
              Done - I booked my call
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PaperCard>
  );
}

function ProcessCarousel({ steps }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const { scrollYProgress } = useScroll();
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -12]);

  const scrollTo = (index) => {
    if (scrollRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth + 12;
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
      setActive(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth + 12;
      const index = Math.round(scrollRef.current.scrollLeft / cardWidth);
      setActive(Math.min(index, steps.length - 1));
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStart.current.x) * 1.2;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - walk;
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleWheel = (e) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    // Only treat primarily-vertical wheel gestures
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    // Detect whether the carousel can scroll horizontally
    const canScrollLeft = el.scrollLeft > 0;
    const canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;

    // If the user holds Shift, always convert vertical -> horizontal.
    // Otherwise only intercept when horizontal scrolling is possible.
    if (!e.shiftKey && !canScrollLeft && !canScrollRight) {
      // let the page scroll normally when the carousel is already at its horizontal edges
      return;
    }

    e.preventDefault();
    const multiplier = 1.0;
    el.scrollLeft += e.deltaY * multiplier;
  };

  const prev = () => {
    if (!scrollRef.current || !cardRef.current) return;
    const cardWidth = cardRef.current.offsetWidth + 12;
    scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const next = () => {
    if (!scrollRef.current || !cardRef.current) return;
    const cardWidth = cardRef.current.offsetWidth + 12;
    scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  return (
    <motion.div style={{ y: cardY }}>
      <div className="relative">
        <button
          aria-label="Previous"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 border border-[#151515]/10 shadow-sm flex items-center justify-center hover:bg-white"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 border border-[#151515]/10 shadow-sm flex items-center justify-center hover:bg-white"
        >
          ›
        </button>
        <div
        ref={scrollRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex cursor-grab gap-3 overflow-x-auto scrollbar-hide select-none snap-x snap-mandatory pb-4 active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {steps.map(([number, title, text]) => (
          <motion.div
            key={number}
            ref={cardRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: smoothSpring }}
            whileHover={{ scale: 1.02 }}
            className="min-w-[280px] snap-start md:min-w-[320px]"
          >
            <PaperCard className="h-full p-5">
              <span className="font-mono text-xs text-[#151515]/35">{number}</span>
              <h3 className="mt-3 font-serif text-3xl leading-none">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#151515]/65">{text}</p>
            </PaperCard>
          </motion.div>
        ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === active ? "w-8 bg-[#2454E8]" : "w-2 bg-[#151515]/20"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function JimmyChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const buttonX = useTransform(scrollYProgress, [0, 0.5], [0, 12]);
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jimmy-chat-history")) || [{ role: "assistant", content: "I help with fit, packages, process, and next steps. Keep questions short and on-topic." }];
    } catch {
      return [{ role: "assistant", content: "I help with fit, packages, process, and next steps. Keep questions short and on-topic." }];
    }
  });
  const messageListRef = useRef(null);
  const sendingRef = useRef(false);
  const inputRef = useRef("");
  const requestBudgetRef = useRef({ count: 0, resetAt: Date.now() });

  useEffect(() => { inputRef.current = input; }, [input]);

  useEffect(() => {
    localStorage.setItem("jimmy-chat-history", JSON.stringify(messages.slice(-16)));
    const element = messageListRef.current;
    if (!element) return;
    requestAnimationFrame(() => {
      element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    });
  }, [messages]);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("open-jimmy", openChat);
    return () => window.removeEventListener("open-jimmy", openChat);
  }, []);

  const newChat = () => {
    setMessages([{ role: "assistant", content: "I help with fit, packages, process, and next steps. Keep questions short and on-topic." }]);
    localStorage.removeItem("jimmy-chat-history");
    requestBudgetRef.current = { count: 0, resetAt: Date.now() };
  };

  const MAX_INPUT_LENGTH = 220;
  const MAX_CHAT_TURNS = 8;
  const MAX_REQUESTS_PER_MINUTE = 6;
  const BLOCKED_REQUEST_PATTERNS = [
    /ignore previous instructions/i,
    /system prompt/i,
    /jailbreak/i,
    /developer mode/i,
    /bypass|unlock|crack|hack|exploit|scam|steal|phish|malware|ddos/i,
    /prompt injection/i,
    /reveal your (instructions|system|prompt)/i,
  ];

  const checkRequestBudget = () => {
    const now = Date.now();
    const budget = requestBudgetRef.current;
    if (now - budget.resetAt > 60000) {
      budget.count = 0;
      budget.resetAt = now;
    }
    if (budget.count >= MAX_REQUESTS_PER_MINUTE) return false;
    budget.count += 1;
    return true;
  };

  const sanitizeInput = (rawText) => {
    const text = rawText.trim();
    if (!text) return { ok: false, message: "Please ask a real question about fit, pricing, or process." };
    if (text.length > MAX_INPUT_LENGTH) return { ok: false, message: "Please keep it short and focused." };
    const lower = text.toLowerCase();
    if (BLOCKED_REQUEST_PATTERNS.some((pattern) => pattern.test(lower))) {
      return { ok: false, message: "I can help with Creative Scaling, not jailbreaks, hacking, scams, or bypassing limits." };
    }
    return { ok: true, text };
  };

  const formatMessageContent = (content) => {
    const renderInline = (text) => {
      return text.split(/(\*\*[^*]+\*\*)/g).map((segment, index) => {
        const match = segment.match(/^\*\*([^*]+)\*\*$/);
        if (match) {
          return (
            <strong key={index} className="font-semibold text-[#151515]">
              {match[1]}
            </strong>
          );
        }
        return segment;
      });
    };

    const lines = content.split(/\r?\n/);
    const nodes = [];
    let currentList = [];

    const flushList = () => {
      if (!currentList.length) return;
      nodes.push(
        <ul key={`list-${nodes.length}`} className="mt-2 ml-4 list-disc space-y-1 text-sm text-[#151515]/75">
          {currentList.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    };

    lines.forEach((line, index) => {
      if (line.trim().startsWith("- ")) {
        currentList.push(line.trim().slice(2));
      } else {
        flushList();
        nodes.push(
          <p key={`line-${index}`} className="mt-2 text-sm leading-6 text-[#151515]/75">
            {renderInline(line)}
          </p>
        );
      }
    });

    flushList();
    return nodes;
  };

  const localResponses = [
    { keywords: ["hi", "hello", "hey", "yo", "sup"], response: "Hey. What brand do you run and what is your monthly revenue?" },
    {
      keywords: ["pricing", "price", "cost", "package", "starter", "growth", "scale", "how much"],
      response: "Depends on your monthly revenue and creative needs:\n- **Starter ($2k/mo):** 8-12 assets, basic strategy, 1 feedback round. Best for testing structure.\n- **Growth ($5k/mo):** 15-20 assets, deeper strategy, weekly sprints, performance reviews.\n- **Scale ($8k/mo):** 25+ assets, full feedback flow, priority delivery, dedicated strategy lead.\nIf you're doing $30k+/month with real demand, Growth or Scale is likely the right fit. Want to confirm? Complete the Strategy Review application.",
    },
    { keywords: ["fit", "qualify", "eligible", "right for", "good fit"], response: "Best fit is Shopify brands doing $30k+/month with product demand. Do you meet that threshold?" },
    { keywords: ["shopify", "store", "brand", "ecom", "ecommerce"], response: "Good. What is your monthly revenue range and who currently handles your creative?" },
    { keywords: ["book", "apply", "application", "strategy review", "call", "meeting"], response: "Complete the Strategy Review application on this page. If you are a fit, the booking calendar will appear." },
    { keywords: ["thank", "thanks", "appreciate"], response: "Happy to help. Apply above when you are ready to start." },
    { keywords: ["creative", "output", "asset", "content", "deliverable"], response: "We deliver Performance Statics and Video Creatives weekly. Each sprint includes hooks, concepts, production, delivery notes, and a review." },
    { keywords: ["hero", "altar", "case", "proof", "result", "example"], response: "HER ALTAR was our testing ground: 700K+ organic views and 7K+ followers in about 10 days. A payment issue limited checkout conversion. Results are not a guarantee." },
    { keywords: ["media buyer", "ads", "ad spend", "facebook", "meta", "tiktok", "google", "paid"], response: "We do not run media buying. We deliver the creative and strategy. Your media buyer or internal team runs the campaigns." },
    { keywords: ["organic", "reels", "shorts"], response: "We support organic content too. Short-form for TikTok, Reels, and Shorts. Hooks, concepts, and delivery are structured the same way." },
  ];

  const findLocalResponse = (input) => {
    const lower = input.toLowerCase();
    for (const item of localResponses) {
      if (item.keywords.some((k) => lower.includes(k))) return item.response;
    }
    return null;
  };

  const sendMessage = async (suggestedText, forceServer = false) => {
    const text = (suggestedText || inputRef.current).trim();
    if (!text || sendingRef.current) return;

    const sanitized = sanitizeInput(text);
    if (!sanitized.ok) {
      setMessages((prev) => [...prev, { role: "assistant", content: sanitized.message }]);
      setInput("");
      return;
    }

    if (!checkRequestBudget()) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I am in strict mode right now. Please wait a moment before sending another question." }]);
      setInput("");
      return;
    }

    const userMessage = { role: "user", content: sanitized.text };
    const nextMessages = [...messages, userMessage];
    if (nextMessages.filter((message) => message.role === "user").length > MAX_CHAT_TURNS) {
      setMessages([{ role: "assistant", content: "This conversation is getting long, so I am starting a fresh thread with the next question." }]);
      localStorage.removeItem("jimmy-chat-history");
      requestBudgetRef.current = { count: 0, resetAt: Date.now() };
      setInput("");
      return;
    }

    sendingRef.current = true;
    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, userMessage]);

    const localReply = !forceServer ? findLocalResponse(sanitized.text) : null;
    if (localReply) {
      setMessages((prev) => [...prev, { role: "assistant", content: localReply }]);
      setLoading(false);
      sendingRef.current = false;
      return;
    }

    try {
      let memory = {};
      try {
        const raw = localStorage.getItem("creative-scaling-profile");
        if (raw) memory = JSON.parse(raw);
      } catch (_) {
        memory = {};
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);

      const response = await fetch("/api/jimmy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, memory }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        if (contentType.includes("application/json")) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error || `Jimmy AI is not available right now. (${response.status})`);
        }
        const text = await response.text().catch(() => "");
        throw new Error(`Jimmy AI is not available right now. (${response.status})`);
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Jimmy AI returned an unexpected response. Try again in a moment.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Jimmy AI did not return a valid reply. Try again." }]);
    } catch (error) {
      if (error.name === "AbortError") {
        setMessages((prev) => [...prev, { role: "assistant", content: "Jimmy AI is taking too long. Please try again in a moment." }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: error.message || "Something went wrong. Try again." }]);
      }
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        style={{ x: buttonX }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-[#F8F1E6] px-5 py-3 text-sm font-bold text-[#151515] shadow-[0_18px_45px_rgba(21,21,21,0.18)] transition-colors hover:-translate-y-1"
      >
        <MessageCircle className="h-4 w-4 text-[#2454E8]" />
        Ask Jimmy
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#151515]/10 px-4 py-5"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.28 }}
              className="ml-auto flex h-full max-h-[760px] w-full max-w-[460px] flex-col overflow-hidden rounded-[2rem] bg-[#F8F1E6]/95 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-extrabold tracking-tight">Jimmy AI</p>
                  <p className="text-xs text-[#151515]/55">Creative Scaling fit assistant</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={newChat} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/60 transition hover:bg-white" title="New conversation">
                    <Plus className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-2xl bg-white/60">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div ref={messageListRef} className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "ml-auto bg-[#2454E8] text-white"
                        : "bg-[#F3EBDD] text-[#151515]/75"
                    }`}
                  >
                    {message.role === "assistant" ? formatMessageContent(message.content) : message.content}
                  </div>
                ))}
                {!loading && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-[#151515]/35">
                    <span className="h-1 w-1 rounded-full bg-[#151515]/30" />
                    Type your reply...
                  </div>
                )}
                {loading && (
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-[#F3EBDD] px-4 py-3 text-sm font-bold text-[#151515]/75">
                    <span className="loading-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                    replying...
                  </div>
                )}
              </div>

              <div className="p-4 pt-0">
                <div className="flex flex-wrap gap-2 pb-3">
                  {["Do you support paid and organic?", "Which package is right?", "What happens after I book?"].map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => sendMessage(text, true)}
                      className="rounded-full border border-[#151515]/15 bg-white/80 px-3.5 py-2 text-[11px] font-bold text-[#151515]/70 shadow-sm transition hover:bg-[#2454E8] hover:text-white hover:border-[#2454E8]"
                    >
                      {text}
                    </button>
                  ))}
                </div>
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
                    onClick={() => sendMessage()}
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
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 42);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const playClick = (event) => {
      if (!event.target.closest("button, a")) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = 420;
      gain.gain.setValueAtTime(0.018, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.045);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.05);
    };
    document.addEventListener("click", playClick);
    return () => document.removeEventListener("click", playClick);
  }, []);

  const scrollToSection = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const packageFit = useMemo(() => ["$30k+ / month", "$100k+ / month", "$250k+ / month", "$500k+ / month"], []);
  const typedWords = useMemo(() => ["Shopify", "DTC", "performance", "growth"], []);
  const [typedHeadline, setTypedHeadline] = useState("");

  useEffect(() => {
    let wordIndex = 0;
    let letterIndex = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const currentWord = typedWords[wordIndex];
      if (!deleting) {
        letterIndex += 1;
        setTypedHeadline(currentWord.slice(0, letterIndex));
        if (letterIndex === currentWord.length) {
          deleting = true;
          timeoutId = window.setTimeout(tick, 1500);
          return;
        }
      } else {
        letterIndex -= 1;
        setTypedHeadline(currentWord.slice(0, letterIndex));
        if (letterIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % typedWords.length;
          timeoutId = window.setTimeout(tick, 600);
          return;
        }
      }
      timeoutId = window.setTimeout(tick, deleting ? 80 : 120);
    };

    timeoutId = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timeoutId);
  }, []);

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

      <motion.div className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-[#2454E8]" style={{ scaleX: scrollYProgress }} />
      <header className={`fixed left-0 top-0 z-50 w-full px-4 pointer-events-none transition-all duration-700 md:px-8 ${isScrolled ? "py-3" : "py-6"}`}>
        <div className={`nav-glass pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] px-4 py-3 transition-all duration-700 md:px-8 ${isScrolled ? "border border-[#151515]/10 bg-[#F8F1E6]/82 shadow-[0_32px_64px_-18px_rgba(21,21,21,0.25)] backdrop-blur-2xl" : "border border-transparent bg-transparent"}`}>
          <button onClick={() => scrollToSection("#top")} className="group flex items-center gap-3 text-left">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#151515]/15 bg-[#F8F1E6] shadow-sm transition group-hover:border-[#2454E8]/45">
              <img src={brandLogo} alt="Creative Scaling" className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 object-contain" />
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
            <BlueButton href="/#apply" className="px-4 py-2.5">Book a Strategy Review</BlueButton>
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
                <a
                  href="/#apply"
                  className="mt-2 inline-flex rounded-2xl bg-[#151515] px-4 py-4 text-center text-[11px] font-black text-white transition hover:bg-[#333]"
                >
                  Book a Strategy Review
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="top" className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-18 pt-28 md:grid-cols-[1fr_0.9fr] md:px-8 md:pb-24 md:pt-32">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7, ease: smoothSpring }} className="flex flex-col justify-center">
          <Label>Performance Creative Systems</Label>
          <h1 className="hero-title mt-7 max-w-4xl font-serif text-[3.6rem] font-bold leading-[0.9] text-[#151515] sm:text-[5rem] md:text-[6.8rem] lg:text-[7.6rem]">
            Build a creative engine for <AccentText>{typedHeadline}<span className="typed-cursor">|</span></AccentText>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#151515]/72 md:text-xl">
            We help Shopify brands launch performance statics, video creatives, and testing systems so they can test faster, learn faster, and stop running out of winning creatives.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BlueButton href="/#apply">Book a Strategy Review</BlueButton>
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
              Most brands do not have a media buying problem. They have a <AccentText><TypewriterText text="creative system" speed={40} delay={500} /></AccentText> problem.
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
            Output and learning, not more <AccentText><TypewriterText text="random content" speed={40} delay={800} /></AccentText>.
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
                HER ALTAR was the <TypewriterText text="testing ground" speed={40} delay={600} />.
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

      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-[0.85fr_1.15fr] md:px-8 md:items-center">
        <div>
          <Label>Founder-led</Label>
          <h2 className="mt-6 font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">Why I built Creative Scaling.</h2>
        </div>
        <PaperCard>
          <p className="text-lg leading-8 text-[#151515]/72">I built Creative Scaling after building my own Shopify brand from the ground up. I saw how hard it was to create content that fit the brand, explained the product, tested the right hooks, and supported both organic growth and paid acquisition.</p>
          <p className="mt-5 text-lg leading-8 text-[#151515]/72">So instead of only making videos, I built a full creative system: research, hooks, concepts, scripts, production, Creative Delivery, feedback, and Performance Review.</p>
          <span className="mt-6 inline-flex rounded-full bg-[#87916F]/20 px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#526044]">A Growth Partner, not random one-off content</span>
        </PaperCard>
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
        <div className="mt-8">
          <ProcessCarousel steps={processSteps} />
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

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><Label>Creative support</Label><h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">Services built around creative output and learning.</h2></div>
          <p className="max-w-md text-base leading-7 text-[#151515]/65">Each service connects to a testing cycle, not a disconnected asset request.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Organic Creative", "TikTok, Reels, Shorts, product content, founder direction, and hook testing."],
            ["Paid Creative", "Meta and TikTok ads, UGC-style video, statics, product demos, and offer creatives."],
            ["Creative Strategy", "Competitor research, hook library, angle development, roadmap, and product priorities."],
            ["Creative Systems", "Weekly sprints, delivery folders, feedback flow, Performance Reviews, and planning."],
          ].map(([title, text], index) => <PaperCard key={title} className="reveal-card"><span className="font-mono text-xs font-bold text-[#87916F]">0{index + 1}</span><h3 className="mt-8 font-serif text-3xl leading-none">{title}</h3><p className="mt-4 text-sm leading-7 text-[#151515]/65">{text}</p></PaperCard>)}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10">
          <Label>Packages</Label>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
            Starting prices that <TypewriterText text="set clear expectations" speed={35} delay={700} />.
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
        <p className="mt-6 max-w-3xl text-sm leading-7 text-[#151515]/62">Every package is customized around volume, cadence, support needs, and the current creative bottleneck. You are paying for strategy, research, hooks, production, delivery, feedback, and iteration—not random images or videos.</p>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10"><Label>Inside the system</Label><h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">What you receive inside the system.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#151515]/70">A clean operating system for connecting research, hooks, production, delivery, feedback, and performance learning.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{operatingItems.map((item, index) => <motion.div key={item} whileHover={{ y: -5 }} className="flex items-center gap-4 rounded-2xl border border-[#151515]/15 bg-[#F8F1E6]/80 p-5 shadow-sm"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#2454E8] font-mono text-xs font-bold text-white">{String(index + 1).padStart(2, "0")}</span><p className="font-bold text-[#151515]/78">{item}</p></motion.div>)}</div>
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

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10"><Label>After your Strategy Review</Label><h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">You will always know what happens next.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#151515]/70">From discovery to the next sprint, the process is clear: where files live, how feedback works, and what we are making next.</p></div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{afterBookingSteps.map(([number, title, text]) => <PaperCard key={title} className="p-5"><span className="font-mono text-xs font-bold text-[#87916F]">{number}</span><h3 className="mt-4 font-serif text-2xl leading-none">{title}</h3><p className="mt-3 text-sm leading-6 text-[#151515]/65">{text}</p></PaperCard>)}</div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <PaperCard className="grid gap-8 p-7 md:grid-cols-[1fr_0.82fr] md:p-10">
          <div><Label>Ask Jimmy</Label><h2 className="mt-6 font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">Ask Jimmy about Creative Scaling.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-[#151515]/70">Jimmy gives direct, qualified answers about the offer, packages, onboarding, pricing, creative process, and whether this is a fit for your brand.</p></div>
          <div className="rounded-[1.5rem] border border-[#151515]/15 bg-[#F3EBDD] p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#151515] text-white"><Bot className="h-5 w-5" /></div><div><p className="font-bold">Jimmy AI</p><p className="text-xs text-[#151515]/55">Short, structured, content-aware answers</p></div></div><div className="mt-5 space-y-2">{["Which package is right for my brand?", "What happens after I book?", "Why does Creative Scaling cost more?"].map((question) => <p key={question} className="rounded-xl bg-white/65 p-3 text-sm font-semibold text-[#151515]/70">{question}</p>)}</div><button type="button" onClick={() => window.dispatchEvent(new Event("open-jimmy"))} className="mt-5 text-sm font-black text-[#2454E8]">Open Jimmy →</button></div>
        </PaperCard>
      </section>

      <section id="faq" className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10">
          <Label>FAQ</Label>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] md:text-7xl">
            <TypewriterText text="Clear answers" speed={40} delay={800} /> before the call.
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
          <BlueButton href="/#apply">Start Application</BlueButton>
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
              <button key={link.href} onClick={() => scrollToSection(link.href)} className="hover:text-[#2454E8]">{link.label}</button>
            ))}
          </div>
        </div>
      </footer>

      <JimmyChat />
    </main>
  );
}
