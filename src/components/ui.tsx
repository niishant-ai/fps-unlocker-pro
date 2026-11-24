import React, { useId } from "react";
import { cn } from "../utils/cn";
import { PLAY_URL, TELEGRAM_URL } from "../data";
import { useTheme } from "../theme";

/* ------------------------------ icons ------------------------------ */
const paths: Record<string, React.ReactNode> = {
  gauge: (
    <>
      <path d="M12 3a9 9 0 0 1 9 9c0 2.4-.94 4.6-2.5 6.2" />
      <path d="M12 3a9 9 0 0 0-9 9c0 2.4.94 4.6 2.5 6.2" />
      <path d="M12 13.5 16.5 8" />
      <circle cx="12" cy="14" r="1.8" fill="currentColor" stroke="none" />
      <path d="M5.5 12H7M12 5.5V7M18.5 12H17" />
    </>
  ),
  bolt: <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />,
  expand: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 12h8M8 12l2.2-2.2M8 12l2.2 2.2M16 12l-2.2-2.2M16 12l-2.2 2.2" />
    </>
  ),
  zoomIn: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8M11 8v6M8 11h6" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8M8 11h6" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h13M20 17h0" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="19" cy="17" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8 7.5 10 4.3-2 7.5-5.4 7.5-10v-6L12 2.5Z" />
      <path d="m8.8 11.8 2.3 2.3 4.2-4.6" />
    </>
  ),
  slide: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="4" />
      <circle cx="7.5" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <path d="m13.5 9.5 2.5 2.5-2.5 2.5M17 9.5l2.5 2.5L17 14.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v11M12 14l-4-4M12 14l4-4" />
      <path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  telegram: (
    <>
      <path d="M21.2 4.6 2.8 11.7c-1 .4-.9 1.7.1 2l4.7 1.5 1.8 5.4c.3.9 1.4 1.1 2 .4l2.7-2.8 4.9 3.6c.8.6 1.9.1 2.1-.9l2.4-14.6c.2-1.1-.9-2-2.3-1.7Z" />
      <path d="M7.6 15.2 17.5 8.5" />
    </>
  ),
  star: <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8L12 2.8Z" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  menu: <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h11" />,
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M5.5 15.5h-1a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  reset: (
    <>
      <path d="M4 5v5h5" />
      <path d="M4.5 10a8 8 0 1 1 1.6 6" />
    </>
  ),
  gamepad: (
    <>
      <path d="M6.5 7h11a4.5 4.5 0 0 1 4.4 5.4l-.8 4A3 3 0 0 1 16 18.2L14.5 16h-5L8 18.2a3 3 0 0 1-5.1-1.8l-.8-4A4.5 4.5 0 0 1 6.5 7Z" />
      <path d="M8 10.5v3M6.5 12h3" />
      <circle cx="15.5" cy="11" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
    </>
  ),
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 5h3" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3.5 12.5 8.5 4.7 8.5-4.7M3.5 16.5 12 21.2l8.5-4.7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.6a3.5 3.5 0 0 1 0 5.8M17.8 14.6a6.5 6.5 0 0 1 3.7 5.4" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M19 14v5.5A1.5 1.5 0 0 1 17.5 21h-13A1.5 1.5 0 0 1 3 19.5v-13A1.5 1.5 0 0 1 4.5 5H10" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17.5H6.5A2.5 2.5 0 0 0 4 22V4.5Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M12.5 15H17" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </>
  ),
  moon: (
    <path d="M20.2 14.8A8.5 8.5 0 0 1 9.2 3.8a8.5 8.5 0 1 0 11 11Z" />
  ),
};

export function Icon({ name, className, strokeWidth = 1.7 }: { name: string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)} aria-hidden="true">
      {paths[name] ?? paths.gauge}
    </svg>
  );
}

export function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6 shrink-0", className)} aria-hidden="true">
      <path d="M4.3 2.4 13.6 12 4.3 21.6c-.4-.25-.65-.7-.65-1.25V3.65c0-.55.25-1 .65-1.25Z" fill="#4d9bff" />
      <path d="m13.6 12 2.9-3 3.9 2.2c.9.5.9 1.1 0 1.6l-3.9 2.2-2.9-3Z" fill="#ffd60a" />
      <path d="M13.6 12 4.3 2.4c.15-.1.5-.25 1.05.05l11.15 6.55-2.9 3Z" fill="#1de98a" />
      <path d="m13.6 12 2.9 3-11.15 6.55c-.55.3-.9.15-1.05.05L13.6 12Z" fill="#ff3b4e" />
    </svg>
  );
}

/* ------------------------------ reveal ------------------------------ */
let sharedRevealIO: IntersectionObserver | null = null;
function getRevealIO() {
  if (!sharedRevealIO) {
    sharedRevealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            sharedRevealIO!.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
  }
  return sharedRevealIO;
}

