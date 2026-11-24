import { useEffect } from "react";
import { cn } from "./utils/cn";
import { PERMS, TELEGRAM_URL } from "./data";
import { usePlayStoreStats } from "./hooks";
import { GhostButton, Icon, PlayButton, Reveal, TelegramButton } from "./components/ui";

/* ============================ SHIZUKU PAGE ============================ */
const SHIZUKU_STEPS = [
  {
    icon: "download",
    title: "Install Shizuku",
    body: "Open Google Play and install the free, open-source Shizuku app. It grants safe ADB-level access for graphics config folders — no root and no PC required.",
  },
  {
    icon: "wifi",
    title: "Enable Wireless debugging",
    body: "Go to Settings → System → Developer options → Wireless debugging → ON. If Developer options are hidden, open About phone and tap Build number 7 times. Stay connected to Wi-Fi during pairing.",
  },
  {
    icon: "shield",
    title: "Pair using your phone's 6-digit code",
    body: "Open Shizuku and tap “Pairing”. Then open Wireless debugging on your phone and tap “Pair device with pairing code”. Type the live 6-digit code shown on your phone directly into the Shizuku notification.",
    note: "Always enter the fresh 6-digit code generated on your own phone — codes expire in about 60 seconds, so request a new one on your device if needed.",
  },
  {
    icon: "bolt",
    title: "Start the Shizuku service",
    body: "Return to Shizuku and tap Start. Wait a few seconds until the status changes from Stopped to Running. After a phone reboot, simply start it again.",
  },
  {
    icon: "check",
    title: "Connect in FPS Unlocker Pro",
    body: "Open FPS Unlocker Pro and allow the Shizuku permission prompt. The Shizuku Engine card on the home screen will switch to Running · Connected.",
  },
  {
    icon: "slide",
    title: "Pick your profile & slide to apply",
    body: "Choose your game version, select 90 / 120 / 165 FPS, toggle iPad View if supported, and slide the apply bar. You can reset back to defaults anytime from the Reset tab.",
  },
];

export function ShizukuPage() {
  return (
    <div className="relative overflow-x-clip pt-[68px] sm:pt-[72px]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="grid-bg absolute inset-0 opacity-40" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-24">
        <Reveal>
          <a href="#guide" className="chip-mono inline-flex items-center gap-2 text-fog transition-colors hover:text-neon">
            <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" /> Back to setup guide
          </a>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2rem,6vw,4.2rem)] font-bold uppercase leading-[1.02] tracking-tight text-snow sm:mt-6">
            Shizuku setup, <em className="serif-accent">step by step</em>.
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-fog sm:mt-5 sm:text-[15px]">
            Modern Android restricts direct access to game data folders (scoped storage). FPS Unlocker Pro runs cleanly on Shizuku — pair once over Wireless Debugging with no root and no PC. Total time: about two minutes.
          </p>
        </Reveal>

        <Reveal variant="scale" delay={180} className="mt-8 overflow-hidden rounded-2xl border border-edge sm:mt-10">
          <img
            src="./img/shizuku-pairing.jpg"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            alt="Android phone showing wireless debugging controls on a dark desk"
            className="h-44 w-full object-cover object-[65%_center] sm:h-72 lg:h-80"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <ol className="min-w-0 space-y-4">
            {SHIZUKU_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 55}>
                <li className="glow-card surface-card flex min-w-0 flex-col gap-3.5 rounded-2xl p-4 sm:flex-row sm:gap-5 sm:p-6">
                  <div className="flex items-center justify-between sm:block">
                    <span className="tabular-nums flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon/12 font-display text-base font-bold text-neon sm:h-11 sm:w-11">
                      {i + 1}
                    </span>
                    <Icon name={s.icon} className="h-4.5 w-4.5 text-fog sm:hidden" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words font-display text-base font-bold uppercase tracking-tight text-snow sm:text-lg">{s.title}</h2>
                    <p className="mt-2 break-words text-[13px] leading-relaxed text-fog sm:text-[13.5px]">{s.body}</p>
                    {s.note && (
                      <div className="mt-3 rounded-xl border border-gold/35 bg-gold/10 px-3.5 py-2.5 text-[12px] leading-relaxed text-gold">
                        <strong className="font-semibold text-gold">Tip:</strong> {s.note}
                      </div>
                    )}
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          {/* side rail */}
          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Reveal delay={100}>
              <div className="surface-card min-w-0 rounded-2xl p-5 sm:p-6">
                <span className="chip-mono flex items-center gap-2 text-neon">
                  <Icon name="terminal" className="h-4 w-4 shrink-0" /> Troubleshooting
                </span>
                <ul className="mt-4 space-y-3 text-[12.5px] leading-relaxed text-fog">
                  <li className="break-words">
                    <strong className="text-snow">“Pairing failed”</strong> — make sure Wi-Fi is connected and Wireless Debugging stays enabled. Codes expire in ~60 seconds; open a fresh pairing dialog on your phone.
                  </li>
                  <li className="break-words">
                    <strong className="text-snow">Shizuku shows Stopped</strong> — open Shizuku and tap Start again. After a phone reboot Android stops background ADB, so re-starting takes a few seconds.
                  </li>
                  <li className="break-words">
                    <strong className="text-snow">Engine shows “Not connected”</strong> — confirm Shizuku says Running, grant permission to FPS Unlocker Pro inside Shizuku, then reopen the app.
                  </li>
                  <li className="break-words">
                    <strong className="text-snow">Need help?</strong> — drop a message in our{" "}
                    <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-cyan2 underline underline-offset-4 hover:text-neon">
                      Telegram group
                    </a>{" "}
                    with your phone model and Android version.
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="min-w-0 rounded-2xl border border-neon/30 bg-emerald2/60 p-5 sm:p-6">
                <span className="chip-mono text-neon">Ready?</span>
                <p className="mt-2 text-[13.5px] leading-relaxed text-fog">Once Shizuku is running, open FPS Unlocker Pro, pick your profile, and slide to apply.</p>
                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <PlayButton small className="w-full justify-center sm:w-auto" />
                  <TelegramButton small className="w-full sm:w-auto" />
                  <GhostButton href="#guide" className="w-full sm:w-auto">Back to home</GhostButton>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ============================ PRIVACY PAGE ============================ */
