import { PLAY_URL, TELEGRAM_URL } from "../data";
import { usePlayStoreStats } from "../hooks";
import { BrandMark } from "./Nav";
import { Icon, PlayButton, ThemeToggle } from "./ui";

export default function Footer() {
  const playStats = usePlayStoreStats();
  const cols: { title: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Screenshots", href: "#screenshots" },
        { label: "Setup guide", href: "#guide" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Shizuku guide", href: "#/shizuku" },
        { label: "FAQ", href: "#faq" },
        { label: "Privacy policy", href: "#/privacy" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Google Play", href: PLAY_URL, ext: true },
        { label: "Telegram community", href: TELEGRAM_URL, ext: true },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-edge bg-abyss">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#/" className="inline-flex items-center gap-3">
              <BrandMark />
              <span className="font-display text-base font-bold uppercase tracking-wide text-snow">
                FPS Unlocker <span className="text-neon">Pro</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-fog">
              The extreme performance engine for supported PUBG Mobile &amp; BGMI versions. 90 / 120 / 165 FPS options, iPad View, Booster and SAV Editor — powered by Shizuku, free on Google Play.
            </p>
            <PlayButton small className="mt-5" />
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title} className="min-w-0">
              <span className="chip-mono text-neon/80">{c.title}</span>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.ext ? "_blank" : undefined}
                      rel={l.ext ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-1.5 text-[13px] text-fog transition-colors hover:text-neon"
                    >
                      <span className="h-px w-0 bg-neon transition-all duration-300 group-hover:w-3" />
                      {l.label}
                      {l.ext && <Icon name="external" className="h-3 w-3 opacity-50" />}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="surface-card-soft mt-10 rounded-2xl px-4 py-4 sm:mt-12 sm:px-5">
          <p className="text-[11px] leading-relaxed text-fog">
            <strong className="text-snow">Disclaimer:</strong> This is an unofficial third-party application. It is not affiliated with, endorsed by, sponsored by, or officially connected with PUBG, BGMI, KRAFTON, Tencent or their respective developers and publishers. All game names and trademarks belong to their owners and are used only to identify compatibility. Actual FPS and performance vary with device hardware, game version, system settings and game limitations — no result is guaranteed. Use third-party configuration tools at your own discretion.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-edge/80 pt-6 sm:flex-row">
          <span className="text-center font-mono text-[11px] text-fog sm:text-left">© 2026 FPS Unlocker Pro · Built for the squad</span>
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <ThemeToggle variant="segmented" showLabels />
            <span className="chip-mono rounded-md border border-gold/30 bg-gold/10 px-2 py-1 text-gold">v{playStats.version}</span>
            <a href="#/privacy" className="font-mono text-[11px] text-fog transition-colors hover:text-neon">Privacy</a>
            <a href="#top" className="flex items-center gap-1.5 font-mono text-[11px] text-fog transition-colors hover:text-neon">
              Back to top <Icon name="arrow" className="h-3 w-3 -rotate-90" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
