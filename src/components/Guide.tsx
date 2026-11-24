import { useState } from "react";
import { cn } from "../utils/cn";
import { GUIDE_STEPS, PLAY_URL, TELEGRAM_URL } from "../data";
import { Icon, Reveal, SectionHead } from "./ui";

export default function Guide() {
  const [step, setStep] = useState(0);

  return (
    <section id="guide" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="grid-bg absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          index="03"
          kicker="Shizuku setup"
          title={<>Ready in <em className="serif-accent">two minutes</em>.</>}
          sub="Four quick steps powered by Shizuku — no root, no PC, no complicated file managers. Tap any step to highlight details."
        />

        <Reveal variant="scale" className="mb-8 overflow-hidden rounded-2xl border border-edge sm:mb-12">
          <img
            src="./img/setup-hands.jpg"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            alt="Player holding an Android phone during a mobile game"
            className="h-44 w-full object-cover object-center sm:h-72 lg:h-80"
          />
        </Reveal>

        {/* steps */}
        <div className="relative grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4" role="list">
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px lg:block" aria-hidden="true">
            <div className="h-full w-full [background:linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-neon)_40%,transparent)_12%,color-mix(in_srgb,var(--color-neon)_40%,transparent)_88%,transparent)]" />
            <div className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-neon transition-all duration-700" style={{ left: `calc(${(step / (GUIDE_STEPS.length - 1)) * 88 + 6}% - 3px)` }} />
          </div>

          {GUIDE_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 90} className="relative">
              <button
                type="button"
                role="listitem"
                onClick={() => setStep(i)}
                aria-expanded={step === i}
                className={cn(
                  "glow-card surface-card flex h-full w-full min-w-0 flex-col rounded-2xl p-5 text-left sm:p-6",
                  step === i && "!border-neon/55"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={cn(
                      "tabular-nums flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-bold transition-all duration-300 sm:h-11 sm:w-11 sm:text-lg",
                      step === i ? "bg-neon text-on-neon" : "border border-neon/40 bg-emerald2 text-neon"
                    )}
                  >
                    {i + 1}
                  </span>
                  <Icon name={s.icon} className={cn("h-5 w-5 transition-colors", step === i ? "text-neon" : "text-fog/80")} />
                </div>
                <h3 className="mt-4 font-display text-[15px] font-bold uppercase leading-snug text-snow">{s.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-fog">{s.desc}</p>
                {step === i && (
                  <span className="chip-mono mt-auto inline-flex items-center gap-1.5 pt-3 text-neon">
                    <span className="h-1 w-1 rounded-full bg-neon animate-blink" /> current step
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </div>

        {/* progress + actions */}
        <Reveal delay={180}>
          <div className="surface-card-soft mt-8 flex flex-col items-stretch justify-between gap-4 rounded-2xl p-4 sm:mt-10 sm:flex-row sm:items-center sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-start sm:gap-4">
              <div className="flex items-center gap-1.5">
                {GUIDE_STEPS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to step ${i + 1}`}
                    onClick={() => setStep(i)}
                    className={cn("h-1.5 rounded-full transition-all duration-500", i <= step ? "w-7 bg-neon sm:w-8" : "w-3.5 bg-edge hover:bg-fog/40 sm:w-4")}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-fog">step {step + 1} / {GUIDE_STEPS.length}</span>
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(s + 1, GUIDE_STEPS.length - 1))}
                  disabled={step === GUIDE_STEPS.length - 1}
                  className="btn-ghost rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-snow disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:justify-end sm:gap-3">
              <a href="#/shizuku" className="btn-ghost inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-snow sm:flex-initial">
                <Icon name="book" className="h-3.5 w-3.5" /> Full Shizuku guide
              </a>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wider text-snow sm:flex-initial">
                <Icon name="telegram" className="h-3.5 w-3.5 text-cyan2" /> Telegram help
              </a>
              <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider sm:w-auto">
                <Icon name="download" className="h-3.5 w-3.5" /> Get the app
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