export function Reveal({ children, className, delay = 0, variant = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; delay?: number; variant?: "" | "left" | "right" | "scale"; as?: any }) {
  const ref = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = getRevealIO();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return (
    <Tag ref={ref} className={cn("reveal min-w-0", variant && `reveal-${variant}`, className)} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}

/* --------------------------- section header --------------------------- */
export function SectionHead({ index, kicker, title, sub, align = "left" }: { index: string; kicker: string; title: React.ReactNode; sub?: string; align?: "center" | "left" }) {
  return (
    <div className={cn("mb-10 sm:mb-12 md:mb-16", align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl")}>
      <Reveal>
        <div className={cn("mb-4 flex items-center gap-3 sm:mb-5", align === "center" && "justify-center")}>
          <span className="chip-mono text-neon">{index}</span>
          <span className="h-px w-10 bg-neon/60 sm:w-12" />
          <span className="chip-mono text-fog">{kicker}</span>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-display text-[clamp(1.85rem,4.6vw,3.4rem)] font-bold uppercase leading-[1.04] tracking-tight text-snow">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={160}>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-fog sm:mt-5 sm:text-[15px]">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------ buttons ------------------------------ */
export function ThemeToggle({
  variant = "segmented",
  showLabels = false,
  className,
}: {
  variant?: "segmented" | "compact";
  showLabels?: boolean;
  className?: string;
}) {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === "compact") {
    const isLight = theme === "light";
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
        title={isLight ? "Switch to dark theme" : "Switch to light theme"}
        className={cn(
          "btn-ghost flex h-10 w-10 items-center justify-center rounded-full text-snow sm:h-11 sm:w-11",
          className
        )}
      >
        <Icon name={isLight ? "moon" : "sun"} className="h-[18px] w-[18px] text-neon" />
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={cn(
        "inline-flex items-center rounded-full border border-edge bg-abyss p-1",
        className
      )}
    >
      {(
        [
          ["dark", "moon", "Dark"],
          ["light", "sun", "Light"],
        ] as const
      ).map(([mode, iconName, label]) => {
        const active = theme === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setTheme(mode)}
            aria-pressed={active}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200",
              showLabels ? "h-8 px-3" : "h-8 w-8",
              active
                ? "bg-carbon text-neon shadow-[0_1px_3px_rgba(13,21,32,0.16)] ring-1 ring-edge"
                : "text-fog hover:text-snow"
            )}
          >
            <Icon name={iconName} className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} />
            {showLabels && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function PlayButton({ className, label = "Get it on", sub = "Google Play", small = false }: { className?: string; label?: string; sub?: string; small?: boolean }) {
  return (
    <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className={cn("btn-primary group inline-flex items-center gap-2.5 rounded-full font-display sm:gap-3", small ? "px-4 py-2.5" : "px-5 py-3 sm:px-6 sm:py-3.5", className)} aria-label="Download FPS Unlocker Pro on Google Play">
      <PlayLogo className={small ? "h-5 w-5" : "h-6 w-6 sm:h-7 sm:w-7"} />
      <span className="text-left leading-none">
        <span className={cn("block font-body font-medium uppercase tracking-[0.14em] opacity-85", small ? "text-[8.5px]" : "text-[9.5px] sm:text-[10px]")}>{label}</span>
        <span className={cn("block font-bold", small ? "text-sm" : "text-base sm:text-lg")}>{sub}</span>
      </span>
    </a>
  );
}

export function TelegramButton({ className, label = "Join Telegram", small = false }: { className?: string; label?: string; small?: boolean }) {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "btn-ghost inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold uppercase tracking-wider text-snow",
        small ? "px-4 py-2.5 text-xs" : "px-5 py-3 text-xs sm:px-6 sm:py-3.5 sm:text-sm",
        className
      )}
    >
      <Icon name="telegram" className="h-4 w-4 shrink-0 text-cyan2" />
      <span>{label}</span>
    </a>
  );
}

export function GhostButton({ href, children, className, onClick }: { href?: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  const cls = cn("btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider text-snow sm:text-sm", className);
  if (href) return <a href={href} className={cls} onClick={onClick}>{children}</a>;
  return <button type="button" className={cls} onClick={onClick}>{children}</button>;
}

/* ---------------------------- phone frame ---------------------------- */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("phone-shell relative rounded-[2.2rem] p-[7px] sm:rounded-[2.4rem] sm:p-[9px]", className)}>
      <span className="phone-hw-btn absolute -right-[2.5px] top-20 h-12 w-[3px] rounded-full sm:top-24 sm:h-14" />
      <span className="phone-hw-btn absolute -right-[2.5px] top-36 h-8 w-[3px] rounded-full sm:top-44 sm:h-9" />
      <span className="phone-hw-btn absolute -left-[2.5px] top-24 h-9 w-[3px] rounded-full sm:top-28 sm:h-10" />
      <div className="relative overflow-hidden rounded-[1.8rem] bg-black sm:rounded-[1.95rem]">
        {children}
        <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      </div>
    </div>
  );
}

export function Stars({ value = 4.1, className }: { value?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
          <defs>
            <linearGradient id={`st-${uid}-${i}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset={`${Math.max(0, Math.min(1, value - i + 1)) * 100}%`} stopColor="var(--color-star-fill)" />
              <stop offset={`${Math.max(0, Math.min(1, value - i + 1)) * 100}%`} stopColor="var(--color-star-empty)" />
            </linearGradient>
          </defs>
          <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8L12 2.8Z" fill={`url(#st-${uid}-${i})`} />
        </svg>
      ))}
    </span>
  );
}
