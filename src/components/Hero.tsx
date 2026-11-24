import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { PLAY_URL } from "../data";
import { appMedia } from "../media";
import { useCountUp, usePlayStoreStats, usePrefersReducedMotion, useTilt } from "../hooks";
import { Icon, PhoneFrame, PlayButton, Reveal, Stars, TelegramButton } from "./ui";

function FpsTicker() {
  const reduced = usePrefersReducedMotion();
  const [fps, setFps] = useState(reduced ? 120 : 60);
  useEffect(() => {
    if (reduced) return;
    const targets = [90, 120, 165, 120];
    let i = 0;
    let raf = 0;
    let from = 60;
    let start = performance.now();
    const step = (t: number) => {
      const target = targets[i % targets.length];
      const p = Math.min(1, (t - start) / 1400);
      const eased = 1 - Math.pow(1 - p, 3);
      setFps(Math.round(from + (target - from) * eased));
      if (p >= 1) {
        from = target;
        i++;
        start = t + 1600;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  return <>{fps}</>;
}

function Stat({ value, suffix, label, decimals = 0, delay, index }: { value: number; suffix: string; label: string; decimals?: number; delay: number; index: number }) {
  const { ref, text } = useCountUp(value, decimals);
  return (
    <Reveal
      delay={delay}
      className={cn(
        "px-3 py-5 text-center sm:px-4 sm:py-6",
        index % 2 === 0 && "border-r border-edge",
        index < 2 && "border-b border-edge md:border-b-0",
        index < 3 && "md:border-r md:border-edge"
      )}
    >
      <span ref={ref} className="tabular-nums font-display text-2xl font-bold tracking-tight text-snow sm:text-4xl">
        {text}
        <span className="text-neon">{suffix}</span>
      </span>
      <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-fog sm:text-[10.5px] sm:tracking-[0.16em]">{label}</span>
    </Reveal>
  );
}

const MARQUEE = ["90 FPS", "120 FPS", "165 FPS", "IPAD VIEW", "FPS BOOSTER", "SHIZUKU ENGINE", "SAV EDITOR", "NO ROOT", "1-SLIDE APPLY"];

export default function Hero() {
  const playStats = usePlayStoreStats();
  const tiltRef = useTilt(6);
  const bgRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const stats = [
    { value: playStats.downloadsNum, suffix: playStats.downloadsSuffix, label: "Downloads on Google Play", decimals: Number.isInteger(playStats.downloadsNum) ? 0 : 1 },
    { value: playStats.rating, suffix: "★", label: "Average Play rating", decimals: 1 },
    { value: playStats.reviewsK, suffix: "K", label: "Player reviews", decimals: 1 },
    { value: 7, suffix: "", label: "Game versions supported", decimals: 0 },
  ];

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(min-width: 1024px) and (hover: hover)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* ------- cinematic backdrop ------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div ref={bgRef} className="absolute inset-0 lg:will-change-transform">
          <img src="./img/hero-bg.jpg" alt="" className="hero-bg-photo h-full w-full object-cover object-center" fetchPriority="low" decoding="async" />
        </div>
        <div className="hero-dark-vignette absolute inset-0 bg-gradient-to-b from-void/70 via-void/35 to-void" />
        <div className="hero-dark-vignette absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-void/40" />
        <div className="hero-light-wash absolute inset-0" />
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute -right-8 top-24 hidden select-none font-display text-[13rem] font-bold leading-none text-stroke opacity-60 sm:block lg:text-[19rem]">
          165
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 pb-12 pt-24 sm:gap-14 sm:pb-16 sm:pt-32 lg:grid-cols-12 lg:gap-8 lg:pt-40">
          {/* ------- copy ------- */}
          <div className="relative z-10 min-w-0 lg:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip-mono inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1.5 text-[10px] text-neon sm:px-3.5 sm:text-[10.5px]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute h-full w-full rounded-full bg-neon animate-ring" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                  </span>
                  v{playStats.version} · Season-ready
                </span>
                <span className="chip-mono surface-card inline-flex rounded-full px-3 py-1.5 text-[10px] text-fog sm:px-3.5 sm:text-[10.5px]">Shizuku · No root</span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-5 font-display text-[clamp(2.35rem,7vw,5.1rem)] font-bold uppercase leading-[0.98] tracking-tight text-snow sm:mt-7">
                Unlock the <em className="serif-accent">frames</em>
                <br />
                your phone
                <br />
                hides<span className="text-neon">.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-fog sm:mt-6 sm:text-[15.5px]">
                <strong className="font-semibold text-snow">FPS Unlocker Pro</strong> applies 90 / 120 / 165 FPS configurations, iPad View, FPS Booster and SAV Editor profiles for supported <strong className="font-semibold text-snow">PUBG Mobile &amp; BGMI</strong> versions — powered cleanly by Shizuku. One slide to apply. One tap to reset.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                <PlayButton />
                <TelegramButton />
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-9">
                <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                  <img src={appMedia.icon} alt="FPS Unlocker Pro app icon" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl transition-transform group-hover:scale-105" />
                  <span className="text-left">
                    <Stars value={playStats.rating} />
                    <span className="mt-0.5 block text-[11px] text-fog">
                      {playStats.ratingText} · {playStats.reviewsShort} reviews · {playStats.downloadsShort} downloads
                    </span>
                  </span>
                </a>
                <span className="hidden h-8 w-px bg-edge sm:block" />
                <span className="max-w-[260px] text-[11px] leading-relaxed text-fog">
                  Actual FPS depends on device, game version &amp; display.
                </span>
              </div>
            </Reveal>
          </div>

          {/* ------- device ------- */}
          <div className="relative z-10 mx-auto w-full max-w-[235px] sm:max-w-[270px] lg:col-span-5 lg:max-w-[295px]">
            <Reveal variant="scale" delay={200}>
              <div className="tilt-wrap relative">
                <div className="hero-ambient absolute left-1/2 top-1/2 -z-10 h-[115%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />
                <div ref={tiltRef} className="relative">
                  <PhoneFrame className="gpu animate-floaty2">
                    <img
                      src={appMedia.screen3}
                      alt="FPS Unlocker Pro home screen — device info, Shizuku engine connected, game version and 120 / 165 FPS selection"
                      width={1080}
                      height={2340}
                      fetchPriority="high"
                      decoding="async"
                      className="block w-full"
                    />
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-neon/[0.06] to-transparent animate-scanline" />
                  </PhoneFrame>

                  <div className="glass hud-corners absolute -left-14 top-[14%] hidden rounded-xl px-4 py-3 lg:block animate-floaty" aria-hidden="true">
                    <span className="chip-mono text-fog">Frame rate</span>
                    <span className="tabular-nums mt-1 block font-mono text-3xl font-bold leading-none text-neon">
                      <FpsTicker />
                      <span className="ml-1 text-xs text-fog">FPS</span>
                    </span>
                    <span className="mt-1.5 flex items-end gap-[3px]">
                      {[5, 9, 7, 12, 8, 14, 10, 15, 12, 16].map((h, i) => (
                        <span key={i} className="w-[3.5px] rounded-sm bg-neon/80" style={{ height: h }} />
                      ))}
                    </span>
                  </div>

                  <div className="glass absolute -right-10 top-[38%] hidden items-center gap-2.5 rounded-xl px-3.5 py-2.5 lg:flex animate-floaty" style={{ animationDelay: "1.4s" }} aria-hidden="true">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15 text-gold">
                      <Icon name="shield" className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="chip-mono block text-fog">Shizuku</span>
                      <span className="font-display text-xs font-bold uppercase text-neon">Connected</span>
                    </span>
                  </div>

                  <div className="glass absolute -left-10 bottom-[14%] hidden items-center gap-2.5 rounded-xl px-3.5 py-2.5 lg:flex animate-floaty" style={{ animationDelay: "2.3s" }} aria-hidden="true">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan2/15 text-cyan2">
                      <Icon name="expand" className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="chip-mono block text-fog">iPad view</span>
                      <span className="font-display text-xs font-bold uppercase text-snow">4:3 · Wider FOV</span>
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ------- stats ------- */}
        <div className="relative z-10 grid grid-cols-2 border-y border-edge md:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} index={i} delay={i * 90} />
          ))}
        </div>
      </div>

      {/* ------- marquee ------- */}
      <div className="marquee-mask relative mt-0 overflow-hidden border-b border-edge py-4">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex shrink-0 items-center" aria-hidden={rep === 1}>
              {MARQUEE.map((m) => (
                <span key={m + rep} className="flex items-center gap-6 pr-6 font-display text-xs font-semibold uppercase tracking-[0.22em] text-fog/90 sm:text-sm">
                  {m}
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-neon/70" fill="currentColor" aria-hidden="true">
                    <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
