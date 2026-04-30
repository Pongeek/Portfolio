import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** 0–1: what fraction of the element must be visible before triggering */
  threshold?: number;
  /** Extra margin around the root (e.g. "0px 0px -80px 0px") */
  rootMargin?: string;
  /** Only fire once and then stop observing */
  once?: boolean;
}

/**
 * Returns a ref to attach to a DOM element and a boolean `inView` that
 * becomes true (and stays true when `once: true`) when the element enters
 * the viewport.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
