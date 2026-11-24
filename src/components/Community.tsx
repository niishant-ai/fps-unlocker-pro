import { useState } from "react";
import { GAME_VERSION, PLAY_URL, TELEGRAM_URL } from "../data";
import { usePlayStoreStats } from "../hooks";
import { appMedia } from "../media";
import { Icon, PhoneFrame, PlayButton, Reveal, SectionHead, Stars, TelegramButton } from "./ui";

export default function Community() {
  const playStats = usePlayStoreStats();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: "FPS Unlocker Pro", text: "Unlock 90 / 120 / 165 FPS, iPad View & more on supported PUBG Mobile / BGMI versions.", url: PLAY_URL };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      throw new Error("no share");
    } catch {
      try {
        await navigator.clipboard.writeText(PLAY_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        window.open(PLAY_URL, "_blank", "noopener");
      }
    }
  };

  const channels = [
    {
      icon: "star",
      title: "Download & Rate on Google Play",
      desc: `${playStats.reviewsShort} players already reviewed it. Get the official Play Store release and share your feedback.`,
      action: "Open Google Play",
      href: PLAY_URL,
      accent: "text-gold",
      bg: "bg-gold/12",
    },
    {
      icon: "telegram",
      title: "Join Telegram Community",
      desc: "Setup help, Shizuku troubleshooting, season config drops, and direct updates on Telegram.",
      action: "Open @pubgmi_gfx_tool",
      href: TELEGRAM_URL,
      accent: "text-cyan2",
      bg: "bg-cyan2/12",
    },
  ];

  return (
    <section id="community" className="relative overflow-hidden py-20 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          index="05"
          kicker="Community & support"
          title={<>A million players <em className="serif-accent">strong</em>.</>}
          sub="Free on Google Play, updated with every game season, backed by an active Telegram community."
        />

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* rating card */}
          <Reveal variant="left">
            <div className="hud-corners surface-card relative flex h-full min-w-0 flex-col justify-between rounded-2xl p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <img src={appMedia.icon} alt="FPS Unlocker Pro app icon" width={64} height={64} decoding="async" className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  <span className="chip-mono inline-flex items-center gap-1.5 rounded-md border border-edge bg-abyss px-2.5 py-1 text-[9.5px] text-fog">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon animate-blink" />
                    Live Play data
                  </span>
                  <span className="chip-mono rounded-md border border-neon/30 bg-neon/10 px-2.5 py-1 text-neon">Free</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-end gap-3">
                  <span className="font-display text-5xl font-bold leading-none tracking-tight text-snow sm:text-6xl">{playStats.ratingText}</span>
                  <div className="pb-1">
                    <Stars value={playStats.rating} />
                    <span className="mt-1 block font-mono text-[10px] text-fog">{playStats.reviewsFormatted} reviews</span>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  {[
                    ["Downloads", playStats.downloadsFull],
                    ["App version", `v${playStats.version} · Shizuku`],
                    ["Game support", `v${GAME_VERSION} · All 7 regions`],
                    ["Last updated", playStats.updatedOn],
                    ["Price", "Free · optional Premium"],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between gap-2 border-b border-edge/60 pb-2 font-mono text-[11.5px]">
                      <span className="text-fog">{l}</span>
                      <span className="text-right text-snow">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={share} className="btn-ghost mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-snow">
                <Icon name={copied ? "check" : "copy"} className="h-4 w-4 shrink-0" />
                <span>{copied ? "Link copied — send to your squad" : "Share with your squad"}</span>
              </button>
            </div>
          </Reveal>

          {/* channels */}
          <div className="flex min-w-0 flex-col justify-between gap-4">
            {channels.map((c, i) => (
              <Reveal key={c.title} variant="right" delay={i * 100} className="flex-1">
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-card surface-card group flex h-full min-w-0 items-center gap-4 rounded-2xl p-5 sm:gap-5 sm:p-6"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.accent}`}>
                    <Icon name={c.icon} className="h-5.5 w-5.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[15px] font-bold uppercase text-snow sm:text-base">{c.title}</span>
                    <span className="mt-1 block text-[12.5px] leading-relaxed text-fog sm:text-[13px]">{c.desc}</span>
                    <span className={`mt-2 block truncate font-mono text-[10.5px] ${c.accent}`}>{c.action} →</span>
                  </span>
                  <Icon name="arrow" className="h-5 w-5 shrink-0 text-fog transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-neon" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ---------- final CTA ---------- */}
        <Reveal variant="scale" delay={100}>
          <div className="cta-card-surface relative mt-16 overflow-hidden rounded-3xl border border-edge sm:mt-20">
            <img src="./img/cta-bg.jpg" alt="" loading="lazy" decoding="async" className="cta-bg-photo absolute inset-0 h-full w-full object-cover" />
            <div className="cta-scrim absolute inset-0" aria-hidden="true" />
            <div className="grid-bg absolute inset-0 opacity-35" aria-hidden="true" />

            <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:p-14">
              <div className="min-w-0">
                <span className="chip-mono flex items-center gap-2 text-neon">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute h-full w-full rounded-full bg-neon animate-ring" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                  </span>
                  Season-ready · v{playStats.version}
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-snow sm:text-5xl">
                  Your lobby is waiting.<br />
                  <em className="serif-accent">Slide. Apply. Win.</em>
                </h2>
                <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-fog sm:text-[14.5px]">
                  Free download, two-minute Shizuku setup, one-tap reset. Bring the frame rate your display was built for — where your device and game version support it.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
                  <PlayButton />
                  <TelegramButton />
                </div>
              </div>

              <div className="relative mx-auto hidden w-full max-w-[210px] lg:block" aria-hidden="true">
                <PhoneFrame className="animate-floaty2 shadow-neon">
                  <img
                    src={appMedia.screen7}
                    alt=""
                    width={1080}
                    height={2340}
                    decoding="async"
                    className="block w-full"
                  />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
