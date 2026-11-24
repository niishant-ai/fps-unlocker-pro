import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";
import { SHOTS } from "../data";
import { Icon, PhoneFrame, Reveal, SectionHead } from "./ui";

export default function Gallery() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);
  const lbSwipe = useRef<{ x: number; y: number } | null>(null);
  const n = SHOTS.length;

  const go = useCallback((d: number) => {
    setZoomed(false);
    setActive((a) => (a + d + n) % n);
  }, [n]);

  const openLightbox = useCallback(() => {
    setZoomed(false);
    setLightbox(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setZoomed(false);
    setLightbox(false);
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, go, closeLightbox]);

  const shot = SHOTS[active];

  return (
    <section id="screenshots" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="grid-bg absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          index="02"
          kicker="App tour"
          title={<>The app, <em className="serif-accent">unfiltered</em>.</>}
          sub="Real screenshots straight from the app — swipe, use arrows, or tap any screen to zoom in full detail."
        />

        <Reveal variant="scale">
          <div
            className="relative h-[490px] touch-pan-y select-none outline-none sm:h-[575px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="App screenshots"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                go(1);
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(-1);
              }
            }}
            onPointerDown={(e) => {
              didSwipe.current = false;
              swipe.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              if (!swipe.current) return;
              const dx = e.clientX - swipe.current.x;
              const dy = e.clientY - swipe.current.y;
              swipe.current = null;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                didSwipe.current = true;
                go(dx < 0 ? 1 : -1);
                window.setTimeout(() => {
                  didSwipe.current = false;
                }, 120);
              }
            }}
            onPointerCancel={() => {
              swipe.current = null;
            }}
          >
            {SHOTS.map((s, i) => {
              let off = i - active;
              if (off > n / 2) off -= n;
              if (off < -n / 2) off += n;
              const hidden = Math.abs(off) > 2;
              const isActive = off === 0;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "absolute left-1/2 top-1/2 transition-[transform,opacity] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] gpu",
                    hidden && "pointer-events-none"
                  )}
                  style={{
                    transform: `translate(-50%, -50%) translateX(calc(${off} * min(44vw, 240px))) scale(${1 - Math.min(Math.abs(off), 2) * 0.16}) rotateY(${off * -9}deg)`,
                    opacity: hidden ? 0 : isActive ? 1 : Math.max(0.28, 1 - Math.abs(off) * 0.38),
                    zIndex: 10 - Math.abs(off),
                  }}
                  aria-hidden={!isActive}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (didSwipe.current) return;
                      if (!isActive) setActive(i);
                      else openLightbox();
                    }}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={isActive ? `Zoom ${s.title}` : `Select ${s.title}`}
                    className="group relative block w-[200px] cursor-pointer rounded-[2.2rem] text-left focus-visible:outline-none sm:w-[238px]"
                  >
                    <PhoneFrame className={cn("transition-shadow duration-300", isActive && "shadow-neon")}>
                      <img
                        src={s.src}
                        alt={`${s.title} — ${s.desc}`}
                        width={s.w}
                        height={s.h}
                        decoding="async"
                        draggable={false}
                        className="block w-full"
                      />
                    </PhoneFrame>
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous screen"
              className="btn-ghost absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-carbon/90 text-snow sm:left-3 sm:h-12 sm:w-12"
            >
              <Icon name="arrow" className="h-4.5 w-4.5 rotate-180 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screen"
              className="btn-ghost absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-carbon/90 text-snow sm:right-3 sm:h-12 sm:w-12"
            >
              <Icon name="arrow" className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </button>
          </div>
        </Reveal>

        {/* tap to zoom trigger + caption */}
        <div className="mx-auto mt-3 max-w-xl text-center" aria-live="polite">
          <button
            type="button"
            onClick={openLightbox}
            className="chip-mono inline-flex items-center gap-2 rounded-full border border-neon/45 bg-emerald2/85 px-4 py-2 text-neon transition-all hover:border-neon hover:bg-neon hover:text-on-neon"
          >
            <Icon name="zoomIn" className="h-3.5 w-3.5" />
            Tap to zoom
          </button>

          <div key={shot.id} className="mt-4">
            <span className="chip-mono tabular-nums text-neon">{shot.tag} · {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            <h3 className="mt-1.5 font-display text-lg font-bold uppercase text-snow sm:text-xl">{shot.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-fog sm:text-sm">{shot.desc}</p>
          </div>
        </div>

        {/* thumbnails */}
        <div className="no-scrollbar mt-7 flex justify-start gap-2.5 overflow-x-auto px-1 pb-2 sm:justify-center">
          {SHOTS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${s.title}`}
              aria-current={active === i}
              className={cn(
                "group relative h-16 w-10 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 sm:h-[70px] sm:w-11",
                active === i ? "scale-105 border-neon shadow-neon" : "border-edge opacity-60 hover:opacity-95"
              )}
            >
              <img src={s.src} alt="" decoding="async" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-center font-mono text-[10px] text-fog">← → arrow keys · swipe · tap screenshot to zoom</p>
      </div>

      {/* portal fullscreen lightbox */}
      {lightbox &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-void/96 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={`${shot.title} full-screen preview`}
            onClick={closeLightbox}
          >
            {/* top toolbar */}
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b border-edge/80 bg-void/90 px-4 py-3 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0">
                <span className="chip-mono block text-[9.5px] text-neon">
                  {shot.tag} · {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
                <span className="block truncate font-display text-sm font-bold uppercase text-snow sm:text-base">{shot.title}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  className="btn-ghost inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 font-mono text-[10px] uppercase tracking-wider text-snow"
                  aria-label={zoomed ? "Fit to screen" : "Zoom in closer"}
                >
                  <Icon name={zoomed ? "zoomOut" : "zoomIn"} className="h-4 w-4 text-neon" />
                  <span className="hidden sm:inline">{zoomed ? "Fit" : "Zoom"}</span>
                </button>
                <button
                  type="button"
                  className="btn-ghost flex h-10 w-10 items-center justify-center rounded-full text-snow"
                  aria-label="Close viewer"
                  onClick={closeLightbox}
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* image stage */}
            <div
              className={cn(
                "relative flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6",
                zoomed ? "overflow-auto items-start" : "overflow-hidden"
              )}
              onPointerDown={(e) => {
                if (zoomed) return;
                lbSwipe.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerUp={(e) => {
                if (!lbSwipe.current || zoomed) return;
                const dx = e.clientX - lbSwipe.current.x;
                const dy = e.clientY - lbSwipe.current.y;
                lbSwipe.current = null;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                  go(dx < 0 ? 1 : -1);
                }
              }}
            >
              {/* desktop side nav arrows */}
              {!zoomed && (
                <>
                  <button
                    type="button"
                    className="btn-ghost absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-carbon/90 text-snow sm:flex"
                    aria-label="Previous screenshot"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(-1);
                    }}
                  >
                    <Icon name="arrow" className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-carbon/90 text-snow sm:flex"
                    aria-label="Next screenshot"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(1);
                    }}
                  >
                    <Icon name="arrow" className="h-5 w-5" />
                  </button>
                </>
              )}

              <img
                src={shot.src}
                width={shot.w}
                height={shot.h}
                alt={`${shot.title} — ${shot.desc}`}
                draggable={false}
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed((z) => !z);
                }}
                className={cn(
                  "rounded-2xl border shadow-2xl transition-all duration-300",
                  zoomed
                    ? "my-auto h-auto w-[min(94vw,520px)] max-w-none cursor-zoom-out border-neon/50"
                    : "max-h-[calc(100dvh-184px)] max-w-[92vw] w-auto h-auto cursor-zoom-in border-edge object-contain"
                )}
              />
            </div>

            {/* bottom navigation bar */}
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-t border-edge/80 bg-void/90 px-4 py-3 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="btn-ghost inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 font-mono text-[10px] uppercase tracking-wider text-snow"
                aria-label="Previous"
                onClick={() => go(-1)}
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
                <span>Prev</span>
              </button>
              <p className="hidden max-w-md truncate text-center text-xs text-fog md:block">{shot.desc}</p>
              <span className="font-mono text-[10px] text-fog md:hidden">{zoomed ? "Tap image to fit" : "Tap image to zoom"}</span>
              <button
                type="button"
                className="btn-ghost inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 font-mono text-[10px] uppercase tracking-wider text-snow"
                aria-label="Next"
                onClick={() => go(1)}
              >
                <span>Next</span>
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
