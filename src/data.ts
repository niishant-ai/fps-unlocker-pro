import { appMedia } from "./media";

export const PLAY_URL = "https://play.google.com/store/apps/details?id=tp.fps90";
export const TELEGRAM_URL = "https://t.me/pubgmi_gfx_tool";
export const GAME_VERSION = "4.7";

export const NAV_LINKS = [
  { id: "features", label: "Features" },
  { id: "screenshots", label: "Screenshots" },
  { id: "guide", label: "Setup" },
  { id: "faq", label: "FAQ" },
];

export type Shot = {
  id: string;
  src: string;
  w: number;
  h: number;
  tag: string;
  title: string;
  desc: string;
};

export const SHOTS: Shot[] = [
  {
    id: "home",
    src: appMedia.screen3,
    w: 1080,
    h: 2340,
    tag: "HOME",
    title: "Performance Dashboard",
    desc: "Device info, storage ring, Shizuku engine status, game version and 120 / 165 FPS presets in one clean view.",
  },
  {
    id: "controls",
    src: appMedia.screen7,
    w: 1080,
    h: 2340,
    tag: "CONTROLS",
    title: "iPad View & One-Slide Apply",
    desc: "Switch between Apply or Save file schemes, toggle iPad View, and slide once to apply your FPS config.",
  },
  {
    id: "versions",
    src: appMedia.screen1,
    w: 1080,
    h: 2340,
    tag: "VERSIONS",
    title: "7 Game Versions Supported",
    desc: "Pick Indian (BGMI), Global, Korean, Taiwan, Vietnam, Flash or India Lite right from the selector.",
  },
  {
    id: "booster",
    src: appMedia.screen4,
    w: 1080,
    h: 2340,
    tag: "BOOSTER",
    title: "Live Performance & Memory",
    desc: "Monitor RAM usage with a live ring showing used, total and free memory — stop passive background apps in one tap.",
  },
  {
    id: "sav-editor",
    src: appMedia.screen5,
    w: 1080,
    h: 2340,
    tag: "SAV EDITOR",
    title: "Active.SAV Frame Rate & Style",
    desc: "Auto-detect or upload Active.SAV for Combat, Lobby or Both, with Extreme+ frame rate and graphics style controls.",
  },
  {
    id: "sav-tuning",
    src: appMedia.screen6,
    w: 1080,
    h: 2340,
    tag: "SAV TUNING",
    title: "Quality, Brightness & Backup",
    desc: "Tune Super Smooth to HD quality, brightness from 1.0 to 3.0, Default or Wide view, plus Refresh, Export, Backup & Restore.",
  },
  {
    id: "reset",
    src: appMedia.screen2,
    w: 1080,
    h: 2340,
    tag: "RESET",
    title: "Safe One-Tap Reset",
    desc: "Restore saved settings and in-game FPS config files back to defaults anytime with Shizuku connected.",
  },
];

export const FEATURES = [
  {
    icon: "gauge",
    kicker: "PERFORMANCE",
    title: "90 / 120 / 165 FPS Unlocker",
    desc: "Access the high frame-rate configurations available for your device and game version — from smooth 90 FPS up to 165 FPS on supported hardware.",
    points: ["90, 120 & 165 FPS presets", "Matched to 90 / 120 / 144 / 165 Hz displays", "Lower touch latency where supported"],
    accent: "neon",
  },
  {
    icon: "expand",
    kicker: "WIDER VISION",
    title: "iPad View",
    desc: "Switch to the iPad-style aspect ratio available on supported game versions and see more of the battlefield on the same screen.",
    points: ["iPad-style 4:3 perspective", "Spot enemies earlier at range", "Toggle per game version"],
    accent: "cyan",
  },
  {
    icon: "bolt",
    kicker: "MEMORY",
    title: "FPS Booster",
    desc: "A performance-focused boost profile plus live device monitoring — storage, battery, RAM usage and ping before you drop in.",
    points: ["One-tap memory boost", "Live memory & storage rings", "Performance status readout"],
    accent: "gold",
  },
  {
    icon: "sliders",
    kicker: "PRO TOOL",
    title: "SAV Editor",
    desc: "Edit Active.SAV directly: frame rate, graphics style, quality, brightness and view — applied to combat, lobby or both.",
    points: ["Classic → Movie graphics styles", "Super Smooth → HD quality presets", "Brightness 1.0 – 3.0 tuning + Backup & Restore"],
    accent: "neon",
  },
  {
    icon: "shield",
    kicker: "NO ROOT",
    title: "Shizuku Engine",
    desc: "Runs cleanly through Shizuku wireless debugging on Android 11 – 16. Scoped storage is handled the official way with zero root required.",
    points: ["Zero root & no PC required", "Full scoped-storage support on Android 11 – 16", "Settings-only — game files untouched"],
    accent: "cyan",
  },
  {
    icon: "slide",
    kicker: "ONE MOTION",
    title: "Apply, Save or Reset",
    desc: "Choose Apply Immediately or Save Config File, slide once, and launch. Changed your mind? Reset restores defaults in one tap.",
    points: ["1-slide apply & auto-launch", "Save reusable config files", "1-tap restore to defaults via Shizuku"],
    accent: "gold",
  },
];

