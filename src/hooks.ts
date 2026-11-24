import { useEffect, useRef, useState } from "react";
import { INITIAL_PLAY_STATS, type PlayStoreStats } from "virtual:playstore-stats";

let liveStatsCache: PlayStoreStats = INITIAL_PLAY_STATS;
let liveStatsPromise: Promise<PlayStoreStats> | null = null;

function loadLivePlayStats(): Promise<PlayStoreStats> {
  if (!liveStatsPromise) {
    liveStatsPromise = (async () => {
      if (typeof window === "undefined" || !window.location.protocol.startsWith("http")) {
        return liveStatsCache;
      }
      try {
        const res = await fetch("./api/playstore-stats", { cache: "no-store", headers: { Accept: "application/json" } });
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) return liveStatsCache;
        const data = (await res.json()) as Partial<PlayStoreStats>;
        if (typeof data.rating === "number" && typeof data.reviewCount === "number") {
          liveStatsCache = { ...liveStatsCache, ...data };
        }
      } catch {
        // Static-only hosting without an API route gracefully uses build-time live stats.
      }
      return liveStatsCache;
    })();
  }
  return liveStatsPromise;
}

export function usePlayStoreStats(): PlayStoreStats {
  const [stats, setStats] = useState<PlayStoreStats>(liveStatsCache);
  useEffect(() => {
    let active = true;
    loadLivePlayStats().then((next) => {
      if (active) setStats(next);
    });
    return () => {
      active = false;
    };
  }, []);
  return stats;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

export function useCountUp(target: number, decimals = 0, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const [val, setVal] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || done.current) {
      setVal(target);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(target * eased);
          if (p < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            done.current = true;
            setVal(target);
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration, reduced]);
  return { ref, text: val.toFixed(decimals) };
}

export function useActiveSection(ids: string[], route = "home") {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (route !== "home") {
      setActive("");
      return;
    }
    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      if (window.scrollY < 240) setActive("");
      io = new IntersectionObserver(
        (entries) => {
          if (window.scrollY < 240) {
            setActive("");
            return;
          }
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(e.target.id);
          });
        },
        { rootMargin: "-38% 0px -55% 0px" }
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) io!.observe(el);
      });
    });
    const onScroll = () => {
      if (window.scrollY < 240) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [ids.join(","), route]);
  return active;
}

/** Subtle pointer-driven 3D tilt, disabled for reduced motion & touch. */
export function useTilt(max = 7) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    let rx = 0, ry = 0, tx = 0, ty = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const leave = () => { tx = 0; ty = 0; };
    const loop = () => {
      rx += (ty * -max - rx) * 0.08;
      ry += (tx * max - ry) * 0.08;
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [max, reduced]);
  return ref;
}
