import { useMemo, useState } from "react";
import { cn } from "../utils/cn";
import { FAQS, TELEGRAM_URL } from "../data";
import { Icon, Reveal, SectionHead } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.map((f, i) => ({ ...f, i })).filter((f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <section id="faq" className="relative overflow-x-clip py-20 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="min-w-0">
            <SectionHead
              align="left"
              index="04"
              kicker="Help & support"
              title={<>Straight <em className="serif-accent">answers</em>.</>}
              sub="Safety, bans, battery, Shizuku — the questions players actually ask, answered honestly."
            />
            <Reveal delay={160}>
              <label className="relative block">
                <span className="sr-only">Search questions</span>
                <Icon name="gauge" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: shizuku, ban, battery…"
                  className="surface-card-soft w-full rounded-full py-3.5 pl-11 pr-4 text-sm text-snow placeholder:text-fog/85 transition-colors focus:border-neon focus:outline-none"
                />
              </label>
            </Reveal>
            <Reveal delay={220}>
              <div className="surface-card mt-6 rounded-2xl p-5 sm:p-6">
                <span className="chip-mono text-gold">Still stuck?</span>
                <p className="mt-2 text-sm leading-relaxed text-fog">Join our Telegram community for quick Shizuku setup help, config updates, and device-specific fixes.</p>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-snow"
                >
                  <Icon name="telegram" className="h-4 w-4 text-cyan2" /> Ask on Telegram
                </a>
              </div>
            </Reveal>
          </div>

          <div className="min-w-0 border-t border-edge">
            {items.length === 0 && (
              <p className="border-b border-edge py-8 text-center text-sm text-fog">
                No match for “{query}”. Try “shizuku”, “fps” or “reset” — or ask on Telegram.
              </p>
            )}
            {items.map((f, idx) => {
              const isOpen = open === f.i;
              return (
                <Reveal key={f.i} delay={Math.min(idx * 45, 260)}>
                  <div className="border-b border-edge">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : f.i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${f.i}`}
                      className="group flex w-full items-center gap-3 py-5 text-left sm:gap-4 sm:py-6"
                    >
                      <span className={cn("tabular-nums shrink-0 font-mono text-[11px] font-bold", isOpen ? "text-neon" : "text-fog")}>{String(f.i + 1).padStart(2, "0")}</span>
                      <span className={cn("min-w-0 flex-1 font-display text-[15px] font-semibold leading-snug transition-colors sm:text-base", isOpen ? "text-neon" : "text-snow group-hover:text-neon")}>{f.q}</span>
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-400", isOpen ? "rotate-180 border-neon bg-neon/15 text-neon" : "border-edge text-fog")}>
                        <Icon name="chevron" className="h-4 w-4" />
                      </span>
                    </button>
                    <div id={`faq-${f.i}`} className={cn("acc-body", isOpen && "open")} role="region">
                      <div className="acc-inner">
                        <p className="max-w-2xl pb-5 pl-0 text-[13.5px] leading-relaxed text-fog sm:pb-6 sm:pl-[2.2rem]">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
