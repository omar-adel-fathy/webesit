import brandLogo from "../../ChatGPT Image Jul 23, 2026, 02_16_52 AM.png";
import { navLinks } from "./SiteHeader";

export default function SiteFooter({ onNavigate }) {
  return (
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
                <button key={l.href} onClick={() => onNavigate?.(l.href)} className="text-left hover:text-[#2454E8]">{l.label}</button>
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
  );
}