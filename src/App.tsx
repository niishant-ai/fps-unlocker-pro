import { useEffect, useState } from "react";
import { cn } from "./utils/cn";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Gallery from "./components/Gallery";
import Guide from "./components/Guide";
import Faq from "./components/Faq";
import Community from "./components/Community";
import Footer from "./components/Footer";
import { PrivacyPage, ShizukuPage, usePageTitle } from "./pages";
import { Icon } from "./components/ui";

type Route = "home" | "shizuku" | "privacy";

function parseRoute(): Route {
  const h = window.location.hash;
  if (h.startsWith("#/shizuku")) return "shizuku";
  if (h.startsWith("#/privacy")) return "privacy";
  return "home";
}

function Home() {
  usePageTitle("FPS Unlocker Pro — 90/120/165 FPS, iPad View & Booster for BGMI / PUBG Mobile");
  return (
    <>
      <Hero />
      <Features />
      <Gallery />
      <Guide />
      <Faq />
      <Community />
    </>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onHash = () => {
      const r = parseRoute();
      setRoute(r);
      if (r === "home") {
        const id = window.location.hash.replace("#", "");
        if (id && !id.startsWith("/")) {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          });
        } else {
          window.scrollTo({ top: 0 });
        }
      } else {
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 260;
      setShowTop(window.scrollY > 900 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [route]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void text-snow">
      <a href="#features" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-neon focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-bold focus:text-on-neon">
        Skip to content
      </a>

      <Nav route={route} />

      <main key={route} className="animate-page">
        {route === "home" && <Home />}
        {route === "shizuku" && <ShizukuPageWithTitle />}
        {route === "privacy" && <PrivacyPageWithTitle />}
      </main>

      <Footer />

      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "btn-ghost fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-carbon/95 text-neon shadow-lift transition-[transform,opacity] duration-400 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        )}
      >
        <Icon name="arrow" className="h-5 w-5 -rotate-90" />
      </button>
    </div>
  );
}

function ShizukuPageWithTitle() {
  usePageTitle("Shizuku Setup Guide — FPS Unlocker Pro");
  return <ShizukuPage />;
}

function PrivacyPageWithTitle() {
  usePageTitle("Privacy Policy — FPS Unlocker Pro");
  return <PrivacyPage />;
}
