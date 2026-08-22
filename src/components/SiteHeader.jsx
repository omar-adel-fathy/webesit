import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import brandLogo from "../../ChatGPT Image Jul 23, 2026, 02_16_52 AM.png";

export const navLinks = [
  { label: "Apply", href: "#apply" },
  { label: "Services", href: "#services" },
  { label: "About", href: "/about/" },
  { label: "News", href: "/news/" },
  { label: "Jimmy", href: "/jimmy/" },
  { label: "YouTube", href: "/youtube/" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export default function SiteHeader({
  activeSection = "",
  onNavigate,
  onLogoClick,
  navItems = navLinks,
  ctaLabel = "Apply for Strategy Review",
  ctaHref = "#apply",
  showMobileMenu = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const go = (href) => {
    setMenuOpen(false);
    onNavigate?.(href);
  };

  // The header CTA is on every page, so it is the one apply click that shows
  // where in the site a visitor decided to convert.
  const goCta = (placement) => {
    window.VidWorthTrack?.("apply_cta_clicked", { meta: { location: placement } });
    go(ctaHref);
  };

  return (
    <header className={`fixed left-0 top-0 z-50 w-full px-4 md:px-6 transition-all duration-500 ${isScrolled ? "py-2" : "py-5"}`}>
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 border ${
          isScrolled
            ? "border-[#CBBF9A]/80 bg-[#F8F1E6]/95 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => (onLogoClick ? onLogoClick() : window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="flex items-center gap-3"
        >
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
          {navItems.map(link => (
            <button
              key={link.label}
              onClick={() => go(link.href)}
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
            href={onNavigate ? "#" : ctaHref}
            onClick={e => { e.preventDefault(); goCta("header"); }}
            className="hidden md:inline-flex cool-button text-xs py-2 h-9 px-5"
          >
            {ctaLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          {showMobileMenu && (
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#CBBF9A] bg-white/70 md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-4 right-4 mt-2 rounded-[2rem] border border-[#CBBF9A] bg-[#F8F1E6]/98 p-5 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-3 text-[11px] font-black uppercase tracking-widest font-mono">
              {navItems.map(link => (
                <button
                  key={link.label}
                  onClick={() => go(link.href)}
                  className="text-left py-2 border-b border-[#CBBF9A]/40 text-[#111113]/80 hover:text-[#2454E8]"
                >
                  {link.label}
                </button>
              ))}
              <a
                href={onNavigate ? "#" : ctaHref}
                onClick={e => { e.preventDefault(); goCta("mobile_menu"); }}
                className="mt-2 cool-button w-full text-center text-xs"
              >
                {ctaLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
