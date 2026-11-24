import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { NAV_LINKS } from "../data";
import { appMedia } from "../media";
import { useActiveSection, usePlayStoreStats } from "../hooks";
import { Icon, PlayButton, TelegramButton, ThemeToggle } from "./ui";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src={appMedia.icon}
      alt=""
      width={36}
      height={36}
      decoding="async"
      className={cn("h-9 w-9 shrink-0 rounded-xl object-cover shadow-sm", className)}
    />
  );
}

export default function Nav({ route }: { route: string }) {
  const playStats = usePlayStoreStats();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id), route);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [route]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-400", scrolled ? "nav-scrolled" : "bg-transparent")}>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-edge/60">
          <div className="h-full w-full origin-left bg-neon" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8" aria-label="Main">
          <a href="#/" className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3" aria-label="FPS Unlocker Pro — home">
            <BrandMark className="transition-transform duration-500 group-hover:scale-105" />
            <span className="min-w-0 leading-none">
              <span className="block truncate whitespace-nowrap font-display text-[14px] font-bold uppercase tracking-[0.07em] text-snow sm:text-[15px]">
                FPS Unlocker <span className="text-neon">Pro</span>
              </span>
              <span className="chip-mono mt-1 block whitespace-nowrap text-[8px] tracking-[0.14em] text-fog sm:text-[8.5px] sm:tracking-[0.18em]">Extreme performance engine</span>
            </span>
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.id} className="shrink-0">
                <a
                  href={`#${l.id}`}
                  className={cn(
                    "relative whitespace-nowrap rounded-lg px-2.5 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.09em] transition-colors xl:px-3.5 xl:text-[12.5px] xl:tracking-[0.1em]",
                    route === "home" && active === l.id ? "text-neon" : "text-fog hover:text-snow"
                  )}
                >
                  {l.label}
                  <span className={cn("absolute inset-x-2.5 -bottom-px h-px bg-neon transition-opacity xl:inset-x-3", route === "home" && active === l.id ? "opacity-100" : "opacity-0")} />
                </a>
              </li>
            ))}
            <li className="shrink-0">
              <a
                href="#/shizuku"
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-2.5 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.09em] transition-colors xl:px-3.5 xl:text-[12.5px] xl:tracking-[0.1em]",
                  route === "shizuku" ? "text-neon" : "text-fog hover:text-snow"
                )}
              >
                Shizuku guide
                <span className={cn("absolute inset-x-2.5 -bottom-px h-px bg-neon transition-opacity xl:inset-x-3", route === "shizuku" ? "opacity-100" : "opacity-0")} />
              </a>
            </li>
          </ul>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <span className="chip-mono hidden rounded-md border border-gold/30 bg-gold/10 px-2 py-1 text-gold xl:inline-block">v{playStats.version}</span>
            <ThemeToggle variant="segmented" className="hidden sm:inline-flex" />
            <ThemeToggle variant="compact" className="sm:hidden" />
            <PlayButton small className="hidden sm:inline-flex" sub="Google Play" />
            <button
              type="button"
              className="btn-ghost flex h-10 w-10 items-center justify-center rounded-full text-snow sm:h-11 sm:w-11 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile menu */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <div className={cn("absolute inset-0 bg-void/90 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div className={cn("absolute inset-x-3 top-[78px] max-h-[calc(100dvh-92px)] origin-top overflow-y-auto rounded-2xl border border-edge bg-carbon p-4 shadow-lift transition-all duration-400 sm:p-5", open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-[0.98] opacity-0")}>
          <ul className="space-y-1">
            {NAV_LINKS.map((l, i) => (
              <li key={l.id} style={{ transitionDelay: `${i * 35}ms` }} className={cn("transition-all duration-500", open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0")}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={cn("flex items-center justify-between rounded-xl px-4 py-3 font-display text-[15px] font-semibold uppercase tracking-wider transition-colors", route === "home" && active === l.id ? "bg-neon/10 text-neon" : "text-snow hover:bg-abyss")}
                >
                  {l.label}
                  <Icon name="arrow" className="h-4 w-4 opacity-50" />
                </a>
              </li>
            ))}
            <li style={{ transitionDelay: "200ms" }} className={cn("transition-all duration-500", open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0")}>
              <a
                href="#/shizuku"
                onClick={() => setOpen(false)}
                className={cn("flex items-center justify-between rounded-xl px-4 py-3 font-display text-[15px] font-semibold uppercase tracking-wider transition-colors", route === "shizuku" ? "bg-neon/10 text-neon" : "text-snow hover:bg-abyss")}
              >
                Shizuku guide
                <Icon name="book" className="h-4 w-4 opacity-50" />
              </a>
            </li>
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-edge bg-abyss/60 px-3.5 py-2.5">
            <span className="chip-mono text-fog">Appearance</span>
            <ThemeToggle variant="segmented" showLabels />
          </div>
          <div className="mt-4 space-y-2.5 border-t border-edge pt-4">
            <PlayButton className="w-full justify-center" />
            <TelegramButton small className="w-full" />
            <p className="chip-mono pt-1 text-center text-fog">Free · Shizuku · v{playStats.version}</p>
          </div>
        </div>
      </div>
    </>
  );
}
