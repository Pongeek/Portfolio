import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor that activates only inside the hero section.
 * - Inner dot tracks the mouse 1:1.
 * - Outer ring eases toward the cursor for a subtle "trail" effect.
 * - Ring expands when hovering interactive elements (a, button, etc).
 * - Hidden entirely on touch devices and when the user prefers reduced motion.
 */
export default function HeroCursor({ targetSelector = "#home" }: { targetSelector?: string }) {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef  = useRef<number | null>(null);

  // Latest mouse position (mutable, doesn't trigger re-renders)
  const pos = useRef({ x: 0, y: 0 });
  // Ring position eased toward pos
  const ring = useRef({ x: 0, y: 0 });

  const [active,   setActive]   = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Only activate on real (fine) pointer devices and when motion is allowed
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced        = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reduced) return;

    const target = document.querySelector<HTMLElement>(targetSelector);
    if (!target) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // Inner dot updates immediately
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);

    // Track interactive-element hover for the ring scale
    const isInteractive = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "A" || tag === "BUTTON") return true;
      // Walk up a few levels to catch nested icons inside <a>/<button>
      return Boolean(el.closest("a, button, [role='button']"));
    };

    const onOver = (e: MouseEvent) => {
      setHovering(isInteractive(e.target as Element));
    };

    // Hide the native cursor inside the hero, since we render our own.
    target.classList.add("hero-cursor-hide-native");

    target.addEventListener("mousemove",  onMove);
    target.addEventListener("mouseenter", onEnter);
    target.addEventListener("mouseleave", onLeave);
    target.addEventListener("mouseover",  onOver);

    // Ease ring toward dot position
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      const el = ringRef.current;
      if (el) {
        el.style.transform =
          `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      target.classList.remove("hero-cursor-hide-native");
      target.removeEventListener("mousemove",  onMove);
      target.removeEventListener("mouseenter", onEnter);
      target.removeEventListener("mouseleave", onLeave);
      target.removeEventListener("mouseover",  onOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetSelector]);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[60]
          w-1.5 h-1.5 rounded-full bg-primary
          transition-opacity duration-200
          ${active ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[60]
          rounded-full border border-primary/60
          transition-[opacity,width,height,border-color,background-color] duration-200 ease-out
          ${active   ? "opacity-100" : "opacity-0"}
          ${hovering ? "w-12 h-12 border-primary bg-primary/10" : "w-7 h-7"}`}
      />
    </>
  );
}