export const GUIDE_STEPS = [
  {
    title: "Install Shizuku & the App",
    desc: "Download FPS Unlocker Pro from Google Play and install the free Shizuku app from Google Play. No root and no PC required.",
    icon: "download",
  },
  {
    title: "Enable Wireless Debugging",
    desc: "Open Settings → Developer options → Wireless debugging → ON while your phone is connected to Wi-Fi.",
    icon: "wifi",
  },
  {
    title: "Pair & Start Shizuku",
    desc: "Tap Pairing in Shizuku, tap “Pair device with pairing code” in Wireless Debugging, enter the 6-digit code shown on your phone, then tap Start.",
    icon: "shield",
  },
  {
    title: "Connect, Slide & Play",
    desc: "Open FPS Unlocker Pro — Shizuku Engine shows Connected. Pick your game version, FPS target and iPad View, then slide to apply.",
    icon: "slide",
  },
];

export const FAQS = [
  {
    q: "What is FPS Unlocker Pro and how does it work?",
    a: "It's an Android GFX utility for supported PUBG Mobile and BGMI versions. It writes graphics configuration profiles — frame rate, graphics style, quality and view ratio — cleanly through Shizuku. It applies settings the game itself reads; it does not modify game code or memory.",
  },
  {
    q: "How do I enable 90, 120 or 165 FPS?",
    a: "Start Shizuku, open FPS Unlocker Pro and verify Shizuku Engine shows Connected, pick your game version, select your FPS option, then slide to apply. Options only appear where your device and installed game build support them.",
  },
  {
    q: "Will I actually get 165 FPS on my phone?",
    a: "Only if three things line up: your display refresh rate, your hardware's real rendering capability, and the game version's support. The app exposes available configurations — it can't add frames your GPU or screen can't produce. A 60 Hz screen will always show at most 60 distinct frames per second.",
  },
  {
    q: "Is root access required?",
    a: "No. The app is completely root-free. It uses Shizuku over Android's built-in Wireless Debugging to safely access the game's graphics config folder.",
  },
  {
    q: "Why does the app use Shizuku?",
    a: "Modern Android versions (Android 11 – 16) restrict direct access to the Android/data folder via scoped storage. Shizuku is the standard, root-free way to grant safe config access — pair it once over Wi-Fi in about two minutes.",
  },
  {
    q: "Is it safe? Can I get banned?",
    a: "The app only applies graphics settings and leaves game files and memory untouched. That said, it is an unofficial third-party tool, not affiliated with KRAFTON or Tencent. Any third-party configuration tool carries some risk under a game's terms of service — use it at your own discretion and reset to defaults if a game update changes behaviour.",
  },
  {
    q: "Does high FPS drain battery or heat up my phone?",
    a: "Rendering more frames per second uses more GPU power — that's physics, not a bug. Expect higher battery drain at 120 / 165 FPS. Lower-quality graphics styles (Super Smooth) reduce GPU load and help keep temperatures steady.",
  },
  {
    q: "How do I restore the original game settings?",
    a: "Connect Shizuku, open the app, and tap Reset. It restores saved settings and in-game FPS config files back to defaults in one tap.",
  },
  {
    q: "Which game versions are supported?",
    a: "Global, Korean, Indian (BGMI), Taiwan, Vietnam, Flash and India Lite configuration sets are included. Compatibility depends on the exact game build installed — after a major game update, check Telegram or wait for updated configs if an option changes.",
  },
  {
    q: "Is the app free?",
    a: "Yes — it's free on Google Play with 1M+ downloads. An optional Premium upgrade removes ads and unlocks extras. Core FPS options, iPad View, Booster and the SAV Editor are usable for free.",
  },
];

export const PERMS = [
  "Shizuku service access — to safely read & write the game's graphics config without root",
  "Draw over other apps — optional on-screen FPS meter",
  "View network connections & full network access — profile updates and ads",
  "Run at startup & prevent device sleeping — keep the engine ready",
  "Google Play license check — Premium verification",
];