export function PrivacyPage() {
  const playStats = usePlayStoreStats();
  const sections: [string, React.ReactNode][] = [
    ["1 · Overview", <>FPS Unlocker Pro (“the app”, package <code className="text-neon">tp.fps90</code>) is a graphics configuration utility for supported PUBG Mobile and BGMI versions. This policy explains what the app and this website access, and what they never do. Effective date: November 2026.</>],
    ["2 · What the app accesses", <>The app reads and writes the game's <strong className="text-snow">graphics configuration files</strong> (such as Active.SAV) on your device using Shizuku. It reads basic device information (model, Android version, refresh rate, memory, battery) to display the performance dashboard. <strong className="text-snow">No account or login is required</strong>, and your configuration files stay on your device.</>],
    ["3 · Permissions & why they exist", <ul className="list-none space-y-2">{PERMS.map((p) => (<li key={p} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon" /><span>{p}</span></li>))}</ul>],
    ["4 · Ads & third parties", <>The free version is ad-supported. Third-party ad networks (such as Google AdMob) may collect device identifiers and usage data under their own privacy policies to serve ads. The optional Premium upgrade removes ads. The app is not affiliated with KRAFTON, Tencent, Proxima Beta or their games; all trademarks belong to their owners.</>],
    ["5 · Data sharing", <>We do not sell personal data. Configuration profiles may be fetched from cloud storage so they stay compatible with new game versions; these requests contain no personal content.</>],
    ["6 · This website", <>This landing page sets no tracking cookies and runs no analytics scripts. External links (Google Play and Telegram) are governed by their respective policies.</>],
    ["7 · Children", <>The app is a utility intended for the audience of the underlying games and is not directed at children under 13. We do not knowingly collect personal information from children.</>],
    ["8 · Changes & contact", <>This policy may be updated as the app evolves; the effective date above will change accordingly. For questions or support, reach out via our{" "}<a className="text-neon underline underline-offset-4" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">Telegram community</a>.</>],
  ];

  return (
    <div className="relative overflow-x-clip pt-[68px] sm:pt-[72px]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="grid-bg absolute inset-0 opacity-40" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:pt-24">
        <Reveal>
          <a href="#/" className="chip-mono inline-flex items-center gap-2 text-fog transition-colors hover:text-neon">
            <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" /> Back to home
          </a>
        </Reveal>
        <Reveal delay={80}>
          <span className="chip-mono mt-6 block text-neon">Legal</span>
          <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3.6rem)] font-bold uppercase leading-[1.02] tracking-tight text-snow">Privacy policy</h1>
          <p className="mt-4 font-mono text-[11px] text-fog">Effective {playStats.updatedOn} · v{playStats.version}</p>
        </Reveal>
        <div className="mt-10 space-y-8 sm:mt-12 sm:space-y-9">
          {sections.map(([title, body], i) => (
            <Reveal key={title} delay={i * 40}>
              <section className="min-w-0 border-b border-edge pb-8 sm:pb-9">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neon">{title}</h2>
                <div className="mt-2.5 break-words text-[13.5px] leading-relaxed text-fog">{body}</div>
              </section>
            </Reveal>
          ))}
        </div>
        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap gap-3">
            <PlayButton small />
            <TelegramButton small />
            <GhostButton href="#faq">Read the FAQ</GhostButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ============================ small helper ============================ */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}

export { cn };
