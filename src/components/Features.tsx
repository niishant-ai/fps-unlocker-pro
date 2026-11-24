import { useState } from "react";
import { cn } from "../utils/cn";
import { FEATURES } from "../data";
import { Icon, Reveal, SectionHead } from "./ui";

const accentText: Record<string, string> = { neon: "text-neon", gold: "text-gold", cyan: "text-cyan2" };
const accentBg: Record<string, string> = { neon: "bg-neon/12 text-neon", gold: "bg-gold/12 text-gold", cyan: "bg-cyan2/12 text-cyan2" };

function FpsVisual() {
  const [fps, setFps] = useState(120);
  const opts = [60, 90, 120, 165];
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap gap-2">
        {opts.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFps(f)}
            className={cn(
              "rounded-full border px-3.5 py-2 font-mono text-xs font-semibold transition-all duration-300 sm:px-4",
              fps === f ? "border-neon bg-emerald2 text-neon" : "border-edge bg-carbon text-fog hover:border-neon/40 hover:text-snow"
            )}
          >
            {f} FPS
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-2.5 sm:mt-6">
        {opts.map((f) => (
          <div key={f} className="tabular-nums flex items-center gap-3">
            <span className={cn("w-8 shrink-0 font-mono text-[10px] sm:w-10", f === fps ? "font-semibold text-neon" : "text-fog")}>{f}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-abyss">
              <div
                className={cn("h-full rounded-full transition-all duration-700", f === fps ? "bg-neon" : "bg-edge")}
                style={{ width: `${(f / 165) * 100}%` }}
              />
            </div>
            <span className={cn("w-14 shrink-0 text-right font-mono text-[10px] sm:w-16", f === fps ? "font-semibold text-snow" : "text-fog")}>{(1000 / f).toFixed(1)} ms</span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] leading-relaxed text-fog">Frame interval at each target — availability depends on your device &amp; game version.</p>
    </div>
  );
}

function IpadVisual() {
  const [wide, setWide] = useState(true);
  return (
    <button type="button" onClick={() => setWide((v) => !v)} className="block w-full text-left" aria-label="Toggle iPad view illustration">
      <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-edge bg-abyss">
        <div className={cn("relative border-2 transition-all duration-700", wide ? "h-24 w-32 border-cyan2" : "h-20 w-36 border-fog/40")}>
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan2/15 to-transparent" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-snow" />
          {wide && (
            <>
              <span className="absolute -left-0.5 top-2 h-2 w-2 rounded-full bg-danger" />
              <span className="absolute -right-0.5 bottom-3 h-2 w-2 rounded-full bg-danger" />
            </>
          )}
        </div>
        <span className="chip-mono absolute bottom-2.5 right-3 text-cyan2">{wide ? "iPad 4:3" : "Phone 16:9"}</span>
      </div>
      <span className="mt-2 block font-mono text-[10px] text-fog">Tap to flip aspect — more of the fight fits on screen.</span>
    </button>
  );
}

function BoostVisual() {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
      <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0">
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-edge)" strokeWidth="7" />
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-meter-fill)" strokeWidth="7" strokeLinecap="round" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * 0.27} transform="rotate(-90 40 40)" />
        <text x="40" y="45" textAnchor="middle" fill="var(--color-snow)" fontSize="15" fontWeight="700" fontFamily="Space Grotesk, sans-serif">73%</text>
      </svg>
      <div className="tabular-nums min-w-[160px] flex-1 space-y-1.5 font-mono text-[10px]">
        {[["RAM", "4.1 / 5.6 GB", 73], ["STORAGE", "59% used", 59], ["PING", "35 ms", 30]].map(([l, v, p]) => (
          <div key={l as string}>
            <div className="flex justify-between gap-2 text-fog"><span>{l}</span><span className="text-snow">{v}</span></div>
            <div className="mt-0.5 h-1 rounded-full bg-abyss"><div className="h-full rounded-full bg-gold/85" style={{ width: `${p}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavVisual() {
  const styles = [["Classic", "from-lime-800 to-lime-950"], ["Colorful", "from-amber-500 to-rose-700"], ["Realistic", "from-stone-500 to-stone-800"], ["Soft", "from-teal-400 to-cyan-800"], ["Movie", "from-indigo-500 to-slate-900"]];
  const [sel, setSel] = useState(0);
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-5 gap-1.5">
        {styles.map(([name, g], i) => (
          <button key={name} type="button" onClick={() => setSel(i)} className="group min-w-0" aria-label={`Graphics style ${name}`}>
            <span className={cn("block h-9 rounded-md bg-gradient-to-br transition-all duration-300", g, sel === i ? "ring-2 ring-neon ring-offset-1 ring-offset-carbon" : "opacity-65 group-hover:opacity-95")} />
            <span className={cn("mt-1 block truncate text-center font-mono text-[7.5px]", sel === i ? "font-semibold text-neon" : "text-fog")}>{name}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg border border-edge bg-abyss px-3 py-2 font-mono text-[10px]">
        <span className="text-fog">BRIGHTNESS</span>
        <span className="tabular-nums font-semibold text-neon">{(1 + sel * 0.5).toFixed(1)}</span>
      </div>
    </div>
  );
}

function ShizukuVisual() {
  return (
    <div className="space-y-2 font-mono text-[10.5px]">
      {[
        ["Android 11 – 16", "Shizuku wireless debug", true],
        ["Scoped storage", "handled cleanly", true],
        ["Root access", "never required", false],
      ].map(([a, b, ok]) => (
        <div key={a as string} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-edge bg-abyss px-3 py-2.5">
          <span className="text-fog">{a}</span>
          <span className={cn("flex items-center gap-1.5", ok ? "text-neon" : "text-gold")}>
            <Icon name={ok ? "check" : "shield"} className="h-3 w-3 shrink-0" strokeWidth={2.4} />
            {b}
          </span>
        </div>
      ))}
    </div>
  );
}

function SlideVisual() {
  const [done, setDone] = useState(false);
  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => setDone((v) => !v)}
        className={cn("relative flex h-14 w-full items-center overflow-hidden rounded-full border transition-colors duration-500", done ? "border-neon bg-emerald2" : "border-neon/0 bg-neon")}
        aria-label="Demo apply slider"
      >
        <span className={cn("absolute left-1.5 flex h-11 w-11 items-center justify-center rounded-full transition-[left,background-color] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]", done ? "left-[calc(100%-3.1rem)] bg-neon text-on-neon" : "bg-on-neon text-neon")}>
          <Icon name={done ? "check" : "arrow"} className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <span className={cn("w-full px-14 text-center font-display text-xs font-bold uppercase tracking-[0.16em] transition-colors sm:text-sm sm:tracking-[0.18em]", done ? "text-neon" : "text-on-neon")}>
          {done ? "✓ 120 FPS saved" : "Save 120 FPS"}
        </span>
      </button>
      <p className="mt-2 text-center font-mono text-[10px] text-fog">Apply immediately · Save config · Reset anytime</p>
    </div>
  );
}

export default function Features() {
  const [open, setOpen] = useState(0);

  return (
    <section id="features" className="relative overflow-x-clip py-20 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          index="01"
          kicker="Engine features"
          title={<>Six tools. <em className="serif-accent">Zero</em> root.</>}
          sub="Each one applies configurations the game already understands — exposed only where your device and game version support them. Open a row to see it work."
        />

        <Reveal>
          <div className="border-t border-edge">
            {FEATURES.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.title} className="border-b border-edge">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-3 py-5 text-left sm:gap-8 sm:py-7"
                  >
                    <span className={cn("tabular-nums font-mono text-xs font-bold transition-colors", isOpen ? "text-neon" : "text-fog")}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 sm:h-11 sm:w-11", accentBg[f.accent], isOpen && "scale-105")}>
                      <Icon name={f.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block font-display text-lg font-bold uppercase tracking-tight transition-all duration-300 sm:text-3xl", isOpen ? "translate-x-0.5 text-snow sm:translate-x-1" : "text-snow/80 group-hover:translate-x-1 group-hover:text-snow")}>
                        {f.title}
                      </span>
                      <span className={cn("chip-mono mt-1 block", accentText[f.accent])}>{f.kicker}</span>
                    </span>
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-400 sm:h-10 sm:w-10", isOpen ? "rotate-180 border-neon bg-neon/15 text-neon" : "border-edge text-fog group-hover:border-neon/50 group-hover:text-neon")}>
                      <Icon name="chevron" className="h-4 w-4" />
                    </span>
                  </button>

                  <div className={cn("acc-body", isOpen && "open")}>
                    <div className="acc-inner">
                      <div className="grid gap-6 pb-7 pl-0 sm:gap-8 sm:pb-8 sm:pl-[7.5rem] lg:grid-cols-2">
                        <div className="min-w-0">
                          <p className="max-w-md text-[14px] leading-relaxed text-fog sm:text-[14.5px]">{f.desc}</p>
                          <ul className="mt-4 space-y-2 sm:mt-5">
                            {f.points.map((p) => (
                              <li key={p} className="flex items-start gap-2.5 text-[13px] text-fog/90">
                                <Icon name="check" className={cn("mt-0.5 h-4 w-4 shrink-0", accentText[f.accent])} strokeWidth={2.6} />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="surface-card-soft min-w-0 rounded-2xl p-4 sm:p-6">
                          {i === 0 && <FpsVisual />}
                          {i === 1 && <IpadVisual />}
                          {i === 2 && <BoostVisual />}
                          {i === 3 && <SavVisual />}
                          {i === 4 && <ShizukuVisual />}
                          {i === 5 && <SlideVisual />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
