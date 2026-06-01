import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Brush,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  MousePointerClick,
  PenLine,
  Rocket,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import "./styles.css";

const socialLinks = [
  { label: "Instagram", note: "@omeradl.ai", href: "https://instagram.com/omeradl.ai", icon: Instagram },
  { label: "LinkedIn", note: "Omar Adel", href: "https://www.linkedin.com/in/omar-adel-754072337/", icon: Linkedin },
  { label: "Visualfram", note: "AI workspace", href: "https://visualfram.com", icon: Globe2 },
  { label: "Spaceleads.co", note: "$1k to $7k case", href: "https://spaceleads.co", icon: ArrowUpRight },
  { label: "Heraltar.shop", note: "24h AI brand", href: "https://heraltar.shop", icon: ArrowUpRight },
  { label: "SingleRepair", note: "18h first sale", href: "#singlerepair", icon: Sparkles },
  { label: "Email", note: "business", href: "mailto:omarabokhesham@gmail.com", icon: Mail },
];

const proofStats = [
  ["40+", "brands supported", "AI visuals, sites, strategy, systems"],
  ["$1k to $7k", "net/month growth case", "spaceleads.co"],
  ["24h", "AI brand built A-Z", "heraltar.shop"],
  ["18h", "first sale system", "SingleRepair"],
  ["Full-stack", "Visualfram built solo", "visualfram.com"],
];

const services = [
  [Workflow, "AI Automations", "Lead flows, intake forms, reporting, client workflows, dashboards, and one-click actions that remove repetitive work."],
  [Brush, "AI Visual Systems", "Brand-matched visual workflows, prompt systems, campaign direction, production pipelines, and training for creative teams."],
  [Bot, "AI Chatbots", "Website, support, sales, and internal assistants built around your real offer, customer questions, and brand voice."],
  [Globe2, "Websites & Conversion", "Offer clarity, page structure, UX flow, ecommerce trust, and conversion-focused site improvements."],
  [PenLine, "Team Training", "Practical training for founders, marketers, designers, editors, and sales teams who want AI in daily work."],
  [Rocket, "Growth Experiments", "Fast tests for landing pages, content angles, funnels, stores, creator campaigns, and AI-powered launches."],
];

const cases = [
  ["01", "Website / Strategy / AI Systems", "Spaceleads.co", "Improved website structure, positioning, marketing flow, strategy, and AI-backed systems.", "From around $1k/month to around $7k net/month within 2-3 months.", "https://spaceleads.co"],
  ["02", "AI Workspace / Product", "Visualfram.com", "Built an AI creative platform from frontend to backend, including generation flows, workspace systems, project logic, and agency workflows.", "Used by creative teams and agencies, with custom workflow requests.", "https://visualfram.com"],
  ["03", "AI Ecommerce / 24h Brand", "Heraltar.shop", "Built an AI-led ecommerce brand and store test in 24 hours from brand direction to visuals, site flow, offer structure, and launch assets.", "Now focused on turning the test into more sustainable growth.", "https://heraltar.shop"],
  ["04", "SingleRepair / Creator Growth", "SingleRepair", "Built and launched product info, AI-led marketing structure, and content system from idea to first sale in under 18 hours.", "100+ creators collaborated with the product ecosystem.", "#singlerepair"],
];

const formOptions = [
  "AI automations",
  "AI visuals",
  "AI chatbot",
  "Website / conversion",
  "Team training",
  "Custom AI tool",
  "SingleRepair collab",
  "Visualfram",
  "Not sure yet",
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function PageNumber({ children }) {
  return (
    <div className="eyebrow">
      <span>{children}</span>
      <span />
    </div>
  );
}

function Button({ children, href = "#", variant = "primary" }) {
  return (
    <a className={`button ${variant}`} href={href}>
      {children}
      {variant === "primary" ? <ArrowUpRight size={17} /> : <ChevronRight size={17} />}
    </a>
  );
}

function PaperCard({ children, className = "" }) {
  return <div className={`paper-card ${className}`}>{children}</div>;
}

function FounderCollage() {
  return (
    <div className="founder-collage" aria-label="AI systems collage">
      <div className="tape tape-one" />
      <div className="crosshair" />
      <motion.div
        className="portrait-card"
        initial={{ rotate: 4, y: 16, opacity: 0 }}
        animate={{ rotate: -2, y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      >
        <div className="portrait-visual">
          <div className="avatar">OA</div>
          <p>Founder / Builder</p>
          <strong>AI systems</strong>
        </div>
      </motion.div>
      <motion.div
        className="note-card"
        initial={{ x: 30, y: 30, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
      >
        <span>system note</span>
        <p>AI should feel human, useful, and fast.</p>
      </motion.div>
      <div className="badge-round">
        <ArrowUpRight size={26} />
      </div>
      <div className="creator-badge">40+ brands</div>
    </div>
  );
}

function PromptCard() {
  const rows = [
    ["Goal", "what I want the business to fix"],
    ["Audience", "who I want to attract"],
    ["Current workflow", "site, content, team, tools"],
  ];

  return (
    <PaperCard className="prompt-card">
      <div className="prompt-top">
        <div className="prompt-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <strong>ChatGPT</strong>
          <span>Fix with AI</span>
        </div>
      </div>
      <h3>Audit my brand like a sharp AI systems strategist.</h3>
      {rows.map(([label, text]) => (
        <div className="prompt-row" key={label}>
          <b>{label}:</b>
          <span>[ {text} ]</span>
        </div>
      ))}
      <div className="prompt-list">
        <b>Tell me:</b>
        {["what is AI slop in the brand now", "what looks strong", "what feels unclear or weak", "what should be automated first", "a simple improvement plan"].map((item, index) => (
          <p key={item}>
            <span>{index + 1}</span>
            {item}
          </p>
        ))}
      </div>
    </PaperCard>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(formOptions[0]);

  const mailto = useMemo(() => {
    const subject = encodeURIComponent("AI audit request");
    const body = encodeURIComponent(`Hey Omar,\n\nI want help with: ${selectedNeed}\n\nBrand / company:\nWebsite or Instagram:\nMain problem:\nBudget range:\n\n`);
    return `mailto:omarabokhesham@gmail.com?subject=${subject}&body=${body}`;
  }, [selectedNeed]);

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header">
        <a className="brand" href="#top">
          <span>O</span>
          <div>
            <strong>Omar Adel</strong>
            <small>AI systems for brands</small>
          </div>
        </a>
        <nav className="desktop-nav">
          <a href="#services">Services</a>
          <a href="#visualfram">Visualfram</a>
          <a href="#cases">Cases</a>
          <a href="#contact">Contact</a>
        </nav>
        <Button href="#contact">Start audit</Button>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav className="mobile-nav">
            {["services", "visualfram", "cases", "contact"].map((item) => (
              <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section id="top" className="hero section-grid">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
          <PageNumber>01 / AI SYSTEMS</PageNumber>
          <h1>I make AI <em>useful</em> for brands.</h1>
          <p>Automations, AI visuals, chatbots, websites, growth systems, and team training built into your real workflow.</p>
          <div className="button-row">
            <Button href="#contact">Start with an AI audit</Button>
            <Button href="https://visualfram.com" variant="outline">Browse Visualfram</Button>
            <Button href="#singlerepair" variant="outline">Work / collab</Button>
          </div>
          <div className="trust-row">
            {["Built Visualfram from scratch", "Supported 40+ brands", "AI systems teams actually use"].map((item) => (
              <div key={item}>
                <CheckCircle2 size={17} />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
        <FounderCollage />
      </section>

      <section className="links-section">
        <div>
          <PageNumber>02 / LINKS</PageNumber>
          <h2>Find me online</h2>
          <p>No TikTok or X for now. YouTube B2B education channel can be added later.</p>
        </div>
        <div className="link-grid">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a className="link-card" href={link.href} key={link.label}>
                <span>
                  <Icon size={18} />
                  <b>{link.label}</b>
                  <small>{link.note}</small>
                </span>
                <ArrowUpRight size={17} />
              </a>
            );
          })}
        </div>
      </section>

      <section className="stats-grid">
        {proofStats.map(([value, label, domain], index) => (
          <motion.a href="#cases" className="stat-card" key={label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.04 }}>
            <small>0{index + 1}</small>
            <strong>{value}</strong>
            <b>{label}</b>
            <span>{domain}</span>
          </motion.a>
        ))}
      </section>

      <section id="services" className="section">
        <div className="section-heading split">
          <div>
            <PageNumber>03 / WORK</PageNumber>
            <h2>AI systems, not AI <em>slop</em>.</h2>
          </div>
          <p>Most brands are generating random content. I build the workflow behind the content: the site, the offer, the team process, and the automation.</p>
        </div>
        <div className="card-grid">
          {services.map(([Icon, title, text], index) => (
            <motion.article className="service-card" key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.04 }}>
              <div>
                <span className="service-icon"><Icon size={22} /></span>
                <small>0{index + 1}</small>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section section-grid">
        <div>
          <PageNumber>04 / AUDIT</PageNumber>
          <h2>Clarity starts with an honest audit.</h2>
          <p>Send your brand, workflow, website, or content system. I will show what looks strong, what is unclear, what feels like AI slop, and what AI can actually fix first.</p>
          <Button href="#contact">Send your brand</Button>
        </div>
        <div className="stack">
          <PromptCard />
          <PaperCard>
            <h3>Good inputs</h3>
            {["website or store link", "Instagram profile", "current workflow", "team size", "what you want fixed"].map((item) => (
              <p className="note-line" key={item}><CircleDot size={16} />{item}</p>
            ))}
          </PaperCard>
        </div>
      </section>

      <section id="visualfram" className="product-section">
        <div>
          <PageNumber>05 / PRODUCT</PageNumber>
          <h2>Visualfram <em>workspace</em></h2>
          <p>I built Visualfram as an AI workspace for creative teams, brands, and agencies, made to create visuals, organize projects, build campaigns, and move faster.</p>
          <div className="button-row">
            <Button href="https://visualfram.com">Browse Visualfram</Button>
            <Button href="#contact" variant="outline">Request custom system</Button>
          </div>
        </div>
        <div className="product-notes">
          {["Frontend + backend", "AI generation flows", "Agency usage", "White-label style workflows"].map((item, index) => (
            <PaperCard key={item}>
              <small>0{index + 1}</small>
              <h3>{item}</h3>
              <p>Built around real creative production, project logic, and custom workflow requests.</p>
            </PaperCard>
          ))}
        </div>
      </section>

      <section id="cases" className="section">
        <div className="section-heading split">
          <div>
            <PageNumber>06 / CASES</PageNumber>
            <h2>Real systems. Real <em>movement</em>.</h2>
          </div>
          <p>Each card links to the actual domain or section. Add screenshots and deeper proof later to make this even stronger.</p>
        </div>
        <div className="case-grid">
          {cases.map(([number, tag, title, text, result, link], index) => (
            <motion.a className="case-card" href={link} key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.04 }}>
              <span>{number} / {tag}</span>
              <ArrowUpRight size={20} />
              <h3>{title}</h3>
              <p>{text}</p>
              <b>Result: {result}</b>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="statement">
        <h2>Most brands are just making AI slop.</h2>
        <div>
          <p>They test tools, generate random content, and call it innovation.</p>
          <p>AI should become part of the actual business workflow: the website, the team, the content engine, the sales process, the creative direction, and daily operations.</p>
          <strong>Less try-hard. More useful.</strong>
        </div>
      </section>

      <section id="singlerepair" className="section section-grid">
        <div>
          <PageNumber>07 / SINGLEREPAIR</PageNumber>
          <h2>Collaborate with SingleRepair.</h2>
          <p>SingleRepair is a content and growth engine built with AI-led marketing, product info, launch assets, and creator workflows.</p>
          <Button href="#contact">Apply to collaborate</Button>
        </div>
        <PaperCard>
          {["18h from idea to first sale", "100+ creators collaborated with the product ecosystem", "AI-led product info and launch marketing", "Creator and content workflow experiments", "Now scaling the system and optimizing brand workflows"].map((item) => (
            <p className="note-line large" key={item}>
              <MousePointerClick size={20} />
              {item}
            </p>
          ))}
        </PaperCard>
      </section>

      <section id="contact" className="contact-section">
        <div>
          <PageNumber>08 / CONTACT</PageNumber>
          <h2>Tell me what you are building.</h2>
          <p>I will look at your brand, workflow, or idea and show you where AI can actually help.</p>
          <div className="chips">
            {formOptions.slice(0, 5).map((option) => (
              <button className={selectedNeed === option ? "active" : ""} type="button" key={option} onClick={() => setSelectedNeed(option)}>
                {option}
              </button>
            ))}
          </div>
          <p className="email-line">Primary email: <a href="mailto:omarabokhesham@gmail.com">omarabokhesham@gmail.com</a></p>
        </div>
        <form className="contact-form">
          <input placeholder="Name" />
          <input placeholder="Brand / company" />
          <input placeholder="Website or Instagram" />
          <select value={selectedNeed} onChange={(event) => setSelectedNeed(event.target.value)}>
            {formOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <textarea placeholder="Main problem right now" />
          <div>
            <input placeholder="Budget range" />
            <input placeholder="Email / WhatsApp" />
          </div>
          <a className="button primary" href={mailto}>Send my brand <Mail size={17} /></a>
        </form>
      </section>

      <footer>
        <div>
          <strong>Omar Adel</strong>
          <span>AI systems for brands</span>
        </div>
        <a href="#top">Back to top <ArrowUpRight size={16} /></a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
